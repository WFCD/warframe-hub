'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import HubLoadingIndicator from '@/components/ui/HubLoadingIndicator';
import { useContentPageLoadingGate } from '@/lib/hooks/useContentPageLoadingGate';

type ContentPageLoadContextValue = {
  setContentLoading: (loading: boolean) => void;
  setChunkLoading: (loading: boolean) => void;
};

const ContentPageLoadContext = createContext<ContentPageLoadContextValue | null>(null);

export const HubPageLoadingShell: FC = () => (
  <div className="hub-page-loading-shell">
    <HubLoadingIndicator />
  </div>
);

export const ContentPageChunkGate: FC<{ children: ReactNode }> = ({ children }) => {
  const ctx = useContext(ContentPageLoadContext);

  useEffect(() => {
    ctx?.setChunkLoading(false);
    return () => ctx?.setChunkLoading(true);
  }, [ctx]);

  return children;
};

export const ContentPageLoadProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [chunkLoading, setChunkLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const showLoader = chunkLoading || contentLoading;

  const value = useMemo(
    () => ({ setContentLoading, setChunkLoading }),
    [setContentLoading, setChunkLoading],
  );

  return (
    <ContentPageLoadContext.Provider value={value}>
      {showLoader ? <HubPageLoadingShell /> : null}
      <div hidden={showLoader}>{children}</div>
    </ContentPageLoadContext.Provider>
  );
};

/** Report content fetch gate to outer page shell; returns same loading flag for local UI. */
export const useContentPageLoadReporting = (dataReady: boolean): boolean => {
  const ctx = useContext(ContentPageLoadContext);
  const showLoading = useContentPageLoadingGate(dataReady);

  useEffect(() => {
    ctx?.setContentLoading(showLoading);
    return () => ctx?.setContentLoading(false);
  }, [ctx, showLoading]);

  return showLoading;
};
