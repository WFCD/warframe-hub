/** ESLint for Cypress specs, config files, and shared YAML. */
const path = require('node:path');

const repoRoot = __dirname;
const rootModules = path.join(repoRoot, 'node_modules');

const resolveFromRoot = (pkg) => require.resolve(pkg, { paths: [rootModules] });

const cypressTsRules = {
  'cypress/no-assigning-return-values': 'error',
  'cypress/no-unnecessary-waiting': 'off',
  'cypress/assertion-before-screenshot': 'warn',
  'cypress/no-force': 'warn',
  'cypress/no-async-tests': 'error',
  'cypress/no-pause': 'error',
  'cypress/unsafe-to-chain-command': 'off',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/no-require-imports': 'off',
  '@typescript-eslint/no-unused-expressions': 'off',
};

module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@stylistic/disable-legacy'],
  plugins: ['@stylistic', 'cypress'],
  rules: {
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/comma-dangle': ['error', 'only-multiline'],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/quote-props': ['error', 'as-needed'],
  },
  overrides: [
    {
      files: ['cypress/**/*.ts', 'cypress.config.ts'],
      parser: resolveFromRoot('@typescript-eslint/parser'),
      plugins: ['@typescript-eslint', 'cypress'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: path.join(repoRoot, 'cypress/tsconfig.json'),
      },
      extends: ['plugin:@typescript-eslint/recommended', 'plugin:cypress/recommended'],
      env: {
        'cypress/globals': true,
        mocha: true,
      },
      rules: cypressTsRules,
    },
    {
      files: ['**/*.{yaml,yml}'],
      parser: resolveFromRoot('yaml-eslint-parser'),
      plugins: ['yml'],
      extends: ['plugin:yml/recommended'],
      rules: {
        'yml/quotes': [
          'error',
          {
            prefer: 'single',
            avoidEscape: true,
          },
        ],
      },
    },
  ],
};
