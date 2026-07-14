'use client';

import { useEffect, useRef, useState } from 'react';

export const CONTENT_PAGE_MIN_LOADING_MS = 2000;

/** Hold content-page loader up to minMs when mount had no data; skip if cache already warm. */
export const useContentPageLoadingGate = (
  dataReady: boolean,
  minMs = CONTENT_PAGE_MIN_LOADING_MS,
): boolean => {
  const mountedWithData = useRef(dataReady);
  const loadingStartedAt = useRef<number | null>(null);
  const [showLoading, setShowLoading] = useState(() => !mountedWithData.current);

  useEffect(() => {
    if (mountedWithData.current) {
      setShowLoading(false);
      return;
    }

    if (!dataReady) {
      loadingStartedAt.current ??= Date.now();
      setShowLoading(true);
      return;
    }

    const startedAt = loadingStartedAt.current ?? Date.now();
    const remaining = Math.max(0, minMs - (Date.now() - startedAt));

    if (remaining === 0) {
      setShowLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(() => setShowLoading(false), remaining);
    return () => window.clearTimeout(timeoutId);
  }, [dataReady, minMs]);

  return showLoading;
};
