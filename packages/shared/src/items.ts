import { API_BASE, get } from './utilities';

export type ItemImageLookup = {
  name: string;
  uniqueName: string;
  imageName: string;
};

export const fetchItemByUniqueName = (uniqueName: string): Promise<ItemImageLookup | undefined> =>
  get<ItemImageLookup>(
    `${API_BASE}/items/${encodeURIComponent(uniqueName)}?by=uniqueName&only=name,uniqueName,imageName`
  );
