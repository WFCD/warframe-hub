import js from '@eslint/js';
import { fixupPluginRules } from '@eslint/compat';
import stylistic from '@stylistic/eslint-plugin';
import preferArrow from 'eslint-plugin-prefer-arrow';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import i18next from 'eslint-plugin-i18next';
import cypress from 'eslint-plugin-cypress';
import jsonc from 'eslint-plugin-jsonc';
import yml from 'eslint-plugin-yml';
import type { Linter } from 'eslint';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const reactPlugin = fixupPluginRules(react);
const jsxA11yPlugin = fixupPluginRules(jsxA11y);
const preferArrowPlugin = fixupPluginRules(preferArrow);

const stylisticRules: Linter.RulesRecord = {
  '@stylistic/semi': ['error', 'always'],
  '@stylistic/quotes': [
    'error',
    'single',
    {
      avoidEscape: true,
      allowTemplateLiterals: 'always',
    },
  ],
  '@stylistic/arrow-parens': ['error', 'always'],
  '@stylistic/comma-dangle': ['error', 'only-multiline'],
  '@stylistic/object-curly-spacing': ['error', 'always'],
  '@stylistic/quote-props': ['error', 'as-needed'],
  '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
  '@stylistic/eol-last': ['error', 'always'],
  '@stylistic/no-trailing-spaces': 'error',
  '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
  '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
  '@stylistic/space-before-blocks': ['error', 'always'],
  '@stylistic/space-infix-ops': 'error',
  '@stylistic/jsx-quotes': ['error', 'prefer-single'],
  '@stylistic/max-len': [
    'error',
    {
      code: 120,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
    },
  ],
  '@stylistic/member-delimiter-style': [
    'error',
    {
      multiline: { delimiter: 'semi', requireLast: true },
      singleline: { delimiter: 'semi', requireLast: false },
    },
  ],
  '@stylistic/type-annotation-spacing': 'error',
};

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      '.vercel/**',
      '.vinext/**',
      '.next/**',
      '.nuxt/**',
      '.output/**',
      'dist/**',
      'dev-dist/**',
      'public/**',
      'static/**',
      'next/**',
      'next-env.d.ts',
      'cypress/screenshots/**',
      'cypress/videos/**',
      '**/package-lock.json',
      'tsconfig.tsbuildinfo',
      '**/sw.js',
      '**/workbox-*.js',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs['disable-legacy'],

  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    plugins: {
      '@stylistic': stylistic,
      'prefer-arrow': preferArrowPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      ...stylisticRules,
      'prefer-arrow-callback': 'error',
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          disallowPrototype: true,
          singleReturnOnly: true,
          classPropertiesAllowed: false,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11yPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/no-array-index-key': 'warn',
      'react/prop-types': 'off',
      // React Compiler–style rules from react-hooks@7; defer until providers refactored.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
    },
  },

  {
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
    ignores: ['lib/locales/**', '**/*.{cy,spec,test}.{ts,tsx}'],
    plugins: {
      i18next,
    },
    rules: {
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-only',
          'should-validate-template': false,
          callees: {
            exclude: [
              'i18n(ext)?',
              't',
              'i18nCore\\.t',
              'getFixedT',
              'Error',
              'TypeError',
              'console\\..*',
              'require',
              'RegExp',
              'URL',
              'addEventListener',
              'removeEventListener',
              'includes',
              'indexOf',
              'endsWith',
              'startsWith',
              'window\\.open',
              'open',
            ],
          },
          'jsx-components': {
            exclude: ['Trans'],
          },
          'jsx-attributes': {
            exclude: [
              'className',
              'class',
              'styleName',
              'style',
              'type',
              'key',
              'id',
              'width',
              'height',
              'href',
              'src',
              'target',
              'rel',
              'role',
              'name',
              'value',
              'defaultValue',
              'checked',
              'disabled',
              'data-.*',
              'as',
              'to',
              'fill',
              'stroke',
              'viewBox',
              'xmlns',
              'd',
              'variant',
              'size',
              'color',
              'placement',
              'item',
              'tone',
              'status',
              'scroll',
              'selectionMode',
              'defaultSelectedKey',
              'panelKey',
              'columnClassName',
              'ikey',
              'hubTestMenuKey',
              'pageChromeLabel',
              'ariaLabel',
              'subtitle',
              'aria-current',
              'aria-hidden',
              'aria-live',
              'aria-atomic',
              'htmlFor',
              'html',
            ],
          },
          words: {
            exclude: [
              '[0-9!-/:-@[-`{-~]+',
              '[A-Z_-]+',
              '^Warframe$',
              '^Discord$',
              '^WFCD$',
              '^Wiki$',
              '^—$',
              '^×$',
              '^cr$',
              '^_blank$',
              '^noopener,noreferrer$',
              'https?://.*',
            ],
          },
        },
      ],
    },
  },

  {
    ...cypress.configs.recommended,
    files: ['cypress/**/*.{ts,tsx,js}', 'cypress.config.ts'],
    rules: {
      ...cypress.configs.recommended.rules,
      'cypress/no-unnecessary-waiting': 'off',
      'cypress/unsafe-to-chain-command': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'i18next/no-literal-string': 'off',
    },
  },

  ...jsonc.configs['flat/recommended-with-jsonc'].map(
    (config): Linter.Config => ({
      ...config,
      files: config.files ?? ['**/*.json', '**/*.jsonc'],
      ignores: ['**/package-lock.json', ...(config.ignores ?? [])],
      rules: {
        ...config.rules,
        'jsonc/indent': ['error', 2],
        'jsonc/comma-dangle': ['error', 'never'],
        '@stylistic/max-len': 'off',
      },
    }),
  ),

  ...yml.configs['flat/recommended'].map(
    (config): Linter.Config => ({
      ...config,
      files: config.files ?? ['**/*.{yaml,yml}'],
      rules: {
        ...config.rules,
        'yml/quotes': [
          'error',
          {
            prefer: 'single',
            avoidEscape: true,
          },
        ],
      },
    }),
  ),
);
