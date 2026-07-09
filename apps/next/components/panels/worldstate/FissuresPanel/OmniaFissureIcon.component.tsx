'use client';
import './OmniaFissureIcon.component.scss';

import { useEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import { cdn } from '@wfcd/shared';

export const lith = cdn('svg/fissures/1.svg');
export const meso = cdn('svg/fissures/2.svg');
export const neo = cdn('svg/fissures/3.svg');
export const axi = cdn('svg/fissures/4.svg');
export const requiem = cdn('svg/fissures/5.svg');

export const FISSURE_TIER_ICONS = [lith, meso, neo, axi, requiem] as const;

export const OMNIA_CYCLE_ICONS = [lith, meso, neo, axi] as const;

export const OMNIA_CYCLE_MS = 1500;
export const OMNIA_CROSSFADE_MS = 500;

type FissureTierLike = {
  tier: string;
  tierNum: number;
};

export const isOmniaFissure = (fissure: FissureTierLike): boolean =>
  fissure.tierNum === 6 || fissure.tier.toLowerCase() === 'omnia';

export const fissureTierIcon = (fissure: FissureTierLike): string =>
  FISSURE_TIER_ICONS[fissure.tierNum - 1] ?? lith;

type OmniaFissureIconProps = {
  label: string;
  className?: string;
};

const OmniaFissureIcon: FC<OmniaFissureIconProps> = ({ label, className }: OmniaFissureIconProps) => {
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [crossfading, setCrossfading] = useState(false);

  useEffect(() => {
    let resetTimeoutId: number | undefined;

    const advance = () => {
      const from = indexRef.current;
      const to = (from + 1) % OMNIA_CYCLE_ICONS.length;
      indexRef.current = to;
      setOutgoingIndex(from);
      setIndex(to);
      setCrossfading(false);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setCrossfading(true));
      });

      resetTimeoutId = window.setTimeout(() => {
        setOutgoingIndex(null);
        setCrossfading(false);
      }, OMNIA_CROSSFADE_MS);
    };

    const intervalId = window.setInterval(advance, OMNIA_CYCLE_MS);
    return () => {
      window.clearInterval(intervalId);
      if (resetTimeoutId !== undefined) window.clearTimeout(resetTimeoutId);
    };
  }, []);

  const rootClass = [
    'hub-img',
    'hub-omnia-fissure-icon',
    className,
    outgoingIndex !== null ? 'hub-omnia-fissure-icon--crossfade' : '',
    crossfading ? 'hub-omnia-fissure-icon--active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={rootClass}
      style={{ '--hub-omnia-crossfade-ms': `${OMNIA_CROSSFADE_MS}ms` } as CSSProperties}
      title={undefined}
    >
      {outgoingIndex !== null ? (
        <span className="hub-omnia-fissure-icon__layer hub-omnia-fissure-icon__layer--outgoing">
          <img src={OMNIA_CYCLE_ICONS[outgoingIndex]} height="24" width="24" alt="" aria-hidden />
        </span>
      ) : null}
      <span
        className={[
          'hub-omnia-fissure-icon__layer',
          outgoingIndex !== null ? 'hub-omnia-fissure-icon__layer--incoming' : 'hub-omnia-fissure-icon__layer--current',
        ].join(' ')}
      >
        <img src={OMNIA_CYCLE_ICONS[index]} height="24" width="24" alt={label} />
      </span>
    </span>
  );
};

export default OmniaFissureIcon;
