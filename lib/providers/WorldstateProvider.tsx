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
} from '../worldstate/worldstateCache';
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

  const updateWorldstate = useCallback(async (options?: UpdateWorldstateOptions) => {
    if (getDataMode() !== 'live') return;

    const activePlatform = notifierDepsRef.current.platform;
    const locale = notifierDepsRef.current.locale;
    const fetchedAt = lastFetchedAtRef.current;

    if (
      !isWorldstateFetchDue({
        platform: activePlatform,
        worldstate: worldstateRef.current,
        locale,
        fetchedAt,
        force: options?.force,
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
  }, []);

  const hasReadyWorldstate =
    Boolean(state.lastUpdated[platform]) ||
    (Boolean(state.hydratedPlatforms[platform]) && !isPlaceholderWorldstate(worldstate));
  const isWorldstateLoading = getDataMode() === 'live' && !hasReadyWorldstate && !initialFetchSettled;

  useEffect(() => {
    setInitialFetchSettled(false);
  }, [platform]);

  useEffect(() => {
    if (getDataMode() !== 'live') return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      if (cancelled) return;
      const interval = getWorldstatePollIntervalMs(worldstateRef.current.timestamp);
      timeoutId = setTimeout(() => void tick(), interval);
    };

    const tick = async () => {
      await updateWorldstate();
      scheduleNext();
    };

    void updateWorldstate();
    scheduleNext();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [updateWorldstate, platform]);

  useEffect(() => {
    const onOnline = () => void updateWorldstate();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [updateWorldstate]);

  useEffect(() => {
    if (getDataMode() !== 'live') return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') void updateWorldstate();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [updateWorldstate]);

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
