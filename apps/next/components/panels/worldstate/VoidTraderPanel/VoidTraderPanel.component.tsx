'use client';
import './VoidTraderPanel.component.scss';
import type { FC } from 'react';

import { Table } from '@heroui/react';
import { useTranslation } from 'react-i18next';
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

const VoidTraderPanel: FC<VoidTraderPanelProps> = ({ voidTrader = {} as VoidTrader }: VoidTraderPanelProps) => {
  const { t } = useTranslation();
  const headertext = t('vt.header');
  const items = voidTrader.inventory || [];
  const available = (voidTrader.inventory?.length ?? 0) > 0;

  const locationLabel = () => `${t(`time.${available ? 'depart' : 'arrive'}`)} ${voidTrader.location}:`;

  return (
    <HubPanelWrap title={headertext} className="baro">
      <HubPanelList>
        <HubPanelListItem borderless={available} borderBottom={!available}>
          <span className="float-left">{locationLabel()}</span>
          <TimeBadge starttime={voidTrader.activation} endtime={voidTrader.expiry} interval={1000} />
        </HubPanelListItem>
        {available && (
          <HubPanelListItem borderBottom>
            <Table className="hub-baro-table" variant="primary" aria-label={headertext}>
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>{t('vt.item')}</Table.Column>
                    <Table.Column className="hub-baro-col-ducats">{t('currency.dabloons')}</Table.Column>
                    <Table.Column className="hub-baro-col-credits">{t('currency.cred')}</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {items.map((item, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{item.item}</Table.Cell>
                        <Table.Cell className="hub-baro-col-ducats">{item.ducats}</Table.Cell>
                        <Table.Cell className="hub-baro-col-credits">{item.credits}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </HubPanelListItem>
        )}
      </HubPanelList>
    </HubPanelWrap>
  );
};

export default VoidTraderPanel;
