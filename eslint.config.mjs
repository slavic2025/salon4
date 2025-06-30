// eslint.config.mjs - Varianta finală, completă și "best practice"

import { FlatCompat } from '@eslint/eslintrc'
// Importăm pachetele necesare pentru TypeScript
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // 1. Încărcăm configurațiile de bază de la Next.js
  ...compat.extends('next/core-web-vitals'),

  // 2. Bloc Unificat pentru TypeScript (Parser, Plugin, Reguli)
  // Acest bloc este acum complet și corect.
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      // Aici înregistrăm plugin-ul și rezolvăm eroarea
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      // Setăm parser-ul corect pentru a înțelege sintaxa TypeScript
      parser: tsParser,
      parserOptions: {
        project: true, // Permite reguli avansate care necesită informații de tip
      },
    },
    rules: {
      // Acum, toate regulile TypeScript sunt într-un singur loc
      '@typescript-eslint/no-floating-promises': 'error',
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

  // 3. Bloc pentru Organizarea Importurilor (rămâne neschimbat)
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
    },
  },

  // 4. LA FINAL, adăugăm configurația de la Prettier pentru a dezactiva conflictele
  eslintConfigPrettier,
]

export default eslintConfig
