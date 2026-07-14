'use client';

import { useMinWidth } from '@/lib/hooks/useMinWidth';

type DesktopModalSize = 'lg' | 'xl';

export function useHubModalPresentation(desktopSize: DesktopModalSize = 'lg') {
  const isDesktop = useMinWidth(768);

  return {
    placement: isDesktop ? ('center' as const) : ('bottom' as const),
    size: isDesktop ? desktopSize : ('cover' as const),
  };
}
