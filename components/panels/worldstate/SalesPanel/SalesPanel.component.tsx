'use client';
import './SalesPanel.component.scss';

import { useMemo, useState, type FC, type ReactNode } from 'react';
import { Table } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { cdn } from '@/lib/shared';
import HubImg from '@/components/media/HubImg';
import TimeBadge, { compactTimeBadgeProps } from '@/components/ui/TimeBadge';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import NoDataItem from '@/components/ui/NoDataItem';
import HubSwitch from '@/components/ui/HubSwitch';

const platinum = cdn('webp/general/plat.webp');

type Sale = {
  id: string;
  item: string;
  premiumOverride?: number | null;
  regularOverride?: number | null;
  expiry: string;
};

type SalesPanelProps = {
  sales?: Sale[];
};

export const hasPlatinumPrice = (sale: Sale): boolean =>
  typeof sale.premiumOverride === 'number' && Number.isFinite(sale.premiumOverride) && sale.premiumOverride > 0;

const formatPriceCell = (sale: Sale, t: (key: string) => string): ReactNode => {
  if (hasPlatinumPrice(sale)) return sale.premiumOverride;
  if (typeof sale.regularOverride === 'number' && Number.isFinite(sale.regularOverride) && sale.regularOverride > 0) {
    return (
      <span className="hub-sales-credit-price">
        {sale.regularOverride}
        {t('currency.credAbbr')}
      </span>
    );
  }
  return '—';
};

const SalesPanel: FC<SalesPanelProps> = ({ sales = [] }: SalesPanelProps) => {
  const { t } = useTranslation();
  const headertext = t('sales.header');
  const now = () => new Date().toString();
  const [includeCreditOnly, setIncludeCreditOnly] = useState(false);

  const creditOnlySales = useMemo(() => sales.filter((sale) => !hasPlatinumPrice(sale)), [sales]);
  const visibleSales = useMemo(
    () => (includeCreditOnly ? sales : sales.filter(hasPlatinumPrice)),
    [sales, includeCreditOnly],
  );

  return (
    <HubPanelWrap title={headertext} className="sales">
      <div className="hub-sales-panel">
        {visibleSales.length > 0 ? (
          <Table className="hub-sales-table" variant="primary">
            <Table.ScrollContainer>
              <Table.Content aria-label={headertext}>
                <Table.Header>
                  <Table.Column isRowHeader>{t('sales.item')}</Table.Column>
                  <Table.Column className="hub-sales-col-plat">
                    <HubImg
                      src={platinum}
                      name={t('currency.plat')}
                      width="24px"
                      height="24px"
                      className="li-mission-decorator li-mission-decorator-lg invert hub-table-header-icon"
                    />
                  </Table.Column>
                  <Table.Column className="hub-sales-col-expiry hub-sr-only-column">{t('sales.ends')}</Table.Column>
                </Table.Header>
                <Table.Body>
                  {visibleSales.map((item) => (
                    <Table.Row key={`${item.id}-sale`}>
                      <Table.Cell>{item.item}</Table.Cell>
                      <Table.Cell className="hub-sales-col-plat">{formatPriceCell(item, t)}</Table.Cell>
                      <Table.Cell className="hub-sales-col-expiry">
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
        ) : (
          <NoDataItem text={headertext} />
        )}
        {creditOnlySales.length > 0 ? (
          <div className="hub-sales-footer">
            <HubSwitch
              id="sales-show-credit-only"
              label={t('sales.showCreditOnly')}
              checked={includeCreditOnly}
              onChange={setIncludeCreditOnly}
            />
          </div>
        ) : null}
      </div>
    </HubPanelWrap>
  );
};

export default SalesPanel;
