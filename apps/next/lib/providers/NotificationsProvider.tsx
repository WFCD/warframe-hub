'use client';

import type { Platform, NotificationsState } from '@wfcd/shared';
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

const STORAGE_KEY = 'hub.v1.notifications';

const initialState: NotificationsState = {
  notificationsAllowed: 'default',
  notifiedIds: { pc: [], ps4: [], xb1: [], switch: [] },
};

type NotifAction =
  | { type: 'HYDRATE'; payload: NotificationsState }
  | { type: 'SET_ALLOWANCE'; payload: NotificationPermission | 'default' }
  | { type: 'SET_NOTIFIED_IDS'; payload: [string[], Platform?] };

const notifReducer = (state: NotificationsState, action: NotifAction): NotificationsState => {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };
    case 'SET_ALLOWANCE':
      return { ...state, notificationsAllowed: action.payload };
    case 'SET_NOTIFIED_IDS': {
      const [ids, platform] = action.payload;
      const p = platform || 'pc';
      return { ...state, notifiedIds: { ...state.notifiedIds, [p]: ids } };
    }
    default:
      return state;
  }
};

type NotifContextValue = {
  state: NotificationsState;
  dispatch: Dispatch<NotifAction>;
  setAllowance: (a: NotificationPermission | 'default') => void;
  getNotifiedIds: (platform: Platform) => string[];
};

const NotificationsContext = createContext<NotifContextValue | null>(null);
const NotificationsProvider: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(notifReducer, initialState);

  useEffect(() => {
    const stored = readStorage<NotificationsState>(STORAGE_KEY);
    if (stored) dispatch({ type: 'HYDRATE', payload: stored });
  }, []);

  usePersistedState(STORAGE_KEY, state);

  const setAllowance = useCallback(
    (a: NotificationPermission | 'default') => dispatch({ type: 'SET_ALLOWANCE', payload: a }),
    []
  );
  const getNotifiedIds = useCallback((platform: Platform) => state.notifiedIds[platform] || [], [state.notifiedIds]);

  const value = useMemo(
    () => ({ state, dispatch, setAllowance, getNotifiedIds }),
    [state, setAllowance, getNotifiedIds]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};
export default NotificationsProvider;

export const useNotifications = (): NotifContextValue => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};
