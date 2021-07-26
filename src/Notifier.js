'use strict';

import Vue from 'vue';
import drum from '@/assets/audio/drum.mp3';
import eidolon from '@/assets/audio/eidolon.mp3';

const wfcdLogoUrl = 'https://warframestat.us/wfcd_logo_color.png';

const defaultNotificationBody = {
  body: 'You can now receive notifications like this.',
  icon: wfcdLogoUrl,
};

const logger = console;

const safeString = (str) => str || '';

const safeCall = (fn) => {
  try {
    fn();
  } catch (e) {
    logger.error(e);
  }
};

const makeNotification = (type, data) => {
  switch (type) {
    case 'alert':
      return {
        head: `${data.mission.type} - ${data.mission.node}`,
        body: {
          body: `${data.mission.reward.asString}\n${data.eta} Remaining`,
          icon: wfcdLogoUrl,
        },
        sound: 'drum',
        type: 'alert',
      };
    case 'operation':
      return {
        head: data.description,
        body: {
          body: data.tooltip,
          icon: wfcdLogoUrl,
        },
        type: 'operation',
      };
    case 'cetus.day':
      return {
        head: 'Cetus - Rise and Shine! Hunting time Over!',
        body: {
          body: data.shortString,
          icon: wfcdLogoUrl,
        },
        type: 'cetus.day',
      };
    case 'cetus.night':
      return {
        head: 'Cetus - Hunting Time!',
        body: {
          body: data.shortString,
          icon: wfcdLogoUrl,
        },
        sound: 'eidolon',
        type: 'night',
      };
    case 'syndicate.ostrons':
      return {
        head: 'Ostron Bounties',
        body: {
          body: `Remaining: ${data.eta}`,
          icon: wfcdLogoUrl,
        },
        type: 'syndicate.ostrons',
      };
    case 'baro':
      return {
        head: "Baro Ki'Teer",
        body: {
          body: `See Component for more details\nBaro Ki'Teer departs in ${data.endString} from ${data.location}`,
          icon: wfcdLogoUrl,
        },
        type: 'baro',
      };
    case 'darvo':
      return {
        head: `Darvo Deal on ${data.item}!`,
        body: {
          body: `${data.discount}% off • ${data.total - data.sold} remaining\nEnds in ${data.eta}`,
          icon: wfcdLogoUrl,
        },
        type: 'darvo',
      };
    case 'enemies':
      return {
        head: `${data.agentType} discovered!`,
        body: {
          body: `${(data.healthPercent * 100).toFixed(2)}% Health Remaining • Discovered at ${data.lastDiscoveredAt}`,
          icon: wfcdLogoUrl,
        },
        type: 'enemies',
      };
    case 'sortie':
      return {
        head: `Sortie: ${data.boss}`,
        body: {
          body: `${data.variants
            .map((variant) => `${variant.missionType} • ${variant.node} • ${variant.modifier}`)
            .join('\n')}\n${data.eta}`,
          icon: wfcdLogoUrl,
        },
      };
    case 'fissure':
      return {
        head: 'New Fissure Detected',
        body: {
          body: `${data.tier} ${data.missionType} • ${data.node}`,
          icon: wfcdLogoUrl,
        },
        type: 'fissure',
      };
    case 'news':
      return {
        head: 'Warframe Hub',
        body: {
          body: data.message,
          icon: wfcdLogoUrl,
        },
        link: data.link,
        type: 'news',
      };
    case 'invasions':
      var rewards = `${data.attackerReward.asString.length ? `${data.attackerReward.asString} vs ` : ''}${
        data.defenderReward.asString
      }`;

      return {
        head: rewards,
        body: {
          body: `${data.desc} • ${data.node}\n${data.eta
            .replace('-Infinityd', '??')
            .replace('Infinityd', '??')} Remaining`,
          icon: wfcdLogoUrl,
        },
        sound: 'drum',
        type: 'invasion',
      };
    case 'vallis.warm':
      return {
        head: 'Vallis - Get your Warm Fishing on!',
        body: {
          body: data.shortString,
          icon: wfcdLogoUrl,
        },
        type: 'warm',
      };
    case 'vallis.cold':
      return {
        head: 'Vallis - Back to the Cold!',
        body: {
          body: data.shortString,
          icon: wfcdLogoUrl,
        },
        type: 'cold',
      };
    case 'nightwave':
      return {
        head: `Nightwave - ${data.title}`,
        body: {
          body: `${data.daily ? 'Daily: ' : data.isElite ? 'Weekly Elite: ' : 'Weekly: '}${data.desc}`,
          icon: wfcdLogoUrl,
        },
      };
    case 'outposts':
      return {
        head: `Sentient Outpost - ${data.mission.node}`,
        body: {
          body: '',
          icon: wfcdLogoUrl,
        },
      };
    case 'arbitration':
      return {
        head: `Arbitration - ${data.node}`,
        body: {
          body: `${data.type}`,
          icon: wfcdLogoUrl,
        },
      };
    default:
      return defaultNotificationBody;
  }
};

export default class Notifier {
  constructor(store) {
    this.store = store;
    this.notifier = Vue.notification;
  }

  isNotifiable(id, event, items) {
    const currentNotifieds = this.store.getters.notifiedIds;
    const eventGood = !currentNotifieds.includes(id) && this.trackedEvents.includes(event);
    const includesItems = items && items.length ? this.trackedRewards.some((r) => items.indexOf(r) >= 0) : true;
    return eventGood && includesItems;
  }

  async notify(notifications) {
    const usePush = !document.hasFocus();
    notifications.forEach((notification) => {
      if (usePush) {
        this.notifier.show(notification.head, notification.body, {
          onclick: (event) => {
            if (notification.link) {
              event.preventDefault();
              window.open(notification.link, '_blank');
            }
          },
        });
      } else {
        Vue.notify({
          group: 'hub',
          title: notification.head,
          text: notification.body.body,
        });
      }

      if (this.store.getters.sounds.includes(notification.type)) {
        let audio;
        switch (notification.sound) {
          case 'drum':
            audio = new Audio(drum);
            break;
          case 'eidolon':
            audio = new Audio(eidolon);
        }
        if (audio) {
          audio.volume = 0.5;
          audio.play();
        }
      }
    });
  }

  generateNotifications(ws) {
    if (!ws) return [];

    const toNotify = [];
    // look for things to be notified
    // run notifications for each
    safeCall(() => {
      for (const alert of ws.alerts) {
        if (this.isNotifiable(alert.id, 'alert', alert.rewardTypes)) {
          toNotify.push(makeNotification('alert', alert));
        }
      }
    });

    safeCall(() => {
      for (const event of ws.events) {
        if (this.isNotifiable(event.id, 'operation')) {
          toNotify.push(makeNotification('operation', event));
        }
      }
    });

    safeCall(() => {
      if (ws.cetusCycle.shortString) {
        if (ws.cetusCycle.isDay) {
          if (this.isNotifiable(ws.cetusCycle.id, 'cetus.day')) {
            toNotify.push(makeNotification('cetus.day', ws.cetusCycle));
          }
        } else {
          if (this.isNotifiable(ws.cetusCycle.id, 'cetus.night')) {
            toNotify.push(makeNotification('cetus.night', ws.cetusCycle));
          }
        }
      }
    });

    safeCall(() => {
      const cetus = ws.syndicateMissions.filter((synd) => synd.syndicate === 'Ostrons')[0];
      if (cetus && this.isNotifiable(cetus.id, 'syndicate.ostrons')) {
        toNotify.push(makeNotification('syndicate.ostrons', cetus));
      }
    });

    safeCall(() => {
      if (ws.voidTrader.active && this.isNotifiable(ws.voidTrader.id, 'baro')) {
        toNotify.push(makeNotification('baro', ws.voidTrader));
      }
    });

    safeCall(() => {
      for (const currentItem of ws.dailyDeals) {
        if (this.isNotifiable(currentItem.id, 'darvo')) {
          toNotify.push(makeNotification('darvo', currentItem));
        }
      }
    });

    safeCall(() => {
      for (const acolyte of ws.persistentEnemies) {
        if (this.isNotifiable(acolyte.pid, 'enemies')) {
          toNotify.push(makeNotification('enemies', acolyte));
        }
      }
    });

    safeCall(() => {
      if (ws.sortie && this.isNotifiable(ws.sortie.id)) {
        toNotify.push(makeNotification('sortie', ws.sortie));
      }
    });

    safeCall(() => {
      for (const fissure of ws.fissures) {
        const notifIdentifier = `fissures.t${fissure.tierNum}.${fissure.missionType.toLowerCase().replace(/\s/gi, '')}`;
        if (this.isNotifiable(fissure.id, notifIdentifier)) {
          toNotify.push(makeNotification('fissure', fissure));
        }
      }
    });

    safeCall(() => {
      for (const article of ws.news) {
        let type;
        if (article.update) {
          type = 'update';
        }
        if (article.primeaccess) {
          type = 'primeAccess';
        }
        if (article.stream) {
          type = 'stream';
        }
        if (typeof type === 'undefined') {
          type = 'news';
        }
        if (this.isNotifiable(article.id, type)) {
          toNotify.push(makeNotification('news', article));
        }
      }
    });

    safeCall(() => {
      for (const invasion of ws.invasions) {
        if (this.isNotifiable(invasion.id, 'invasions', invasion.rewardTypes)) {
          toNotify.push(makeNotification('invasions', invasion));
        }
      }
    });

    safeCall(() => {
      if (ws.vallisCycle.shortString) {
        if (ws.vallisCycle.isWarm) {
          if (this.isNotifiable(ws.vallisCycle.id, 'vallis.warm')) {
            toNotify.push(makeNotification('vallis.warm', ws.vallisCycle));
          }
        } else {
          if (this.isNotifiable(ws.vallisCycle.id, 'vallis.cold')) {
            toNotify.push(makeNotification('vallis.cold', ws.vallisCycle));
          }
        }
      }
    });

    safeCall(() => {
      if (ws.nightwave && ws.nightwave.activeChallenges.length) {
        for (const challenge of ws.nightwave.activeChallenges) {
          if (this.isNotifiable(challenge.id, 'nightwave')) {
            toNotify.push(makeNotification('nightwave', challenge));
          }
        }
      }
    });

    safeCall(() => {
      if (ws.sentientOutposts.id && ws.sentientOutposts.active) {
        if (this.isNotifiable(ws.sentientOutposts.id, 'outposts')) {
          toNotify.push(makeNotification('outposts', ws.sentientOutposts));
        }
      }
    });

    safeCall(() => {
      if (ws.arbitration) {
        const id = `arbitration:${new Date(ws.arbitration.expiry).getTime()}`;
        const notifId = `arbitration.${safeString(ws.arbitration.enemy).toLowerCase()}.${safeString(ws.arbitration.type)
          .toLowerCase()
          .replace(/\s/gi, '')}`;
        if (this.isNotifiable(id, notifId)) {
          toNotify.push(makeNotification('arbitration', ws.arbitration));
        }
      }
    });

    return toNotify;
  }

  async checkNotifications() {
    const ws = this.store.getters.worldstate;
    this.trackedRewards = Object.keys(this.store.getters.trackableState.rewardTypes)
      .map((reward) => this.store.getters.trackableState.rewardTypes[reward])
      .filter((reward) => reward.state)
      .map((reward) => reward.value);
    this.trackedEvents = Object.keys(this.store.getters.trackableState.eventTypes)
      .map((event) => this.store.getters.trackableState.eventTypes[event])
      .filter((event) => event.state)
      .map((event) => event.value);

    const toNotify = this.generateNotifications(ws);

    await this.notify(toNotify);
    return this.store.dispatch('updateNotifiedIds');
  }
}
