'use client';

import initialWorldstate from '@/data/json/initialWorldstate.json';
import { normalizePlatform, type Platform, type WorldstateData, type WorldstatesByPlatform } from '@/lib/shared';
import { API_BASE, get, Notifier, stripInactiveArbitration } from '@/lib/shared';
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
  useRef,
  type ReactNode,
  type Dispatch,
  type FC,
} from 'react';
import { readStorage, removeStorage, writeStorage } from './storageUtils';
import { usePrefs } from './PrefsProvider';
import { useNotifications } from './NotificationsProvider';
import { getDataMode } from '../test/dataMode';
import { isPlaceholderWorldstate } from '../worldstate/worldstatePlaceholder';
import {
  getWorldstatePollIntervalMs,
  isWorldstateFetchDue,
  readWorldstateCacheMeta,
  writeWorldstateCacheMeta,
  wsMetaStorageKey,
} from '../worldstate/worldstateCache';
import { startPollLeadership } from '../worldstate/pollLeadership';
import { ensureI18nLocale } from '../i18n/localeBundles';
import i18nCore from '../i18nCore';

type FullInitial = {
  pc: WorldstateData;
  ps4: WorldstateData;
  xb1: WorldstateData;
  swi: WorldstateData;
};

const seed = initialWorldstate as FullInitial;

const initialWorldstates: WorldstatesByPlatform = {
  pc: stripInactiveArbitration(seed.pc),
  ps4: stripInactiveArbitration(seed.ps4),
  xb1: stripInactiveArbitration(seed.xb1),
  switch: stripInactiveArbitration(seed.swi),
};

type WsState = {
  worldstates: WorldstatesByPlatform;
  lastUpdated: Partial<Record<Platform, string>>;
  hydratedPlatforms: Partial<Record<Platform, boolean>>;
};

const initialState: WsState = {
  worldstates: initialWorldstates,
  lastUpdated: {},
  hydratedPlatforms: {},
};

const wsStorageKey = (platform: Platform) => `hub.v1.ws.${platform}`;

type WsAction =
  | { type: 'HYDRATE_PLATFORM'; payload: { platform: Platform; data: WorldstateData; fetchedAt?: string } }
  | { type: 'SET_WORLDSTATE'; payload: [Platform, WorldstateData, string] };

const wsReducer = (state: WsState, action: WsAction): WsState => {
  switch (action.type) {
    case 'HYDRATE_PLATFORM':
      return {
        ...state,
        worldstates: {
          ...state.worldstates,
          [action.payload.platform]: stripInactiveArbitration(action.payload.data),
        },
        hydratedPlatforms: { ...state.hydratedPlatforms, [action.payload.platform]: true },
        ...(action.payload.fetchedAt
          ? { lastUpdated: { ...state.lastUpdated, [action.payload.platform]: action.payload.fetchedAt } }
          : {}),
      };
    case 'SET_WORLDSTATE': {
      const [platform, data, fetchedAt] = action.payload;
      return {
        ...state,
        worldstates: { ...state.worldstates, [platform]: stripInactiveArbitration(data) },
        lastUpdated: { ...state.lastUpdated, [platform]: fetchedAt },
      };
    }
    default:
      return state;
  }
};

type UpdateWorldstateOptions = {
  force?: boolean;
};

type WsContextValue = {
  state: WsState;
  dispatch: Dispatch<WsAction>;
  worldstate: WorldstateData;
  platform: Platform;
  updateWorldstate: (options?: UpdateWorldstateOptions) => Promise<void>;
  lastUpdated?: string;
  isWorldstateLoading: boolean;
  initialFetchSettled: boolean;
  storageHydrated: boolean;
};

const WorldstateContext = createContext<WsContextValue | null>(null);

const WorldstateProvider: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { state: prefs } = usePrefs();
  const { state: notifState, dispatch: notifDispatch, getNotifiedIds } = useNotifications();
  const platform = normalizePlatform(prefs.platform);
  const [state, dispatch] = useReducer(wsReducer, initialState);
  const [initialFetchSettled, setInitialFetchSettled] = useState(false);
  const [storageHydrated, setStorageHydrated] = useState(false);

  const worldstate = state.worldstates[platform] ?? initialWorldstates.pc;
  const worldstateRef = useRef(worldstate);
  const lastFetchedAtRef = useRef(state.lastUpdated[platform]);
  const fetchInFlightRef = useRef<Promise<void> | null>(null);
  const notifierDepsRef = useRef({
    locale: prefs.locale,
    soundFilters: prefs.soundFilters,
    trackables: prefs.trackables,
    notificationsAllowed: notifState.notificationsAllowed,
    getNotifiedIds,
    notifDispatch,
    platform,
  });

  worldstateRef.current = worldstate;
  lastFetchedAtRef.current = state.lastUpdated[platform];
  notifierDepsRef.current = {
    locale: prefs.locale,
    soundFilters: prefs.soundFilters,
    trackables: prefs.trackables,
    notificationsAllowed: notifState.notificationsAllowed,
    getNotifiedIds,
    notifDispatch,
    platform,
  };

  useLayoutEffect(() => {
    const legacySwitch = readStorage<WorldstateData>('hub.v1.ws.swi');
    if (legacySwitch && !readStorage<WorldstateData>(wsStorageKey('switch'))) {
      writeStorage(wsStorageKey('switch'), legacySwitch);
      removeStorage('hub.v1.ws.swi');
    }

    (['pc', 'ps4', 'xb1', 'switch'] as Platform[]).forEach((p) => {
      const stored = readStorage<WorldstateData>(wsStorageKey(p));
      if (!stored) return;
      if (isPlaceholderWorldstate(stored)) {
        removeStorage(wsStorageKey(p));
        return;
      }

      const meta = readWorldstateCacheMeta(p);
      dispatch({
        type: 'HYDRATE_PLATFORM',
        payload: {
          platform: p,
          data: stored,
          fetchedAt: meta?.fetchedAt,
        },
      });
    });

    setStorageHydrated(true);
  }, []);

  useEffect(() => {
    const ws = state.worldstates[platform];
    if (!ws || isPlaceholderWorldstate(ws)) return;
    writeStorage(wsStorageKey(platform), ws);
  }, [state.worldstates, platform]);

  const isLeaderRef = useRef(false);
  const leadershipReadyRef = useRef(false);
  const scheduleNextRef = useRef<() => void>(() => {});

  const hydrateFromStorage = useCallback((p: Platform): boolean => {
    const stored = readStorage<WorldstateData>(wsStorageKey(p));
    if (!stored || isPlaceholderWorldstate(stored)) return false;
    const meta = readWorldstateCacheMeta(p);
    dispatch({
      type: 'HYDRATE_PLATFORM',
      payload: {
        platform: p,
        data: stored,
        fetchedAt: meta?.fetchedAt,
      },
    });
    return true;
  }, []);

  const updateWorldstate = useCallback(async (options?: UpdateWorldstateOptions) => {
    if (getDataMode() !== 'live') return;

    const activePlatform = notifierDepsRef.current.platform;
    const locale = notifierDepsRef.current.locale;
    const fetchedAt = lastFetchedAtRef.current;
    const force = options?.force === true;

    // Followers: adopt leader's localStorage; only force (banner) may network
    if (leadershipReadyRef.current && !isLeaderRef.current && !force) {
      if (hydrateFromStorage(activePlatform)) setInitialFetchSettled(true);
      return;
    }

    if (
      !isWorldstateFetchDue({
        platform: activePlatform,
        worldstate: worldstateRef.current,
        locale,
        fetchedAt,
        force,
      })
    ) {
      setInitialFetchSettled(true);
      return;
    }

    if (fetchInFlightRef.current) {
      await fetchInFlightRef.current;
      return;
    }

    const run = (async () => {
      try {
        const ws = await get<WorldstateData>(`${API_BASE}/${activePlatform}/?language=${locale}`, {
          headers: { 'Accept-Language': locale },
        });
        if (!ws) return;

        const now = new Date().toISOString();
        writeWorldstateCacheMeta(activePlatform, { fetchedAt: now, locale });
        dispatch({ type: 'SET_WORLDSTATE', payload: [activePlatform, ws, now] });

        const deps = notifierDepsRef.current;
        await ensureI18nLocale(i18nCore, deps.locale);
        const notifier = new Notifier({
          getLocale: () => deps.locale,
          getNotifiedIds: () => deps.getNotifiedIds(deps.platform),
          setNotifiedIds: (ids) => deps.notifDispatch({ type: 'SET_NOTIFIED_IDS', payload: [ids, deps.platform] }),
          getSoundFilters: () => deps.soundFilters,
          getTrackables: () => deps.trackables,
          getNotificationAllowance: () => deps.notificationsAllowed,
        });
        void notifier.checkNotifications(ws);
      } finally {
        setInitialFetchSettled(true);
        fetchInFlightRef.current = null;
      }
    })();

    fetchInFlightRef.current = run;
    await run;
  }, [hydrateFromStorage]);

  const hasReadyWorldstate =
    Boolean(state.lastUpdated[platform]) ||
    (Boolean(state.hydratedPlatforms[platform]) && !isPlaceholderWorldstate(worldstate));
  const isWorldstateLoading = getDataMode() === 'live' && !hasReadyWorldstate && !initialFetchSettled;

  useEffect(() => {
    setInitialFetchSettled(false);
  }, [platform]);

  useEffect(() => {
    if (getDataMode() !== 'live') return;
    return startPollLeadership((next) => {
      isLeaderRef.current = next;
      leadershipReadyRef.current = true;
      if (next) void updateWorldstate();
      else hydrateFromStorage(notifierDepsRef.current.platform);
    });
  }, [updateWorldstate, hydrateFromStorage]);

  useEffect(() => {
    if (getDataMode() !== 'live') return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const scheduleNext = () => {
      if (cancelled) return;
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      const interval = getWorldstatePollIntervalMs();
      timeoutId = setTimeout(() => void tick(), interval);
    };
    scheduleNextRef.current = scheduleNext;

    const tick = async () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      await updateWorldstate();
      scheduleNext();
    };

    void updateWorldstate();
    scheduleNext();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [updateWorldstate, platform]);

  useEffect(() => {
    const onOnline = () => {
      if (!leadershipReadyRef.current || isLeaderRef.current) void updateWorldstate();
      else hydrateFromStorage(notifierDepsRef.current.platform);
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [updateWorldstate, hydrateFromStorage]);

  useEffect(() => {
    if (getDataMode() !== 'live') return;
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (!leadershipReadyRef.current || isLeaderRef.current) void updateWorldstate();
      else hydrateFromStorage(notifierDepsRef.current.platform);
      scheduleNextRef.current();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [updateWorldstate, hydrateFromStorage]);

  useEffect(() => {
    if (getDataMode() !== 'live') return;
    const onStorage = (event: StorageEvent) => {
      if (!event.key) return;
      const p = notifierDepsRef.current.platform;
      if (event.key !== wsStorageKey(p) && event.key !== wsMetaStorageKey(p)) return;
      hydrateFromStorage(p);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [hydrateFromStorage]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      worldstate,
      platform,
      updateWorldstate,
      lastUpdated: state.lastUpdated[platform],
      isWorldstateLoading,
      initialFetchSettled,
      storageHydrated,
    }),
    [state, worldstate, platform, updateWorldstate, isWorldstateLoading, initialFetchSettled, storageHydrated],
  );

  return <WorldstateContext.Provider value={value}>{children}</WorldstateContext.Provider>;
};
export default WorldstateProvider;

export const useWorldstate = <T = WsContextValue,>(selector?: (ctx: WsContextValue) => T): T => {
  const ctx = useContext(WorldstateContext);
  if (!ctx) throw new Error('useWorldstate must be used within WorldstateProvider');
  if (selector) return selector(ctx);
  return ctx as T;
};

export const seedWorldstate = (platform: Platform, data: WorldstateData): void => {
  writeStorage(wsStorageKey(platform), stripInactiveArbitration(data));
};
