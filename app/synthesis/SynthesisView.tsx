'use client';

import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import ContentPage from '@/components/pages/ContentPage';
import ContentLinkButton from '@/components/pages/ContentPage/ContentLinkButton';
import ContentDataTable from '@/components/pages/ContentPage/ContentDataTable';
import ContentLoadingAlert from '@/components/pages/ContentPage/ContentLoadingAlert';
import { useCache } from '@/lib/providers/CacheProvider';
import { SynthesisPreviewProvider, useSynthesisPreview } from '@/components/media/SynthesisImg';
import SynthesisTableBody, { type SynthTarget } from './SynthesisTableBody';

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
      ariaLabel="Synthesis Targets"
      className="synth-table"
      pagination={{ page: currentPage, pageCount, onPageChange: handlePageChange }}
      search={{ id: 'synth-filter', value: filter, onChange: onFilterChange }}
      actions={
        <ContentLinkButton href="https://wiki.warframe.com/w/Synthesis" external size="sm">
          What is Synthesis? <i className="fas fa-external-link-alt fa-xs" />
        </ContentLinkButton>
      }
    >
      <thead>
        <tr>
          <th scope="col" title="The name of the Synthesis Target">
            Name
          </th>
          <th scope="col" className="synth-col-portrait" title="The portrait of the Synthesis Target">
            Portrait
          </th>
          <th scope="col" title="The location where you can find this Synthesis Target">
            Location
          </th>
          <th scope="col" title="The level of the location where you can find this Synthesis Target">
            Level
          </th>
          <th scope="col" title="The type of mission for the location where you can find this Synthesis Target">
            Mission
          </th>
          <th scope="col" title="Chance of the Synthesis Target spawning at this location">
            Spawn Rate
          </th>
          <th scope="col" title="Last verification date">
            Verify
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
  const { state, updateSynthData } = useCache();
  const data = state.synthData as SynthTarget[];
  const loading = !data.length;

  useEffect(() => {
    if (!data.length) void updateSynthData();
  }, [data.length, updateSynthData]);

  return (
    <ContentPage
      title="Synthesis Targets"
      notice={
        <p>
          <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=666483447" target="_blank" rel="noreferrer">
            Synthesis Data provided by Evilflora
          </a>
        </p>
      }
    >
      {loading ? (
        <ContentLoadingAlert title="Loading Synthesis Data...">
          If this card stays active for more than a minute, please reload the site or try agin later.
        </ContentLoadingAlert>
      ) : (
        <SynthesisContent data={data} />
      )}
    </ContentPage>
  );
};

export default SynthesisView;
