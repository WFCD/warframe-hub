'use client';

import './CodexView.scss';

import { useEffect, useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { CodexItem } from '@/lib/shared';
import ContentPage from '@/components/pages/ContentPage';
import ContentDataTable from '@/components/pages/ContentPage/ContentDataTable';
import ContentTableToolbarDropdown from '@/components/pages/ContentPage/ContentTableToolbarDropdown';
import HubSwitch from '@/components/ui/HubSwitch';
import { useCache } from '@/lib/providers/CacheProvider';
import { useContentPageLoadReporting } from '@/lib/providers/ContentPageLoadProvider';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import CodexTableBody from './CodexTableBody';
import { useCodexQueryState } from './useCodexQueryState';

const perPage = 25;

const sortItems = (items: CodexItem[]): CodexItem[] =>
  [...items].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

const uniqueValues = (items: CodexItem[], key: 'type' | 'category'): string[] =>
  Array.from(
    new Set(
      items
        .map((item) => item[key])
        .filter((value): value is string => Boolean(value))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
    ),
  );

const CodexView: FC = () => {
  const { t } = useTranslation();
  const { state, updateItems } = useCache();
  const { state: prefs } = usePrefs();
  const items = state.items;
  const loading = useContentPageLoadReporting(items.length > 0);

  const {
    filter,
    setFilter,
    selectedTypes,
    setSelectedTypes,
    selectedCategories,
    setSelectedCategories,
    currentPage,
    setCurrentPage,
  } = useCodexQueryState();

  useEffect(() => {
    void updateItems();
  }, [updateItems]);

  const types = useMemo(() => uniqueValues(items, 'type'), [items]);
  const categories = useMemo(() => uniqueValues(items, 'category'), [items]);

  const filtered = useMemo(() => {
    const query = filter.trim().toLowerCase();
    return sortItems(
      items.filter((item) => {
        const typeMatches = !selectedTypes.length || (item.type ? selectedTypes.includes(item.type) : false);
        const categoryMatches =
          !selectedCategories.length || (item.category ? selectedCategories.includes(item.category) : false);
        if (!typeMatches || !categoryMatches) return false;
        if (!query) return true;
        return [item.name, item.type, item.category, item.uniqueName]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));
      }),
    );
  }, [items, filter, selectedTypes, selectedCategories]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const typesLabel =
    selectedTypes.length > 0
      ? t('codex.filters.typesActive', { count: selectedTypes.length })
      : t('codex.filters.types');
  const categoriesLabel =
    selectedCategories.length > 0
      ? t('codex.filters.categoriesActive', { count: selectedCategories.length })
      : t('codex.filters.categories');

  return (
    <ContentPage
      title={t('codex.title')}
      subtitle={loading ? undefined : t('codex.subtitle', { count: items.length })}
      notice={
        <p>
          {t('codex.notice')}{' '}
          <a href="https://api.warframestat.us/items" target="_blank" rel="noreferrer">
            WFCD Items API
          </a>
          .
        </p>
      }
    >
      {!loading ? (
        <ContentDataTable
          ariaLabel={t('codex.tableAria')}
          className="codex-table"
          pagination={{ page: currentPage, pageCount, onPageChange: setCurrentPage }}
          search={{
            id: 'codex-filter',
            value: filter,
            onChange: setFilter,
            placeholder: t('codex.searchPlaceholder'),
          }}
          filters={
            <>
              <ContentTableToolbarDropdown
                label={typesLabel}
                active={selectedTypes.length > 0}
                ariaLabel={t('codex.filters.types')}
              >
                <div className="hub-content-type-filter">
                  {types.map((type) => (
                    <HubSwitch
                      key={type}
                      id={`codex-type-${type}`}
                      label={type}
                      checked={selectedTypes.includes(type)}
                      onChange={(isSelected) => {
                        if (isSelected) setSelectedTypes((prev) => [...prev, type]);
                        else setSelectedTypes((prev) => prev.filter((entry) => entry !== type));
                      }}
                    />
                  ))}
                </div>
              </ContentTableToolbarDropdown>
              <ContentTableToolbarDropdown
                label={categoriesLabel}
                active={selectedCategories.length > 0}
                ariaLabel={t('codex.filters.categories')}
              >
                <div className="hub-content-type-filter">
                  {categories.map((category) => (
                    <HubSwitch
                      key={category}
                      id={`codex-category-${category}`}
                      label={category}
                      checked={selectedCategories.includes(category)}
                      onChange={(isSelected) => {
                        if (isSelected) setSelectedCategories((prev) => [...prev, category]);
                        else setSelectedCategories((prev) => prev.filter((entry) => entry !== category));
                      }}
                    />
                  ))}
                </div>
              </ContentTableToolbarDropdown>
            </>
          }
        >
          <thead>
            <tr>
              <th scope="col" className="hub-codex-table__expand-col">
                <span className="sr-only">{t('codex.columns.details')}</span>
              </th>
              <th scope="col">{t('codex.columns.name')}</th>
              <th scope="col">{t('codex.columns.type')}</th>
              <th scope="col">{t('codex.columns.category')}</th>
              <th scope="col">{t('codex.columns.tradable')}</th>
              <th scope="col">{t('codex.columns.masterable')}</th>
              <th scope="col">{t('codex.columns.links')}</th>
            </tr>
          </thead>
          <CodexTableBody rows={filtered} currentPage={currentPage} perPage={perPage} locale={prefs.locale} />
        </ContentDataTable>
      ) : null}
    </ContentPage>
  );
};

export default CodexView;
