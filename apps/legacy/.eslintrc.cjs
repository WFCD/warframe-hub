module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: require.resolve('@babel/eslint-parser'),
    requireConfigFile: false,
    babelOptions: {
      presets: [require.resolve('@nuxt/babel-preset-app')],
    },
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
    'plugin:vuejs-accessibility/recommended',
  ],
  plugins: ['vuejs-accessibility'],
  rules: {
    'vue/no-use-v-if-with-v-for': 'off',
    semi: ['error', 'always'],
    'arrow-parens': ['error', 'always'],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
  },
  ignorePatterns: ['node_modules/', '.nuxt/', 'dist/'],
};
