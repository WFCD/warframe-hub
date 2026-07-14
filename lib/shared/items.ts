import { API_BASE, get } from './utilities';
import type { CodexItem, CodexItemDetail } from './types/codex';

export type ItemImageLookup = {
  name: string;
  uniqueName: string;
  imageName: string;
};

export const CODEX_ITEM_FIELDS = 'name,uniqueName,type,category,tradable,masterable,imageName';
export const CODEX_ITEM_EXCLUDE = 'patchlogs,components';
/** Full WFCD catalog is ~17k; legacy vuex cache was only warframes/weapons/mods. */
export const MIN_CODEX_ITEMS = 10_000;

export const fetchCodexItems = (locale: string): Promise<CodexItem[] | undefined> =>
  get<CodexItem[]>(
    `${API_BASE}/items?only=${CODEX_ITEM_FIELDS}&remove=${CODEX_ITEM_EXCLUDE}&language=${encodeURIComponent(locale)}`,
  );

export const searchCodexItems = (query: string, locale: string): Promise<CodexItem[] | undefined> =>
  get<CodexItem[]>(
    `${API_BASE}/items/search/${encodeURIComponent(query)}?only=${CODEX_ITEM_FIELDS}&remove=${CODEX_ITEM_EXCLUDE}&language=${encodeURIComponent(locale)}`,
  );

export const fetchItemByUniqueName = (uniqueName: string): Promise<ItemImageLookup | undefined> =>
  get<ItemImageLookup>(
    `${API_BASE}/items/${encodeURIComponent(uniqueName)}?by=uniqueName&only=name,uniqueName,imageName`
  );

export const fetchCodexItemDetail = (uniqueName: string, locale: string): Promise<CodexItemDetail | undefined> =>
  get<CodexItemDetail>(
    `${API_BASE}/items/${encodeURIComponent(uniqueName)}?by=uniqueName&remove=patchlogs&language=${encodeURIComponent(locale)}`,
  );
