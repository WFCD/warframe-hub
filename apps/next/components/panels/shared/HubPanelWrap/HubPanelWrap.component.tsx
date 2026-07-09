'use client';
import './HubPanelWrap.component.scss';

import type { ReactNode, FC } from 'react';
import { Card } from '@heroui/react';

type HubPanelWrapProps = {
  title?: string;
  titleAddon?: ReactNode;
  className?: string;
  children: ReactNode;
};

const HubPanelWrap: FC<HubPanelWrapProps> = ({
  title = '',
  titleAddon,
  className,
  children,
}: HubPanelWrapProps) => {
  return (
    <Card data-packer-item="true" className={`hub-panel-surface binpacker-item ${className ?? ''}`}>
      {title ? (
        <Card.Header className="hub-panel-header">
          <Card.Title className={`hub-panel-title${titleAddon ? ' hub-panel-title-with-addon' : ''}`}>
            <span>{title}</span>
            {titleAddon ? <span className="hub-panel-title-addon">{titleAddon}</span> : null}
          </Card.Title>
        </Card.Header>
      ) : null}
      <Card.Content className="hub-panel-content">{children}</Card.Content>
    </Card>
  );
};

export default HubPanelWrap;
