'use client';
import './EventsPanel.component.scss';

import { useState, type FC } from 'react';
import { Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import BountyJobsTable, { type BountyJobsTableRow } from '@/components/panels/shared/BountyJobsTable';
import NoDataItem from '@/components/ui/NoDataItem';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import TimeBadge from '@/components/ui/TimeBadge';
import { API_TIME_EPOCH_ISO } from '@/lib/shared';

const reversedHealthEvents = ['Thermia Fractures'];

type EventReward = {
  items?: string[];
  countedItems?: unknown[];
  credits?: number;
};

type EventJob = {
  type: string;
  standingStages: number[];
  enemyLevels: number[];
  rewardPool?: string[];
};

type HubEvent = {
  id: string;
  active?: boolean;
  description: string;
  tooltip?: string;
  activation?: string;
  expiry?: string;
  victimNode?: string;
  health?: number;
  currentScore?: number;
  maximumScore?: number;
  rewards?: EventReward[];
  interimSteps?: { reward: EventReward }[];
  jobs?: EventJob[];
  completionBonuses?: string[];
  altActivation?: string;
  altExpiry?: string;
  nextAlt?: { activation?: string; expiry?: string };
};

type EventsPanelProps = {
  events?: HubEvent[];
};

type HealthTone = 'success' | 'accent' | 'warning' | 'danger';

const healthTone = (health: number): HealthTone => {
  if (health <= 80 && health > 50) return 'accent';
  if (health <= 50 && health > 20) return 'warning';
  if (health <= 20) return 'danger';
  return 'success';
};

const healthToneOpposite = (health: number): HealthTone => {
  if (health >= 20 && health < 50) return 'accent';
  if (health >= 50 && health < 80) return 'warning';
  if (health >= 80) return 'danger';
  return 'success';
};

const formatJobItems = (event: HubEvent): BountyJobsTableRow[] =>
  (event.jobs || []).map((job) => ({
    type: job.type,
    standing: job.standingStages.reduce((a, b) => a + b, 0) || 0,
    levelRange: `${job.enemyLevels[0]}-${job.enemyLevels[1]}`,
    rewards: job.rewardPool || [],
    showDetails: false,
  }));

const EventsPanel: FC<EventsPanelProps> = ({ events = [] }: EventsPanelProps) => {
  const { t } = useTranslation();
  const headertext = t('events.header');
  const activeEvents = events.filter((e) => e.active);

  const [jobRows, setJobRows] = useState<Record<string, BountyJobsTableRow[]>>({});

  const toggleDetails = (eventId: string, index: number) => {
    setJobRows((prev) => {
      const event = activeEvents.find((e) => e.id === eventId);
      const rows = prev[eventId] ?? (event ? formatJobItems(event) : []);
      return {
        ...prev,
        [eventId]: rows.map((row, i) => (i === index ? { ...row, showDetails: !row.showDetails } : row)),
      };
    });
  };

  const getHealth = (event: HubEvent) =>
    event.health ?? (100 - ((event.currentScore ?? 0) / (event.maximumScore ?? 1)) * 100).toFixed(2);

  return (
    <HubPanelWrap title={headertext} className={`events ${events.length === 0 ? 'no-content' : ''}`}>
      {activeEvents.length > 0 ? (
        <div className='hub-events-list'>
          {activeEvents.map((event) => {
            const rows = jobRows[event.id] ?? formatJobItems(event);
            const health = Number(getHealth(event));
            const isReversed = reversedHealthEvents.includes(event.description);
            const healthColor = isReversed ? healthToneOpposite(health) : healthTone(health);

            return (
              <article key={event.id} className='hub-event-item'>
                <header className='hub-event-header'>
                  <h5 className='hub-event-title'>{event.description}</h5>
                  <Chip className='hub-event-health' color={healthColor} size='sm' variant='soft'>
                    {t(isReversed ? 'events.completed' : 'events.remaining', { perc: health })}
                  </Chip>
                </header>

                {event.tooltip ? <div className='hub-event-tooltip'>{event.tooltip}</div> : null}

                {event.activation && event.expiry ? (
                  <div className='hub-event-timer'>
                    <TimeBadge starttime={event.activation} endtime={event.expiry} interval={1000} pullright={false} />
                  </div>
                ) : null}

                {event.victimNode ? (
                  <div className='hub-event-chip-row'>
                    <Chip color='danger' size='sm' variant='soft'>
                      {event.victimNode}
                    </Chip>
                  </div>
                ) : null}

                {(event.rewards?.length || event.interimSteps?.length) ? (
                  <div className='hub-event-section'>
                    {event.rewards?.length ? <div className='hub-event-section-title'>{t('events.rewards.header')}</div> : null}
                    <div className='hub-event-chip-row'>
                      {event.rewards?.map((reward, ri) => (
                        <span key={`reward-set-${event.id}-${ri}`} className='hub-event-chip-group'>
                          {reward.items?.map((item) => (
                            <Chip key={`${event.id}-reward-item-${ri}-${item}`} color='success' size='sm' variant='soft'>
                              {item}
                            </Chip>
                          ))}
                          {reward.countedItems?.map((item, ci) => (
                            <Chip
                              key={`${event.id}-reward-counted-${ri}-${ci}`}
                              color='success'
                              size='sm'
                              variant='soft'
                            >
                              {String(item)}
                            </Chip>
                          ))}
                          {reward.credits ? (
                            <Chip color='accent' size='sm' variant='soft'>
                              {reward.credits}
                              {t('currency.credAbbr')}
                            </Chip>
                          ) : null}
                        </span>
                      ))}
                      {event.interimSteps?.map((step, si) => (
                        <span key={`interim-${event.id}-${si}`} className='hub-event-chip-group'>
                          {step.reward.items?.map((item) => (
                            <Chip key={`${event.id}-interim-item-${si}-${item}`} color='success' size='sm' variant='soft'>
                              {item}
                            </Chip>
                          ))}
                          {step.reward.countedItems?.map((item, ci) => (
                            <Chip
                              key={`${event.id}-interim-counted-${si}-${ci}`}
                              color='success'
                              size='sm'
                              variant='soft'
                            >
                              {String(item)}
                            </Chip>
                          ))}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {event.jobs?.length ? (
                  <BountyJobsTable
                    rows={rows}
                    rowKeyPrefix={event.id}
                    ariaLabel={`${event.description} ${t('bounty.type')}`}
                    onToggleRow={(index) => toggleDetails(event.id, index)}
                  />
                ) : null}

                {event.completionBonuses && event.completionBonuses.length > 0 ? (
                  <div className='hub-event-section'>
                    <div className='hub-event-section-title'>{t('events.completionBonuses')}</div>
                    <div className='hub-event-chip-row'>
                      {event.completionBonuses.map((bonus) => (
                        <Chip key={`${event.id}-bonus-${bonus}`} color='default' size='sm' variant='soft'>
                          {bonus}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : null}

                {event.altActivation !== API_TIME_EPOCH_ISO && event.altExpiry !== API_TIME_EPOCH_ISO ? (
                  <div className='hub-event-section'>
                    <div className='hub-event-section-title'>{t('events.currentCycle')}</div>
                    <div className='hub-event-timer'>
                      <TimeBadge
                        starttime={event.altActivation!}
                        endtime={event.altExpiry!}
                        interval={1000}
                        pullright={false}
                      />
                    </div>
                  </div>
                ) : null}

                {event.nextAlt?.activation !== API_TIME_EPOCH_ISO && event.nextAlt?.expiry !== API_TIME_EPOCH_ISO ? (
                  <div className='hub-event-section'>
                    <div className='hub-event-section-title'>{t('events.nextCycle')}</div>
                    <div className='hub-event-timer'>
                      <TimeBadge
                        starttime={event.nextAlt?.activation ?? String(Date.now())}
                        endtime={event.nextAlt?.expiry ?? String(Date.now())}
                        interval={1000}
                        pullright={false}
                      />
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <NoDataItem text={headertext} />
      )}
    </HubPanelWrap>
  );
};

export default EventsPanel;
