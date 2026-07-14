import type { FissurePanelKey } from './fissurePanelMigration';

export type WorldstateFissure = {
  node: string;
  expired?: boolean;
  isStorm?: boolean;
  isHard?: boolean;
};

const matchesFissureVariant = (fissure: WorldstateFissure, variant: FissurePanelKey): boolean => {
  if (fissure.expired) return false;
  if (variant === 'voidStorms') return Boolean(fissure.isStorm);
  if (variant === 'steelPathFissures') return Boolean(fissure.isHard);
  return !fissure.isStorm && !fissure.isHard;
};

export const filterFissuresForPanel = (
  fissures: WorldstateFissure[] | undefined,
  variant: FissurePanelKey,
  fissurePlanets: Record<string, { state?: boolean }> | undefined,
): WorldstateFissure[] => {
  const list = fissures ?? [];
  const hiddenPlanets: string[] = [];

  if (fissurePlanets) {
    Object.keys(fissurePlanets).forEach((planet) => {
      if (fissurePlanets[planet]?.state) hiddenPlanets.push(planet);
    });
  }

  const planetFilter = hiddenPlanets.length > 0 ? new RegExp(`(${hiddenPlanets.join('|')})`, 'i') : null;

  return list.filter((fissure) => {
    if (!matchesFissureVariant(fissure, variant)) return false;
    if (!planetFilter) return true;
    return !planetFilter.test(fissure.node);
  });
};

export const hasFissuresForPanel = (
  fissures: WorldstateFissure[] | undefined,
  variant: FissurePanelKey,
  fissurePlanets: Record<string, { state?: boolean }> | undefined,
): boolean => filterFissuresForPanel(fissures, variant, fissurePlanets).length > 0;
