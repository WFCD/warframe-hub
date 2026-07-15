const quote = (files: string[]) => files.map((f) => `"${f}"`).join(' ');

const isBuildArtifact = (file: string) =>
  /\/(\.vercel|\.vinext|\.next|\.output|dist|dev-dist|node_modules)(\/|$)/.test(file) ||
  file.endsWith('package-lock.json');

const withoutBuildArtifacts = (files: string[]) => files.filter((file) => !isBuildArtifact(file));

const config = {
  '**/*.{js,jsx,ts,tsx,json,yml,yaml}': (files: string[]) => {
    const lintable = withoutBuildArtifacts(files);
    if (!lintable.length) return [];
    return `eslint --cache --fix ${quote(lintable)}`;
  },
  'components/**/*.{tsx,scss}': (files: string[]) => {
    const lintable = withoutBuildArtifacts(files);
    if (!lintable.length) return [];
    return `node scripts/run-staged-component-tests.mjs ${quote(lintable)}`;
  },
};

export default config;
