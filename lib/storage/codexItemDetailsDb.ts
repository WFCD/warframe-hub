import type { CodexItemDetail } from '@/lib/shared';
import { CODEX_ITEM_DETAILS_STORE, runHubTx } from './hubDb';

type CodexItemDetailRecord = {
  id: string;
  locale: string;
  uniqueName: string;
  updatedAt: number;
  detail: CodexItemDetail;
};

const detailId = (locale: string, uniqueName: string): string => `${locale}\0${uniqueName}`;

export const readCodexItemDetailDb = async (
  locale: string,
  uniqueName: string,
): Promise<CodexItemDetail | null> => {
  try {
    const record = await runHubTx<CodexItemDetailRecord | undefined>(CODEX_ITEM_DETAILS_STORE, 'readonly', (store) =>
      new Promise((resolve, reject) => {
        const request = store.get(detailId(locale, uniqueName));
        request.onsuccess = () => resolve(request.result as CodexItemDetailRecord | undefined);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB read failed'));
      }),
    );
    return record?.detail ?? null;
  } catch {
    return null;
  }
};

export const writeCodexItemDetailDb = async (
  locale: string,
  uniqueName: string,
  detail: CodexItemDetail,
): Promise<boolean> => {
  try {
    await runHubTx<IDBValidKey>(CODEX_ITEM_DETAILS_STORE, 'readwrite', (store) =>
      new Promise((resolve, reject) => {
        const request = store.put({
          id: detailId(locale, uniqueName),
          locale,
          uniqueName,
          updatedAt: Date.now(),
          detail,
        } satisfies CodexItemDetailRecord);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB write failed'));
      }),
    );
    return true;
  } catch {
    return false;
  }
};
