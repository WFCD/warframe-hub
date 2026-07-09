'use client';
import './SoundFilters.component.scss';

import type { FC } from 'react';

import { Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import HubSwitch from '@/components/ui/HubSwitch';
import { NOTIFICATION_SOUND_KEYS, playNotificationSound } from '@/lib/notifications/notificationSounds';
import { usePrefs } from '@/lib/providers/PrefsProvider';

const SoundFilters: FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = usePrefs();

  return (
    <div className="hub-settings-sounds">
      <p className="hub-settings-notifications-help">{t('settings.soundsHelp')}</p>
      <div className="hub-settings-sound-list">
        {NOTIFICATION_SOUND_KEYS.map((sound) => (
          <div key={sound} className="hub-settings-sound-row">
            <HubSwitch
              id={`sound-${sound}`}
              label={t(`settings.sounds.${sound}`)}
              checked={state.soundFilters.includes(sound)}
              onChange={(isSelected) => {
                const next = isSelected
                  ? [...state.soundFilters, sound]
                  : state.soundFilters.filter((s) => s !== sound);
                dispatch({ type: 'SET_SOUND_FILTERS', payload: next });
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="hub-settings-sound-preview"
              aria-label={t('settings.soundsPlay', { sound: t(`settings.sounds.${sound}`) })}
              onPress={() => void playNotificationSound(sound)}
            >
              <i className="fas fa-volume-up" aria-hidden />
              {t('settings.soundsPlayLabel')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoundFilters;
