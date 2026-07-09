'use client';
import './InvasionItem.component.scss';

import { useMemo, type FC } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Card, Chip, ProgressBar } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { cdn } from '@wfcd/shared';
import AsyncItemThumb from '@/components/media/AsyncItemThumb';
import HubImg from '@/components/media/HubImg';

dayjs.extend(relativeTime);

const corpus = cdn('svg/factions/corpus.svg');
const corrupted = cdn('svg/factions/corrupted.svg');
const grineer = cdn('svg/factions/grineer.svg');
const infested = cdn('svg/factions/infested.svg');
const sentient = cdn('svg/factions/sentient.svg');

const fImg: Record<string, string> = {
  corpus,
  grineer,
  infested,
  infestation: infested,
  corrupted,
  orokin: corrupted,
  sentient,
};

type FactionTone = 'corpus' | 'grineer' | 'infested' | 'corrupted' | 'default';

const factionTone = (faction: string): FactionTone => {
  switch (faction) {
    case 'Corpus':
      return 'corpus';
    case 'Grineer':
      return 'grineer';
    case 'Infested':
    case 'Infestation':
      return 'infested';
    case 'Corrupted':
      return 'corrupted';
    default:
      return 'default';
  }
};

const chipColor = (faction: string): 'accent' | 'danger' | 'success' | 'warning' | 'default' => {
  switch (factionTone(faction)) {
    case 'corpus':
      return 'accent';
    case 'grineer':
      return 'danger';
    case 'infested':
      return 'success';
    case 'corrupted':
      return 'warning';
    default:
      return 'default';
  }
};

const countedItem = (item: { count: number; type: string }) =>
  item.count > 1 ? `${item.count} ${item.type}` : item.type;

type InvasionReward = {
  items?: string[];
  countedItems?: { key: string; type: string; count: number }[];
};

type InvasionFaction = {
  faction: string;
  factionKey: string;
  reward?: InvasionReward;
};

export type Invasion = {
  id: string;
  node: string;
  desc: string;
  activation: string;
  count: number;
  requiredRuns: number;
  completion: number;
  completed: boolean;
  attacker: InvasionFaction;
  defender: InvasionFaction;
};

type RewardChipsProps = {
  items: string[];
  countedItems: { key: string; type: string; count: number }[];
  faction: string;
};

const RewardChips: FC<RewardChipsProps> = ({ items, countedItems, faction }: RewardChipsProps) => (
  <>
    {items.map((item) => (
      <Chip key={item} color={chipColor(faction)} variant="soft" size="sm" className="hub-invasion-reward-chip">
        <AsyncItemThumb alt={item} />
      </Chip>
    ))}
    {countedItems.map((item) => (
      <Chip key={item.type} color={chipColor(faction)} variant="soft" size="sm" className="hub-invasion-reward-chip">
        <AsyncItemThumb alt={countedItem(item)} ikey={item.key} />
      </Chip>
    ))}
  </>
);

type InvasionItemProps = {
  invasion: Invasion;
};

const InvasionItem: FC<InvasionItemProps> = ({ invasion }: InvasionItemProps) => {
  const { t } = useTranslation();

  const atkFaction = invasion.attacker?.factionKey || 'Corrupted';
  const defFaction = invasion.defender?.factionKey || 'Corrupted';
  const atkItems = invasion.attacker?.reward?.items || [];
  const atkCntItems = invasion.attacker?.reward?.countedItems || [];
  const defItems = invasion.defender?.reward?.items || [];
  const defCntItems = invasion.defender?.reward?.countedItems || [];
  const attackerPct = invasion.completion;
  const defenderPct = 100 - invasion.completion;

  const eta = useMemo(() => {
    const completedRuns = invasion.count;
    if (!completedRuns) return '';
    const elapsedMillis = dayjs(invasion.activation).diff(dayjs(), 'millisecond');
    const remaining = invasion.requiredRuns - completedRuns;
    const estExpiry = dayjs().add(remaining * (elapsedMillis / completedRuns), 'millisecond');
    return `${t('invasions.eta')} ${dayjs(estExpiry).fromNow(true).trim()}`;
  }, [invasion.activation, invasion.count, invasion.requiredRuns, t]);

  const attackerIcon = fImg[atkFaction.toLowerCase()] || corrupted;
  const defenderIcon = fImg[defFaction.toLowerCase()] || corrupted;

  return (
    <Card className="hub-invasion-card">
      <Card.Content className="hub-invasion-card-content">
        <div className="hub-invasion-rewards-side">
          {atkItems.length > 0 || atkCntItems.length > 0 ? (
            <RewardChips items={atkItems} countedItems={atkCntItems} faction={atkFaction} />
          ) : null}
        </div>

        <div className="hub-invasion-title">
          <b>{invasion.node}</b> — {invasion.desc}
        </div>

        <div className="hub-invasion-rewards-side hub-invasion-rewards-side-end">
          {defItems.length > 0 || defCntItems.length > 0 ? (
            <RewardChips items={defItems} countedItems={defCntItems} faction={defFaction} />
          ) : null}
        </div>

        <div className="hub-invasion-progress-row">
          <HubImg
            src={attackerIcon}
            name={atkFaction}
            className="hub-invasion-faction-icon invert"
            width="20px"
            height="20px"
          />

          <div className="hub-invasion-progress-bar-wrap">
            <ProgressBar
              value={attackerPct}
              minValue={0}
              maxValue={100}
              aria-label={`${atkFaction} ${attackerPct.toFixed(0)}% vs ${defFaction}`}
              className="hub-invasion-progress-bar"
              size="lg"
            >
              <ProgressBar.Track className="hub-invasion-dual-track">
                <div
                  className={`hub-invasion-segment hub-invasion-segment--${factionTone(atkFaction)}`}
                  style={{ width: `${attackerPct}%` }}
                  title={atkFaction}
                />
                <div
                  className={`hub-invasion-segment hub-invasion-segment--${factionTone(defFaction)}`}
                  style={{ width: `${defenderPct}%` }}
                  title={defFaction}
                />
              </ProgressBar.Track>
            </ProgressBar>
          </div>

          <HubImg
            src={defenderIcon}
            name={defFaction}
            className="hub-invasion-faction-icon invert"
            width="20px"
            height="20px"
          />
        </div>

        <div className="hub-invasion-meta">
          {attackerPct.toFixed(2)}%{eta ? ` — ${eta}` : ''}
        </div>
      </Card.Content>
    </Card>
  );
};

export default InvasionItem;
