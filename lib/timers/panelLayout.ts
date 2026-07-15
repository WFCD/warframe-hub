import type { MasonryPanelKey } from '@/lib/timers/masonryPanels';

export const ACTIVE_GRID_DROPPABLE_ID = 'timers-active-grid';
export const HIDDEN_POOL_DROPPABLE_ID = 'timers-hidden-pool';

export type PanelLayoutContainer = 'active' | 'hidden';

export const splitPanelLayout = (
  order: MasonryPanelKey[],
  isEnabled: (key: MasonryPanelKey) => boolean,
): { activeKeys: MasonryPanelKey[]; hiddenKeys: MasonryPanelKey[] } => {
  const activeKeys: MasonryPanelKey[] = [];
  const hiddenKeys: MasonryPanelKey[] = [];

  for (const key of order) {
    if (isEnabled(key)) activeKeys.push(key);
    else hiddenKeys.push(key);
  }

  return { activeKeys, hiddenKeys };
};

export const mergePanelLayout = (activeKeys: MasonryPanelKey[], hiddenKeys: MasonryPanelKey[]): MasonryPanelKey[] => [
  ...activeKeys,
  ...hiddenKeys,
];

export const resolvePanelContainer = (
  id: string,
  activeKeys: MasonryPanelKey[],
  hiddenKeys: MasonryPanelKey[],
): PanelLayoutContainer | null => {
  if (id === ACTIVE_GRID_DROPPABLE_ID || activeKeys.includes(id as MasonryPanelKey)) return 'active';
  if (id === HIDDEN_POOL_DROPPABLE_ID || hiddenKeys.includes(id as MasonryPanelKey)) return 'hidden';
  return null;
};

export type PanelLayoutDragResult =
  | { kind: 'noop' }
  | {
    kind: 'update';
    activeKeys: MasonryPanelKey[];
    hiddenKeys: MasonryPanelKey[];
    toggledKey?: MasonryPanelKey;
    toggledDisplay?: boolean;
  };

/** Apply a drag-end between active grid slots and the hidden pool. */
export const applyPanelLayoutDrag = ({
  activeKeys,
  hiddenKeys,
  draggedKey,
  overId,
}: {
  activeKeys: MasonryPanelKey[];
  hiddenKeys: MasonryPanelKey[];
  draggedKey: MasonryPanelKey;
  overId: string;
}): PanelLayoutDragResult => {
  if (draggedKey === overId) return { kind: 'noop' };

  const from = activeKeys.includes(draggedKey) ? 'active' : hiddenKeys.includes(draggedKey) ? 'hidden' : null;
  const to = resolvePanelContainer(overId, activeKeys, hiddenKeys);

  if (!from || !to) return { kind: 'noop' };

  if (from === 'active' && to === 'active') {
    const oldIndex = activeKeys.indexOf(draggedKey);
    const newIndex = activeKeys.indexOf(overId as MasonryPanelKey);
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return { kind: 'noop' };
    const next = [...activeKeys];
    const [item] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, item);
    return { kind: 'update', activeKeys: next, hiddenKeys };
  }

  if (from === 'hidden' && to === 'hidden') {
    const oldIndex = hiddenKeys.indexOf(draggedKey);
    const newIndex = hiddenKeys.indexOf(overId as MasonryPanelKey);
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return { kind: 'noop' };
    const next = [...hiddenKeys];
    const [item] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, item);
    return { kind: 'update', activeKeys, hiddenKeys: next };
  }

  if (from === 'active' && to === 'hidden') {
    const nextActive = activeKeys.filter((key) => key !== draggedKey);
    const nextHidden = [...hiddenKeys];
    const insertAt = hiddenKeys.includes(overId as MasonryPanelKey)
      ? hiddenKeys.indexOf(overId as MasonryPanelKey)
      : nextHidden.length;
    nextHidden.splice(insertAt, 0, draggedKey);
    return {
      kind: 'update',
      activeKeys: nextActive,
      hiddenKeys: nextHidden,
      toggledKey: draggedKey,
      toggledDisplay: false,
    };
  }

  if (from === 'hidden' && to === 'active') {
    const nextHidden = hiddenKeys.filter((key) => key !== draggedKey);
    const nextActive = [...activeKeys];
    const insertAt = activeKeys.includes(overId as MasonryPanelKey)
      ? activeKeys.indexOf(overId as MasonryPanelKey)
      : nextActive.length;
    nextActive.splice(insertAt, 0, draggedKey);
    return {
      kind: 'update',
      activeKeys: nextActive,
      hiddenKeys: nextHidden,
      toggledKey: draggedKey,
      toggledDisplay: true,
    };
  }

  return { kind: 'noop' };
};

export const togglePanelInLayout = (
  activeKeys: MasonryPanelKey[],
  hiddenKeys: MasonryPanelKey[],
  key: MasonryPanelKey,
  enabled: boolean,
): { activeKeys: MasonryPanelKey[]; hiddenKeys: MasonryPanelKey[] } => {
  if (enabled) {
    return {
      activeKeys: activeKeys.includes(key) ? activeKeys : [...activeKeys, key],
      hiddenKeys: hiddenKeys.filter((k) => k !== key),
    };
  }

  return {
    activeKeys: activeKeys.filter((k) => k !== key),
    hiddenKeys: hiddenKeys.includes(key) ? hiddenKeys : [...hiddenKeys, key],
  };
};
