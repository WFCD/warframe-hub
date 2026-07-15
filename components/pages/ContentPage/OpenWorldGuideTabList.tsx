'use client';

import type { FC } from 'react';
import { Tabs } from '@heroui/react';
import { useTranslation } from 'react-i18next';

type OpenWorldGuideTabListProps = {
  active: string;
  onSelect: (key: string) => void;
  ariaLabel: string;
  compact?: boolean;
};

const OpenWorldGuideTabList: FC<OpenWorldGuideTabListProps> = ({
  active,
  onSelect,
  ariaLabel,
  compact = false,
}: OpenWorldGuideTabListProps) => {
  const { t } = useTranslation();

  return (
    <Tabs
      selectedKey={active}
      onSelectionChange={(key) => {
        if (key) onSelect(String(key));
      }}
      className={['hub-content-guide-tabs', compact ? 'hub-content-guide-tabs--compact' : ''].filter(Boolean).join(' ')}
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label={ariaLabel}>
          <Tabs.Tab id='cetus'>{t('ow.cetus')}</Tabs.Tab>
          <Tabs.Tab id='vallis'>{t('ow.vallis')}</Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};

export default OpenWorldGuideTabList;
