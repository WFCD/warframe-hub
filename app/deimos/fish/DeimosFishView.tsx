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
  FISH_TABLE_MOBILE_DETAIL_COL,
} from '@/components/pages/ContentPage/FishTableUi';
import {
  deimosSpearTier,
  parseFishMass,
  parseFishRarity,
  useFishTableSort,
} from '@/components/pages/ContentPage/fishTableSort';
import FishImg from '@/components/media/FishImg';
import fish from '@/data/json/fish/deimos.json';

type FishResources = {
  tumor?: number;
  bladder?: number;
  gills?: number;
};

type FishSize = {
  resources: FishResources;
};

type FishUnique = {
  name: string;
  thumb: string;
  wiki: string;
};

type DeimosFish = {
  name: string;
  thumb?: string;
  wiki?: string;
  unique: FishUnique[];
  location: string;
  time: {
    vome: { appear: boolean };
    fass: { appear: boolean };
  };
  rarity: string;
  bait: { name: string; recommended: boolean; thumb?: string };
  hotspot?: boolean;
  spear: { spari?: boolean; ebisu?: boolean };
  maximumMass: string;
  small: FishSize;
  medium: FishSize;
  large: FishSize;
};

const fishData = fish as DeimosFish[];

const buildDeimosDetailItems = (item: DeimosFish) =>
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
    ...item.unique.map((unique) => ({
      key: `${item.name}-${unique.name}`,
      label: unique.name,
      href: unique.wiki,
      thumb: unique.thumb,
      imageType: 'parts' as const,
      width: '150',
    })),
    item.bait.thumb
      ? {
        key: `${item.name}-bait`,
        label: item.bait.name,
        thumb: item.bait.thumb,
        imageType: 'bait' as const,
        width: '120',
      }
      : null,
  ].filter((entry): entry is NonNullable<typeof entry> => Boolean(entry?.thumb));

const ResourceCell: FC<{ size: FishSize }> = ({ size }: { size: FishSize }) => {
  const { t } = useTranslation();
  const { resources } = size;
  return (
    <>
      {resources.tumor}
      <FishImg type='common' item='tumor' title={t('fish.resources.benignTumor')} width='20' />
      {resources.bladder ? (
        <>
          {resources.bladder}
          <FishImg type='common' item='bladder' title={t('fish.resources.fermentedBladder')} width='20' />
        </>
      ) : null}
      {resources.gills ? (
        <>
          {resources.gills}
          <FishImg type='common' item='gills' title={t('fish.resources.tubercularGills')} width='20' />
        </>
      ) : null}
    </>
  );
};

const DeimosFishView: FC = () => {
  const { t } = useTranslation();
  const sortAria = (column: string) => t('fish.sortBy', { column });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const sortAccessors = useMemo(
    () => ({
      name: (item: DeimosFish) => item.name,
      unique: (item: DeimosFish) => item.unique.map((unique) => unique.name).join(', '),
      small: (item: DeimosFish) => Object.values(item.small.resources).reduce((sum, n) => sum + (n ?? 0), 0),
      medium: (item: DeimosFish) => Object.values(item.medium.resources).reduce((sum, n) => sum + (n ?? 0), 0),
      large: (item: DeimosFish) => Object.values(item.large.resources).reduce((sum, n) => sum + (n ?? 0), 0),
      location: (item: DeimosFish) => item.location,
      time: (item: DeimosFish) => `${Number(item.time.vome.appear)}-${Number(item.time.fass.appear)}`,
      rarity: (item: DeimosFish) => parseFishRarity(item.rarity),
      bait: (item: DeimosFish) => item.bait.name,
      baitRecommended: (item: DeimosFish) => item.bait.recommended,
      hotspot: (item: DeimosFish) => Boolean(item.hotspot),
      spear: (item: DeimosFish) => deimosSpearTier(item.spear),
      maximumMass: (item: DeimosFish) => parseFishMass(item.maximumMass),
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
      title={t('fish.titles.deimos')}
      actions={<ContentLinkButton href='/deimos/map'>{t('fish.links.deimosMap')}</ContentLinkButton>}
    >
      <div className='hub-content-panel hub-content-panel--flush'>
        <Table className='hub-content-table fish-info' variant='primary'>
          <Table.ScrollContainer>
            <Table.Content aria-label={t('fish.titles.deimos')}>
              <Table.Header>
                <Table.Column />
                <FishSortableColumn
                  id='name'
                  sort={sort}
                  onSort={toggleSort}
                  isRowHeader
                  title={t('fish.tooltips.name')}
                  ariaLabel={sortAria(t('fish.columns.name'))}
                >
                  {t('fish.columns.name')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='unique'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.uniqueSize')}
                  ariaLabel={sortAria(t('fish.columns.unique'))}
                >
                  {t('fish.columns.unique')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='small'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.smallSize')}
                  ariaLabel={sortAria(t('fish.columns.small'))}
                >
                  {t('fish.columns.small')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='medium'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.mediumSize')}
                  ariaLabel={sortAria(t('fish.columns.medium'))}
                >
                  {t('fish.columns.medium')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='large'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.largeSize')}
                  ariaLabel={sortAria(t('fish.columns.large'))}
                >
                  {t('fish.columns.large')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='location'
                  sort={sort}
                  onSort={toggleSort}
                  title={t('fish.tooltips.locationFish')}
                  ariaLabel={sortAria(t('fish.columns.location'))}
                >
                  {t('fish.columns.location')}
                </FishSortableColumn>
                <FishSortableColumn id='time' sort={sort} onSort={toggleSort} title={t('fish.tooltips.time')} ariaLabel={sortAria(t('fish.columns.time'))}>
                  {t('fish.columns.time')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='rarity'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.rarity')}
                  ariaLabel={sortAria(t('fish.columns.rarity'))}
                >
                  {t('fish.columns.rarity')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='bait'
                  sort={sort}
                  onSort={toggleSort}
                  title={t('fish.tooltips.baitFish')}
                  ariaLabel={sortAria(t('fish.columns.bait'))}
                >
                  {t('fish.columns.bait')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='baitRecommended'
                  sort={sort}
                  onSort={toggleSort}
                  title={t('fish.tooltips.baitRecommended')}
                  ariaLabel={sortAria(t('fish.columns.baitRecommended'))}
                >
                  {t('fish.columns.baitRecommended')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='hotspot'
                  sort={sort}
                  onSort={toggleSort}
                  title={t('fish.tooltips.hotspot')}
                  ariaLabel={sortAria(t('fish.columns.hotspot'))}
                >
                  {t('fish.columns.hotspot')}
                </FishSortableColumn>
                <FishSortableColumn id='spear' sort={sort} onSort={toggleSort} title={t('fish.tooltips.spear')} ariaLabel={sortAria(t('fish.columns.spear'))}>
                  {t('fish.columns.spear')}
                </FishSortableColumn>
                <FishSortableColumn
                  id='maximumMass'
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title={t('fish.tooltips.maxWeight')}
                  ariaLabel={sortAria(t('fish.columns.maxWeight'))}
                >
                  {t('fish.columns.maxWeight')}
                </FishSortableColumn>
              </Table.Header>
              <Table.Body>
                {sortedData.map((item) => {
                  const detailItems = buildDeimosDetailItems(item);

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
                        <Table.Cell className={FISH_TABLE_MOBILE_DETAIL_COL}>
                          {item.unique.map((unique) => (
                            <span key={unique.name}>
                              {unique.name}
                              <br />
                            </span>
                          ))}
                        </Table.Cell>
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
                          <span id={`${item.name}-time`}>
                            {item.time.vome.appear ? (
                              <FishImg type='time' item='vome' title={t('fish.time.vome')} width='20' />
                            ) : null}
                            {item.time.fass.appear ? (
                              <FishImg type='time' item='fass' title={t('fish.time.fass')} width='20' />
                            ) : null}
                          </span>
                        </Table.Cell>
                        <Table.Cell className={FISH_TABLE_MOBILE_DETAIL_COL}>
                          <FishImg
                            type='common'
                            item={item.rarity.slice(2).toLowerCase()}
                            title={item.rarity.slice(2)}
                            width='15'
                          />
                        </Table.Cell>
                        <Table.Cell>{item.bait.name}</Table.Cell>
                        <Table.Cell>
                          <FishBoolIcon value={item.bait.recommended} />
                        </Table.Cell>
                        <Table.Cell>
                          <FishBoolIcon value={Boolean(item.hotspot)} />
                        </Table.Cell>
                        <Table.Cell>
                          {item.spear.spari ? (
                            <FishImg type='common' item='spari' title={t('fish.spears.spariT1')} width='30' />
                          ) : null}
                          {item.spear.ebisu ? (
                            <FishImg type='common' item='ebisu' title={t('fish.spears.ebisuT2')} width='30' />
                          ) : null}
                        </Table.Cell>
                        <Table.Cell className={FISH_TABLE_MOBILE_DETAIL_COL}>{item.maximumMass}</Table.Cell>
                      </Table.Row>
                      {expanded.has(item.name) ? (
                        <Table.Row>
                          <Table.Cell colSpan={14}>
                            <FishDetailPanel
                              items={detailItems}
                              mobileStats={[
                                {
                                  label: t('fish.columns.unique'),
                                  value: item.unique.map((unique) => (
                                    <span key={unique.name}>
                                      {unique.name}
                                      <br />
                                    </span>
                                  )),
                                },
                                { label: t('fish.columns.small'), value: <ResourceCell size={item.small} /> },
                                { label: t('fish.columns.medium'), value: <ResourceCell size={item.medium} /> },
                                { label: t('fish.columns.large'), value: <ResourceCell size={item.large} /> },
                                {
                                  label: t('fish.columns.rarity'),
                                  value: (
                                    <FishImg
                                      type='common'
                                      item={item.rarity.slice(2).toLowerCase()}
                                      title={item.rarity.slice(2)}
                                      width='15'
                                    />
                                  ),
                                },
                                { label: t('fish.columns.maxWeight'), value: item.maximumMass },
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

export default DeimosFishView;
