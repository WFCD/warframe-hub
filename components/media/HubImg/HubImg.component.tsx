'use client';
import './HubImg.component.scss';

import type { CSSProperties, ReactNode, FC } from 'react';

type HubImgProps = {
  src: string;
  name?: string;
  width?: string;
  height?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** When false, omit native title tooltip (e.g. when wrapped in HeroUI Tooltip). */
  showTitle?: boolean;
};
const HubImg: FC<HubImgProps> = ({
  src,
  name = 'Name',
  width = '15px',
  height = '15px',
  className,
  style,
  showTitle = true,
}: HubImgProps) => {
  const widthPx = Number.parseInt(width, 10);
  const heightPx = Number.parseInt(height, 10);

  return (
    <span
      title={showTitle ? name : undefined}
      className={`hub-img inline-flex items-center justify-center align-middle leading-none ${className ?? ''}`.trim()}
      style={style}
    >
      <img
        className='block'
        src={src}
        width={Number.isFinite(widthPx) ? widthPx : undefined}
        height={Number.isFinite(heightPx) ? heightPx : undefined}
        alt={name}
      />
    </span>
  );
};
export default HubImg;
