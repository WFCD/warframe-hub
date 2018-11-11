'use strict';
/* globals document */
import Vue from 'vue';

const wfcdLogoUrl = 'https://warframestat.us/wfcd_logo_color.png';

const defaultNotificationBody = {
  body: 'You can now receive notifications like this.',
  icon: wfcdLogoUrl
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
      };
    case 'operation':
      return {
        head: data.description,
        body: {
          body: data.tooltip,
          icon: wfcdLogoUrl,
        },
      };
    case 'cetus.day':
      return {
        head: 'Cetus - Rise and Shine! Hunting\'s Over!',
        body: {
          body: data.shortString,
          icon: wfcdLogoUrl,
        },
      };
    case 'cetus.night':
      return {
        head: 'Cetus - It\'s Hunting Time!',
        body: {
          body: data.shortString,
          icon: wfcdLogoUrl,
        },
      };
    case 'syndicate.ostrons':
      return {
        head: 'Ostron Bounties',
        body: {
          body: `Remaining: ${data.eta}`,
          icon: wfcdLogoUrl,
        },
      };
    case 'baro':
      return {
        head: 'Baro Ki\'Teer',
        body: {
          body: `See Component for more details\nBaro Ki'Teer departs in ${data.endString} from ${data.location}`,
          icon: wfcdLogoUrl,
        },
      };
    case 'darvo':
      return {
        head: `Darvo Deal on ${data.item}!`,
        body: {
          body: `${data.discount}% off • ${data.total - data.sold} remaining\nEnds in ${data.eta}`,
          icon: wfcdLogoUrl,
        },
      };
    case 'enemies':
      return {
        head: `${data.agentType} discovered!`,
        body: {
          body: `${(data.healthPercent * 100).toFixed(2)}% Health Remaining • Discovered at ${data.lastDiscoveredAt}`,
          icon: wfcdLogoUrl,
        },
      };
    case 'sortie':
      return {
        head: `Sortie: ${data.boss}`,
        body: {
          body: `${data.variants.map((variant) => `${variant.missionType} • ${variant.node} • ${variant.modifier}`).join('\n')}\n${data.eta}`,
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
      };
    case 'news':
      return {
        head: 'Warframe Hub',
        body: {
          body: data.message,
          icon: wfcdLogoUrl,
        },
        link: data.link,
      };
    case 'invasions':
      var rewards = `${data.attackerReward.asString.length ? `${data.attackerReward.asString} vs ` : ''}${data.defenderReward.asString}`;

      return {
        head: rewards,
        body: {
          body: `${data.desc} • ${data.node}\n${data.eta.replace('-Infinityd', '??').replace('Infinityd', '??')} Remaining`,
          icon: wfcdLogoUrl,
        },
      };
    default:
      return defaultNotificationBody;
  }
};

class Notifier {
  constructor (store) {
    this.store = store;
    this.notifier = Vue.notification;
  }

  isNotifiable(id, event, items) {
    const currentNotifieds = this.store.getters.notifiedIds;
    const eventGood = !currentNotifieds.includes(id) && this.trackedEvents.includes(event);
    const includesItems = items && items.length ? this.trackedRewards.some((r) => items.indexOf(r) >= 0) : true;
    return eventGood && includesItems;
  }

  async notify (notifications) {
    const usePush = true || !document.hasFocus();
    notifications.forEach((notification) => {
      if (usePush) {
        this.notifier.show(notification.head, notification.body, {});
      }
    });
  }

  generateNotifications(ws) {
    const toNotify = [];
    // look for things to be notified
    // run notifications for each
    for (const alert of ws.alerts) {
      if (this.isNotifiable(alert.id, 'alert', alert.rewardTypes)) {
        toNotify.push(makeNotification('alert', alert));
      }
    }

    for (const event of ws.events) {
      if (this.isNotifiable(event.id, 'operation')) {
        toNotify.push(makeNotification('operation', event));
      }
    }

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

    const cetus = ws.syndicateMissions.filter((synd) => synd.syndicate === 'Ostrons')[0];
    if (cetus && this.isNotifiable(cetus.id, 'syndicate.ostrons')) {
      toNotify.push(makeNotification('syndicate.ostrons', cetus));
    }

    if (ws.voidTrader.active && this.isNotifiable(ws.voidTrader.id, 'baro')) {
      toNotify.push(makeNotification('baro', ws.voidTrader));
    }

    for (const currentItem of ws.dailyDeals) {
      if (this.isNotifiable(currentItem.id, 'darvo')) {
        toNotify.push(makeNotification('darvo', currentItem));
      }
    }

    for (const acolyte of ws.persistentEnemies) {
      if (this.isNotifiable(acolyte.pid, 'enemies')) {
        toNotify.push(makeNotification('enemies', acolyte));
      }
    }

    if (ws.sortie && this.isNotifiable(ws.sortie.id)) {
      toNotify.push(makeNotification('sortie', ws.sortie));
    }

    for (const fissure of ws.fissures) {
      const notifIdentifier = `fissures.t${fissure.tierNum}.${fissure.missionType.toLowerCase().replace(/\s/ig, '')}`;
      if (this.isNotifiable(fissure.id, notifIdentifier)) {
        toNotify.push(makeNotification('fissure', fissure));
      }
    }

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

    for (const invasion of ws.invasions) {
      if (this.isNotifiable(invasion.id, 'invasions', invasion.rewardTypes)) {
        toNotify.push(makeNotification('invasions', invasion));
      }
    }
    return toNotify;
  }

  async checkNotifications () {
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

export default Notifier;
