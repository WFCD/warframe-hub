'use client';

import type { FC } from 'react';
import type { Key } from '@heroui/react';

import { useTranslation } from 'react-i18next';
import HubTrackableMultiSelect from '@/components/ui/HubTrackableMultiSelect';
import {
  getActiveKeys,
  getArbitrationOptions,
  getEventOptions,
  getFissureOptions,
  getRewardOptions,
} from '@/lib/notifications/trackableGroups';
import { usePrefs } from '@/lib/providers/PrefsProvider';

const NotificationFilters: FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = usePrefs();
  const { rewardTypes, eventTypes } = state.trackables;

  const rewardOptions = getRewardOptions(rewardTypes);
  const eventOptions = getEventOptions(eventTypes);
  const fissureOptions = getFissureOptions(eventTypes);
  const arbitrationOptions = getArbitrationOptions(eventTypes);

  const eventGroupKeys = eventOptions.map((option) => option.key);
  const fissureGroupKeys = fissureOptions.map((option) => option.key);
  const arbitrationGroupKeys = arbitrationOptions.map((option) => option.key);

  const applyRewardSelection = (keys: Key[]) => {
    const enabled = new Set(keys.map(String));
    Object.keys(rewardTypes).forEach((key) => {
      dispatch({ type: 'SET_REWARD_STATE', payload: [key, enabled.has(key)] });
    });
  };

  const applyEventGroupSelection = (groupKeys: string[], keys: Key[]) => {
    const enabled = new Set(keys.map(String));
    groupKeys.forEach((key) => {
      dispatch({ type: 'SET_EVENT_STATE', payload: [key, enabled.has(key)] });
    });
  };

  const activeEventKeys = getActiveKeys(eventTypes);

  return (
    <div className="hub-settings-notifications">
      <p className="hub-settings-notifications-help">{t('settings.notificationsHelp')}</p>

      <HubTrackableMultiSelect
        label={t('settings.rewards')}
        placeholder={t('settings.selectRewards')}
        options={rewardOptions}
        selectedKeys={getActiveKeys(rewardTypes)}
        onSelectionChange={applyRewardSelection}
      />

      <HubTrackableMultiSelect
        label={t('settings.events')}
        placeholder={t('settings.selectEvents')}
        options={eventOptions}
        selectedKeys={activeEventKeys.filter((key) => eventGroupKeys.includes(key))}
        onSelectionChange={(keys) => applyEventGroupSelection(eventGroupKeys, keys)}
      />

      <HubTrackableMultiSelect
        label={t('fissures.header')}
        placeholder={t('settings.selectFissures')}
        options={fissureOptions}
        selectedKeys={activeEventKeys.filter((key) => fissureGroupKeys.includes(key))}
        onSelectionChange={(keys) => applyEventGroupSelection(fissureGroupKeys, keys)}
      />

      <HubTrackableMultiSelect
        label={t('arbitration.header')}
        placeholder={t('settings.selectArbitrations')}
        options={arbitrationOptions}
        selectedKeys={activeEventKeys.filter((key) => arbitrationGroupKeys.includes(key))}
        onSelectionChange={(keys) => applyEventGroupSelection(arbitrationGroupKeys, keys)}
      />
    </div>
  );
};

export default NotificationFilters;
