'use client';

import type { FC, ReactNode } from 'react';
import { Table, Tooltip } from '@heroui/react';
import FishImg from '@/components/media/FishImg';
import { HUB_TOOLTIP_DELAY } from '@/lib/ui/tooltipTiming';
import type { FishSortState } from './fishTableSort';

type FishExpandButtonProps = {
  name: string;
  expanded: boolean;
  onToggle: () => void;
};

export const FishExpandButton: FC<FishExpandButtonProps> = ({
  name,
  expanded,
  onToggle,
}: FishExpandButtonProps) => (
  <button
    type="button"
    className="hub-content-expand-btn"
    aria-expanded={expanded}
    aria-label={`Toggle details for ${name}`}
    onClick={onToggle}
  >
    <i className={`fas fa-chevron-${expanded ? 'down' : 'right'}`} aria-hidden />
  </button>
);

type FishBoolIconProps = {
  value: boolean;
};

export const FishBoolIcon: FC<FishBoolIconProps> = ({ value }: FishBoolIconProps) => (
  <i className={`fas fa-lg ${value ? 'fa-check-circle hub-content-bool--yes' : 'fa-times-circle hub-content-bool--no'}`} />
);

type FishTimeTooltipProps = {
  id: string;
  label: string;
  children: ReactNode;
};

export const FishTimeTooltip: FC<FishTimeTooltipProps> = ({ id, label, children }: FishTimeTooltipProps) => (
  <Tooltip delay={HUB_TOOLTIP_DELAY}>
    <Tooltip.Trigger>
      <span id={id}>{children}</span>
    </Tooltip.Trigger>
    <Tooltip.Content>{label}</Tooltip.Content>
  </Tooltip>
);

type FishDetailItem = {
  key: string;
  label: string;
  href?: string;
  thumb?: string;
  imageType: 'fish' | 'parts' | 'bait';
  width: string;
};

type FishDetailPanelProps = {
  items: FishDetailItem[];
  mobileStats?: FishMobileStatRow[];
};

export type FishMobileStatRow = {
  label: string;
  value: ReactNode;
};

export const FISH_TABLE_MOBILE_DETAIL_COL = 'fish-info__col--mobile-detail';

type FishSortableColumnProps = {
  id: string;
  sort: FishSortState | null;
  onSort: (column: string) => void;
  children: ReactNode;
  className?: string;
  title?: string;
  isRowHeader?: boolean;
  sortable?: boolean;
};

export const FishSortableColumn: FC<FishSortableColumnProps> = ({
  id,
  sort,
  onSort,
  children,
  className,
  title,
  isRowHeader,
  sortable = true,
}: FishSortableColumnProps) => {
  const active = sort?.column === id;
  const direction = active ? sort.direction : null;
  const label = typeof children === 'string' ? children : id;

  return (
    <Table.Column isRowHeader={isRowHeader} title={title} className={className}>
      {sortable ? (
        <button
          type="button"
          className={['hub-fish-sort-btn', active ? 'is-active' : ''].filter(Boolean).join(' ')}
          aria-label={`Sort by ${label}`}
          aria-pressed={active}
          onClick={() => onSort(id)}
        >
          <span>{children}</span>
          <i
            className={[
              'fas',
              'hub-fish-sort-btn__icon',
              active ? (direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort',
            ].join(' ')}
            aria-hidden
          />
        </button>
      ) : (
        children
      )}
    </Table.Column>
  );
};

export const FishMobileDetailStats: FC<{ rows: FishMobileStatRow[] }> = ({ rows }: { rows: FishMobileStatRow[] }) => (
  <dl className="hub-fish-mobile-stats">
    {rows.map(({ label, value }) => (
      <div key={label} className="hub-fish-mobile-stats__row">
        <dt className="hub-fish-mobile-stats__label">{label}</dt>
        <dd className="hub-fish-mobile-stats__value">{value}</dd>
      </div>
    ))}
  </dl>
);

export const FishDetailPanel: FC<FishDetailPanelProps> = ({ items, mobileStats }: FishDetailPanelProps) => {
  const hasGallery = items.length > 0;
  const hasMobileStats = Boolean(mobileStats?.length);
  if (!hasGallery && !hasMobileStats) return null;

  return (
    <div className="hub-fish-expand-detail">
      {hasMobileStats ? <FishMobileDetailStats rows={mobileStats!} /> : null}
      {hasGallery ? (
        <div className="hub-content-detail-panel">
          {items.map((item) =>
            item.thumb ? (
              <div key={item.key} className="hub-content-detail-panel__item">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="hub-content-detail-panel__link">
                    {item.label}
                  </a>
                ) : (
                  <strong>{item.label}</strong>
                )}
                <FishImg type={item.imageType} item={item.thumb} title={item.label} width={item.width} />
              </div>
            ) : null
          )}
        </div>
      ) : null}
    </div>
  );
};
