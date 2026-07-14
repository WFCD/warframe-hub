export const NOTIFICATION_SOUND_KEYS = ['drum', 'eidolon'] as const;

export type NotificationSoundKey = (typeof NOTIFICATION_SOUND_KEYS)[number];

const NOTIFICATION_SOUND_SRC: Record<NotificationSoundKey, string> = {
  drum: '/audio/drum.mp3',
  eidolon: '/audio/eidolon.mp3',
};

export const playNotificationSound = async (
  key: NotificationSoundKey,
  volume = 1,
): Promise<void> => {
  if (typeof window === 'undefined') return;

  const audio = new Audio(NOTIFICATION_SOUND_SRC[key]);
  audio.volume = volume;
  try {
    await audio.play();
  } catch {
    // Browser may block playback outside a user gesture.
  }
};
