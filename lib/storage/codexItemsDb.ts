import type { CodexItem } from '@/lib/shared';
import { CODEX_ITEMS_STORE, runHubTx } from './hubDb';

type CodexItemsRecord = {
  locale: string;
  updatedAt: number;
  items: CodexItem[];
};

export type CodexItemsMeta = {
  locale: string;
  updatedAt: number;
  count: number;
};

export const readCodexItemsDb = async (locale: string): Promise<CodexItem[] | null> => {
  try {
    const record = await runHubTx<CodexItemsRecord | undefined>(CODEX_ITEMS_STORE, 'readonly', (store) =>
      new Promise((resolve, reject) => {
        const request = store.get(locale);
        request.onsuccess = () => resolve(request.result as CodexItemsRecord | undefined);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB read failed'));
      }),
    );
    return record?.items?.length ? record.items : null;
  } catch {
    return null;
  }
};

export const readCodexItemsMetaDb = async (locale: string): Promise<CodexItemsMeta | null> => {
  try {
    const record = await runHubTx<CodexItemsRecord | undefined>(CODEX_ITEMS_STORE, 'readonly', (store) =>
      new Promise((resolve, reject) => {
        const request = store.get(locale);
        request.onsuccess = () => resolve(request.result as CodexItemsRecord | undefined);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB read failed'));
      }),
    );
    if (!record) return null;
    return { locale: record.locale, updatedAt: record.updatedAt, count: record.items.length };
  } catch {
    return null;
  }
};

export const writeCodexItemsDb = async (locale: string, items: CodexItem[]): Promise<boolean> => {
  try {
    await runHubTx<IDBValidKey>(CODEX_ITEMS_STORE, 'readwrite', (store) =>
      new Promise((resolve, reject) => {
        const request = store.put({
          locale,
          updatedAt: Date.now(),
          items,
        } satisfies CodexItemsRecord);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB write failed'));
      }),
    );
    return true;
  } catch {
    return false;
  }
};

export const clearCodexItemsDb = async (): Promise<void> => {
  try {
    await runHubTx<undefined>(CODEX_ITEMS_STORE, 'readwrite', (store) =>
      new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve(undefined);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB clear failed'));
      }),
    );
  } catch {
    /* ignore */
  }
};
