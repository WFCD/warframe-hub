import {
  NOTIFICATION_SOUND_KEYS,
  playNotificationSound,
  type NotificationSoundKey,
} from './notificationSounds';
import { NOTIFICATION_ICON_URL } from './constants';
import { createNotificationTranslator } from './notificationI18n';

export type TestNotificationResult = {
  status: 'sent' | 'denied' | 'unsupported';
  permission: NotificationPermission | 'unsupported';
};

export const isNotificationSupported = (): boolean =>
  typeof window !== 'undefined' && 'Notification' in window;

const resolvePermission = async (): Promise<NotificationPermission | 'denied' | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
};

/** Legacy settings-modal flow: prompt once, show thanks toast on grant. */
export const promptNotificationPermission = async (
  locale = 'en',
): Promise<NotificationPermission | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  const t = createNotificationTranslator(locale);
  const result = await Notification.requestPermission();
  if (result === 'granted') {
    new Notification(t('settings.permissionThanksTitle'), {
      body: t('settings.testNotificationBody'),
      icon: NOTIFICATION_ICON_URL,
    });
  }

  return result;
};

const playFirstEnabledSound = async (soundFilters: string[]): Promise<void> => {
  const sound = soundFilters.find((entry): entry is NotificationSoundKey =>
    (NOTIFICATION_SOUND_KEYS as readonly string[]).includes(entry),
  );
  if (sound) await playNotificationSound(sound);
};

export const sendTestNotification = async ({
  title,
  body,
  soundFilters = [],
}: {
  title: string;
  body: string;
  soundFilters?: string[];
}): Promise<TestNotificationResult> => {
  const permission = await resolvePermission();
  if (permission === 'unsupported') {
    return { status: 'unsupported', permission: 'unsupported' };
  }
  if (permission !== 'granted') {
    return { status: 'denied', permission };
  }

  new Notification(title, {
    body,
    icon: NOTIFICATION_ICON_URL,
  });
  await playFirstEnabledSound(soundFilters);

  return { status: 'sent', permission };
};
