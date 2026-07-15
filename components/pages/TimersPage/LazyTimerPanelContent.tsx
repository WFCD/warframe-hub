'use client';

import { memo, useEffect, useRef, useState, type FC } from 'react';
import type { TimerPanelRenderContext } from '@/lib/timers/renderTimerPanel';
import { loadTimerPanelComponent, type TimerPanelComponent } from '@/lib/timers/timerPanelImports';
import { shouldRenderTimerPanelContent } from '@/lib/timers/isTimerPanelDataReady';
import { getDataMode } from '@/lib/test/dataMode';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import NewsPanel from '@/components/panels/worldstate/NewsPanel';
import TimerPanelBody from '@/lib/timers/TimerPanelBody';
import TimerPanelLoadingShell from './TimerPanelLoadingShell';

const EAGER_PANEL_COUNT = 1;
const VIEWPORT_ROOT_MARGIN = '120px';
const eagerLoadAllPanels = () => getDataMode() !== 'live';

type LazyTimerPanelContentProps = TimerPanelRenderContext & {
  eagerIndex?: number;
};

const LazyTimerPanelContent: FC<LazyTimerPanelContentProps> = ({
  eagerIndex = Number.POSITIVE_INFINITY,
  panelKey,
  components,
  ...panelContext
}: LazyTimerPanelContentProps) => {
  const { state: prefs } = usePrefs();
  const label = components[panelKey]?.displayName ?? panelKey;
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoadChunk, setShouldLoadChunk] = useState(false);
  const [Panel, setPanel] = useState<TimerPanelComponent | null>(null);
  const [chunkError, setChunkError] = useState(false);

  const syndicates = {
    ostron: panelContext.ostron,
    solaris: panelContext.solaris,
    entrati: panelContext.entrati,
  };
  const fissurePlanets = prefs.fissurePlanets;
  const canRender = shouldRenderTimerPanelContent(
    panelKey,
    panelContext.worldstate,
    syndicates,
    fissurePlanets,
  );
  const loadAllPanels = eagerLoadAllPanels();
  const isEagerNews = panelKey === 'news' && eagerIndex < EAGER_PANEL_COUNT;
  const shouldEagerLoad = loadAllPanels || isEagerNews || eagerIndex < EAGER_PANEL_COUNT;

  useEffect(() => {
    if (!canRender) {
      setShouldLoadChunk(false);
      return;
    }

    if (shouldEagerLoad) {
      setShouldLoadChunk(true);
    }
  }, [canRender, shouldEagerLoad]);

  useEffect(() => {
    if (!canRender || shouldLoadChunk || isEagerNews || loadAllPanels) return;

    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadChunk(true);
        observer.disconnect();
      },
      { rootMargin: VIEWPORT_ROOT_MARGIN },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [canRender, shouldLoadChunk, isEagerNews, loadAllPanels]);

  useEffect(() => {
    if (!canRender || !shouldLoadChunk || Panel || chunkError || isEagerNews) return;

    let cancelled = false;

    void loadTimerPanelComponent(panelKey)
      .then((loaded) => {
        if (!cancelled) setPanel(() => loaded);
      })
      .catch(() => {
        if (!cancelled) setChunkError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [canRender, shouldLoadChunk, panelKey, Panel, chunkError, isEagerNews]);

  if (!canRender) return null;

  if (isEagerNews) {
    return (
      <div ref={hostRef} className='hub-timer-panel-lazy-host'>
        <TimerPanelBody panelKey='news' Panel={NewsPanel as TimerPanelComponent} components={components} {...panelContext} />
      </div>
    );
  }

  if (!Panel) {
    return (
      <div ref={hostRef} className='hub-timer-panel-lazy-host'>
        <TimerPanelLoadingShell label={label} />
      </div>
    );
  }

  return (
    <div ref={hostRef} className='hub-timer-panel-lazy-host'>
      <TimerPanelBody panelKey={panelKey} Panel={Panel} components={components} {...panelContext} />
    </div>
  );
};

export default memo(LazyTimerPanelContent);
