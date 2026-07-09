'use client';

import { useCallback, useMemo, useState } from 'react';

export type FishSortDirection = 'asc' | 'desc';

export type FishSortState = {
  column: string;
  direction: FishSortDirection;
};

export type FishSortValue = string | number | boolean;

export function parseFishRarity(rarity: string): number | string {
  const match = /^(\d+)-/.exec(rarity);
  return match ? Number.parseInt(match[1]!, 10) : rarity;
}

export function parseFishMass(value: string): number | string {
  const match = /^([\d.]+)/.exec(value);
  return match ? Number.parseFloat(match[1]!) : value;
}

export function poeSpearTier(spear: { lanzo?: boolean; tulok?: boolean; peram?: boolean }) {
  if (spear.lanzo) return 1;
  if (spear.tulok) return 2;
  if (spear.peram) return 3;
  return 4;
}

export function deimosSpearTier(spear: { spari?: boolean; ebisu?: boolean }) {
  if (spear.spari) return 1;
  if (spear.ebisu) return 2;
  return 3;
}

export function compareFishValues(a: FishSortValue, b: FishSortValue): number {
  if (typeof a === 'boolean' || typeof b === 'boolean') {
    return Number(a) - Number(b);
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function useFishTableSort<T extends { name: string }>(
  data: T[],
  accessors: Record<string, (item: T) => FishSortValue>
) {
  const [sort, setSort] = useState<FishSortState | null>(null);

  const toggleSort = useCallback(
    (column: string) => {
      if (!accessors[column]) return;
      setSort((prev) => {
        if (prev?.column !== column) return { column, direction: 'asc' };
        return { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      });
    },
    [accessors]
  );

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const access = accessors[sort.column];
    if (!access) return data;

    return [...data].sort((left, right) => {
      let cmp = compareFishValues(access(left), access(right));
      if (cmp === 0) cmp = compareFishValues(left.name, right.name);
      return sort.direction === 'desc' ? -cmp : cmp;
    });
  }, [accessors, data, sort]);

  return { sortedData, sort, toggleSort };
}
