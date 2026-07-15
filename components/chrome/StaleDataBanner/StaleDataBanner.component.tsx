'use client';
import { useCallback, useEffect, useState, type FC } from 'react';
import { Alert, Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useWorldstate } from '@/lib/providers/WorldstateProvider';
import { isWorldstateStale } from '@/lib/worldstate/worldstateAge';
import { getDataMode } from '@/lib/test/dataMode';
import { useClientMounted } from '@/lib/hooks/useClientMounted';

const StaleDataBanner: FC = () => {
  const { t } = useTranslation();
  const { worldstate, updateWorldstate } = useWorldstate();
  const clientMounted = useClientMounted();
  const [online, setOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!clientMounted) return;
    setOnline(navigator.onLine);
    setNow(Date.now());
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    const id = window.setInterval(() => setNow(Date.now()), 10000);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, [clientMounted]);

  const stale =
    clientMounted && getDataMode() === 'live' && online && isWorldstateStale(worldstate.timestamp, undefined, now);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await updateWorldstate({ force: true });
    } finally {
      setRefreshing(false);
    }
  }, [updateWorldstate]);

  if (!stale) return null;

  return (
    <Alert status='warning' className='hub-stale-data-banner mb-0 rounded-none border-x-0 border-t-0'>
      <Alert.Content className='flex flex-wrap items-center justify-center gap-3 text-center'>
        <Alert.Description>{t('staleData.message')}</Alert.Description>
        <Button
          size='sm'
          variant='secondary'
          className='shrink-0'
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
