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

const ResourceCell: FC<{ size: FishSize }> = ({ size }: { size: FishSize }) => (
  <>
    {size.resources.scrap}
    <FishImg type="common" item="scrap" title="Scrap" width="20" />/ {size.standing}
    <FishImg type="common" item="standing" title="Solaris United Standing" width="15" invert />
  </>
);

const VallisFishView: FC = () => {
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
      title="Orb Vallis Servofish"
      notice={
        <p className="hub-content-callout hub-content-callout--warning">
          All servofish requires either Shockprod or Stunna Fishing Spear for effective capture
        </p>
      }
      actions={
        <>
          <ContentLinkButton href="/ow/fish/howto#hotspots">What is a Hotspot?</ContentLinkButton>
          <ContentLinkButton href="/vallis/map">Orb Vallis Map</ContentLinkButton>
        </>
      }
    >
      <div className="hub-content-panel hub-content-panel--flush">
        <Table className="hub-content-table fish-info" variant="primary" aria-label="Orb Vallis Servofish">
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                <Table.Column />
                <FishSortableColumn id="name" sort={sort} onSort={toggleSort} isRowHeader title="The name of the fish">
                  Name
                </FishSortableColumn>
                <FishSortableColumn
                  id="unique"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="Unique item when dismantling - you will receive one regardless of model"
                >
                  Unique
                </FishSortableColumn>
                <FishSortableColumn
                  id="small"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="Common model - you will get scrap if dismantled or standing if donated"
                >
                  Basic
                </FishSortableColumn>
                <FishSortableColumn
                  id="medium"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="Uncommon model - you will get scrap if dismantled or standing if donated"
                >
                  Adorned
                </FishSortableColumn>
                <FishSortableColumn
                  id="large"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="Rare model - you will get scrap if dismantled or standing if donated"
                >
                  Magnificent
                </FishSortableColumn>
                <FishSortableColumn id="location" sort={sort} onSort={toggleSort} title="Location of where to find the servofish">
                  Location
                </FishSortableColumn>
                <FishSortableColumn
                  id="time"
                  sort={sort}
                  onSort={toggleSort}
                  title="Temperature of when you can find the servofish - arrow denotes preference"
                >
                  Temperature
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
                <FishSortableColumn id="bait" sort={sort} onSort={toggleSort} title="What bait will make this servofish more likely to spawn">
                  Bait
                </FishSortableColumn>
                <FishSortableColumn
                  id="hotspot"
                  sort={sort}
                  onSort={toggleSort}
                  title="Whether a hotspot is required for this fish to spawn"
                >
                  Hotspot Required
                </FishSortableColumn>
                <FishSortableColumn
                  id="maximumPoint"
                  sort={sort}
                  onSort={toggleSort}
                  className={FISH_TABLE_MOBILE_DETAIL_COL}
                  title="The maximum points possible for this fish"
                >
                  Max Points
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
                              <i className="fas fa-lg fa-snowflake hub-content-time-night" />
                            ) : null}
                            {item.time.cold.prefer ? <i className="fas fa-lg fa-arrow-left mx-1" /> : null}
                            {item.time.warm.prefer ? <i className="fas fa-lg fa-arrow-right mx-1" /> : null}
                            {item.time.warm.appear ? (
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
                                { label: 'Unique', value: item.unique.name },
                                { label: 'Basic', value: <ResourceCell size={item.small} /> },
                                { label: 'Adorned', value: <ResourceCell size={item.medium} /> },
                                { label: 'Magnificent', value: <ResourceCell size={item.large} /> },
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
                                { label: 'Max Points', value: item.maximumPoint },
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
