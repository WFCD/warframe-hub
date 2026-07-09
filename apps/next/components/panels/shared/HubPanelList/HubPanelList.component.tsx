'use client';
import './HubPanelList.component.scss';

import type { CSSProperties, FC, ReactNode } from 'react';

type HubPanelListProps = {
  children: ReactNode;
  className?: string;
};

type HubPanelListItemProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  borderless?: boolean;
  borderBottom?: boolean;
  compact?: boolean;
};

export const HubPanelList: FC<HubPanelListProps> = ({ children, className }: HubPanelListProps) => (
  <div className={['hub-panel-list', className].filter(Boolean).join(' ')}>{children}</div>
);

export const HubPanelListItem: FC<HubPanelListItemProps> = ({
  children,
  className,
  style,
  borderless = false,
  borderBottom = false,
  compact = false,
}: HubPanelListItemProps) => (
  <div
    className={[
      'hub-panel-list-item',
      borderless ? 'hub-panel-list-item--borderless' : '',
      borderBottom ? 'hub-panel-list-item--border-bottom' : '',
      compact ? 'hub-panel-list-item--compact' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    style={style}
  >
    {children}
  </div>
);
