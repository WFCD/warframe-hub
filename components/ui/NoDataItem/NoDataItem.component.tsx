'use client';
import './NoDataItem.component.scss';
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
    <div
      className={[
        'hub-no-data-item',
        overrideBorder ? '' : 'hub-no-data-item--border-bottom',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="dim hub-empty-state">
        <HubImg
          src={loading}
          name={t('nav.nodata')}
          width="40px"
          height="40px"
          className="hub-empty-state-icon"
          style={{ filter: 'invert(80%)' }}
        />

        <div className="no-content-warning align-middle" style={{ marginBottom: '2px' }}>
          {t('nav.nodatatxt', { text })}
        </div>
      </span>
    </div>
  );
};

export default NoDataItem;
