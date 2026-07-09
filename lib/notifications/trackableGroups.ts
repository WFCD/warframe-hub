import type { TrackableEntry } from '@/lib/shared';

import type { TrackableSelectOption } from '@/components/ui/HubTrackableMultiSelect';

const toOption = ([key, entry]: [string, TrackableEntry]): TrackableSelectOption => ({
  key,
  text: String(entry.text ?? key),
});

export const isFissureKey = (key: string): boolean => key.includes('fissures');
export const isArbitrationKey = (key: string): boolean => key.includes('arbitration');
export const isGeneralEventKey = (key: string): boolean => !isFissureKey(key) && !isArbitrationKey(key);

export const getActiveKeys = (entries: Record<string, TrackableEntry>): string[] =>
  Object.entries(entries)
    .filter(([, entry]) => entry.state)
    .map(([key]) => key);

export const getRewardOptions = (rewardTypes: Record<string, TrackableEntry>): TrackableSelectOption[] =>
  Object.entries(rewardTypes).map(toOption);

export const getEventOptions = (eventTypes: Record<string, TrackableEntry>): TrackableSelectOption[] =>
  Object.entries(eventTypes)
    .filter(([key]) => isGeneralEventKey(key))
    .map(toOption);

export const getFissureOptions = (eventTypes: Record<string, TrackableEntry>): TrackableSelectOption[] =>
  Object.entries(eventTypes)
    .filter(([key]) => isFissureKey(key))
    .map(toOption)
    .sort((a, b) => a.key.localeCompare(b.key));

export const getArbitrationOptions = (eventTypes: Record<string, TrackableEntry>): TrackableSelectOption[] =>
  Object.entries(eventTypes)
    .filter(([key]) => isArbitrationKey(key))
    .map(toOption);
