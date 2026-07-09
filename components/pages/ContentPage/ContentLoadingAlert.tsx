'use client';

import type { FC, ReactNode } from 'react';
import { Alert } from '@heroui/react';

type ContentLoadingAlertProps = {
  title: string;
  children: ReactNode;
};

const ContentLoadingAlert: FC<ContentLoadingAlertProps> = ({ title, children }: ContentLoadingAlertProps) => (
  <Alert status="accent" className="hub-content-loading">
    <Alert.Content>
      <Alert.Description>
        <strong className="hub-content-loading__title">{title}</strong>
        <p className="hub-content-loading__body">{children}</p>
      </Alert.Description>
    </Alert.Content>
  </Alert>
);

export default ContentLoadingAlert;
