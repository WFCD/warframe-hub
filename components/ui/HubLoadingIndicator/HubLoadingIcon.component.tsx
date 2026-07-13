import type { FC, SVGProps } from 'react';

type HubLoadingIconProps = SVGProps<SVGSVGElement>;

const diamondPath =
  'M 26.598504,59.531252 59.531249,26.631431 92.463989,59.531247 59.531244,92.431065 26.598504,59.531252';

const HubLoadingIcon: FC<HubLoadingIconProps> = ({ className, ...props }: HubLoadingIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 119.0625 119.0625"
    className={['hub-loading-indicator__svg', className].filter(Boolean).join(' ')}
    fill="none"
    aria-hidden
    {...props}
  >
    <path
      className="hub-loading-indicator__background"
      strokeWidth={0}
      d="M 0.12514913,59.531255 59.473156,0.187824 118.82115,59.531246 59.473147,118.87468 0.12514913,59.531255"
    />
    <g className="hub-loading-indicator__ring-rotate hub-loading-indicator__ring-rotate--0">
      <g className="hub-loading-indicator__ring-scale hub-loading-indicator__ring-scale--0">
        <path className="hub-loading-indicator__diamond" d={diamondPath} />
      </g>
    </g>
    <g className="hub-loading-indicator__ring-rotate hub-loading-indicator__ring-rotate--1">
      <g className="hub-loading-indicator__ring-scale hub-loading-indicator__ring-scale--1">
        <path className="hub-loading-indicator__diamond" d={diamondPath} />
      </g>
    </g>
    <g className="hub-loading-indicator__ring-rotate hub-loading-indicator__ring-rotate--2">
      <g className="hub-loading-indicator__ring-scale hub-loading-indicator__ring-scale--2">
        <path className="hub-loading-indicator__diamond" d={diamondPath} />
      </g>
    </g>
    <g className="hub-loading-indicator__line-group hub-loading-indicator__line-group--left">
      <path
        className="hub-loading-indicator__line"
        d="m 0.1173222,59.531257 c 0,0 4.8436152,44.648433 37.9165318,11.575516 L 71.106773,38.033854 C 104.17969,4.9609374 118.82891,59.531249 118.82891,59.531249"
      />
      <path
        className="hub-loading-indicator__line"
        d="m 0.1173222,59.531257 c 0,0 8.1509069,47.955723 41.2238228,14.882807 L 74.414064,41.341145 C 107.48698,8.2682291 118.82891,59.531249 118.82891,59.531249"
      />
    </g>
    <g className="hub-loading-indicator__line-group hub-loading-indicator__line-group--right">
      <path
        className="hub-loading-indicator__line"
        d="m 118.82891,59.531249 c 0,0 -8.03464,-47.955728 -41.107554,-14.882812 L 44.648437,77.721356 C 11.575521,110.79427 0.1173222,59.531257 0.1173222,59.531257"
      />
      <path
        className="hub-loading-indicator__line"
        d="m 118.82891,59.531249 c 0,0 -4.72735,-44.648436 -37.800263,-11.57552 L 47.955729,81.028647 C 14.882813,114.10156 0.1173222,59.531257 0.1173222,59.531257"
      />
    </g>
  </svg>
);

export default HubLoadingIcon;
