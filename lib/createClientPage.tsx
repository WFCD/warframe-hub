'use client';

import dynamic from 'next/dynamic';
import { Suspense, type ComponentType, type FC } from 'react';

/** Static shell route: no SSR of page body — prerender emits HTML shell, UI hydrates client-side. */
const createClientPage = <P extends object = object>(loader: () => Promise<{ default: ComponentType<P> }>) => {
  const Page = dynamic(loader, { ssr: false, loading: () => null });
  const ClientPage: FC<P> = (props) => (
    <Suspense fallback={null}>
      <Page {...props} />
    </Suspense>
  );
  return ClientPage;
};

export default createClientPage;
