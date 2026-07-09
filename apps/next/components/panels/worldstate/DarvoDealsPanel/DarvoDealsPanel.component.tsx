'use client';
import './DarvoDealsPanel.component.scss';
import type { FC } from 'react';

import { Table } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { cdn } from '@wfcd/shared';
import HubImg from '@/components/media/HubImg';
import TimeBadge, { compactTimeBadgeProps } from '@/components/ui/TimeBadge';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import NoDataItem from '@/components/ui/NoDataItem';
import { HubPanelList, HubPanelListItem } from '@/components/panels/shared/HubPanelList';

const platinum = cdn('webp/general/plat.webp');

type DarvoDeal = {
  id: string;
  item: string;
  salePrice: number;
  discount: number;
  total: number;
  sold: number;
  expiry: string;
};

type DarvoDealsPanelProps = {
  deals?: DarvoDeal[];
};

const DarvoDealsPanel: FC<DarvoDealsPanelProps> = ({ deals = [] }: DarvoDealsPanelProps) => {
  const { t } = useTranslation();
  const headertext = t('darvo.header');
  const now = () => new Date().toString();

  return (
    <HubPanelWrap title={headertext} className="darvo">
      {deals.length === 1 && (
        <div className="hidden hub-compact:block hub-darvo-single-deal">
          <b>{deals[0].item}</b>{' '}
          <span className="hub-inline-row">
            {deals[0].salePrice} <HubImg src={platinum} name={t('currency.plat')} />
          </span>{' '}
          ({deals[0].discount}
          {t('darvo.off')}) {deals[0].total - deals[0].sold}/ {deals[0].total} {t('darvo.leftL')}{' '}
          <TimeBadge starttime={now()} endtime={deals[0].expiry} interval={10000} {...compactTimeBadgeProps} />
        </div>
      )}
      <HubPanelList>
        {deals.length > 0 ? (
          <HubPanelListItem borderBottom>
            <Table className="hub-darvo-table" variant="primary" aria-label={headertext}>
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header className="sr-only">
                    <Table.Column isRowHeader>{t('sales.item')}</Table.Column>
                    <Table.Column>{t('darvo.off')}</Table.Column>
                    <Table.Column>{t('currency.plat')}</Table.Column>
                    <Table.Column>{t('darvo.left')}</Table.Column>
                    <Table.Column>{t('sales.ends')}</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {deals.map((item) => (
                      <Table.Row key={`${item.id}-deal`}>
                        <Table.Cell>{item.item}</Table.Cell>
                        <Table.Cell>
                          {item.discount}
                          {t('darvo.off')}
                        </Table.Cell>
                        <Table.Cell>
                          <span className="hub-inline-row">
                            {item.salePrice}
                            <HubImg src={platinum} name={t('currency.plat')} />
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {(((item.total - item.sold) / item.total) * 100).toFixed(2)}
                          {t('darvo.left')}
                        </Table.Cell>
                        <Table.Cell>
                          <TimeBadge
                            starttime={now()}
                            endtime={item.expiry}
                            interval={10000}
                            {...compactTimeBadgeProps}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </HubPanelListItem>
        ) : (
          <NoDataItem text={headertext} />
        )}
      </HubPanelList>
    </HubPanelWrap>
  );
};

export default DarvoDealsPanel;
