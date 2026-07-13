'use client';

import dynamic from 'next/dynamic';
import { Suspense, type ComponentType, type FC } from 'react';
import {
  ContentPageChunkGate,
  ContentPageLoadProvider,
} from '@/lib/providers/ContentPageLoadProvider';

/** Static shell route: no SSR of page body — prerender emits HTML shell, UI hydrates client-side. */
const createClientPage = <P extends object = object>(loader: () => Promise<{ default: ComponentType<P> }>) => {
  const Page = dynamic(loader, { ssr: false });
  const ClientPage: FC<P> = (props) => (
    <ContentPageLoadProvider>
      <Suspense fallback={null}>
        <ContentPageChunkGate>
          <Page {...props} />
        </ContentPageChunkGate>
      </Suspense>
    </ContentPageLoadProvider>
  );
  return ClientPage;
};

export default createClientPage;
