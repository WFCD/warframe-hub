import type { TrackableEntry } from '@/lib/shared';

const buildGeneratedEntries = (keys: string[]): Record<string, TrackableEntry> =>
  Object.fromEntries(
    keys.map((key) => [
      key,
      {
        state: false,
        value: key,
      },
    ]),
  );

const FISSURE_TIERS = ['t1', 't2', 't3', 't4', 't5', 't6', 'sp.t1', 'sp.t2', 'sp.t3', 'sp.t4', 'sp.t5', 'sp.t6'];

const FISSURE_MISSION_TYPES = [
  'alchemy',
  'assassination',
  'capture',
  'conjunctionsurvival',
  'defense',
  'disruption',
  'extermination',
  'excavation',
  'hijack',
  'hive',
  'interception',
  'mobiledefense',
  'orphix',
  'rescue',
  'skirmish',
  'survival',
  'voidcascade',
  'voidflood',
  'volatile',
];

const ARBITRATION_FACTIONS = ['grineer', 'corpus', 'corrupted', 'orokin', 'infested'];

const ARBITRATION_MISSION_TYPES = [
  'excavation',
  'defense',
  'disruption',
  'survival',
  'defection',
  'infestedsalvage',
  'interception',
];

export const buildFissureEventTypes = (): Record<string, TrackableEntry> => {
  const keys: string[] = [];
  FISSURE_TIERS.forEach((tier) => {
    FISSURE_MISSION_TYPES.forEach((missionType) => {
      keys.push(`fissures.${tier}.${missionType}`);
    });
  });
  return buildGeneratedEntries(keys);
};

export const buildArbitrationEventTypes = (): Record<string, TrackableEntry> => {
  const keys: string[] = [];
  ARBITRATION_FACTIONS.forEach((faction) => {
    ARBITRATION_MISSION_TYPES.forEach((missionType) => {
      keys.push(`arbitration.${faction}.${missionType}`);
    });
  });
  return buildGeneratedEntries(keys);
};
