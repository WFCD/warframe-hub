export const DB_NAME = 'hub-v1';
export const DB_VERSION = 2;
export const CODEX_ITEMS_STORE = 'codex-items';
export const CODEX_ITEM_DETAILS_STORE = 'codex-item-details';

export const openHubDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CODEX_ITEMS_STORE)) {
        db.createObjectStore(CODEX_ITEMS_STORE, { keyPath: 'locale' });
      }
      if (!db.objectStoreNames.contains(CODEX_ITEM_DETAILS_STORE)) {
        db.createObjectStore(CODEX_ITEM_DETAILS_STORE, { keyPath: 'id' });
      }
    };
  });

export const runHubTx = <T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => Promise<T> | T,
): Promise<T> =>
  openHubDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);

        Promise.resolve(fn(store))
          .then((result) => {
            tx.oncomplete = () => resolve(result);
          })
          .catch(reject);
        tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
      }),
  );
