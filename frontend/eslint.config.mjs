// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['build/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'writable',
      },
    },
    plugins: {
      react: reactPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules, // disables rules conflicting with Prettier
      'prettier/prettier': 'error', // enables prettier as ESLint rule
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': [
        'warn',
        { varsIgnorePattern: 'React|Router|Route | Link' },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
