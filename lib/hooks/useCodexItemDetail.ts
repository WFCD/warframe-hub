'use client';

import { useEffect, useState } from 'react';
import type { CodexItemDetail } from '@/lib/shared';
import { fetchCodexItemDetail } from '@/lib/shared';
import { readCodexItemDetailDb, writeCodexItemDetailDb } from '@/lib/storage/codexItemDetailsDb';

export type CodexItemDetailStatus = 'idle' | 'loading' | 'ready' | 'error';

export const useCodexItemDetail = (
  uniqueName: string,
  locale: string,
  enabled: boolean,
): { detail: CodexItemDetail | null; status: CodexItemDetailStatus } => {
  const [detail, setDetail] = useState<CodexItemDetail | null>(null);
  const [status, setStatus] = useState<CodexItemDetailStatus>('idle');

  useEffect(() => {
    if (!enabled || !uniqueName) {
      setDetail(null);
      setStatus('idle');
      return;
    }

    let cancelled = false;

    void (async () => {
      setStatus('loading');

      const cached = await readCodexItemDetailDb(locale, uniqueName);
      if (cached) {
        if (!cancelled) {
          setDetail(cached);
          setStatus('ready');
        }
        return;
      }

      const fetched = await fetchCodexItemDetail(uniqueName, locale);
      if (!fetched) {
        if (!cancelled) setStatus('error');
        return;
      }

      await writeCodexItemDetailDb(locale, uniqueName, fetched);
      if (!cancelled) {
        setDetail(fetched);
        setStatus('ready');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, locale, uniqueName]);

  return { detail, status };
};
