'use client';

import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { cdn } from '@/lib/shared';

const wfcdLogo = cdn('svg/wfcd.svg');
const NotFound: FC = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-wrap gap-8 items-start max-w-[1140px] mx-auto py-12 px-6 text-left'>
      <div className='shrink-0 basis-48'>
        <img className='wfcd-logo' src={wfcdLogo} alt={t('notFound.logoAlt')} style={{ filter: 'invert(0.7)' }} />
      </div>
      <div className='flex-1 basis-80 min-w-0'>
        <h1>{t('notFound.title')}</h1>
        <h2>{t('notFound.subtitle')}</h2>
        <h3>{t('notFound.question')}</h3>
        <br />
        <br />
        <p>{t('notFound.reassure')}</p>
        <p>{t('notFound.logged')}</p>
        <p>{t('notFound.panicking')}</p>
        <p>{t('notFound.poorDev')}</p>
        <br />
        <br />
        <a href='/'>{t('notFound.homeLink')}</a>
      </div>
    </div>
  );
};
export default NotFound;
