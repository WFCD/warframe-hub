'use client';

import { useCallback, useEffect, useState } from 'react';
import { debouncedWriteStorage, readStorage } from '@/lib/providers/storageUtils';

const CODEX_QUERY_KEY = 'hub.v1.codex.query';

export type CodexQueryState = {
  filter: string;
  selectedTypes: string[];
  selectedCategories: string[];
  currentPage: number;
};

const emptyCodexQuery = (): CodexQueryState => ({
  filter: '',
  selectedTypes: [],
  selectedCategories: [],
  currentPage: 1,
});

const parseListParam = (value: string | null): string[] =>
  value
    ?.split(',')
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];

export const parseCodexQuery = (search: string): CodexQueryState => {
  const params = new URLSearchParams(search);
  const currentPage = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1);

  return {
    filter: params.get('q') ?? '',
    selectedTypes: parseListParam(params.get('types')),
    selectedCategories: parseListParam(params.get('categories')),
    currentPage,
  };
};

const hasCodexQuery = (state: CodexQueryState): boolean =>
  Boolean(state.filter.trim()) ||
  state.selectedTypes.length > 0 ||
  state.selectedCategories.length > 0 ||
  state.currentPage > 1;

const readInitialCodexQuery = (): CodexQueryState => {
  if (typeof window === 'undefined') return emptyCodexQuery();

  const fromUrl = parseCodexQuery(window.location.search);
  if (hasCodexQuery(fromUrl)) return fromUrl;

  return readStorage<CodexQueryState>(CODEX_QUERY_KEY) ?? emptyCodexQuery();
};

const syncCodexQueryUrl = (state: CodexQueryState): void => {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const q = state.filter.trim();

  if (q) params.set('q', q);
  else params.delete('q');

  if (state.selectedTypes.length) params.set('types', state.selectedTypes.join(','));
  else params.delete('types');

  if (state.selectedCategories.length) params.set('categories', state.selectedCategories.join(','));
  else params.delete('categories');

  if (state.currentPage > 1) params.set('page', String(state.currentPage));
  else params.delete('page');

  const nextSearch = params.toString();
  const nextUrl = nextSearch ? `${window.location.pathname}?${nextSearch}` : window.location.pathname;
  const currentUrl = `${window.location.pathname}${window.location.search}`;

  if (nextUrl !== currentUrl) {
    window.history.replaceState(window.history.state, '', nextUrl);
  }
};

export const useCodexQueryState = () => {
  const [state, setState] = useState<CodexQueryState>(readInitialCodexQuery);

  useEffect(() => {
    syncCodexQueryUrl(state);
    debouncedWriteStorage(CODEX_QUERY_KEY, state);
  }, [state]);

  useEffect(() => {
    const onPopState = () => {
      setState(parseCodexQuery(window.location.search));
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setFilter = useCallback((filter: string) => {
    setState((prev) => ({ ...prev, filter, currentPage: 1 }));
  }, []);

  const setSelectedTypes = useCallback((value: string[] | ((prev: string[]) => string[])) => {
    setState((prev) => ({
      ...prev,
      selectedTypes: typeof value === 'function' ? value(prev.selectedTypes) : value,
      currentPage: 1,
    }));
  }, []);

  const setSelectedCategories = useCallback((value: string[] | ((prev: string[]) => string[])) => {
    setState((prev) => ({
      ...prev,
      selectedCategories: typeof value === 'function' ? value(prev.selectedCategories) : value,
      currentPage: 1,
    }));
  }, []);

  const setCurrentPage = useCallback((currentPage: number) => {
    setState((prev) => ({ ...prev, currentPage: Math.max(1, currentPage) }));
  }, []);

  return {
    filter: state.filter,
    selectedTypes: state.selectedTypes,
    selectedCategories: state.selectedCategories,
    currentPage: state.currentPage,
    setFilter,
    setSelectedTypes,
    setSelectedCategories,
    setCurrentPage,
  };
};
