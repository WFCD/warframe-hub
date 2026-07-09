'use client';

import componentsJson from '@/data/json/components.json';
import planetsJson from '@/data/json/planets.json';
import localesJson from '@/data/json/locales.json';
import { normalizePlatform, type Platform, type PrefsState, type ComponentsMap } from '@/lib/shared';
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
  type Dispatch,
  type FC,
} from 'react';
import { debouncedWriteStorage, readStorage, usePersistedState } from './storageUtils';
import { migrateLegacyStorage } from './legacyMigration';
import { buildTrackables } from '../data/buildTrackables';
import { DEFAULT_MASONRY_PANEL_ORDER, normalizeComponentOrder } from '../timers/masonryPanels';
import { migrateFissurePanels } from '../timers/fissurePanelMigration';

const STORAGE_KEY = 'hub.v1.prefs';

const detectLocale = (): string => {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language.substr(0, 2).toLowerCase();
  return Object.keys(localesJson as Record<string, string>).includes(lang) ? lang : 'en';
};

const initialState: PrefsState = {
  platform: 'pc',
  theme: 'night',
  locale: detectLocale(),
  components: componentsJson as ComponentsMap,
  componentOrder: [...DEFAULT_MASONRY_PANEL_ORDER],
  trackables: { rewardTypes: {}, eventTypes: {} },
  fissurePlanets: planetsJson as PrefsState['fissurePlanets'],
  fissureDisplays: 'fissures-storms',
  soundFilters: [],
};

type PrefsAction =
  | { type: 'HYDRATE'; payload: PrefsState }
  | { type: 'SET_PLATFORM'; payload: Platform }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_LOCALE'; payload: string }
  | { type: 'SET_COMPONENT_DISPLAY'; payload: [string, boolean] }
  | { type: 'SET_COMPONENT_ORDER'; payload: string[] }
  | { type: 'SET_FISSURE_DISPLAYS'; payload: string }
  | { type: 'SET_FISSURE_PLANET'; payload: [string, boolean] }
  | { type: 'SET_SOUND_FILTERS'; payload: string[] }
  | { type: 'SET_REWARD_STATE'; payload: [string, boolean] }
  | { type: 'SET_EVENT_STATE'; payload: [string, boolean] }
  | { type: 'SET_COMPONENT'; payload: [string, ComponentsMap[string]] }
  | { type: 'SET_NEWS_AUTO_CYCLE'; payload: boolean };

const prefsReducer = (state: PrefsState, action: PrefsAction): PrefsState => {
  switch (action.type) {
    case 'HYDRATE': {
      const components = { ...state.components, ...action.payload.components };
      const componentOrder = normalizeComponentOrder(
        action.payload.componentOrder ?? state.componentOrder,
        components,
      );
      const platform = normalizePlatform(action.payload.platform ?? state.platform);
      return { ...state, ...action.payload, platform, components, componentOrder };
    }
    case 'SET_PLATFORM':
      return { ...state, platform: normalizePlatform(action.payload) };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOCALE':
      return { ...state, locale: action.payload };
    case 'SET_COMPONENT_DISPLAY': {
      const [key, display] = action.payload;
      return {
        ...state,
        components: { ...state.components, [key]: { ...state.components[key], display } },
      };
    }
    case 'SET_COMPONENT_ORDER':
      return {
        ...state,
        componentOrder: normalizeComponentOrder(action.payload, state.components),
      };
    case 'SET_FISSURE_DISPLAYS':
      return { ...state, fissureDisplays: action.payload };
    case 'SET_FISSURE_PLANET': {
      const [key, val] = action.payload;
      return {
        ...state,
        fissurePlanets: { ...state.fissurePlanets, [key]: { ...state.fissurePlanets[key], state: val } },
      };
    }
    case 'SET_SOUND_FILTERS':
      return { ...state, soundFilters: action.payload };
    case 'SET_REWARD_STATE': {
      const [key, val] = action.payload;
      const rewardTypes = { ...state.trackables.rewardTypes };
      if (rewardTypes[key]) rewardTypes[key] = { ...rewardTypes[key], state: val };
      return { ...state, trackables: { ...state.trackables, rewardTypes } };
    }
    case 'SET_EVENT_STATE': {
      const [key, val] = action.payload;
      const eventTypes = { ...state.trackables.eventTypes };
      if (eventTypes[key]) eventTypes[key] = { ...eventTypes[key], state: val };
      return { ...state, trackables: { ...state.trackables, eventTypes } };
    }
    case 'SET_COMPONENT': {
      const [key, val] = action.payload;
      return { ...state, components: { ...state.components, [key]: val } };
    }
    case 'SET_NEWS_AUTO_CYCLE':
      return {
        ...state,
        components: {
          ...state.components,
          news: { ...state.components.news, autoCycle: action.payload },
        },
      };
    default:
      return state;
  }
};

type PrefsContextValue = {
  state: PrefsState;
  dispatch: Dispatch<PrefsAction>;
  setPlatform: (p: Platform) => void;
  setTheme: (t: string) => void;
  setLocale: (l: string) => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);
const PrefsProvider: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(prefsReducer, initialState);
  const [prefsReady, setPrefsReady] = useState(false);

  useEffect(() => {
    migrateLegacyStorage();
    const stored = readStorage<PrefsState>(STORAGE_KEY);
    const trackables = buildTrackables(stored?.trackables);

    if (stored) {
      const migrated = migrateFissurePanels(
        stored.components,
        initialState.components,
        stored.fissureDisplays ?? initialState.fissureDisplays,
        stored.componentOrder,
      );
      const components = migrated.components;
      dispatch({
        type: 'HYDRATE',
        payload: {
          ...stored,
          trackables,
          components,
          componentOrder: normalizeComponentOrder(migrated.componentOrder, components),
        },
      });
    } else {
      dispatch({
        type: 'HYDRATE',
        payload: {
          trackables,
          componentOrder: normalizeComponentOrder(undefined, initialState.components),
        } as Partial<PrefsState>,
      });
    }

    setPrefsReady(true);
  }, []);

  usePersistedState(STORAGE_KEY, state, prefsReady);

  const setPlatform = useCallback((p: Platform) => dispatch({ type: 'SET_PLATFORM', payload: p }), []);
  const setTheme = useCallback((t: string) => dispatch({ type: 'SET_THEME', payload: t }), []);
  const setLocale = useCallback((l: string) => dispatch({ type: 'SET_LOCALE', payload: l }), []);

  const value = useMemo(
    () => ({ state, dispatch, setPlatform, setTheme, setLocale }),
    [state, setPlatform, setTheme, setLocale]
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
};
export default PrefsProvider;

export const usePrefs = (): PrefsContextValue => {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider');
  return ctx;
};

export const seedPrefs = (payload: Partial<PrefsState>): void => {
  debouncedWriteStorage(STORAGE_KEY, payload);
};
