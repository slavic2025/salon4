// eslint.config.mjs - Varianta finală și curată

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import stylistic from '@stylistic/eslint-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // Configuratiile de bază de la Next.js
  ...compat.extends('next/core-web-vitals'),

  // Configurație globală pentru toate fișierele
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Reguli de formatare
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': 'error',
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/object-curly-newline': ['error', { multiline: true, consistent: true }],
      '@stylistic/array-element-newline': ['error', 'consistent'],
    },
  },

  // Configurație specifică pentru fișiere de configurare
  {
    files: ['*.config.{js,ts,mjs}', 'drizzle.config.ts'],
    rules: {
      '@stylistic/semi': 'off', // Dezactivează pentru fișiere de configurare
    },
  },

  // Configurație pentru fișiere TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]

export default eslintConfig
