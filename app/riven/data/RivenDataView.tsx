'use client';

import { useEffect, useMemo, useState, type FC } from 'react';
import Link from 'next/link';
import { Trans, useTranslation } from 'react-i18next';
import type { Platform, RivenTradeStat } from '@/lib/shared';
import ContentPage from '@/components/pages/ContentPage';
import ContentDataTable from '@/components/pages/ContentPage/ContentDataTable';
import ContentTableToolbarDropdown from '@/components/pages/ContentPage/ContentTableToolbarDropdown';
import HubSwitch from '@/components/ui/HubSwitch';
import platforms from '@/data/json/platforms.json';
import { useCache } from '@/lib/providers/CacheProvider';
import { useContentPageLoadReporting } from '@/lib/providers/ContentPageLoadProvider';
import { useWorldstate } from '@/lib/providers/WorldstateProvider';
import { FishBoolIcon } from '@/components/pages/ContentPage/FishTableUi';

const RIVEN_FILTER_ID = 'filterInput';
const ROLL_VALUES = ['rolled', 'unrolled', 'both'] as const;
const perPage = 25;

const toTitleCase = (str: string) =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const platformDisplay = (platform: Platform) => {
  const key = platform === 'switch' ? 'swi' : platform;
  return (platforms as Record<string, { display: string }>)[key]?.display ?? platform;
};

const RivenDataView: FC = () => {
  const { t } = useTranslation();
  const { state, updateRivens } = useCache();
  const platform = useWorldstate((ctx) => ctx.platform);
  const rivens = useMemo(
    () => (state.rivens[platform] ?? []) as RivenTradeStat[],
    [state.rivens, platform]
  );

  const [filter, setFilter] = useState('');
  const [rollstate, setRollstate] = useState('both');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const types = useMemo(() => Array.from(new Set(rivens.map((r) => r.itemType))), [rivens]);
  const loading = useContentPageLoadReporting(rivens.length > 0);

  useEffect(() => {
    if (!rivens.length) void updateRivens();
  }, [rivens.length, updateRivens]);

  const filtered = useMemo(() => {
    const query = filter.trim().toLowerCase();
    const veiledLabel = t('riven.veiled').toLowerCase();
    return rivens.filter((row) => {
      const rollFilter =
        rollstate === 'both' || (rollstate === 'rolled' && row.rerolled) || (rollstate === 'unrolled' && !row.rerolled);
      const typeMatches = !selectedTypes.length || selectedTypes.includes(row.itemType);
      if (!rollFilter || !typeMatches) return false;
      if (!query) return true;
      const weapon = (row.compatibility || veiledLabel).toLowerCase();
      return weapon.includes(query);
    });
  }, [rivens, filter, rollstate, selectedTypes, t]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, rollstate, selectedTypes]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const typesLabel =
    selectedTypes.length > 0
      ? t('riven.filters.typesActive', { count: selectedTypes.length })
      : t('riven.filters.types');
  const rolledLabel =
    rollstate === 'both'
      ? t('riven.filters.rolled')
      : t(`riven.rolls.${rollstate as (typeof ROLL_VALUES)[number]}`);

  return (
    <ContentPage
      title={t('riven.title')}
      subtitle={t('riven.subtitle', { platform: platformDisplay(platform) })}
      notice={
        <p>
          <Trans
            i18nKey='riven.notice'
            components={{
              deLink: (
                <Link
                  href='https://forums.warframe.com/topic/1077490-r'
                  target='_blank'
                  rel='noreferrer'
                />
              ),
              wfcdLink: (
                <Link href='https://api.warframestat.us/pc/rivens' target='_blank' rel='noreferrer' />
              ),
            }}
          />
        </p>
      }
    >
      {!loading ? (
        <ContentDataTable
          ariaLabel={t('riven.tableAria')}
          className='riven-table'
          pagination={{ page: currentPage, pageCount, onPageChange: setCurrentPage }}
          search={{ id: RIVEN_FILTER_ID, value: filter, onChange: setFilter }}
          filters={
            <>
              <ContentTableToolbarDropdown
                label={typesLabel}
                active={selectedTypes.length > 0}
                ariaLabel={t('riven.filters.types')}
              >
                <div className='hub-content-type-filter'>
                  {types.map((type) => (
                    <HubSwitch
                      key={type}
                      id={`type-${type}`}
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
                label={rolledLabel}
                active={rollstate !== 'both'}
                ariaLabel={t('riven.filters.rolledAria')}
              >
                <div className='hub-content-table-filter-menu' role='radiogroup' aria-label={t('riven.filters.rolledAria')}>
                  {ROLL_VALUES.map((value) => (
                    <label key={value} className='hub-content-table-filter-menu__option'>
                      <input
                        type='radio'
                        name='riven-roll-filter'
                        value={value}
                        checked={rollstate === value}
                        onChange={() => setRollstate(value)}
                      />
                      {t(`riven.rolls.${value}`)}
                    </label>
                  ))}
                </div>
              </ContentTableToolbarDropdown>
            </>
          }
        >
          <thead>
            <tr>
              <th scope='col' title={t('riven.columns.weaponTitle')}>
                {t('riven.columns.weapon')}
              </th>
              <th scope='col' title={t('riven.columns.rerolledTitle')}>
                {t('riven.columns.rerolled')}
              </th>
              <th scope='col' title={t('riven.columns.avgTradeTitle')}>
                {t('riven.columns.avgTrade')}
              </th>
              <th scope='col' title={t('riven.columns.stddevTitle')}>
                {t('riven.columns.stddev')}
              </th>
              <th scope='col' title={t('riven.columns.minTitle')}>
                {t('riven.columns.min')}
              </th>
              <th scope='col' title={t('riven.columns.medianTitle')}>
                {t('riven.columns.median')}
              </th>
              <th scope='col' title={t('riven.columns.maxTitle')}>
                {t('riven.columns.max')}
              </th>
              <th scope='col' title={t('riven.columns.populationTitle')}>
                {t('riven.columns.population')}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((row, idx) => (
              <tr key={`${row.compatibility ?? 'veiled'}-${row.itemType}-${idx}`}>
                <td>{toTitleCase(row.compatibility || t('riven.veiled'))}</td>
                <td>
                  <FishBoolIcon value={row.rerolled} />
                </td>
                <td>{String(row.avg)}</td>
                <td>{String(row.stddev)}</td>
                <td>{String(row.min)}</td>
                <td>{String(row.median)}</td>
                <td>{String(row.max)}</td>
                <td>{String(row.pop)}</td>
              </tr>
            ))}
          </tbody>
        </ContentDataTable>
      ) : null}
    </ContentPage>
  );
};

export default RivenDataView;
