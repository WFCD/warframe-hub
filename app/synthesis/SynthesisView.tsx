'use client';

import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import ContentPage from '@/components/pages/ContentPage';
import ContentLinkButton from '@/components/pages/ContentPage/ContentLinkButton';
import ContentDataTable from '@/components/pages/ContentPage/ContentDataTable';
import { useCache } from '@/lib/providers/CacheProvider';
import { useContentPageLoadReporting } from '@/lib/providers/ContentPageLoadProvider';
import { SynthesisPreviewProvider, useSynthesisPreview } from '@/components/media/SynthesisImg';
import SynthesisTableBody, { type SynthTarget } from './SynthesisTableBody';

const SYNTH_FILTER_ID = 'synth-filter';
const perPage = 7;

type SynthesisTablePanelProps = {
  filtered: SynthTarget[];
  currentPage: number;
  onPageChange: (page: number) => void;
  filter: string;
  onFilterChange: (value: string) => void;
};

const SynthesisTablePanel: FC<SynthesisTablePanelProps> = ({
  filtered,
  currentPage,
  onPageChange,
  filter,
  onFilterChange,
}: SynthesisTablePanelProps) => {
  const { t } = useTranslation();
  const preview = useSynthesisPreview();
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));

  const handlePageChange = useCallback(
    (page: number) => {
      preview?.close();
      onPageChange(page);
    },
    [onPageChange, preview]
  );

  return (
    <ContentDataTable
      ariaLabel={t('synthesis.tableAria')}
      className='synth-table'
      pagination={{ page: currentPage, pageCount, onPageChange: handlePageChange }}
      search={{ id: SYNTH_FILTER_ID, value: filter, onChange: onFilterChange }}
      actions={
        <ContentLinkButton href='https://wiki.warframe.com/w/Synthesis' external size='sm'>
          {t('synthesis.whatIs')} <i className='fas fa-external-link-alt fa-xs' />
        </ContentLinkButton>
      }
    >
      <thead>
        <tr>
          <th scope='col' title={t('synthesis.columns.nameTitle')}>
            {t('synthesis.columns.name')}
          </th>
          <th scope='col' className='synth-col-portrait' title={t('synthesis.columns.portraitTitle')}>
            {t('synthesis.columns.portrait')}
          </th>
          <th scope='col' title={t('synthesis.columns.locationTitle')}>
            {t('synthesis.columns.location')}
          </th>
          <th scope='col' title={t('synthesis.columns.levelTitle')}>
            {t('synthesis.columns.level')}
          </th>
          <th scope='col' title={t('synthesis.columns.missionTitle')}>
            {t('synthesis.columns.mission')}
          </th>
          <th scope='col' title={t('synthesis.columns.spawnRateTitle')}>
            {t('synthesis.columns.spawnRate')}
          </th>
          <th scope='col' title={t('synthesis.columns.verifyTitle')}>
            {t('synthesis.columns.verify')}
          </th>
        </tr>
      </thead>
      <SynthesisTableBody rows={filtered} currentPage={currentPage} perPage={perPage} />
    </ContentDataTable>
  );
};

const SynthesisContent: FC<{ data: SynthTarget[] }> = ({ data }) => {
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!filter) return data;
    const q = filter.toLowerCase();
    return data.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.locations.some(
          (loc) =>
            loc.planet.toLowerCase().includes(q) ||
            loc.mission.toLowerCase().includes(q) ||
            loc.faction.toLowerCase().includes(q)
        )
    );
  }, [data, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <SynthesisPreviewProvider page={currentPage}>
      <SynthesisTablePanel
        filtered={filtered}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        filter={filter}
        onFilterChange={setFilter}
      />
    </SynthesisPreviewProvider>
  );
};

const SynthesisView: FC = () => {
  const { t } = useTranslation();
  const { state, updateSynthData } = useCache();
  const data = state.synthData as SynthTarget[];
  const loading = useContentPageLoadReporting(data.length > 0);

  useEffect(() => {
    if (!data.length) void updateSynthData();
  }, [data.length, updateSynthData]);

  return (
    <ContentPage
      title={t('synthesis.title')}
      notice={
        <p>
          <a href='https://steamcommunity.com/sharedfiles/filedetails/?id=666483447' target='_blank' rel='noreferrer'>
            {t('synthesis.noticeLink')}
          </a>
        </p>
      }
    >
      {!loading ? <SynthesisContent data={data} /> : null}
    </ContentPage>
  );
};

export default SynthesisView;
