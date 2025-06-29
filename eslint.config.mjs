// eslint.config.mjs - Varianta finală, corectată

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import eslintConfigPrettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
// Am eliminat `import tseslint from 'typescript-eslint'` de aici, deoarece nu era folosit.

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// Atribuim configuratia unei constante, rezolvând eroarea 'no-anonymous-default-export'
const eslintConfig = [
  // 1. Încărcăm configurațiile de bază de la Next.js
  ...compat.extends('next/core-web-vitals'),

  // 2. Adăugăm un bloc pentru reguli TypeScript avansate
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },

  // 3. Adăugăm un bloc pentru organizarea importurilor
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  // 4. LA FINAL, adăugăm configurația de la Prettier
  eslintConfigPrettier,
]

// Facem export la constanta denumită
export default eslintConfig
