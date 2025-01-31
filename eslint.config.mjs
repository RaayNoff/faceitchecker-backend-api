// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'import/prefer-default-export': 'off',
      'no-useless-constructor': 'off',
      'class-methods-use-this': 'off',
      'no-await-in-loop': 'off',
      'linebreak-style': 'off',
      'no-restricted-syntax': 'off',
      'no-redeclare': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-return-await': 'off',
      'no-path-concat': 'off',
      'no-continue': 0,
      'lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
    },
  },
);
