module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@stylistic/disable-legacy',
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jsx-a11y', '@stylistic'],
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
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    '.vercel/',
    '.vinext/',
    '.output/',
    'dist/',
    'dev-dist/',
    'public/',
    'next-env.d.ts',
    'cypress/screenshots/',
    'cypress/videos/',
    '**/package-lock.json',
  ],
  overrides: [
    {
      files: ['**/*.json', '**/*.jsonc'],
      excludedFiles: ['**/package-lock.json'],
      parser: 'jsonc-eslint-parser',
      plugins: ['jsonc'],
      extends: ['plugin:jsonc/recommended-with-jsonc'],
      rules: {
        'jsonc/indent': ['error', 2],
        'jsonc/comma-dangle': ['error', 'never'],
        '@stylistic/max-len': 'off',
      },
    },
    {
      files: ['**/*.{yaml,yml}'],
      parser: 'yaml-eslint-parser',
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
    {
      files: ['cypress.config.ts', '**/cypress.config.ts'],
      env: { node: true },
      parserOptions: { sourceType: 'commonjs' },
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
