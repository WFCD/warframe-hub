export const makeid = (): string => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const cdn = (path: string): string => `https://cdn.warframestat.us/genesis/${path}`;

export const wfcdn = (imgName: string): string => `https://cdn.warframestat.us/img/${imgName}`;

export const optimize = (img: string, size?: string, mode = 'fit', direction = 'auto'): string => {
  const fsize = size ? `rs_${size}_${mode}_${direction},` : '';
  return `https://cdn.warframestat.us/${fsize}o_webp,progressive_true/${img}`;
};

export const get = async <T = unknown>(url: string, opts?: RequestInit): Promise<T | undefined> => {
  try {
    const res = await fetch(url, opts);
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
};

export const API_BASE = 'https://api.warframestat.us';

/** Bounty rewardPool lists repeat entries per tier — keep first-seen order. */
export const dedupeRewardPool = (rewards?: readonly string[]): string[] => {
  if (!rewards?.length) return [];
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const reward of rewards) {
    if (seen.has(reward)) continue;
    seen.add(reward);
    unique.push(reward);
  }
  return unique;
};
