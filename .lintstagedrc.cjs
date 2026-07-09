const quote = (files) => files.map((f) => `"${f}"`).join(' ');

const isNextScoped = (file) => file.startsWith('apps/next/');

const isBuildArtifact = (file) =>
  /\/(\.vercel|\.vinext|\.next|\.output|dist|dev-dist|node_modules)(\/|$)/.test(file) ||
  file.endsWith('package-lock.json');

const withoutBuildArtifacts = (files) => files.filter((file) => !isBuildArtifact(file));

module.exports = {
  'apps/legacy/**/*.{js,vue}': (files) =>
    `npm exec --prefix apps/legacy -- eslint --cache --fix ${quote(withoutBuildArtifacts(files))}`,
  'apps/next/**/*.{js,jsx,ts,tsx,json,yml,yaml}': (files) => {
    const lintable = withoutBuildArtifacts(files);
    if (!lintable.length) return [];
    return `npm exec --prefix apps/next -- eslint --cache --fix ${quote(lintable)}`;
  },
  'apps/next/components/**/*.{tsx,scss}': (files) => {
    const lintable = withoutBuildArtifacts(files);
    if (!lintable.length) return [];
    return `node scripts/run-staged-component-tests.mjs ${quote(lintable)}`;
  },
  'packages/shared/**/*.{js,ts}': (files) =>
    `npm exec -w @wfcd/shared -- eslint --cache --fix ${quote(withoutBuildArtifacts(files))}`,
  'cypress/**/*.{js,jsx,ts,tsx}': (files) =>
    `npm exec --prefix apps/next -- eslint --resolve-plugins-relative-to apps/next -c eslint.cypress.cjs --cache --fix ${quote(withoutBuildArtifacts(files))}`,
  'cypress.config.ts': (files) =>
    `npm exec --prefix apps/next -- eslint --resolve-plugins-relative-to apps/next -c eslint.cypress.cjs --cache --fix ${quote(withoutBuildArtifacts(files))}`,
  '{crowdin.yml,.releaserc.yaml}': (files) =>
    `npm exec --prefix apps/next -- eslint --resolve-plugins-relative-to apps/next -c eslint.cypress.cjs --cache --fix ${quote(withoutBuildArtifacts(files))}`,
  '*': (files) => {
    const prettierFiles = files.filter((file) => !isNextScoped(file) && !isBuildArtifact(file));
    if (!prettierFiles.length) return [];
    return `prettier --write --ignore-unknown ${quote(prettierFiles)}`;
  },
};
