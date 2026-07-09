import type { TrackableEntry } from '@/lib/shared';

type CatalogEntry = {
  value: string;
  text: string;
};

const FISSURE_TIERS: CatalogEntry[] = [
  { value: 't1', text: 'Lith' },
  { value: 't2', text: 'Meso' },
  { value: 't3', text: 'Neo' },
  { value: 't4', text: 'Axi' },
  { value: 't5', text: 'Requiem' },
  { value: 't6', text: 'Omnia' },
  { value: 'sp.t1', text: 'Steel Path Lith' },
  { value: 'sp.t2', text: 'Steel Path Meso' },
  { value: 'sp.t3', text: 'Steel Path Neo' },
  { value: 'sp.t4', text: 'Steel Path Axi' },
  { value: 'sp.t5', text: 'Steel Path Requiem' },
  { value: 'sp.t6', text: 'Steel Path Omnia' },
];

const FISSURE_MISSION_TYPES: CatalogEntry[] = [
  { value: 'alchemy', text: 'Alchemy' },
  { value: 'assassination', text: 'Assassination' },
  { value: 'capture', text: 'Capture' },
  { value: 'conjunctionsurvival', text: 'Conjunction Survival' },
  { value: 'defense', text: 'Defense' },
  { value: 'disruption', text: 'Disruption' },
  { value: 'extermination', text: 'Extermination' },
  { value: 'excavation', text: 'Excavation' },
  { value: 'hijack', text: 'Hijack' },
  { value: 'hive', text: 'Hive' },
  { value: 'interception', text: 'Interception' },
  { value: 'mobiledefense', text: 'Mobile Defense' },
  { value: 'orphix', text: 'Orphix' },
  { value: 'rescue', text: 'Rescue' },
  { value: 'skirmish', text: 'Skirmish' },
  { value: 'survival', text: 'Survival' },
  { value: 'voidcascade', text: 'Void Cascade' },
  { value: 'voidflood', text: 'Void Flood' },
  { value: 'volatile', text: 'Volatile' },
];

const ARBITRATION_FACTIONS: CatalogEntry[] = [
  { value: 'grineer', text: 'Grineer' },
  { value: 'corpus', text: 'Corpus' },
  { value: 'corrupted', text: 'Corrupted' },
  { value: 'orokin', text: 'Orokin' },
  { value: 'infested', text: 'Infested' },
];

const ARBITRATION_MISSION_TYPES: CatalogEntry[] = [
  { value: 'excavation', text: 'Excavation' },
  { value: 'defense', text: 'Defense' },
  { value: 'disruption', text: 'Disruption' },
  { value: 'survival', text: 'Survival' },
  { value: 'defection', text: 'Defection' },
  { value: 'infestedsalvage', text: 'Infested Salvage' },
  { value: 'interception', text: 'Interception' },
];

const buildGeneratedEntries = (
  keys: Array<{ key: string; text: string }>
): Record<string, TrackableEntry> =>
  Object.fromEntries(
    keys.map(({ key, text }) => [
      key,
      {
        state: false,
        value: key,
        text,
      },
    ])
  );

export const buildFissureEventTypes = (): Record<string, TrackableEntry> => {
  const entries: Array<{ key: string; text: string }> = [];

  FISSURE_TIERS.forEach((tier) => {
    FISSURE_MISSION_TYPES.forEach((missionType) => {
      const key = `fissures.${tier.value}.${missionType.value}`;
      entries.push({
        key,
        text: `${tier.text} ${missionType.text} Fissure`,
      });
    });
  });

  return buildGeneratedEntries(entries);
};

export const buildArbitrationEventTypes = (): Record<string, TrackableEntry> => {
  const entries: Array<{ key: string; text: string }> = [];

  ARBITRATION_FACTIONS.forEach((faction) => {
    ARBITRATION_MISSION_TYPES.forEach((missionType) => {
      const key = `arbitration.${faction.value}.${missionType.value}`;
      entries.push({
        key,
        text: `${faction.text} ${missionType.text} Arbitration`,
      });
    });
  });

  return buildGeneratedEntries(entries);
};
