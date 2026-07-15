import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';

const REACT_ARIA_INTL_LOCALE = /\/intl\/[^/]+\/([a-z]{2}-[A-Z]{2})\.js$/;

const enUsPathFor = (source: string, importer?: string): string | null => {
  const cleanSource = source.split('?')[0];
  const match = cleanSource.match(REACT_ARIA_INTL_LOCALE);
  if (!match || match[1] === 'en-US') return null;

  const enUsSource = cleanSource.replace(`${match[1]}.js`, 'en-US.js');

  if (importer) {
    const fromImporter = resolve(dirname(importer.split('?')[0]), enUsSource);
    if (existsSync(fromImporter)) return fromImporter;
  }

  if (enUsSource.startsWith('/') || enUsSource.includes('node_modules')) {
    if (existsSync(enUsSource)) return enUsSource;
  }

  return null;
};

/**
 * react-aria intl bundles import ~35 locales each; vinext SSR fetchModule
 * times out loading them one-by-one. Collapse to en-US (hub copy uses i18next).
 */
export const reactAriaIntlSlim = (): Plugin => ({
  name: 'hub-react-aria-intl-slim',
  enforce: 'pre',
  resolveId: (source, importer) => enUsPathFor(source, importer) ?? undefined,
});

export const REACT_ARIA_OPTIMIZE_DEPS = ['@heroui/react', 'react-aria', 'react-aria-components'] as const;

export const REACT_ARIA_NO_EXTERNAL = [
  '@heroui/react',
  'react-aria',
  'react-aria-components',
  /^@react-aria\//,
  /^@react-stately\//,
  /^@internationalized\//,
] as const;
