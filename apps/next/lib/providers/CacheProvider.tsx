'use client';

import type { Platform, CacheState, RivenApiPayload } from '@wfcd/shared';
import { API_BASE, flattenRivensApi, get, rivensApiPlatform } from '@wfcd/shared';
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
import { readStorage, writeStorage } from './storageUtils';
import { usePrefs } from './PrefsProvider';
import { getDataMode } from '../test/dataMode';

const initialState: CacheState = {
  rivens: { pc: [], ps4: [], xb1: [], switch: [] },
  synthData: [],
  warframes: [],
  weapons: [],
  mods: [],
};

type CacheAction =
  | { type: 'HYDRATE'; payload: Partial<CacheState> }
  | { type: 'SET_RIVENS'; payload: [Platform, unknown[]] }
  | { type: 'SET_SYNTH'; payload: unknown[] }
  | { type: 'SET_WARFRAMES'; payload: unknown[] }
  | { type: 'SET_WEAPONS'; payload: unknown[] }
  | { type: 'SET_MODS'; payload: unknown[] };

const cacheReducer = (state: CacheState, action: CacheAction): CacheState => {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };
    case 'SET_RIVENS': {
      const [platform, rivens] = action.payload;
      return { ...state, rivens: { ...state.rivens, [platform]: rivens } };
    }
    case 'SET_SYNTH':
      return { ...state, synthData: action.payload };
    case 'SET_WARFRAMES':
      return { ...state, warframes: action.payload };
    case 'SET_WEAPONS':
      return { ...state, weapons: action.payload };
    case 'SET_MODS':
      return { ...state, mods: action.payload };
    default:
      return state;
  }
};

type CacheContextValue = {
  state: CacheState;
  dispatch: Dispatch<CacheAction>;
  updateRivens: () => Promise<void>;
  updateSynthData: () => Promise<void>;
  updateWarframes: () => Promise<void>;
  updateWeapons: () => Promise<void>;
  updateMods: () => Promise<void>;
  refreshAll: () => Promise<void>;
};

const CacheContext = createContext<CacheContextValue | null>(null);
const CacheProvider: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { state: prefs } = usePrefs();
  const [state, dispatch] = useReducer(cacheReducer, initialState);

  useEffect(() => {
    const rivens = readStorage<CacheState['rivens']>('hub.v1.cache.rivens');
    const synth = readStorage<unknown[]>('hub.v1.cache.synth');
    const warframes = readStorage<unknown[]>('hub.v1.cache.codex.warframes');
    const weapons = readStorage<unknown[]>('hub.v1.cache.codex.weapons');
    const mods = readStorage<unknown[]>('hub.v1.cache.codex.mods');
    dispatch({
      type: 'HYDRATE',
      payload: {
        ...(rivens ? { rivens } : {}),
        ...(synth ? { synthData: synth } : {}),
        ...(warframes ? { warframes } : {}),
        ...(weapons ? { weapons } : {}),
        ...(mods ? { mods } : {}),
      },
    });
  }, []);

  useEffect(() => {
    writeStorage('hub.v1.cache.rivens', state.rivens);
    writeStorage('hub.v1.cache.synth', state.synthData);
    writeStorage('hub.v1.cache.codex.warframes', state.warframes);
    writeStorage('hub.v1.cache.codex.weapons', state.weapons);
    writeStorage('hub.v1.cache.codex.mods', state.mods);
  }, [state]);

  const updateRivens = useCallback(async () => {
    if (getDataMode() !== 'live') return;
    const apiPlatform = rivensApiPlatform(prefs.platform);
    const payload = await get<RivenApiPayload>(`${API_BASE}/${apiPlatform}/rivens`);
    const rivens = payload ? flattenRivensApi(payload) : [];
    dispatch({ type: 'SET_RIVENS', payload: [prefs.platform, rivens] });
  }, [prefs.platform]);

  const updateSynthData = useCallback(async () => {
    if (getDataMode() !== 'live') return;
    const res = await get<unknown[]>(`${API_BASE}/synthTargets/?language=${prefs.locale}`);
    if (res) dispatch({ type: 'SET_SYNTH', payload: res });
  }, [prefs.locale]);

  const updateWarframes = useCallback(async () => {
    if (getDataMode() !== 'live') return;
    const res = await get<unknown[]>(
      `${API_BASE}/warframes?exclude=category,color,conclave,patchlogs,wikiaThumbnail,type,tradable&language=${prefs.locale}`
    );
    if (res) dispatch({ type: 'SET_WARFRAMES', payload: res });
  }, [prefs.locale]);

  const updateWeapons = useCallback(async () => {
    if (getDataMode() !== 'live') return;
    const res = await get<unknown[]>(
      `${API_BASE}/weapons?exclude=category,color,conclave,patchlogs,wikiaThumbnail,type,tradable&language=${prefs.locale}`
    );
    if (res) dispatch({ type: 'SET_WEAPONS', payload: res });
  }, [prefs.locale]);

  const updateMods = useCallback(async () => {
    if (getDataMode() !== 'live') return;
    const res = await get<unknown[]>(
      `${API_BASE}/mods?exclude=category,color,conclave,patchlogs,wikiaThumbnail,type,tradable&language=${prefs.locale}`
    );
    if (res) dispatch({ type: 'SET_MODS', payload: res });
  }, [prefs.locale]);

  const refreshAll = useCallback(async () => {
    await Promise.all([updateRivens(), updateSynthData(), updateWarframes(), updateWeapons(), updateMods()]);
  }, [updateRivens, updateSynthData, updateWarframes, updateWeapons, updateMods]);

  useEffect(() => {
    if (getDataMode() !== 'live') return;
    void updateRivens();
    void updateSynthData();
    const hourly = setInterval(() => void refreshAll(), 3600000);
    return () => clearInterval(hourly);
  }, [updateRivens, updateSynthData, refreshAll]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      updateRivens,
      updateSynthData,
      updateWarframes,
      updateWeapons,
      updateMods,
      refreshAll,
    }),
    [state, updateRivens, updateSynthData, updateWarframes, updateWeapons, updateMods, refreshAll]
  );

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
};
export default CacheProvider;

export const useCache = (): CacheContextValue => {
  const ctx = useContext(CacheContext);
  if (!ctx) throw new Error('useCache must be used within CacheProvider');
  return ctx;
};

export const seedCache = (payload: Partial<CacheState>): void => {
  if (payload.rivens) writeStorage('hub.v1.cache.rivens', payload.rivens);
  if (payload.synthData) writeStorage('hub.v1.cache.synth', payload.synthData);
};
