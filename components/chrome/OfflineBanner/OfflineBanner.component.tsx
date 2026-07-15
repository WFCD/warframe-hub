'use client';

import { useEffect, useState, type FC } from 'react';
import { Alert } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useWorldstate } from '@/lib/providers/WorldstateProvider';

const OfflineBanner: FC = () => {
  const { t, i18n } = useTranslation();
  const [online, setOnline] = useState(true);
  const { lastUpdated } = useWorldstate();

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

  if (online) return null;

  const lastUpdatedLabel = lastUpdated
    ? t('offline.lastUpdated', {
      date: new Date(lastUpdated).toLocaleString(i18n.language),
    })
    : '';

  return (
    <Alert status='warning' className='mb-0 rounded-none border-x-0 border-t-0'>
      <Alert.Content className='text-center'>
        <Alert.Description>
          {t('offline.cachedData')}
          {lastUpdatedLabel}
        </Alert.Description>
      </Alert.Content>
    </Alert>
  );
};
export default OfflineBanner;
