'use client';

import type { MapsState } from '@/lib/shared';
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
import { readStorage, usePersistedState } from './storageUtils';

const STORAGE_KEY = 'hub.v1.maps';

const initialState: MapsState = {
  poeMapToggles: {
    'Map Label-toggle-value': true,
    'Fishing-toggle-value': true,
    'Grineer Camp-toggle-value': true,
    'Oddity-toggle-value': true,
    'Cetus Wisp-toggle-value': true,
    'Vomvalyst Lure-toggle-value': true,
    'Cave Entrance-toggle-value': true,
  },
  vallisMapToggles: {
    'Map Label-toggle-value': true,
    'Fishing-toggle-value': true,
    'Fishing Spots-toggle-value': true,
    'Mining Spots-toggle-value': true,
    'K-Drive-toggle-value': true,
    'Oddity-toggle-value': true,
    'Somachord Tone-toggle-value': true,
    'Toroids-toggle-value': true,
    'Special Caves-toggle-value': true,
  },
  deimosMapToggles: {
    'Map Label-toggle-value': true,
    'Teleporter-toggle-value': true,
    'Cave Entrance-toggle-value': true,
    'Necramech-toggle-value': false,
    'Mother Bounty-toggle-value': false,
    'K-Drive-toggle-value': true,
  },
  bountyToggles: {},
};

type MapsAction =
  | { type: 'HYDRATE'; payload: MapsState }
  | { type: 'SET_POE_TOGGLES'; payload: Record<string, boolean> }
  | { type: 'SET_VALLIS_TOGGLES'; payload: Record<string, boolean> }
  | { type: 'SET_DEIMOS_TOGGLES'; payload: Record<string, boolean> }
  | { type: 'SET_BOUNTY_TOGGLE'; payload: [string, boolean] };

const mapsReducer = (state: MapsState, action: MapsAction): MapsState => {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };
    case 'SET_POE_TOGGLES':
      return { ...state, poeMapToggles: action.payload };
    case 'SET_VALLIS_TOGGLES':
      return { ...state, vallisMapToggles: action.payload };
    case 'SET_DEIMOS_TOGGLES':
      return { ...state, deimosMapToggles: action.payload };
    case 'SET_BOUNTY_TOGGLE': {
      const [key, val] = action.payload;
      return { ...state, bountyToggles: { ...state.bountyToggles, [key]: val } };
    }
    default:
      return state;
  }
};

type MapsContextValue = {
  state: MapsState;
  dispatch: Dispatch<MapsAction>;
  setPoeMapToggles: (t: Record<string, boolean>) => void;
  setVallisMapToggles: (t: Record<string, boolean>) => void;
  setDeimosMapToggles: (t: Record<string, boolean>) => void;
};

const MapsContext = createContext<MapsContextValue | null>(null);
const MapsProvider: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(mapsReducer, initialState);

  useEffect(() => {
    const stored = readStorage<MapsState>(STORAGE_KEY);
    if (stored) dispatch({ type: 'HYDRATE', payload: stored });
  }, []);

  usePersistedState(STORAGE_KEY, state);

  const setPoeMapToggles = useCallback(
    (t: Record<string, boolean>) => dispatch({ type: 'SET_POE_TOGGLES', payload: t }),
    []
  );
  const setVallisMapToggles = useCallback(
    (t: Record<string, boolean>) => dispatch({ type: 'SET_VALLIS_TOGGLES', payload: t }),
    []
  );
  const setDeimosMapToggles = useCallback(
    (t: Record<string, boolean>) => dispatch({ type: 'SET_DEIMOS_TOGGLES', payload: t }),
    []
  );

  const value = useMemo(
    () => ({ state, dispatch, setPoeMapToggles, setVallisMapToggles, setDeimosMapToggles }),
    [state, setPoeMapToggles, setVallisMapToggles, setDeimosMapToggles]
  );

  return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>;
};
export default MapsProvider;

export const useMaps = (): MapsContextValue => {
  const ctx = useContext(MapsContext);
  if (!ctx) throw new Error('useMaps must be used within MapsProvider');
  return ctx;
};
