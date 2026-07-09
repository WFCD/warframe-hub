import type { WorldstateData } from './types/worldstate';

const wfcdLogoUrl = 'https://warframestat.us/wfcd_logo_color.png';

export type NotifierContext = {
  getNotifiedIds: () => string[];
  setNotifiedIds: (ids: string[]) => void;
  getSoundFilters: () => string[];
  getTrackables: () => { rewardTypes: Record<string, { state: boolean }>; eventTypes: Record<string, { state: boolean }> };
  getNotificationAllowance: () => NotificationPermission | 'default';
};

export class Notifier {
  constructor(private ctx: NotifierContext) {}

  async checkNotifications(ws: WorldstateData): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (this.ctx.getNotificationAllowance() !== 'granted') return;

    const ids = this.collectIds(ws);
    const prev = this.ctx.getNotifiedIds();
    const newAlerts = ids.filter((id) => !prev.includes(id));
    if (!newAlerts.length) return;

    for (const alert of (ws.alerts as Array<{ id: string; mission?: { node?: string } }>) ?? []) {
      if (newAlerts.includes(alert.id)) {
        new Notification('Warframe Alert', {
          body: alert.mission?.node ?? 'New alert',
          icon: wfcdLogoUrl,
        });
      }
    }

    this.ctx.setNotifiedIds(ids);
  }

  private collectIds(ws: WorldstateData): string[] {
    return []
      .concat((ws.alerts as Array<{ id: string }> | undefined)?.map((a) => a.id) ?? [])
      .concat((ws.events as Array<{ id: string }> | undefined)?.map((e) => e.id) ?? [])
      .concat((ws.news as Array<{ id: string }> | undefined)?.map((n) => n.id) ?? [])
      .filter(Boolean) as string[];
  }
}
