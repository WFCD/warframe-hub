import type { Plugin, UserConfig } from 'vite';
import type { CodeSplittingGroup, CodeSplittingOptions } from 'rolldown';

const NODE_MODULES = '[\\\\/]node_modules[\\\\/]';

const HUB_CODE_SPLITTING_GROUPS: CodeSplittingGroup[] = [
  {
    name: 'react-dom',
    test: new RegExp(`${NODE_MODULES}react-dom[\\\\/]`),
    priority: 50,
  },
  {
    name: 'scheduler',
    test: new RegExp(`${NODE_MODULES}scheduler[\\\\/]`),
    priority: 50,
  },
  {
    name: 'react',
    test: new RegExp(`${NODE_MODULES}react[\\\\/]`),
    priority: 49,
  },
  {
    name: 'vendor-i18n',
    test: new RegExp(`${NODE_MODULES}(i18next|react-i18next)[\\\\/]`),
    priority: 40,
    minSize: 20_000,
  },
  {
    name: 'vendor-heroui',
    test: new RegExp(`${NODE_MODULES}@heroui[\\\\/]`),
    priority: 40,
    minSize: 30_000,
  },
  {
    name: 'vendor-aria',
    test: new RegExp(`${NODE_MODULES}(react-aria|react-aria-components|@react-aria|@react-stately)[\\\\/]`),
    priority: 40,
    minSize: 40_000,
  },
  {
    name: 'vendor-dnd',
    test: new RegExp(`${NODE_MODULES}@dnd-kit[\\\\/]`),
    priority: 40,
  },
  {
    name: 'vendor-masonry',
    test: new RegExp(`${NODE_MODULES}react-masonry-css[\\\\/]`),
    priority: 40,
  },
];

type OutputConfig = {
  codeSplitting?: boolean | CodeSplittingOptions;
  [key: string]: unknown;
};

const getClientOutput = (build: UserConfig['build'] | undefined): OutputConfig | undefined => {
  const output = build?.rolldownOptions?.output;
  if (!output) return undefined;
  return (Array.isArray(output) ? output[0] : output) as OutputConfig;
};

const mergeCodeSplittingGroups = (
  existing: OutputConfig['codeSplitting'],
  groups: CodeSplittingGroup[],
): CodeSplittingOptions => {
  const base = typeof existing === 'object' && existing !== null ? existing : { minSize: 10_000 };
  return {
    ...base,
    groups: [...(base.groups ?? []), ...groups],
  };
};

/** Merge hub chunk groups into vinext client `codeSplitting` (replaces ignored `manualChunks`). */
export const hubChunkGroups = (): Plugin => ({
  name: 'hub:chunk-groups',
  apply: 'build',
  enforce: 'post',
  configEnvironment(name, config) {
    if (name !== 'client') return;

    const output = getClientOutput(config.build);
    return {
      build: {
        rolldownOptions: {
          output: {
            ...output,
            codeSplitting: mergeCodeSplittingGroups(output?.codeSplitting, HUB_CODE_SPLITTING_GROUPS),
          },
        },
      },
    };
  },
});
