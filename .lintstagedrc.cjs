const quote = (files) => files.map((f) => `"${f}"`).join(' ');

const isBuildArtifact = (file) =>
  /\/(\.vercel|\.vinext|\.next|\.output|dist|dev-dist|node_modules)(\/|$)/.test(file) ||
  file.endsWith('package-lock.json');

const withoutBuildArtifacts = (files) => files.filter((file) => !isBuildArtifact(file));

module.exports = {
  '**/*.{js,jsx,ts,tsx,json,yml,yaml}': (files) => {
    const lintable = withoutBuildArtifacts(files).filter(
      (file) =>
        !file.startsWith('cypress/') &&
        file !== 'cypress.config.ts' &&
        file !== 'crowdin.yml' &&
        file !== '.releaserc.yaml'
    );
    if (!lintable.length) return [];
    return `eslint --cache --fix ${quote(lintable)}`;
  },
  'components/**/*.{tsx,scss}': (files) => {
    const lintable = withoutBuildArtifacts(files);
    if (!lintable.length) return [];
    return `node scripts/run-staged-component-tests.mjs ${quote(lintable)}`;
  },
  'cypress/**/*.{js,jsx,ts,tsx}': (files) =>
    `eslint --no-eslintrc -c eslint.cypress.cjs --cache --fix ${quote(withoutBuildArtifacts(files))}`,
  'cypress.config.ts': (files) =>
    `eslint --no-eslintrc -c eslint.cypress.cjs --cache --fix ${quote(withoutBuildArtifacts(files))}`,
  '{crowdin.yml,.releaserc.yaml}': (files) =>
    `eslint --no-eslintrc -c eslint.cypress.cjs --cache --fix ${quote(withoutBuildArtifacts(files))}`,
};
