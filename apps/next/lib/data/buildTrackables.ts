import type { TrackableEntry, TrackablesMap } from '@wfcd/shared';

import { buildArbitrationEventTypes, buildFissureEventTypes } from './generatedTrackables';
import { rewardTypes, eventTypes as baseEventTypes } from './trackables.js';

export const getDefaultTrackables = (): TrackablesMap => ({
  rewardTypes: { ...rewardTypes },
  eventTypes: {
    ...baseEventTypes,
    ...buildArbitrationEventTypes(),
    ...buildFissureEventTypes(),
  },
});

const mergeEntryGroup = (
  catalog: Record<string, TrackableEntry>,
  stored: Record<string, TrackableEntry> | undefined
): Record<string, TrackableEntry> => {
  const merged = { ...catalog };

  Object.entries(stored ?? {}).forEach(([key, entry]) => {
    if (merged[key]) {
      merged[key] = { ...merged[key], state: Boolean(entry.state) };
    }
  });

  return merged;
};

export const mergeTrackables = (stored: TrackablesMap | undefined, catalog: TrackablesMap): TrackablesMap => ({
  rewardTypes: mergeEntryGroup(catalog.rewardTypes, stored?.rewardTypes),
  eventTypes: mergeEntryGroup(catalog.eventTypes, stored?.eventTypes),
});

export const buildTrackables = (stored?: TrackablesMap): TrackablesMap =>
  mergeTrackables(stored, getDefaultTrackables());
