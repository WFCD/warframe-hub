import type { FC } from 'react';
import { cdn } from '@wfcd/shared';

const wfcdLogo = cdn('svg/wfcd.svg');
const NotFound: FC = () => {
  return (
    <div className="hub-not-found">
      <div className="hub-not-found__logo">
        <img className="wfcd-logo" src={wfcdLogo} alt="WFCD Logo" style={{ filter: 'invert(0.7)' }} />
      </div>
      <div className="hub-not-found__content">
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
