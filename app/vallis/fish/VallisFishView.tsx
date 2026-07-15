'use client';

import { Fragment, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@heroui/react';
import ContentPage from '@/components/pages/ContentPage';
import ContentLinkButton from '@/components/pages/ContentPage/ContentLinkButton';
import {
  FishBoolIcon,
  FishDetailPanel,
  FishExpandButton,
  FishSortableColumn,
  FishTimeTooltip,
  FISH_TABLE_MOBILE_DETAIL_COL,
} from '@/components/pages/ContentPage/FishTableUi';
import { parseFishMass, parseFishRarity, useFishTableSort } from '@/components/pages/ContentPage/fishTableSort';
import FishImg from '@/components/media/FishImg';
import fish from '@/data/json/fish/vallis.json';

type FishSize = {
  resources: { scrap: number };
  standing: number;
};

type FishUnique = {
  name: string;
  thumb?: string;
  wiki?: string;
};

type VallisFish = {
  name: string;
  thumb?: string;
  wiki?: string;
  unique: FishUnique;
  location: string;
  time: {
    string: string;
    cold: { appear: boolean; prefer: boolean };
    warm: { appear: boolean; prefer: boolean };
  };
  rarity: string;
  bait: { name: string; thumb?: string };
  hotspot?: boolean;
  maximumPoint: string;
  small: FishSize;
  medium: FishSize;
  large: FishSize;
};

const fishData = fish as VallisFish[];

const buildVallisDetailItems = (item: VallisFish) =>
  [
    item.thumb
      ? {
        key: `${item.name}-fish`,
        label: item.name,
        href: item.wiki,
        thumb: item.thumb,
        imageType: 'fish' as const,
        width: '200',
      }
      : null,
    item.unique.thumb
      ? {
        key: `${item.name}-unique`,
        label: item.unique.name,
        href: item.unique.wiki,
        thumb: item.unique.thumb,
        imageType: 'parts' as const,
        width: '200',
      }
      : null,
    item.bait.thumb
      ? {
        key: `${item.name}-bait`,
        label: item.bait.name,
        thumb: item.bait.thumb,
        imageType: 'bait' as const,
        width: '200',
      }
      : null,
  ].filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

const ResourceCell: FC<{ size: FishSize }> = ({ size }: { size: FishSize }) => {
  const { t } = useTranslation();
  return (
    <>
      {size.resources.scrap}
      <FishImg type='common' item='scrap' title={t('fish.resources.scrap')} width='20' />/ {size.standing}
      <FishImg type='common' item='standing' title={t('fish.resources.solarisStanding')} width='15' invert />
    </>
  );
};

const VallisFishView: FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const sortAccessors = useMemo(
    () => ({
      name: (item: VallisFish) => item.name,
      unique: (item: VallisFish) => item.unique.name,
      small: (item: VallisFish) => item.small.standing,
      medium: (item: VallisFish) => item.medium.standing,
      large: (item: VallisFish) => item.large.standing,
      location: (item: VallisFish) => item.location,
      time: (item: VallisFish) => item.time.string,
      rarity: (item: VallisFish) => parseFishRarity(item.rarity),
      bait: (item: VallisFish) => item.bait.name,
      hotspot: (item: VallisFish) => Boolean(item.hotspot),
      maximumPoint: (item: VallisFish) => parseFishMass(item.maximumPoint),
    }),
    []
  );
  const { sortedData, sort, toggleSort } = useFishTableSort(fishData, sortAccessors);

  const toggleDetails = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <ContentPage
      title={t('fish.titles.vallis')}
      notice={
        <p className='hub-content-callout hub-content-callout--warning'>{t('fish.notice.vallisSpear')}</p>
      }
      actions={
        <>
          <ContentLinkButton href='/ow/fish/howto#hotspots'>{t('fish.links.hotspot')}</ContentLinkButton>
          <ContentLinkButton href='/vallis/map'>{t('fish.links.vallisMap')}</ContentLinkButton>
        </>
      }
    >
      <div className='hub-content-panel hub-content-panel--flush'>
        <Table className='hub-content-table fish-info' variant='primary'>
          <Table.ScrollContainer>
            <Table.Content aria-label={t('fish.titles.vallis')}>
              <Table.Header>
                <Table.Column />
                <FishSortableColumn
                  id='name'
                  sort={sort}
                  onSort={toggleSort}
                  isRowHeader
                  title={t('fish.tooltips.name')}
                >
                  {t('fish.columns.name')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='unique'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.uniqueModel')}
                >
                  {t('fish.columns.unique')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='small'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.basicModel')}
                >
                  {t('fish.columns.basic')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='medium'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.adornedModel')}
                >
                  {t('fish.columns.adorned')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='large'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.magnificentModel')}
                >
                  {t('fish.columns.magnificent')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='location'
                  sort={sort}
                  onSort={toggleSort}
                  title={t('fish.tooltips.locationServofish')}
                >
                  {t('fish.columns.location')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='time'
                  sort={sort}
                  onSort={toggleSort}
                  title={t('fish.tooltips.temperature')}
                >
                  {t('fish.columns.temperature')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='rarity'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.rarity')}
                >
                  {t('fish.columns.rarity')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='bait'
                  sort={sort}
                  onSort={toggleSort}
                  title={t('fish.tooltips.baitServofish')}
                >
                  {t('fish.columns.bait')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='hotspot'
                  sort={sort}
                  onSort={toggleSort}
                  title={t('fish.tooltips.hotspot')}
                >
                  {t('fish.columns.hotspotRequired')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='maximumPoint'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.maxPoints')}
                >
                  {t('fish.columns.maxPoints')}
                </FishSortableColumn>
              </Table.Header>
              <Table.Body>
                {sortedData.map((item) => {
                  const detailItems = buildVallisDetailItems(item);

                  return (
                    <Fragment key={item.name}>
                      <Table.Row>
                        <Table.Cell>
                          <FishExpandButton
                            name={item.name}
                            expanded={expanded.has(item.name)}
                            onToggle={() => toggleDetails(item.name)}
                          />
                        </Table.Cell>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell className={FISH_TABLE_MOBILE_DETAIL_COL}>{item.unique.name}</Table.Cell>
                        <Table.Cell className={FISH_TABLE_MOBILE_DETAIL_COL}>
                          <ResourceCell size={item.small} />
                        </Table.Cell>
                        <Table.Cell className={FISH_TABLE_MOBILE_DETAIL_COL}>
                          <ResourceCell size={item.medium} />
                        </Table.Cell>
                        <Table.Cell className={FISH_TABLE_MOBILE_DETAIL_COL}>
                          <ResourceCell size={item.large} />
                        </Table.Cell>
                        <Table.Cell>{item.location}</Table.Cell>
                        <Table.Cell>
                          <FishTimeTooltip id={`${item.name}-time`} label={item.time.string}>
                            {item.time.cold.appear ? (
                              <i className='fas fa-lg fa-snowflake hub-content-time-night' />
                            ) : null}
                            {item.time.cold.prefer ? <i className='fas fa-lg fa-arrow-left mx-1' /> : null}
                            {item.time.warm.prefer ? <i className='fas fa-lg fa-arrow-right mx-1' /> : null}
                            {item.time.warm.appear ? (
                              <i className='fas fa-lg fa-sun hub-content-time-day' />
                            ) : null}
                          </FishTimeTooltip>
                        </Table.Cell>
                        <Table.Cell className={FISH_TABLE_MOBILE_DETAIL_COL}>
                          <FishImg
                            type='common'
                            item={item.rarity.slice(2).toLowerCase()}
                            title={item.rarity.slice(2)}
                            width='20'
                          />
                        </Table.Cell>
                        <Table.Cell>{item.bait.name}</Table.Cell>
                        <Table.Cell>
                          <FishBoolIcon value={Boolean(item.hotspot)} />
                        </Table.Cell>
                        <Table.Cell className={FISH_TABLE_MOBILE_DETAIL_COL}>{item.maximumPoint}</Table.Cell>
                      </Table.Row>
                      {expanded.has(item.name) ? (
                        <Table.Row>
                          <Table.Cell colSpan={12}>
                            <FishDetailPanel
                              items={detailItems}
                              mobileStats={[
                                { label: t('fish.columns.unique'), value: item.unique.name },
                                { label: t('fish.columns.basic'), value: <ResourceCell size={item.small} /> },
                                { label: t('fish.columns.adorned'), value: <ResourceCell size={item.medium} /> },
                                { label: t('fish.columns.magnificent'), value: <ResourceCell size={item.large} /> },
                                {
                                  label: t('fish.columns.rarity'),
                                  value: (
                                    <FishImg
                                      type='common'
                                      item={item.rarity.slice(2).toLowerCase()}
                                      title={item.rarity.slice(2)}
                                      width='20'
                                    />
                                  ),
                                },
                                { label: t('fish.columns.maxPoints'), value: item.maximumPoint },
                              ]}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ) : null}
                    </Fragment>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </ContentPage>
  );
};

export default VallisFishView;
