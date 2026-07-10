'use client';

import { useEffect, useState } from 'react';

function useMinWidth(px: number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [px]);

  return matches;
}

type DesktopModalSize = 'lg' | 'xl';

export function useHubModalPresentation(desktopSize: DesktopModalSize = 'lg') {
  const isDesktop = useMinWidth(768);

  return {
    placement: isDesktop ? ('center' as const) : ('bottom' as const),
    size: isDesktop ? desktopSize : ('cover' as const),
  };
}
