'use client';
import './TimersPage.component.scss';

import type { FC, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

import Masonry from 'react-masonry-css';
import { useTranslation } from 'react-i18next';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import { useWorldstate } from '@/lib/providers/WorldstateProvider';
import { useHydratedTimersReady } from '@/lib/hooks/useHydratedTimersReady';
import OfflineBanner from '@/components/chrome/OfflineBanner';
import StaleDataBanner from '@/components/chrome/StaleDataBanner';
import HubLoadingIndicator from '@/components/ui/HubLoadingIndicator';
import CycleTimerDock from '@/components/cycles/CycleTimerDock';
import { shouldShowCycleTimers } from '@/lib/cycleTimerVisibility';
import { getDataMode } from '@/lib/test/dataMode';
import { isPlaceholderWorldstate } from '@/lib/worldstate/worldstatePlaceholder';
import { DEFAULT_MASONRY_PANEL_ORDER, type MasonryPanelKey } from '@/lib/timers/masonryPanels';
import { getRenderableTimerPanelKeys } from '@/lib/timers/getRenderableTimerPanels';
import { useNewsLcpPreload } from '@/lib/hooks/useNewsLcpPreload';
import type { HubNewsItem } from '@/lib/news/newsContent';
import { mergePanelLayout, splitPanelLayout, togglePanelInLayout } from '@/lib/timers/panelLayout';
import SortableTimerPanel from './SortableTimerPanel';
import TimerPanelPlaceholder from './TimerPanelPlaceholder';
import LazyTimerPanelContent from './LazyTimerPanelContent';
import TimersLayoutToolbar from './TimersLayoutToolbar';

const TimersEditLayout = dynamic(() => import('./TimersEditLayout'), { ssr: false });

/** Match legacy HubPanelWrap: sm=12 (1 col), lg=6 (2 col), xl=4 (3 col). */
const breakpointCols = { default: 3, 1199: 2, 991: 1 };

const TimersPage: FC = () => {
  const { t } = useTranslation();
  const { state: prefs, dispatch, prefsReady } = usePrefs();
  const { worldstate, initialFetchSettled, storageHydrated } = useWorldstate();
  const timersReady = useHydratedTimersReady(prefsReady, storageHydrated);
  const hasLiveWorldstate = !isPlaceholderWorldstate(worldstate);
  const dataReady = getDataMode() !== 'live' || hasLiveWorldstate || initialFetchSettled;
  const showContent = timersReady && dataReady;
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

  const syndicates = useMemo(() => ({ ostron, solaris, entrati }), [ostron, solaris, entrati]);

  useNewsLcpPreload(
    worldstate.news as HubNewsItem[] | undefined,
    prefs.locale,
    showContent && Boolean(components.news?.display),
  );

  const isPanelEnabled = useCallback((key: MasonryPanelKey) => components[key]?.display ?? false, [components]);

  const { activeKeys, hiddenKeys } = useMemo(
    () => splitPanelLayout(panelOrder, isPanelEnabled),
    [isPanelEnabled, panelOrder],
  );

  const renderablePanelKeys = useMemo(() => {
    if (!showContent) return [];
    return getRenderableTimerPanelKeys(
      activeKeys,
      components,
      worldstate,
      syndicates,
      prefs.fissurePlanets,
    );
  }, [activeKeys, components, prefs.fissurePlanets, syndicates, showContent, worldstate]);

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

  const togglePanelVisible = useCallback(
    (key: MasonryPanelKey) => {
      const enabled = components[key]?.display ?? false;
      const next = togglePanelInLayout(activeKeys, hiddenKeys, key, !enabled);
      persistLayout(next.activeKeys, next.hiddenKeys);
      dispatch({ type: 'SET_COMPONENT_DISPLAY', payload: [key, !enabled] });
    },
    [activeKeys, components, dispatch, hiddenKeys, persistLayout],
  );

  const panelContext = useMemo(
    () => ({ worldstate, components, ostron, solaris, entrati }),
    [components, entrati, ostron, solaris, worldstate],
  );

  const renderLazyPanel = useCallback(
    (panelKey: MasonryPanelKey, eagerIndex: number) => (
      <LazyTimerPanelContent {...panelContext} panelKey={panelKey} eagerIndex={eagerIndex} />
    ),
    [panelContext],
  );

  const renderPanelBody = useCallback(
    (key: MasonryPanelKey, { preview = false }: { preview?: boolean } = {}): ReactNode => {
      const config = components[key];
      const label = config?.displayName ?? key;
      const enabled = config?.display ?? false;

      if (!enabled && !preview) {
        return <TimerPanelPlaceholder label={label} compact />;
      }

      const eagerIndex = renderablePanelKeys.indexOf(key);
      return renderLazyPanel(key, eagerIndex < 0 ? Number.POSITIVE_INFINITY : eagerIndex);
    },
    [components, renderablePanelKeys, renderLazyPanel],
  );

  const viewSlots = renderablePanelKeys.map((key, index) => (
    <SortableTimerPanel key={key} id={key} editMode={false}>
      {renderLazyPanel(key, index)}
    </SortableTimerPanel>
  ));

  const viewGrid = (
    <Masonry breakpointCols={breakpointCols} className='masonry-grid' columnClassName='masonry-grid_column'>
      {viewSlots}
    </Masonry>
  );

  if (!showContent) {
    return (
      <div className='timers timers--loading'>
        <div className='hub-chrome-shell hub-timers-loading' role='status' aria-live='polite'>
          <HubLoadingIndicator label={t('timersPage.loading')} />
        </div>
      </div>
    );
  }

  return (
    <div className={`timers${editMode ? ' timers--layout-edit' : ''}`}>
      <OfflineBanner />
      <StaleDataBanner />
      {displayCycleTimers ? (
        <div className='hub-chrome-shell hub-cycle-timers-shell'>
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
      <div className='hub-chrome-shell grid hub-timers-grid'>
        {editMode ? (
          <TimersEditLayout
            components={components}
            activeKeys={activeKeys}
            hiddenKeys={hiddenKeys}
            activeDragKey={activeDragKey}
            overlayWidth={overlayWidth}
            onDragStart={(key, width) => {
              setActiveDragKey(key);
              setOverlayWidth(width);
            }}
            onDragEnd={clearDragState}
            onLayoutDragResult={(result) => {
              persistLayout(result.activeKeys, result.hiddenKeys);
              if (result.toggledKey !== undefined && result.toggledDisplay !== undefined) {
                dispatch({
                  type: 'SET_COMPONENT_DISPLAY',
                  payload: [result.toggledKey, result.toggledDisplay],
                });
              }
            }}
            onTogglePanelVisible={togglePanelVisible}
            renderPanelBody={renderPanelBody}
          />
        ) : (
          viewGrid
        )}
      </div>
    </div>
  );
};

export default TimersPage;
