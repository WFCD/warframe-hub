'use client';
import type { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { cdn } from '@/lib/shared';
import HubImg from '@/components/media/HubImg';

const loading = cdn('svg/loading.svg');

type NoDataItemProps = {
  text?: string;
  overrideBorder?: boolean;
};

const NoDataItem: FC<NoDataItemProps> = ({ text = 'Data', overrideBorder = false }: NoDataItemProps) => {
  const { t } = useTranslation();

  return (
    <div className={overrideBorder ? 'py-1 px-1.5' : 'py-1 px-1.5 border-b-0'}>
      <span className="dim inline-flex items-center justify-center gap-2">
        <HubImg
          src={loading}
          name={t('nav.nodata')}
          width="40px"
          height="40px"
          className="shrink-0"
          style={{ filter: 'invert(80%)' }}
        />

        <div className="no-content-warning align-middle mb-0.5">
          {t('nav.nodatatxt', { text })}
        </div>
      </span>
    </div>
  );
};

export default NoDataItem;
