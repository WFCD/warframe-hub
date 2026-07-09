'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';

export type PageChromeConfig = {
  label?: ReactNode;
  controls: ReactNode;
};

type PageChromeContextValue = {
  collapsed: boolean;
  config: PageChromeConfig | null;
  register: (config: PageChromeConfig) => void;
  unregister: () => void;
  setAnchorEl: (el: HTMLElement | null) => void;
};

const PageChromeContext = createContext<PageChromeContextValue | null>(null);

const readDockLinePx = () => {
  const shell = document.querySelector('.hub-navbar-shell');
  if (!shell) return 64;
  return Math.ceil(shell.getBoundingClientRect().bottom);
};

export const PageChromeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PageChromeConfig | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorReady, setAnchorReady] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);

  const register = useCallback((next: PageChromeConfig) => {
    setConfig(next);
  }, []);

  const unregister = useCallback(() => {
    setConfig(null);
    setCollapsed(false);
    anchorRef.current = null;
    setAnchorReady(false);
  }, []);

  const setAnchorEl = useCallback((el: HTMLElement | null) => {
    if (anchorRef.current === el) return;
    anchorRef.current = el;
    setAnchorReady(el !== null);
  }, []);

  const hasChrome = config !== null;

  useEffect(() => {
    if (!hasChrome || !anchorReady || !anchorRef.current) {
      setCollapsed(false);
      return;
    }

    const anchorEl = anchorRef.current;

    const updateCollapsed = () => {
      const dockLine = readDockLinePx();
      const { bottom } = anchorEl.getBoundingClientRect();
      const nextCollapsed = bottom <= dockLine + 1;
      setCollapsed((prev) => (prev === nextCollapsed ? prev : nextCollapsed));
    };

    updateCollapsed();
    window.addEventListener('scroll', updateCollapsed, { passive: true });
    window.addEventListener('resize', updateCollapsed);
    return () => {
      window.removeEventListener('scroll', updateCollapsed);
      window.removeEventListener('resize', updateCollapsed);
    };
  }, [hasChrome, anchorReady]);

  const value = useMemo(
    () => ({
      collapsed,
      config,
      register,
      unregister,
      setAnchorEl,
    }),
    [collapsed, config, register, unregister, setAnchorEl]
  );

  return <PageChromeContext.Provider value={value}>{children}</PageChromeContext.Provider>;
};

export const usePageChromeContext = () => useContext(PageChromeContext);
