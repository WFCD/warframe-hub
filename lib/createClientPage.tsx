'use client';

import dynamic from 'next/dynamic';
import { Suspense, type ComponentType, type FC } from 'react';
import HubLoadingIndicator from '@/components/ui/HubLoadingIndicator';

const ClientPageLoading: FC = () => (
  <div className="hub-page-loading-shell">
    <HubLoadingIndicator />
  </div>
);

/** Static shell route: no SSR of page body — prerender emits HTML shell, UI hydrates client-side. */
const createClientPage = <P extends object = object>(loader: () => Promise<{ default: ComponentType<P> }>) => {
  const Page = dynamic(loader, { ssr: false, loading: ClientPageLoading });
  const ClientPage: FC<P> = (props) => (
    <Suspense fallback={<ClientPageLoading />}>
      <Page {...props} />
    </Suspense>
  );
  return ClientPage;
};

export default createClientPage;
