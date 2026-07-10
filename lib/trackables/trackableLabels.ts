import i18nCore from '@/lib/i18nCore';
import type { TrackableEntry } from '@/lib/shared';

export const getTrackableLabel = (key: string, entry: TrackableEntry, locale: string): string => {
  const exists = (path: string) => i18nCore.exists(path, { lng: locale });
  const label = (path: string, options?: Record<string, string>) =>
    String(i18nCore.t(path, { lng: locale, ...options }));

  if (exists(`trackables.rewards.${key}`)) return label(`trackables.rewards.${key}`);
  if (exists(`trackables.events.${key}`)) return label(`trackables.events.${key}`);

  const fissureMatch = key.match(/^fissures\.(.+)\.(.+)$/);
  if (fissureMatch) {
    const [, tier, missionType] = fissureMatch;
    return label('trackables.fissureLabel', {
      tier: exists(`trackables.fissureTiers.${tier}`) ? label(`trackables.fissureTiers.${tier}`) : tier,
      missionType: exists(`trackables.missionTypes.${missionType}`)
        ? label(`trackables.missionTypes.${missionType}`)
        : missionType,
    });
  }

  const arbitrationMatch = key.match(/^arbitration\.(.+)\.(.+)$/);
  if (arbitrationMatch) {
    const [, faction, missionType] = arbitrationMatch;
    return label('trackables.arbitrationLabel', {
      faction: exists(`trackables.factions.${faction}`) ? label(`trackables.factions.${faction}`) : faction,
      missionType: exists(`trackables.missionTypes.${missionType}`)
        ? label(`trackables.missionTypes.${missionType}`)
        : missionType,
    });
  }

  return String(entry.text ?? key);
};
