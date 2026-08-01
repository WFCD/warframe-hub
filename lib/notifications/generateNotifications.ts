import { isRealInstant, parseInstant, type WorldstateData } from '@/lib/shared';

import type { TFunction } from 'i18next';

import { makeNotification, type HubNotificationPayload } from './notificationMessages';

const safeString = (value: unknown): string => (typeof value === 'string' ? value : '');

const safeCall = (fn: () => void): void => {
  try {
    fn();
  } catch (error) {
    console.error(error);
  }
};

const fissureEventKey = (fissure: {
  isHard?: boolean;
  tierNum?: number;
  missionType?: string;
}): string =>
  `fissures${fissure.isHard ? '.sp' : ''}.t${fissure.tierNum}.${String(fissure.missionType ?? '')
    .toLowerCase()
    .replace(/\s/gi, '')}`;

const arbitrationEventKey = (arbitration: { enemy?: string; type?: string }): string =>
  `arbitration.${safeString(arbitration.enemy).toLowerCase()}.${safeString(arbitration.type)
    .toLowerCase()
    .replace(/\s/gi, '')}`;

const arbitrationId = (arbitration: { expiry?: string }): string => {
  const expiry = parseInstant(arbitration.expiry);
  return `arbitration:${isRealInstant(expiry) ? expiry.valueOf() : 0}`;
};

const newsEventKey = (article: {
  update?: boolean;
  primeaccess?: boolean;
  stream?: boolean;
}): string => {
  if (article.update) return 'updates';
  if (article.primeaccess) return 'primeaccess';
  if (article.stream) return 'streams';
  return 'news';
};

export type GenerateNotificationsContext = {
  notifiedIds: string[];
  trackedRewards: string[];
  trackedEvents: string[];
  t: TFunction;
};

const isNotifiable = (
  id: string,
  event: string,
  items: string[] | undefined,
  ctx: GenerateNotificationsContext,
): boolean => {
  const eventEnabled = !ctx.notifiedIds.includes(id) && ctx.trackedEvents.includes(event);
  const rewardsMatch =
    items && items.length ? items.some((item) => ctx.trackedRewards.includes(item)) : true;
  return eventEnabled && rewardsMatch;
};

export const generateNotifications = (
  ws: WorldstateData,
  ctx: GenerateNotificationsContext,
): HubNotificationPayload[] => {
  if (!ws) return [];

  const toNotify: HubNotificationPayload[] = [];

  safeCall(() => {
    for (const alert of (ws.alerts as Array<Record<string, unknown>> | undefined) ?? []) {
      if (isNotifiable(String(alert.id), 'alerts', alert.rewardTypes as string[] | undefined, ctx)) {
        toNotify.push(makeNotification('alert', alert, ctx.t));
      }
    }
  });

  safeCall(() => {
    for (const event of (ws.events as Array<Record<string, unknown>> | undefined) ?? []) {
      if (isNotifiable(String(event.id), 'operations', undefined, ctx)) {
        toNotify.push(makeNotification('operation', event, ctx.t));
      }
    }
  });

  safeCall(() => {
    const cycle = ws.cetusCycle as { id?: string; shortString?: string; isDay?: boolean } | undefined;
    if (!cycle?.shortString || !cycle.id) return;
    if (cycle.isDay) {
      if (isNotifiable(cycle.id, 'cetus.day', undefined, ctx)) {
        toNotify.push(makeNotification('cetus.day', cycle, ctx.t));
      }
    } else if (isNotifiable(cycle.id, 'cetus.night', undefined, ctx)) {
      toNotify.push(makeNotification('cetus.night', cycle, ctx.t));
    }
  });

  safeCall(() => {
    const cetus = ((ws.syndicateMissions as Array<{ id?: string; syndicate?: string }> | undefined) ?? []).find(
      (syndicate) => syndicate.syndicate === 'Ostrons',
    );
    if (cetus?.id && isNotifiable(cetus.id, 'syndicate.ostrons', undefined, ctx)) {
      toNotify.push(makeNotification('syndicate.ostrons', cetus, ctx.t));
    }
  });

  safeCall(() => {
    const baro = ws.voidTrader as { id?: string; active?: boolean } | undefined;
    if (baro?.active && baro.id && isNotifiable(baro.id, 'baro', undefined, ctx)) {
      toNotify.push(makeNotification('baro', baro, ctx.t));
    }
  });

  safeCall(() => {
    for (const deal of (ws.dailyDeals as Array<Record<string, unknown>> | undefined) ?? []) {
      if (isNotifiable(String(deal.id), 'darvo', undefined, ctx)) {
        toNotify.push(makeNotification('darvo', deal, ctx.t));
      }
    }
  });

  safeCall(() => {
    for (const enemy of (ws.persistentEnemies as Array<Record<string, unknown>> | undefined) ?? []) {
      if (isNotifiable(String(enemy.pid), 'enemies', undefined, ctx)) {
        toNotify.push(makeNotification('enemies', enemy, ctx.t));
      }
    }
  });

  safeCall(() => {
    const sortie = ws.sortie as { id?: string } | undefined;
    if (sortie?.id && isNotifiable(sortie.id, 'sorties', undefined, ctx)) {
      toNotify.push(makeNotification('sortie', sortie, ctx.t));
    }
  });

  safeCall(() => {
    const hunt = ws.archonHunt as { id?: string } | undefined;
    if (hunt?.id && isNotifiable(hunt.id, 'archonHunt', undefined, ctx)) {
      toNotify.push(makeNotification('archonHunt', hunt, ctx.t));
    }
  });

  safeCall(() => {
    for (const fissure of (ws.fissures as Array<Record<string, unknown>> | undefined) ?? []) {
      const eventKey = fissureEventKey(fissure);
      if (isNotifiable(String(fissure.id), eventKey, undefined, ctx)) {
        toNotify.push(makeNotification('fissure', fissure, ctx.t));
      }
    }
  });

  safeCall(() => {
    for (const article of (ws.news as Array<Record<string, unknown>> | undefined) ?? []) {
      const eventKey = newsEventKey(article);
      if (isNotifiable(String(article.id), eventKey, undefined, ctx)) {
        toNotify.push(makeNotification('news', article, ctx.t));
      }
    }
  });

  safeCall(() => {
    for (const invasion of (ws.invasions as Array<Record<string, unknown>> | undefined) ?? []) {
      if (isNotifiable(String(invasion.id), 'invasions', invasion.rewardTypes as string[] | undefined, ctx)) {
        toNotify.push(makeNotification('invasions', invasion, ctx.t));
      }
    }
  });

  safeCall(() => {
    const cycle = ws.vallisCycle as { id?: string; shortString?: string; isWarm?: boolean } | undefined;
    if (!cycle?.shortString || !cycle.id) return;
    if (cycle.isWarm) {
      if (isNotifiable(cycle.id, 'vallis.warm', undefined, ctx)) {
        toNotify.push(makeNotification('vallis.warm', cycle, ctx.t));
      }
    } else if (isNotifiable(cycle.id, 'vallis.cold', undefined, ctx)) {
      toNotify.push(makeNotification('vallis.cold', cycle, ctx.t));
    }
  });

  safeCall(() => {
    const challenges = (ws.nightwave?.activeChallenges as Array<Record<string, unknown>> | undefined) ?? [];
    for (const challenge of challenges) {
      if (isNotifiable(String(challenge.id), 'nightwave', undefined, ctx)) {
        toNotify.push(makeNotification('nightwave', challenge, ctx.t));
      }
    }
  });

  safeCall(() => {
    const outpost = ws.sentientOutposts as { id?: string; active?: boolean } | undefined;
    if (outpost?.id && outpost.active && isNotifiable(outpost.id, 'outposts', undefined, ctx)) {
      toNotify.push(makeNotification('outposts', outpost, ctx.t));
    }
  });

  safeCall(() => {
    const arbitration = ws.arbitration as { expiry?: string; enemy?: string; type?: string } | undefined;
    if (!arbitration) return;
    const id = arbitrationId(arbitration);
    const eventKey = arbitrationEventKey(arbitration);
    if (isNotifiable(id, eventKey, undefined, ctx)) {
      toNotify.push(makeNotification('arbitration', arbitration, ctx.t));
    }
  });

  return toNotify;
};
