'use client';

import type { FC, ReactNode } from 'react';
import { Tabs } from '@heroui/react';
import { useTranslation } from 'react-i18next';

type OpenWorldGuideTabsProps = {
  active: string;
  onSelect: (key: string) => void;
  ariaLabel: string;
  cetus: ReactNode;
  vallis: ReactNode;
};

const OpenWorldGuideTabs: FC<OpenWorldGuideTabsProps> = ({
  active,
  onSelect,
  ariaLabel,
  cetus,
  vallis,
}: OpenWorldGuideTabsProps) => {
  const { t } = useTranslation();

  return (
    <Tabs
      selectedKey={active}
      onSelectionChange={(key) => {
        if (key) onSelect(String(key));
      }}
      className='hub-content-guide-tabs'
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label={ariaLabel}>
          <Tabs.Tab id='cetus'>{t('ow.cetus')}</Tabs.Tab>
          <Tabs.Tab id='vallis'>{t('ow.vallis')}</Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel id='cetus'>{cetus}</Tabs.Panel>
      <Tabs.Panel id='vallis'>{vallis}</Tabs.Panel>
    </Tabs>
  );
};

export default OpenWorldGuideTabs;
