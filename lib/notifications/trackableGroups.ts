import type { TrackableEntry } from '@/lib/shared';

import { getTrackableLabel } from '@/lib/trackables/trackableLabels';
import type { TrackableSelectOption } from '@/components/ui/HubTrackableMultiSelect';

const toOption =
  (locale: string) =>
  ([key, entry]: [string, TrackableEntry]): TrackableSelectOption => ({
    key,
    text: getTrackableLabel(key, entry, locale),
  });

export const isFissureKey = (key: string): boolean => key.includes('fissures');
export const isArbitrationKey = (key: string): boolean => key.includes('arbitration');
export const isGeneralEventKey = (key: string): boolean => !isFissureKey(key) && !isArbitrationKey(key);

export const getActiveKeys = (entries: Record<string, TrackableEntry>): string[] =>
  Object.entries(entries)
    .filter(([, entry]) => entry.state)
    .map(([key]) => key);

export const getRewardOptions = (
  rewardTypes: Record<string, TrackableEntry>,
  locale: string,
): TrackableSelectOption[] => Object.entries(rewardTypes).map(toOption(locale));

export const getEventOptions = (
  eventTypes: Record<string, TrackableEntry>,
  locale: string,
): TrackableSelectOption[] =>
  Object.entries(eventTypes)
    .filter(([key]) => isGeneralEventKey(key))
    .map(toOption(locale));

export const getFissureOptions = (
  eventTypes: Record<string, TrackableEntry>,
  locale: string,
): TrackableSelectOption[] =>
  Object.entries(eventTypes)
    .filter(([key]) => isFissureKey(key))
    .map(toOption(locale))
    .sort((a, b) => a.key.localeCompare(b.key));

export const getArbitrationOptions = (
  eventTypes: Record<string, TrackableEntry>,
  locale: string,
): TrackableSelectOption[] =>
  Object.entries(eventTypes)
    .filter(([key]) => isArbitrationKey(key))
    .map(toOption(locale));
