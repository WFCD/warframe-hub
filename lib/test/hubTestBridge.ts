import { isHubTestMode } from './dataMode';

export type HubTestBridge = {
  openSettings: () => void;
  openAbout: () => void;
  openMenu: (key: string) => void;
};

declare global {
  interface Window {
    __hubTestBridge?: HubTestBridge;
  }
}

const menuOpeners = new Map<string, () => void>();

export const registerHubTestActions = (actions: {
  openSettings: () => void;
  openAbout: () => void;
}): void => {
  if (!isHubTestMode()) return;
  window.__hubTestBridge = {
    openSettings: actions.openSettings,
    openAbout: actions.openAbout,
    openMenu: (key: string) => {
      menuOpeners.get(key)?.();
    },
  };
};

export const registerHubTestMenu = (key: string, open: () => void): (() => void) => {
  if (!isHubTestMode()) return () => undefined;
  menuOpeners.set(key, open);
  return () => {
    menuOpeners.delete(key);
  };
};
