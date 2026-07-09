'use client';

import type { FC, ReactNode } from 'react';
import { Tabs } from '@heroui/react';

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
}: OpenWorldGuideTabsProps) => (
  <Tabs
    selectedKey={active}
    onSelectionChange={(key) => {
      if (key) onSelect(String(key));
    }}
    className="hub-content-guide-tabs"
  >
    <Tabs.ListContainer>
      <Tabs.List aria-label={ariaLabel}>
        <Tabs.Tab id="cetus">Cetus</Tabs.Tab>
        <Tabs.Tab id="vallis">Vallis</Tabs.Tab>
      </Tabs.List>
    </Tabs.ListContainer>
    <Tabs.Panel id="cetus">{cetus}</Tabs.Panel>
    <Tabs.Panel id="vallis">{vallis}</Tabs.Panel>
  </Tabs>
);

export default OpenWorldGuideTabs;
