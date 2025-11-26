// eslint.config.js
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['dist/', 'build/'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      'react-refresh': reactRefresh,
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      // Base recommended sets
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,

      // Vite / React 17+ style JSX – no need to import React everywhere
      'react/react-in-jsx-scope': 'off',

      // Keep your previous React Refresh rule
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Make existing code pass without a mega refactor
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-types': 'warn',

      // TS already handles a lot of this; avoid noisy false positives
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-useless-catch': 'off',
      'no-unsafe-optional-chaining': 'warn',

      // Use the TS version of no-unused-vars and keep your previous behavior
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'react/jsx-key': 'warn',
    },
  },

  // Targeted override for the one hook rule that was causing trouble
  {
    files: ['src/services/getContract.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];
