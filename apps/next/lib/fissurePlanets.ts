import type { TFunction } from 'i18next';
import type { FissurePlanetEntry } from '@wfcd/shared';

export type FissurePlanetOption = {
  key: string;
  text: string;
};

export const getFissurePlanetOptions = (
  fissurePlanets: Record<string, FissurePlanetEntry>,
  t: TFunction,
): FissurePlanetOption[] =>
  Object.entries(fissurePlanets)
    .map(([key, planet]) => ({
      key,
      text: t(`planets.${key}`, { defaultValue: String(planet.text ?? key) }),
    }))
    .sort((a, b) => a.text.localeCompare(b.text, undefined, { sensitivity: 'base' }));

export const getHiddenFissurePlanetKeys = (fissurePlanets: Record<string, FissurePlanetEntry>): string[] =>
  Object.entries(fissurePlanets)
    .filter(([, planet]) => planet.state)
    .map(([key]) => key);
