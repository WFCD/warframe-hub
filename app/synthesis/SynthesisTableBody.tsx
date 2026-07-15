'use client';

import { useMemo, type FC, type ReactNode } from 'react';
import SynthesisImg from '@/components/media/SynthesisImg';

type SynthLocation = {
  planet: string;
  mission: string;
  level: string | number;
  faction: string;
  type: string;
  spawn_rate: string;
  last_verified: string;
};

export type SynthTarget = {
  name: string;
  imageKey: string;
  locations: SynthLocation[];
};

type SynthesisTableBodyProps = {
  rows: SynthTarget[];
  currentPage: number;
  perPage: number;
};

const locationLines = (row: SynthTarget, render: (loc: SynthLocation, key: number) => ReactNode) =>
  row.locations.map((loc, key) => (
    <span key={`${row.name}-${key}`}>
      {render(loc, key)}
      {key + 1 !== row.locations.length ? <br /> : null}
    </span>
  ));

const SynthesisTableBody: FC<SynthesisTableBodyProps> = ({ rows, currentPage, perPage }: SynthesisTableBodyProps) => {
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return rows.slice(start, start + perPage);
  }, [rows, currentPage, perPage]);

  return (
    <tbody>
      {pageItems.map((row) => (
        <tr key={row.name}>
          <td>{row.name}</td>
          <td className='synth-cell'>
            <SynthesisImg name={row.name} image={row.imageKey} />
          </td>
          <td>{locationLines(row, (loc) => `${loc.planet} (${loc.mission})`)}</td>
          <td>{locationLines(row, (loc) => loc.level)}</td>
          <td>{locationLines(row, (loc) => `${loc.faction} - ${loc.type}`)}</td>
          <td>{locationLines(row, (loc) => loc.spawn_rate)}</td>
          <td>{locationLines(row, (loc) => loc.last_verified)}</td>
        </tr>
      ))}
    </tbody>
  );
};

export default SynthesisTableBody;
