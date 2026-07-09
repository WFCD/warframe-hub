'use client';
import './ConstructionPanel.component.scss';
import type { FC } from 'react';

import { useTranslation } from 'react-i18next';
import NoDataItem from '@/components/ui/NoDataItem';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import { HubPanelList, HubPanelListItem } from '@/components/panels/shared/HubPanelList';

const normalize = (num: number): number => {
  if (num > 100) return normalize(num - 100);
  if (num < 0) return 0;
  return num;
};

const percent = (str: string | number | undefined): number => {
  const num = normalize(Number.parseFloat(String(str ?? '0.00')));
  return Number.parseFloat(num.toFixed(2));
};

type EllipseProgressProps = {
  progress: number;
  color: string;
  size?: number;
  caption: string;
};

const EllipseProgress: FC<EllipseProgressProps> = ({ progress, color, size = 100, caption }: EllipseProgressProps) => {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="construction-wrapper text-center">
      <div className="construction-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#222" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="construction-ring-value">{progress}%</div>
      </div>
      <p className="legend-caption">{caption}</p>
    </div>
  );
};

type Construction = {
  fomorianProgress?: string | number;
  razorbackProgress?: string | number;
};

type ConstructionPanelProps = {
  construction?: Construction;
};

const ConstructionPanel: FC<ConstructionPanelProps> = ({
  construction = { fomorianProgress: 0, razorbackProgress: 0 },
}: ConstructionPanelProps) => {
  const { t } = useTranslation();
  const headertext = t('construction.header');
  const hasData = construction && Object.keys(construction).length > 2;

  return (
    <HubPanelWrap title={headertext} className="construction">
      {hasData ? (
        <HubPanelList>
          <HubPanelListItem borderless className="hub-construction-row">
            <EllipseProgress
              progress={percent(construction.fomorianProgress)}
              color="#ff0000"
              caption={t('construction.fomorian')}
            />
            <EllipseProgress
              progress={percent(construction.razorbackProgress)}
              color="#5BACF7"
              caption={t('construction.razorback')}
            />
          </HubPanelListItem>
        </HubPanelList>
      ) : (
        <NoDataItem text={headertext} />
      )}
    </HubPanelWrap>
  );
};

export default ConstructionPanel;
