'use client';

import type { FC, ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import type { ComponentsMap } from '@/lib/shared';
import type { MasonryPanelKey } from '@/lib/timers/masonryPanels';
import {
  ACTIVE_GRID_DROPPABLE_ID,
  applyPanelLayoutDrag,
  type PanelLayoutDragResult,
} from '@/lib/timers/panelLayout';
import SortableTimerPanel from './SortableTimerPanel';
import TimerPanelPlaceholder from './TimerPanelPlaceholder';
import TimersHiddenPanelPool from './TimersHiddenPanelPool';

const ActivePanelGrid: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({ id: ACTIVE_GRID_DROPPABLE_ID });

  return (
    <div
      ref={setNodeRef}
      className={['hub-timers-edit-grid', isOver ? 'hub-timers-edit-grid--over' : ''].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
};

type TimersEditLayoutProps = {
  components: ComponentsMap;
  activeKeys: MasonryPanelKey[];
  hiddenKeys: MasonryPanelKey[];
  activeDragKey: MasonryPanelKey | null;
  overlayWidth: number | null;
  onDragStart: (key: MasonryPanelKey, width: number | null) => void;
  onDragEnd: () => void;
  onLayoutDragResult: (result: Extract<PanelLayoutDragResult, { kind: 'update' }>) => void;
  onTogglePanelVisible: (key: MasonryPanelKey) => void;
  renderPanelBody: (key: MasonryPanelKey, options?: { preview?: boolean }) => ReactNode;
};

const TimersEditLayout: FC<TimersEditLayoutProps> = ({
  components,
  activeKeys,
  hiddenKeys,
  activeDragKey,
  overlayWidth,
  onDragStart,
  onDragEnd,
  onLayoutDragResult,
  onTogglePanelVisible,
  renderPanelBody,
}: TimersEditLayoutProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    onDragStart(String(active.id) as MasonryPanelKey, active.rect.current.initial?.width ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const draggedKey = String(active.id) as MasonryPanelKey;
    onDragEnd();
    if (!over) return;

    const result = applyPanelLayoutDrag({
      activeKeys,
      hiddenKeys,
      draggedKey,
      overId: String(over.id),
    });

    if (result.kind !== 'update') return;

    onLayoutDragResult(result);
  };

  const renderEditSlot = (key: MasonryPanelKey, { compact = false }: { compact?: boolean } = {}) => {
    const enabled = components[key]?.display ?? false;
    const label = components[key]?.displayName ?? key;

    return (
      <SortableTimerPanel
        key={key}
        id={key}
        editMode
        compact={compact}
        visible={enabled}
        onToggleVisible={() => onTogglePanelVisible(key)}
      >
        {compact || !enabled ? <TimerPanelPlaceholder label={label} compact={compact} /> : renderPanelBody(key)}
      </SortableTimerPanel>
    );
  };

  const activeSlots = activeKeys.map((key) => renderEditSlot(key));
  const hiddenSlots = hiddenKeys.map((key) => renderEditSlot(key, { compact: true }));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={onDragEnd}
    >
      <SortableContext id='timers-active' items={activeKeys} strategy={rectSortingStrategy}>
        <ActivePanelGrid>{activeSlots}</ActivePanelGrid>
      </SortableContext>

      <TimersHiddenPanelPool count={hiddenKeys.length}>
        <SortableContext id='timers-hidden' items={hiddenKeys} strategy={rectSortingStrategy}>
          {hiddenSlots}
        </SortableContext>
      </TimersHiddenPanelPool>

      <DragOverlay dropAnimation={null}>
        {activeDragKey ? (
          <div
            className={[
              'hub-timer-panel-overlay',
              hiddenKeys.includes(activeDragKey) ? 'hub-timer-panel-overlay--compact' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={overlayWidth ? { width: overlayWidth } : undefined}
          >
            {renderPanelBody(activeDragKey, { preview: true })}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TimersEditLayout;
