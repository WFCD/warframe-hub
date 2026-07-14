import type { HubNotificationPayload } from './notificationMessages';
import { showInAppNotification } from './inAppNotificationBus';
import {
  NOTIFICATION_SOUND_KEYS,
  playNotificationSound,
  type NotificationSoundKey,
} from './notificationSounds';

const playSoundIfEnabled = async (
  notification: HubNotificationPayload,
  soundFilters: string[],
): Promise<void> => {
  if (
    !notification.sound ||
    !(NOTIFICATION_SOUND_KEYS as readonly string[]).includes(notification.sound) ||
    !soundFilters.includes(notification.sound)
  ) {
    return;
  }

  await playNotificationSound(notification.sound as NotificationSoundKey, 0.5);
};

const deliverPushNotification = (notification: HubNotificationPayload): void => {
  const instance = new Notification(notification.title, {
    body: notification.body,
    icon: notification.icon,
  });

  if (notification.link) {
    instance.onclick = (event) => {
      event.preventDefault();
      window.open(notification.link, '_blank', 'noopener,noreferrer');
      instance.close();
    };
  }
};

export const deliverNotifications = async (
  notifications: HubNotificationPayload[],
  soundFilters: string[],
): Promise<void> => {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const usePush = !document.hasFocus();

  for (const notification of notifications) {
    if (usePush) {
      deliverPushNotification(notification);
    } else {
      showInAppNotification(notification);
    }

    await playSoundIfEnabled(notification, soundFilters);
  }
};
