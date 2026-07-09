export type Platform = 'pc' | 'ps4' | 'xb1' | 'switch';

export const PLATFORMS: Platform[] = ['pc', 'ps4', 'xb1', 'switch'];

/** Legacy JSON / vuex used `swi`; runtime state uses `switch`. */
export const normalizePlatform = (platform: string | undefined): Platform => {
  if (platform === 'swi' || platform === 'switch') return 'switch';
  if (platform === 'ps4' || platform === 'xb1' || platform === 'pc') return platform;
  return 'pc';
};
