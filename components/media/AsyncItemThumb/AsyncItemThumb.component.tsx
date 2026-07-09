'use client';

import { useEffect, useMemo, useState, type FC } from 'react';
import { Tooltip } from '@heroui/react';
import { makeid, wfcdn, optimize } from '@/lib/shared';

type AsyncItemThumbProps = {
  alt?: string;
  width?: number;
  ikey?: string;
};

const AsyncItemThumb: FC<AsyncItemThumbProps> = ({ alt = '', width = 20, ikey = '' }: AsyncItemThumbProps) => {
  const id = useMemo(() => makeid(), []);
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    const stripped = (ikey || alt)
      .replace(/\d+\s+/i, '')
      .replace('Blueprint', '')
      .replace('Receiver', '')
      .replace('Hilt', '')
      .replace('Blade', '')
      .replace('Stock', '')
      .trim();

    const url = `https://api.warframestat.us/items/search/${stripped.toLowerCase()}`;

    void fetch(url)
      .then((d) => d.json())
      .then((data: { name: string; imageName?: string }[]) => {
        const match = data.filter((d) => d.name === stripped);
        if (match[0]?.imageName) {
          setImg(optimize(wfcdn(match[0].imageName), String(width * 8)));
        }
      })
      .catch(() => {});
  }, [alt, ikey, width]);

  if (!img) {
    return <div>{alt}</div>;
  }

  const thumb = <img id={id} src={img} alt={alt} style={{ pointerEvents: 'inherit' }} width={`${width}px`} />;

  return (
    <Tooltip delay={400}>
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
