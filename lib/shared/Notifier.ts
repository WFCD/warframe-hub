import type { WorldstateData } from './types/worldstate';
import { collectNotifiedIds } from '../notifications/collectNotifiedIds';
import { deliverNotifications } from '../notifications/deliverNotifications';
import { generateNotifications } from '../notifications/generateNotifications';
import { createNotificationTranslator } from '../notifications/notificationI18n';

export type NotifierContext = {
  getLocale: () => string;
  getNotifiedIds: () => string[];
  setNotifiedIds: (ids: string[]) => void;
  getSoundFilters: () => string[];
  getTrackables: () => {
    rewardTypes: Record<string, { state: boolean; value?: string }>;
    eventTypes: Record<string, { state: boolean; value?: string }>;
  };
  getNotificationAllowance: () => NotificationPermission | 'default';
};

const activeTrackableValues = (entries: Record<string, { state: boolean; value?: string }>): string[] =>
  Object.values(entries)
    .filter((entry) => entry.state)
    .map((entry) => String(entry.value ?? ''))
    .filter(Boolean);

export class Notifier {
  constructor(private ctx: NotifierContext) {}

  async checkNotifications(ws: WorldstateData): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (this.ctx.getNotificationAllowance() !== 'granted') return;

    const trackables = this.ctx.getTrackables();
    const t = createNotificationTranslator(this.ctx.getLocale());
    const toNotify = generateNotifications(ws, {
      notifiedIds: this.ctx.getNotifiedIds(),
      trackedRewards: activeTrackableValues(trackables.rewardTypes),
      trackedEvents: activeTrackableValues(trackables.eventTypes),
      t,
    });

    await deliverNotifications(toNotify, this.ctx.getSoundFilters());
    this.ctx.setNotifiedIds(collectNotifiedIds(ws));
  }
}
