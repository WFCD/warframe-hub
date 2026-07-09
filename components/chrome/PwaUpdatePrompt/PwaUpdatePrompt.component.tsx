'use client';
import './PwaUpdatePrompt.component.scss';

import { useEffect, useState, type FC } from 'react';
import { Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';

const isDev = process.env.NODE_ENV === 'development';

const PwaUpdatePrompt: FC = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const { needRefresh, updateServiceWorker } = useRegisterSW({
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

  return (
    <div className="hub-pwa-update-prompt" role="status" aria-live="polite">
      <div className="hub-pwa-update-prompt__card">
        <div className="hub-pwa-update-prompt__header">
          <strong>{t('updates.header')}</strong>
          <button
            type="button"
            className="hub-pwa-update-prompt__close"
            onClick={() => setShow(false)}
            aria-label={t('updates.dismiss')}
          >
            ×
          </button>
        </div>
        <div className="hub-pwa-update-prompt__body">
          {t('updates.ready')}
          <div className="hub-pwa-update-prompt__actions">
            <Button size="sm" variant="primary" onPress={() => void updateServiceWorker(true)}>
              {t('updates.updateNow')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PwaUpdatePrompt;
