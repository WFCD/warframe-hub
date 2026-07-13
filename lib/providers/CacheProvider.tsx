'use client';

import type { Platform, CacheState, RivenApiPayload, CodexItem } from '@/lib/shared';
import { API_BASE, fetchCodexItems, flattenRivensApi, get, MIN_CODEX_ITEMS, rivensApiPlatform } from '@/lib/shared';
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  type ReactNode,
  type Dispatch,
  type FC,
} from 'react';
import { readCodexItemsDb, readCodexItemsMetaDb, writeCodexItemsDb } from '@/lib/storage/codexItemsDb';
import { readStorage, removeStorage, writeStorage } from './storageUtils';
import { usePrefs } from './PrefsProvider';
import { getDataMode } from '../test/dataMode';

const CODEX_ITEMS_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const LEGACY_CODEX_KEYS = [
  'hub.v1.cache.codex.items',
  'hub.v1.cache.codex.warframes',
  'hub.v1.cache.codex.weapons',
  'hub.v1.cache.codex.mods',
] as const;

const initialState: CacheState = {
  rivens: { pc: [], ps4: [], xb1: [], switch: [] },
  synthData: [],
  items: [],
};

type CacheAction =
  | { type: 'HYDRATE'; payload: Partial<CacheState> }
  | { type: 'SET_RIVENS'; payload: [Platform, unknown[]] }
  | { type: 'SET_SYNTH'; payload: unknown[] }
  | { type: 'SET_ITEMS'; payload: CodexItem[] };

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
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

type CacheContextValue = {
  state: CacheState;
  dispatch: Dispatch<CacheAction>;
  updateRivens: () => Promise<void>;
  updateSynthData: () => Promise<void>;
  updateItems: (force?: boolean) => Promise<void>;
  refreshAll: () => Promise<void>;
};

const CacheContext = createContext<CacheContextValue | null>(null);

const mergeLegacyCodexItems = (): CodexItem[] => {
  const warframes = readStorage<CodexItem[]>('hub.v1.cache.codex.warframes') ?? [];
  const weapons = readStorage<CodexItem[]>('hub.v1.cache.codex.weapons') ?? [];
  const mods = readStorage<CodexItem[]>('hub.v1.cache.codex.mods') ?? [];
  const merged = readStorage<CodexItem[]>('hub.v1.cache.codex.items') ?? [];
  const seen = new Set<string>();
  const items: CodexItem[] = [];

  for (const item of [...merged, ...warframes, ...weapons, ...mods]) {
    const key = item.uniqueName || item.name;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    items.push(item);
  }

  return items;
};

const clearLegacyCodexStorage = (): void => {
  for (const key of LEGACY_CODEX_KEYS) {
    removeStorage(key);
  }
};

const loadCodexItems = async (locale: string): Promise<CodexItem[]> => {
  if (getDataMode() !== 'live') {
    return readStorage<CodexItem[]>('hub.v1.cache.codex.items') ?? [];
  }

  const cached = await readCodexItemsDb(locale);
  if (cached && cached.length >= MIN_CODEX_ITEMS) return cached;

  const legacy = mergeLegacyCodexItems();
  if (legacy.length >= MIN_CODEX_ITEMS) {
    await writeCodexItemsDb(locale, legacy);
    clearLegacyCodexStorage();
    return legacy;
  }

  return [];
};

const CacheProvider: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { state: prefs } = usePrefs();
  const [state, dispatch] = useReducer(cacheReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    const rivens = readStorage<CacheState['rivens']>('hub.v1.cache.rivens');
    const synth = readStorage<unknown[]>('hub.v1.cache.synth');
    dispatch({
      type: 'HYDRATE',
      payload: {
        ...(rivens ? { rivens } : {}),
        ...(synth ? { synthData: synth } : {}),
      },
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const items = await loadCodexItems(prefs.locale);
      if (!cancelled && items.length) {
        dispatch({ type: 'SET_ITEMS', payload: items });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [prefs.locale]);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage('hub.v1.cache.rivens', state.rivens);
    writeStorage('hub.v1.cache.synth', state.synthData);
  }, [hydrated, state.rivens, state.synthData]);

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

  const updateItems = useCallback(
    async (force = false) => {
      if (getDataMode() !== 'live') return;

      if (!force) {
        const meta = await readCodexItemsMetaDb(prefs.locale);
        if (meta && Date.now() - meta.updatedAt < CODEX_ITEMS_MAX_AGE_MS) {
          const cached = await readCodexItemsDb(prefs.locale);
          if (cached && cached.length >= MIN_CODEX_ITEMS) {
            dispatch({ type: 'SET_ITEMS', payload: cached });
            return;
          }
        }
      }

      const res = await fetchCodexItems(prefs.locale);
      if (!res) return;

      dispatch({ type: 'SET_ITEMS', payload: res });
      await writeCodexItemsDb(prefs.locale, res);
      clearLegacyCodexStorage();
    },
    [prefs.locale],
  );

  const refreshAll = useCallback(async () => {
    await Promise.all([updateRivens(), updateSynthData()]);
  }, [updateRivens, updateSynthData]);

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
      updateItems,
      refreshAll,
    }),
    [state, updateRivens, updateSynthData, updateItems, refreshAll],
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
  if (payload.items) writeStorage('hub.v1.cache.codex.items', payload.items);
};
