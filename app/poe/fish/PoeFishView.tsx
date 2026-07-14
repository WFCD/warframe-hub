'use client';

import { Fragment, useMemo, useState, type FC } from 'react';
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
import {
  parseFishMass,
  parseFishRarity,
  poeSpearTier,
  useFishTableSort,
} from '@/components/pages/ContentPage/fishTableSort';
import FishImg from '@/components/media/FishImg';
import fish from '@/data/json/fish/poe.json';

type FishResources = {
  meat: number;
  scales: number;
  oil: number;
};

type FishSize = {
  resources: FishResources;
  standing: number;
};

type FishUnique = {
  name: string;
  thumb?: string;
  wiki?: string;
};

type PoeFish = {
  name: string;
  thumb?: string;
  wiki?: string;
  unique: FishUnique;
  location: string;
  time: {
    string: string;
    night: { appear: boolean; prefer: boolean };
    day: { appear: boolean; prefer: boolean };
  };
  rarity: string;
  bait: { name: string; required: boolean; thumb?: string };
  hotspot?: boolean;
  spear: { lanzo?: boolean; tulok?: boolean; peram?: boolean };
  maximumMass: string;
  small: FishSize;
  medium: FishSize;
  large: FishSize;
};

const fishData = fish as PoeFish[];

const ResourceCell: FC<{ size: FishSize }> = ({ size }: { size: FishSize }) => {
  const { resources, standing } = size;
  return (
    <>
      {resources.meat}
      <FishImg type="common" item="meat" title="Fish Meat" width="20" />
      {resources.scales}
      <FishImg type="common" item="scale" title="Fish Scales" width="20" />
      {resources.oil}
      <FishImg type="common" item="oil" title="Fish Oil" width="20" />/ {standing}
      <FishImg type="common" item="standing" title="Ostron Standing" width="15" invert />
    </>
  );
};

const PoeFishView: FC = () => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const sortAccessors = useMemo(
    () => ({
      name: (item: PoeFish) => item.name,
      unique: (item: PoeFish) => item.unique.name,
      small: (item: PoeFish) => item.small.standing,
      medium: (item: PoeFish) => item.medium.standing,
      large: (item: PoeFish) => item.large.standing,
      location: (item: PoeFish) => item.location,
      time: (item: PoeFish) => item.time.string,
      rarity: (item: PoeFish) => parseFishRarity(item.rarity),
      bait: (item: PoeFish) => item.bait.name,
      baitRequired: (item: PoeFish) => item.bait.required,
      hotspot: (item: PoeFish) => Boolean(item.hotspot),
      spear: (item: PoeFish) => poeSpearTier(item.spear),
      maximumMass: (item: PoeFish) => parseFishMass(item.maximumMass),
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
      title="Plains of Eidolon Fishing"
      actions={
        <>
          <ContentLinkButton href="/ow/fish/howto#hotspots">What is a Hotspot?</ContentLinkButton>
          <ContentLinkButton href="/poe/map">Plains of Eidolon Map</ContentLinkButton>
        </>
      }
    >
      <div className="hub-content-panel hub-content-panel--flush">
        <Table className="hub-content-table fish-info" variant="primary">
          <Table.ScrollContainer>
            <Table.Content aria-label="Plains of Eidolon Fishing">
              <Table.Header>
                <Table.Column title="Display pictures for fish, unique, and bait type" />
                <FishSortableColumn id="name" sort={sort} onSort={toggleSort} isRowHeader title="The name of the fish">
                  Name
                </FishSortableColumn>
                <FishSortableColumn
                  id="unique"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="Unique item when dismantling - you will receive one regardless of size"
                >
                  Unique
                </FishSortableColumn>
                <FishSortableColumn
                  id="small"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="Common size - you will get fish parts if dismantled or standing if donated"
                >
                  Small
                </FishSortableColumn>
                <FishSortableColumn
                  id="medium"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="Uncommon size - you will get fish parts if dismantled or standing if donated"
                >
                  Medium
                </FishSortableColumn>
                <FishSortableColumn
                  id="large"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="Rare size - you will get fish parts if dismantled or standing if donated"
                >
                  Large
                </FishSortableColumn>
                <FishSortableColumn id="location" sort={sort} onSort={toggleSort} title="Location of where to find the fish">
                  Location
                </FishSortableColumn>
                <FishSortableColumn
                  id="time"
                  sort={sort}
                  onSort={toggleSort}
                  title="Time of when you can find the fish - arrow denotes preference"
                >
                  Time
                </FishSortableColumn>
                <FishSortableColumn
                  id="rarity"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="How likely the fish will spawn"
                >
                  Rarity
                </FishSortableColumn>
                <FishSortableColumn id="bait" sort={sort} onSort={toggleSort} title="What bait will make this fish more likely to spawn">
                  Bait
                </FishSortableColumn>
                <FishSortableColumn
                  id="baitRequired"
                  sort={sort}
                  onSort={toggleSort}
                  title="Whether bait is required in order for this fish to spawn"
                >
                  Bait Required
                </FishSortableColumn>
                <FishSortableColumn
                  id="hotspot"
                  sort={sort}
                  onSort={toggleSort}
                  title="Whether a hotspot is required for this fish to spawn"
                >
                  Hotspot Required
                </FishSortableColumn>
                <FishSortableColumn id="spear" sort={sort} onSort={toggleSort} title="What spear is effective at catching the fish">
                  Spear
                </FishSortableColumn>
                <FishSortableColumn
                  id="maximumMass"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="The maximum weight possible for this fish"
                >
                  Max Weight
                </FishSortableColumn>
              </Table.Header>
              <Table.Body>
                {sortedData.map((item) => {
                  const detailItems = [
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
                          width: '150',
                        }
                      : null,
                    item.bait.thumb
                      ? {
                          key: `${item.name}-bait`,
                          label: item.bait.name,
                          thumb: item.bait.thumb,
                          imageType: 'bait' as const,
                          width: '120',
                        }
                      : null,
                  ].filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

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
                            {item.time.night.appear ? (
                              <i className="fas fa-lg fa-moon hub-content-time-night" />
                            ) : null}
                            {item.time.night.prefer ? <i className="fas fa-lg fa-arrow-left mx-1" /> : null}
                            {item.time.day.prefer ? <i className="fas fa-lg fa-arrow-right mx-1" /> : null}
                            {item.time.day.appear ? (
                              <i className="fas fa-lg fa-sun hub-content-time-day" />
                            ) : null}
                          </FishTimeTooltip>
                        </Table.Cell>
                        <Table.Cell className={FISH_TABLE_MOBILE_DETAIL_COL}>
                          <FishImg
                            type="common"
                            item={item.rarity.slice(2).toLowerCase()}
                            title={item.rarity.slice(2)}
                            width="20"
                          />
                        </Table.Cell>
                        <Table.Cell>{item.bait.name}</Table.Cell>
                        <Table.Cell>
                          <FishBoolIcon value={item.bait.required} />
                        </Table.Cell>
                        <Table.Cell>
                          <FishBoolIcon value={Boolean(item.hotspot)} />
                        </Table.Cell>
                        <Table.Cell>
                          {item.spear.lanzo ? (
                            <FishImg type="common" item="lanzosm" title="Lanzo (T1)" width="30" />
                          ) : null}
                          {item.spear.tulok ? (
                            <FishImg type="common" item="tuloksm" title="Tulok (T2)" width="30" />
                          ) : null}
                          {item.spear.peram ? (
                            <FishImg type="common" item="peramsm" title="Peram (T3)" width="30" />
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
                                { label: 'Unique', value: item.unique.name },
                                { label: 'Small', value: <ResourceCell size={item.small} /> },
                                { label: 'Medium', value: <ResourceCell size={item.medium} /> },
                                { label: 'Large', value: <ResourceCell size={item.large} /> },
                                {
                                  label: 'Rarity',
                                  value: (
                                    <FishImg
                                      type="common"
                                      item={item.rarity.slice(2).toLowerCase()}
                                      title={item.rarity.slice(2)}
                                      width="20"
                                    />
                                  ),
                                },
                                { label: 'Max Weight', value: item.maximumMass },
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

export default PoeFishView;
