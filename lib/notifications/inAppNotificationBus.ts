import type { HubNotificationPayload } from './notificationMessages';

export type InAppNotification = HubNotificationPayload & { id: string };

type Listener = (notification: InAppNotification) => void;

const listeners = new Set<Listener>();

export const subscribeInAppNotifications = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const showInAppNotification = (notification: HubNotificationPayload): void => {
  if (typeof window === 'undefined') return;

  const entry: InAppNotification = {
    ...notification,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };

  listeners.forEach((listener) => listener(entry));
};
