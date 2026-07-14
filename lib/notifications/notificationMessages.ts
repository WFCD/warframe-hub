import type { TFunction } from 'i18next';

import type { NotificationSoundKey } from './notificationSounds';
import { NOTIFICATION_ICON_URL } from './constants';

export type HubNotificationPayload = {
  title: string;
  body: string;
  icon: string;
  link?: string;
  sound?: NotificationSoundKey;
};

const iconBody = (body: string): Pick<HubNotificationPayload, 'body' | 'icon'> => ({
  body,
  icon: NOTIFICATION_ICON_URL,
});

export const makeNotification = (
  type: string,
  data: Record<string, unknown>,
  t: TFunction,
): HubNotificationPayload => {
  switch (type) {
    case 'alert': {
      const mission = data.mission as { type?: string; node?: string; reward?: { asString?: string } };
      const title = t('notifications.alert.title', {
        missionType: mission?.type ?? t('notifications.alert.fallbackMissionType'),
        node: mission?.node ?? t('notifications.unknown'),
      });
      const body = [mission?.reward?.asString ?? '', t('notifications.remaining', { eta: String(data.eta ?? '') })]
        .filter(Boolean)
        .join('\n');
      return { title, ...iconBody(body), sound: 'drum' };
    }
    case 'operation':
      return {
        title: String(data.description ?? t('notifications.operation.fallbackTitle')),
        ...iconBody(String(data.tooltip ?? '')),
      };
    case 'cetus.day':
      return {
        title: t('notifications.cetusDay.title'),
        ...iconBody(String(data.shortString ?? '')),
      };
    case 'cetus.night':
      return {
        title: t('notifications.cetusNight.title'),
        ...iconBody(String(data.shortString ?? '')),
        sound: 'eidolon',
      };
    case 'syndicate.ostrons':
      return {
        title: t('notifications.ostronBounties.title'),
        ...iconBody(t('notifications.remainingColon', { eta: String(data.eta ?? '') })),
      };
    case 'baro':
      return {
        title: t('notifications.baro.title'),
        ...iconBody(
          t('notifications.baro.body', {
            endString: String(data.endString ?? ''),
            location: String(data.location ?? ''),
          }),
        ),
      };
    case 'darvo':
      return {
        title: t('notifications.darvo.title', { item: String(data.item ?? t('notifications.anItem')) }),
        ...iconBody(
          t('notifications.darvo.body', {
            discount: String(data.discount ?? ''),
            remaining: String(Number(data.total ?? 0) - Number(data.sold ?? 0)),
            eta: String(data.eta ?? ''),
          }),
        ),
      };
    case 'enemies':
      return {
        title: t('notifications.enemies.title', {
          agentType: String(data.agentType ?? t('notifications.enemy')),
        }),
        ...iconBody(
          t('notifications.enemies.body', {
            healthPercent: (Number(data.healthPercent ?? 0) * 100).toFixed(2),
            lastDiscoveredAt: String(data.lastDiscoveredAt ?? ''),
          }),
        ),
      };
    case 'sortie': {
      const variants = (data.variants as Array<{ missionType?: string; node?: string; modifier?: string }>) ?? [];
      return {
        title: t('notifications.sortie.title', { boss: String(data.boss ?? '') }),
        ...iconBody(
          `${variants
            .map((variant) => `${variant.missionType ?? ''} • ${variant.node ?? ''} • ${variant.modifier ?? ''}`)
            .join('\n')}\n${String(data.eta ?? '')}`.trim(),
        ),
      };
    }
    case 'archonHunt': {
      const missions = (data.missions as Array<{ type?: string; node?: string }>) ?? [];
      return {
        title: t('notifications.archonHunt.title', { boss: String(data.boss ?? '') }),
        ...iconBody(
          `${missions.map((mission) => `${mission.type ?? ''} • ${mission.node ?? ''}`).join('\n')}\n${String(data.eta ?? '')}`.trim(),
        ),
      };
    }
    case 'fissure':
      return {
        title: t('notifications.fissure.title'),
        ...iconBody(
          t('notifications.fissure.body', {
            tier: String(data.tier ?? ''),
            missionType: String(data.missionType ?? ''),
            node: String(data.node ?? ''),
          }),
        ),
      };
    case 'news':
      return {
        title: t('notifications.defaultTitle'),
        ...iconBody(String(data.message ?? '')),
        link: typeof data.link === 'string' ? data.link : undefined,
      };
    case 'invasions': {
      const attacker = (data.attackerReward as { asString?: string } | undefined)?.asString ?? '';
      const defender = (data.defenderReward as { asString?: string } | undefined)?.asString ?? '';
      const eta = String(data.eta ?? '')
        .replace('-Infinityd', '??')
        .replace('Infinityd', '??');
      return {
        title: attacker.length
          ? t('notifications.invasions.titleVs', { attacker, defender })
          : defender,
        ...iconBody(
          t('notifications.invasions.body', {
            desc: String(data.desc ?? ''),
            node: String(data.node ?? ''),
            eta,
          }),
        ),
        sound: 'drum',
      };
    }
    case 'vallis.warm':
      return {
        title: t('notifications.vallisWarm.title'),
        ...iconBody(String(data.shortString ?? '')),
      };
    case 'vallis.cold':
      return {
        title: t('notifications.vallisCold.title'),
        ...iconBody(String(data.shortString ?? '')),
      };
    case 'nightwave':
      return {
        title: t('notifications.nightwave.title', { challengeTitle: String(data.title ?? '') }),
        ...iconBody(
          t('notifications.nightwave.body', {
            prefix: data.daily
              ? t('notifications.nightwave.dailyPrefix')
              : data.isElite
                ? t('notifications.nightwave.elitePrefix')
                : t('notifications.nightwave.weeklyPrefix'),
            desc: String(data.desc ?? ''),
          }),
        ),
      };
    case 'outposts': {
      const mission = data.mission as { node?: string } | undefined;
      return {
        title: t('notifications.outposts.title', {
          node: mission?.node ?? t('notifications.unknown'),
        }),
        ...iconBody(''),
      };
    }
    case 'arbitration':
      return {
        title: t('notifications.arbitration.title', { node: String(data.node ?? '') }),
        ...iconBody(String(data.type ?? '')),
      };
    default:
      return {
        title: t('notifications.defaultTitle'),
        ...iconBody(t('notifications.defaultBody')),
      };
  }
};
