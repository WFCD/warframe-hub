'use client';

import { useEffect, useState, type FC } from 'react';
import { Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';

const isDev = process.env.NODE_ENV === 'development';

const PwaUpdatePrompt: FC = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (isDev && registration) {
        void registration.unregister();
      }
    },
    onNeedRefresh() {
      if (!isDev) setShow(true);
    },
  });

  useEffect(() => {
    if (!isDev && needRefresh) setShow(true);
  }, [needRefresh]);

  if (isDev || !show) return null;

  const dismiss = () => {
    setShow(false);
    setNeedRefresh(false);
  };

  return (
    <div
      className='fixed right-4 bottom-4 z-[var(--hub-z-toast,1080)] max-w-[min(24rem,calc(100vw-2rem))]'
      role='status'
      aria-live='polite'
    >
      <div className='rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--hub-panel-shadow,0_0.5rem_1.5rem_rgb(0_0_0_/_0.25))]'>
        <div className='flex items-center justify-between gap-3 px-3.5 pt-2.5 pb-1.5'>
          <strong>{t('updates.header')}</strong>
          <button
            type='button'
            className='border-0 bg-transparent text-[var(--hub-text-secondary)] text-xl leading-none cursor-pointer'
            onClick={dismiss}
            aria-label={t('updates.dismiss')}
          >
            ×
          </button>
        </div>
        <div className='px-3.5 pb-3.5'>
          {t('updates.ready')}
          <div className='mt-2.5 pt-2.5 border-t border-[var(--border)]'>
            <Button size='sm' variant='primary' onPress={() => void updateServiceWorker(true)}>
              {t('updates.updateNow')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PwaUpdatePrompt;
