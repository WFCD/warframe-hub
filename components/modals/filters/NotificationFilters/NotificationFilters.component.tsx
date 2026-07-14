'use client';

import { useState, type FC } from 'react';
import type { Key } from '@heroui/react';
import { Button } from '@heroui/react';

import { useTranslation } from 'react-i18next';
import HubTrackableMultiSelect from '@/components/ui/HubTrackableMultiSelect';
import {
  getActiveKeys,
  getArbitrationOptions,
  getEventOptions,
  getFissureOptions,
  getRewardOptions,
} from '@/lib/notifications/trackableGroups';
import { isNotificationSupported, sendTestNotification } from '@/lib/notifications/testNotification';
import { useNotifications } from '@/lib/providers/NotificationsProvider';
import { usePrefs } from '@/lib/providers/PrefsProvider';

type TestStatus = 'idle' | 'sent' | 'denied' | 'unsupported';

const NotificationFilters: FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = usePrefs();
  const { setAllowance } = useNotifications();
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const { rewardTypes, eventTypes } = state.trackables;
  const notificationsSupported = isNotificationSupported();

  const rewardOptions = getRewardOptions(rewardTypes, state.locale);
  const eventOptions = getEventOptions(eventTypes, state.locale);
  const fissureOptions = getFissureOptions(eventTypes, state.locale);
  const arbitrationOptions = getArbitrationOptions(eventTypes, state.locale);

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

  const handleTestNotification = async () => {
    const result = await sendTestNotification({
      title: t('settings.testNotificationTitle'),
      body: t('settings.testNotificationBody'),
      soundFilters: state.soundFilters,
    });

    if (result.permission !== 'unsupported') {
      setAllowance(result.permission);
    }
    setTestStatus(result.status);
  };

  const testStatusMessage =
    testStatus === 'sent'
      ? t('settings.testNotificationSent')
      : testStatus === 'denied'
        ? t('settings.testNotificationDenied')
        : testStatus === 'unsupported'
          ? t('settings.testNotificationUnsupported')
          : null;

  return (
    <div className="hub-settings-notifications">
      <p className="hub-settings-notifications-help">{t('settings.notificationsHelp')}</p>
      <div className="hub-settings-notifications-test">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          isDisabled={!notificationsSupported}
          onPress={() => void handleTestNotification()}
        >
          {t('settings.testNotification')}
        </Button>
        <p className="hub-settings-notifications-help">{t('settings.testNotificationHelp')}</p>
        {testStatusMessage ? (
          <p
            className={[
              'hub-settings-notifications-test-status',
              testStatus === 'sent' ? 'hub-settings-notifications-test-status--sent' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            role="status"
          >
            {testStatusMessage}
          </p>
        ) : null}
      </div>

      <HubTrackableMultiSelect
        label={t('settings.rewards')}
        placeholder={t('settings.selectRewards')}
        options={rewardOptions}
        selectedKeys={getActiveKeys(rewardTypes)}
        onSelectionChange={applyRewardSelection}
        showSelectAll
      />

      <HubTrackableMultiSelect
        label={t('settings.events')}
        placeholder={t('settings.selectEvents')}
        options={eventOptions}
        selectedKeys={activeEventKeys.filter((key) => eventGroupKeys.includes(key))}
        onSelectionChange={(keys) => applyEventGroupSelection(eventGroupKeys, keys)}
        showSelectAll
      />

      <HubTrackableMultiSelect
        label={t('fissures.header')}
        placeholder={t('settings.selectFissures')}
        options={fissureOptions}
        selectedKeys={activeEventKeys.filter((key) => fissureGroupKeys.includes(key))}
        onSelectionChange={(keys) => applyEventGroupSelection(fissureGroupKeys, keys)}
        showSelectAll
      />

      <HubTrackableMultiSelect
        label={t('arbitration.header')}
        placeholder={t('settings.selectArbitrations')}
        options={arbitrationOptions}
        selectedKeys={activeEventKeys.filter((key) => arbitrationGroupKeys.includes(key))}
        onSelectionChange={(keys) => applyEventGroupSelection(arbitrationGroupKeys, keys)}
        showSelectAll
      />
    </div>
  );
};

export default NotificationFilters;
