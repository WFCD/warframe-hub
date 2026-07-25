import type { ReactNode, FC } from 'react';
import { Exo_2 } from 'next/font/google';
import HubProviders from '@/lib/providers/HubProviders';
import ClientShell from '@/components/chrome/ClientShell';
import SentryInit from '@/components/chrome/SentryInit';

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'Warframe Hub',
  description: 'The Home for Warframe Information',
  manifest: '/manifest.webmanifest',
  themeColor: '#161618',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Warframe Hub',
  },
  icons: {
    apple: '/icon.png',
  },
};

const RootLayout: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  return (
    <html lang='en' className={exo2.className} suppressHydrationWarning>
      <head>
        <script src='/runtime-env.js' />
      </head>
      <body>
        <SentryInit />
        <HubProviders>
          <ClientShell>{children}</ClientShell>
        </HubProviders>
      </body>
    </html>
  );
};
export default RootLayout;
