import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import promisePlugin from 'eslint-plugin-promise';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.eslint.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'promise': promisePlugin,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^(call|callback|_)$' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/await-thenable': 'error',
      'no-async-promise-executor': 'error',
      'promise/catch-or-return': 'error',
      '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-misused-promises': ['error', {
        checksConditionals: true,
        checksVoidReturn: false
      }],
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'indent': ['error', 4],
      'comma-dangle': ['error', 'never'],
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      'no-console': 'warn',
    },
    ignores: ['node_modules/', 'dist/'],
  },
];