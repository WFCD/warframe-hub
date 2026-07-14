'use client';

import type { FC, ReactNode } from 'react';

import HubLoadingIndicator from '@/components/ui/HubLoadingIndicator';

type ContentLoadingAlertProps = {
  title: string;
  children?: ReactNode;
};

const ContentLoadingAlert: FC<ContentLoadingAlertProps> = ({ title, children }: ContentLoadingAlertProps) => (
  <div className="hub-content-loading">
    <div className="hub-page-loading-shell hub-content-loading__shell">
      <HubLoadingIndicator label={title} className="hub-content-loading__indicator" />
      {children ? <p className="hub-content-loading__body">{children}</p> : null}
    </div>
  </div>
);

export default ContentLoadingAlert;
