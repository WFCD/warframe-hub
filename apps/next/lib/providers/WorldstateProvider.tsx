'use client';

import initialWorldstate from '@/data/json/initialWorldstate.json';
import { normalizePlatform, type Platform, type WorldstateData, type WorldstatesByPlatform } from '@wfcd/shared';
import { API_BASE, get, Notifier, stripInactiveArbitration } from '@wfcd/shared';
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
  type Dispatch,
  type FC,
} from 'react';
import { readStorage, removeStorage, writeStorage } from './storageUtils';
import { usePrefs } from './PrefsProvider';
import { useNotifications } from './NotificationsProvider';
import { getDataMode } from '../test/dataMode';

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
};

const initialState: WsState = {
  worldstates: initialWorldstates,
  lastUpdated: {},
};

type WsAction =
  | { type: 'HYDRATE_PLATFORM'; payload: { platform: Platform; data: WorldstateData } }
  | { type: 'SET_WORLDSTATE'; payload: [Platform, WorldstateData] };

const wsReducer = (state: WsState, action: WsAction): WsState => {
  switch (action.type) {
    case 'HYDRATE_PLATFORM':
      return {
        ...state,
        worldstates: {
          ...state.worldstates,
          [action.payload.platform]: stripInactiveArbitration(action.payload.data),
        },
      };
    case 'SET_WORLDSTATE': {
      const [platform, data] = action.payload;
      return {
        ...state,
        worldstates: { ...state.worldstates, [platform]: stripInactiveArbitration(data) },
        lastUpdated: { ...state.lastUpdated, [platform]: new Date().toISOString() },
      };
    }
    default:
      return state;
  }
};

type WsContextValue = {
  state: WsState;
  dispatch: Dispatch<WsAction>;
  worldstate: WorldstateData;
  platform: Platform;
  updateWorldstate: () => Promise<void>;
  lastUpdated?: string;
};

const WorldstateContext = createContext<WsContextValue | null>(null);

const wsStorageKey = (platform: Platform) => `hub.v1.ws.${platform}`;
const WorldstateProvider: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { state: prefs } = usePrefs();
  const { state: notifState, dispatch: notifDispatch, getNotifiedIds } = useNotifications();
  const platform = normalizePlatform(prefs.platform);
  const [state, dispatch] = useReducer(wsReducer, initialState);

  useEffect(() => {
    const legacySwitch = readStorage<WorldstateData>('hub.v1.ws.swi');
    if (legacySwitch && !readStorage<WorldstateData>(wsStorageKey('switch'))) {
      writeStorage(wsStorageKey('switch'), legacySwitch);
      removeStorage('hub.v1.ws.swi');
    }

    (['pc', 'ps4', 'xb1', 'switch'] as Platform[]).forEach((p) => {
      const stored = readStorage<WorldstateData>(wsStorageKey(p));
      if (stored) dispatch({ type: 'HYDRATE_PLATFORM', payload: { platform: p, data: stored } });
    });
  }, []);

  useEffect(() => {
    const ws = state.worldstates[platform];
    if (ws) writeStorage(wsStorageKey(platform), ws);
  }, [state.worldstates, platform]);

  const updateWorldstate = useCallback(async () => {
    if (getDataMode() !== 'live') return;
    const ws = await get<WorldstateData>(`${API_BASE}/${platform}/?language=${prefs.locale}`, {
      headers: { 'Accept-Language': prefs.locale },
    });
    if (ws) {
      dispatch({ type: 'SET_WORLDSTATE', payload: [platform, ws] });
      const notifier = new Notifier({
        getNotifiedIds: () => getNotifiedIds(platform),
        setNotifiedIds: (ids) => notifDispatch({ type: 'SET_NOTIFIED_IDS', payload: [ids, platform] }),
        getSoundFilters: () => prefs.soundFilters,
        getTrackables: () => prefs.trackables,
        getNotificationAllowance: () => notifState.notificationsAllowed,
      });
      await notifier.checkNotifications(ws);
    }
  }, [
    platform,
    prefs.locale,
    prefs.soundFilters,
    prefs.trackables,
    notifState.notificationsAllowed,
    getNotifiedIds,
    notifDispatch,
  ]);

  useEffect(() => {
    if (getDataMode() !== 'live') return;
    void updateWorldstate();
    const interval = Number(process.env.NEXT_PUBLIC_INTERVAL ?? 30000);
    const id = setInterval(() => void updateWorldstate(), interval);
    return () => clearInterval(id);
  }, [updateWorldstate]);

  useEffect(() => {
    const onOnline = () => void updateWorldstate();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [updateWorldstate]);

  const worldstate = state.worldstates[platform] ?? initialWorldstates.pc;

  const value = useMemo(
    () => ({
      state,
      dispatch,
      worldstate,
      platform,
      updateWorldstate,
      lastUpdated: state.lastUpdated[platform],
    }),
    [state, worldstate, platform, updateWorldstate]
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
