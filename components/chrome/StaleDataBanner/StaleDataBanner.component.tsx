'use client';
import './StaleDataBanner.component.scss';

import { useCallback, useEffect, useState, type FC } from 'react';
import { Alert, Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useWorldstate } from '@/lib/providers/WorldstateProvider';
import { isWorldstateStale } from '@/lib/worldstate/worldstateAge';
import { getDataMode } from '@/lib/test/dataMode';

const StaleDataBanner: FC = () => {
  const { t } = useTranslation();
  const { worldstate, updateWorldstate } = useWorldstate();
  const [online, setOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const stale = getDataMode() === 'live' && online && isWorldstateStale(worldstate.timestamp, undefined, now);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await updateWorldstate();
    } finally {
      setRefreshing(false);
    }
  }, [updateWorldstate]);

  if (!stale) return null;

  return (
    <Alert status="warning" className="hub-stale-data-banner mb-0 rounded-none border-x-0 border-t-0">
      <Alert.Content className="hub-stale-data-banner__content">
        <Alert.Description>{t('staleData.message')}</Alert.Description>
        <Button
          size="sm"
          variant="secondary"
          className="hub-stale-data-banner__btn"
          isDisabled={refreshing}
          onPress={() => void onRefresh()}
        >
          {refreshing ? t('staleData.refreshing') : t('staleData.refresh')}
        </Button>
      </Alert.Content>
    </Alert>
  );
};

export default StaleDataBanner;
