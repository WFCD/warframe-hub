'use client';
import './BountyJobsTable.component.scss';

import { Fragment, type FC } from 'react';
import { Chip, Table } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { cdn, dedupeRewardPool } from '@wfcd/shared';
import HubImg from '@/components/media/HubImg';

const standing = cdn('svg/standing.svg');

export type BountyJobsTableRow = {
  type: string;
  standing: number;
  levelRange: string;
  rewards: string[];
  showDetails: boolean;
};

type BountyJobsTableProps = {
  rows: BountyJobsTableRow[];
  rowKeyPrefix: string;
  ariaLabel: string;
  onToggleRow: (index: number) => void;
};

const BountyJobsTable: FC<BountyJobsTableProps> = ({
  rows,
  rowKeyPrefix,
  ariaLabel,
  onToggleRow,
}: BountyJobsTableProps) => {
  const { t } = useTranslation();

  return (
    <Table className="hub-bounty-table" variant="primary" aria-label={ariaLabel}>
      <Table.ScrollContainer>
        <Table.Content>
          <Table.Header>
            <Table.Column isRowHeader>{t('bounty.type')}</Table.Column>
            <Table.Column className="hub-bounty-col-standing">
              <HubImg
                src={standing}
                name={t('bounty.standing')}
                width="24px"
                height="24px"
                className="li-mission-decorator li-mission-decorator-lg invert hub-table-header-icon"
              />
            </Table.Column>
            <Table.Column>{t('bounty.lrange')}</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map((row, index) => (
              <Fragment key={`${rowKeyPrefix}-${index}`}>
                <Table.Row className="hub-bounty-row" onAction={() => onToggleRow(index)}>
                  <Table.Cell>
                    <div className="hub-bounty-type-cell">
                      <i
                        className={`hub-bounty-type-chevron fas fa-chevron-${row.showDetails ? 'down' : 'right'}`}
                        aria-hidden
                      />
                      <span className="hub-bounty-type-label">{row.type}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="hub-bounty-col-standing">{row.standing}</Table.Cell>
                  <Table.Cell>{row.levelRange}</Table.Cell>
                </Table.Row>
                {row.showDetails && (
                  <Table.Row className="hub-bounty-row-details">
                    <Table.Cell colSpan={3}>
                      <div className="hub-bounty-rewards">
                        {dedupeRewardPool(row.rewards).map((reward) => (
                          <Chip key={`${rowKeyPrefix}-${index}-${reward}`} size="sm" variant="soft">
                            {reward}
                          </Chip>
                        ))}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Fragment>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};

export default BountyJobsTable;
