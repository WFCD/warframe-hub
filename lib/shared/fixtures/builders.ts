import type { WorldstateData } from '../types/worldstate';
import fullWorldstate from '../../fixtures/worldstate/full.json';
import timersFullOverrides from '../../fixtures/worldstate/timers-full.json';

type FullFixture = {
  pc: WorldstateData;
  ps4: WorldstateData;
  xb1: WorldstateData;
  swi: WorldstateData;
};

const full = fullWorldstate as FullFixture;

/** Non-placeholder timestamp so test/fixture worldstate hydrates and panels render. */
export const FIXTURE_WORLDSTATE_TIMESTAMP = '2026-07-08T12:00:00.000Z';

export const buildWorldstate = (overrides: Partial<WorldstateData> = {}): WorldstateData => ({
  ...(full.pc as WorldstateData),
  ...overrides,
});

export const buildFissures = (count: number): unknown[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `fissure-${i}`,
    node: `Node ${i}`,
    missionType: 'Exterminate',
    tier: 'Lith',
    enemy: 'Grineer',
    eta: '1h',
  }));

export const getFullWorldstateFixture = (): FullFixture => full;

export const buildEmptyFissuresWorldstate = (): WorldstateData =>
  buildWorldstate({ fissures: [] });

export const buildNightwaveActiveWorldstate = (): WorldstateData =>
  buildWorldstate({
    nightwave: {
      activeChallenges: [{ id: 'nw-1', title: 'Test Challenge', desc: 'Do a thing' }],
    },
  });

export const buildTimersFullWorldstate = (): WorldstateData =>
  buildWorldstate({
    ...(timersFullOverrides as Partial<WorldstateData>),
    timestamp: FIXTURE_WORLDSTATE_TIMESTAMP,
  });
