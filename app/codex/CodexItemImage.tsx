'use client';

import type { FC } from 'react';
import { Tooltip } from '@heroui/react';
import { wfcdn } from '@/lib/shared';
import { HUB_TOOLTIP_DELAY } from '@/lib/ui/tooltipTiming';

type CodexItemImageProps = {
  imageName: string;
  name: string;
  className?: string;
  width: number;
  height: number;
  previewScale?: number;
};

const CodexItemImage: FC<CodexItemImageProps> = ({
  imageName,
  name,
  className,
  width,
  height,
  previewScale = 4,
}: CodexItemImageProps) => {
  const src = wfcdn(imageName);
  const previewWidth = width * previewScale;
  const previewHeight = height * previewScale;

  return (
    <Tooltip delay={HUB_TOOLTIP_DELAY}>
      <Tooltip.Trigger>
        <span className="hub-codex-item-image__trigger">
          <img className={className} src={src} alt="" width={width} height={height} />
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content placement="top">
        <div className="hub-codex-item-image__tooltip">
          <img
            className="hub-codex-item-image__preview"
            src={src}
            alt=""
            width={previewWidth}
            height={previewHeight}
          />
          <span className="hub-codex-item-image__label">{name}</span>
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
};

export default CodexItemImage;
