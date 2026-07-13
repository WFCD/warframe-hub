'use client';

import { useEffect, useMemo, useState, type FC } from 'react';
import { Tooltip } from '@heroui/react';
import { makeid, wfcdn, optimize } from '@/lib/shared';
import { fetchItemImageName } from '@/lib/cache/itemSearchCache';
import { HUB_TOOLTIP_DELAY } from '@/lib/ui/tooltipTiming';

type AsyncItemThumbProps = {
  alt?: string;
  width?: number;
  ikey?: string;
};

const normalizeItemQuery = (ikey: string, alt: string): string =>
  (ikey || alt)
    .replace(/\d+\s+/i, '')
    .replace('Blueprint', '')
    .replace('Receiver', '')
    .replace('Hilt', '')
    .replace('Blade', '')
    .replace('Stock', '')
    .trim()
    .toLowerCase();

const AsyncItemThumb: FC<AsyncItemThumbProps> = ({ alt = '', width = 20, ikey = '' }: AsyncItemThumbProps) => {
  const id = useMemo(() => makeid(), []);
  const [img, setImg] = useState<string | null>(null);
  const query = useMemo(() => normalizeItemQuery(ikey, alt), [alt, ikey]);

  useEffect(() => {
    if (!query) return;

    let cancelled = false;
    void fetchItemImageName(query).then((imageName) => {
      if (cancelled || !imageName) return;
      setImg(optimize(wfcdn(imageName), String(width * 8)));
    });

    return () => {
      cancelled = true;
    };
  }, [query, width]);

  if (!img) {
    return <div>{alt}</div>;
  }

  const thumb = <img id={id} src={img} alt={alt} style={{ pointerEvents: 'inherit' }} width={`${width}px`} />;

  return (
    <Tooltip delay={HUB_TOOLTIP_DELAY}>
      <Tooltip.Trigger>
        <span className="hub-async-thumb-trigger">{thumb}</span>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <img src={img} alt={alt} className="async-thumb" width={`${width * 5}px`} />
        <div>{alt}</div>
      </Tooltip.Content>
    </Tooltip>
  );
};

export default AsyncItemThumb;
