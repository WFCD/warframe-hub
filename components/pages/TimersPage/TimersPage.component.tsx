'use client';
import './TimersPage.component.scss';

import type { FC, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import Masonry from 'react-masonry-css';
import { Card } from '@heroui/react';
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
import { usePrefs } from '@/lib/providers/PrefsProvider';
import { useWorldstate } from '@/lib/providers/WorldstateProvider';
import OfflineBanner from '@/components/chrome/OfflineBanner';
import StaleDataBanner from '@/components/chrome/StaleDataBanner';
import CycleTimerDock from '@/components/cycles/CycleTimerDock';
import { shouldShowCycleTimers } from '@/lib/cycleTimerVisibility';
import { DEFAULT_MASONRY_PANEL_ORDER, type MasonryPanelKey } from '@/lib/timers/masonryPanels';
import { isTimerPanelVisible } from '@/lib/timers/timerPanelVisibility';
import { renderTimerPanel } from '@/lib/timers/renderTimerPanel';
import {
  ACTIVE_GRID_DROPPABLE_ID,
  applyPanelLayoutDrag,
  mergePanelLayout,
  splitPanelLayout,
  togglePanelInLayout,
} from '@/lib/timers/panelLayout';
import SortableTimerPanel from './SortableTimerPanel';
import TimerPanelPlaceholder from './TimerPanelPlaceholder';
import TimersHiddenPanelPool from './TimersHiddenPanelPool';
import TimersLayoutToolbar from './TimersLayoutToolbar';

/** Match legacy HubPanelWrap: sm=12 (1 col), lg=6 (2 col), xl=4 (3 col). */
const breakpointCols = { default: 3, 1199: 2, 991: 1 };

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

const TimersPage: FC = () => {
  const { state: prefs, dispatch } = usePrefs();
  const { worldstate } = useWorldstate();
  const [editMode, setEditMode] = useState(false);
  const [activeDragKey, setActiveDragKey] = useState<MasonryPanelKey | null>(null);
  const [overlayWidth, setOverlayWidth] = useState<number | null>(null);
  const components = prefs.components;

  const syndicateMissions = (worldstate.syndicateMissions as Array<{ id: string }> | undefined) ?? [];
  const ostron = syndicateMissions.find((s) => s.id.includes('CetusSyndicate'));
  const solaris = syndicateMissions.find((s) => s.id.includes('SolarisSyndicate'));
  const entrati = syndicateMissions.find((s) => s.id.includes('EntratiSyndicate'));

  const displayCycleTimers = shouldShowCycleTimers(components, worldstate);

  const panelOrder = useMemo(() => {
    const order = prefs.componentOrder?.length ? prefs.componentOrder : DEFAULT_MASONRY_PANEL_ORDER;
    return order.filter((key): key is MasonryPanelKey => components[key]?.displayable !== false);
  }, [components, prefs.componentOrder]);

  const isPanelEnabled = useCallback((key: MasonryPanelKey) => components[key]?.display ?? false, [components]);

  const { activeKeys, hiddenKeys } = useMemo(
    () => splitPanelLayout(panelOrder, isPanelEnabled),
    [isPanelEnabled, panelOrder],
  );

  const syndicates = { ostron, solaris, entrati };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const clearDragState = () => {
    setActiveDragKey(null);
    setOverlayWidth(null);
  };

  const persistLayout = useCallback(
    (nextActive: MasonryPanelKey[], nextHidden: MasonryPanelKey[]) => {
      dispatch({ type: 'SET_COMPONENT_ORDER', payload: mergePanelLayout(nextActive, nextHidden) });
    },
    [dispatch],
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveDragKey(String(active.id) as MasonryPanelKey);
    setOverlayWidth(active.rect.current.initial?.width ?? null);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const draggedKey = String(active.id) as MasonryPanelKey;
    clearDragState();
    if (!over) return;

    const result = applyPanelLayoutDrag({
      activeKeys,
      hiddenKeys,
      draggedKey,
      overId: String(over.id),
    });

    if (result.kind !== 'update') return;

    persistLayout(result.activeKeys, result.hiddenKeys);
    if (result.toggledKey !== undefined && result.toggledDisplay !== undefined) {
      dispatch({
        type: 'SET_COMPONENT_DISPLAY',
        payload: [result.toggledKey, result.toggledDisplay],
      });
    }
  };

  const togglePanelVisible = useCallback(
    (key: MasonryPanelKey) => {
      const enabled = components[key]?.display ?? false;
      const next = togglePanelInLayout(activeKeys, hiddenKeys, key, !enabled);
      persistLayout(next.activeKeys, next.hiddenKeys);
      dispatch({ type: 'SET_COMPONENT_DISPLAY', payload: [key, !enabled] });
    },
    [activeKeys, components, dispatch, hiddenKeys, persistLayout],
  );

  const renderPanelBody = useCallback(
    (key: MasonryPanelKey, { preview = false }: { preview?: boolean } = {}): ReactNode => {
      const config = components[key];
      const label = config?.displayName ?? key;
      const enabled = config?.display ?? false;

      if (!enabled && !preview) {
        return <TimerPanelPlaceholder label={label} compact />;
      }

      const panel = renderTimerPanel({ key, worldstate, components, ostron, solaris, entrati });
      if (panel) return panel;

      return (
        <Card className="hub-panel-surface binpacker-item">
          <Card.Content className="hub-timer-panel-inactive">
            {label} — not active right now, but you can still place it here.
          </Card.Content>
        </Card>
      );
    },
    [components, entrati, ostron, solaris, worldstate],
  );

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
        onToggleVisible={() => togglePanelVisible(key)}
      >
        {compact || !enabled ? <TimerPanelPlaceholder label={label} compact={compact} /> : renderPanelBody(key)}
      </SortableTimerPanel>
    );
  };

  const activeSlots = activeKeys.map((key) => renderEditSlot(key));
  const hiddenSlots = hiddenKeys.map((key) => renderEditSlot(key, { compact: true }));

  const viewSlots = panelOrder.map((key) => {
    if (!isTimerPanelVisible(key, components, worldstate, syndicates)) return null;

    return (
      <SortableTimerPanel key={key} id={key} editMode={false}>
        {renderTimerPanel({ key, worldstate, components, ostron, solaris, entrati })}
      </SortableTimerPanel>
    );
  });

  const editGrid = (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={clearDragState}
    >
      <SortableContext id="timers-active" items={activeKeys} strategy={rectSortingStrategy}>
        <ActivePanelGrid>{activeSlots}</ActivePanelGrid>
      </SortableContext>

      <TimersHiddenPanelPool count={hiddenKeys.length}>
        <SortableContext id="timers-hidden" items={hiddenKeys} strategy={rectSortingStrategy}>
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

  const viewGrid = (
    <Masonry breakpointCols={breakpointCols} className="masonry-grid" columnClassName="masonry-grid_column">
      {viewSlots}
    </Masonry>
  );

  return (
    <div className={`timers${editMode ? ' timers--layout-edit' : ''}`}>
      <OfflineBanner />
      <StaleDataBanner />
      {displayCycleTimers ? (
        <div className="hub-chrome-shell hub-cycle-timers-shell">
          <CycleTimerDock worldstate={worldstate} />
        </div>
      ) : null}
      <TimersLayoutToolbar
        editMode={editMode}
        onToggleEditMode={() => {
          clearDragState();
          setEditMode((on) => !on);
        }}
      />
      <div className="hub-chrome-shell grid hub-timers-grid">{editMode ? editGrid : viewGrid}</div>
    </div>
  );
};

export default TimersPage;
