import type { FC } from 'react';
import { cdn } from '@/lib/shared';

const wfcdLogo = cdn('svg/wfcd.svg');
const NotFound: FC = () => {
  return (
    <div className="flex flex-wrap gap-8 items-start max-w-[1140px] mx-auto py-12 px-6 text-left">
      <div className="shrink-0 basis-48">
        <img className="wfcd-logo" src={wfcdLogo} alt="WFCD Logo" style={{ filter: 'invert(0.7)' }} />
      </div>
      <div className="flex-1 basis-80 min-w-0">
        <h1>404 ERROR OH NO</h1>
        <h2>You broke the site!</h2>
        <h3>How could you?</h3>
        <br />
        <br />
        <p>Don&apos;t worry, one of the developers will clean up the mess. You can carry on though!</p>
        <p>This interaction will be logged, so we can solve the problem faster.</p>
        <p>
          Speaking of which, one of the developers is probably panicking right now just because of this error log.
        </p>
        <p>Oh well, poor him.</p>
        <br />
        <br />
        <a href="/">Click here to return to a safe place</a>
      </div>
    </div>
  );
};
export default NotFound;
