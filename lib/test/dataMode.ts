export type DataMode = 'live' | 'fixture' | 'injected';

export const getDataMode = (): DataMode => {
  if (typeof window === 'undefined') return 'live';
  const params = new URLSearchParams(window.location.search);
  if (params.get('hubTest') === '1') return params.get('fixture') ? 'fixture' : 'injected';
  if (window.localStorage.getItem('hub.test.override')) return 'injected';
  return 'live';
};

export const isTestMode = (): boolean => getDataMode() !== 'live';
