'use client';
import './VoidTraderPanel.component.scss';
import type { FC } from 'react';

import { Disclosure, Table } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import type { ComponentConfig } from '@/lib/shared';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import TimeBadge from '@/components/ui/TimeBadge';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import { HubPanelList, HubPanelListItem } from '@/components/panels/shared/HubPanelList';

type VoidTraderItem = {
  item: string;
  ducats: number;
  credits: number;
};

type VoidTrader = {
  activation: string;
  expiry: string;
  location: string;
  inventory?: VoidTraderItem[];
};

type VoidTraderPanelProps = {
  voidTrader?: VoidTrader;
};

const VoidTraderInventoryTable: FC<{ items: VoidTraderItem[]; headertext: string }> = ({
  items,
  headertext,
}: {
  items: VoidTraderItem[];
  headertext: string;
}) => {
  const { t } = useTranslation();

  return (
    <Table className='hub-baro-table' variant='primary'>
      <Table.ScrollContainer>
        <Table.Content aria-label={headertext}>
          <Table.Header>
            <Table.Column isRowHeader>{t('vt.item')}</Table.Column>
            <Table.Column className='hub-baro-col-ducats'>{t('currency.dabloons')}</Table.Column>
            <Table.Column className='hub-baro-col-credits'>{t('currency.cred')}</Table.Column>
          </Table.Header>
          <Table.Body>
            {items.map((item, i) => (
              <Table.Row key={i}>
                <Table.Cell>{item.item}</Table.Cell>
                <Table.Cell className='hub-baro-col-ducats'>{item.ducats}</Table.Cell>
                <Table.Cell className='hub-baro-col-credits'>{item.credits}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};

const VoidTraderPanel: FC<VoidTraderPanelProps> = ({ voidTrader = {} as VoidTrader }: VoidTraderPanelProps) => {
  const { t } = useTranslation();
  const { state, dispatch } = usePrefs();
  const headertext = t('vt.header');
  const items = voidTrader.inventory || [];
  const available = items.length > 0;
  const baroConfig = state.components.baro as ComponentConfig & { expand?: boolean };
  const expanded = baroConfig?.expand ?? false;

  const locationLabel = () => `${t(`time.${available ? 'depart' : 'arrive'}`)} ${voidTrader.location}:`;

  const setExpanded = (isExpanded: boolean) => {
    dispatch({
      type: 'SET_COMPONENT',
      payload: ['baro', { ...baroConfig, expand: isExpanded }],
    });
  };

  return (
    <HubPanelWrap title={headertext} className='baro'>
      <HubPanelList>
        <HubPanelListItem borderless={available} borderBottom={!available}>
          <span className='float-left'>{locationLabel()}</span>
          <TimeBadge starttime={voidTrader.activation} endtime={voidTrader.expiry} interval={1000} />
        </HubPanelListItem>
        {available ? (
          <HubPanelListItem borderBottom>
            <Disclosure
              className='hub-baro-inventory'
              isExpanded={expanded}
              onExpandedChange={setExpanded}
            >
              <Disclosure.Trigger className='hub-baro-inventory-trigger'>
                {t('vt.showInventory', { count: items.length })}
                <Disclosure.Indicator />
              </Disclosure.Trigger>
              <Disclosure.Content>
                <Disclosure.Body>
                  <VoidTraderInventoryTable items={items} headertext={headertext} />
                </Disclosure.Body>
              </Disclosure.Content>
            </Disclosure>
          </HubPanelListItem>
        ) : null}
      </HubPanelList>
    </HubPanelWrap>
  );
};

export default VoidTraderPanel;
