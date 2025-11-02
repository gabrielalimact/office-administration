import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['.next/**', 'dist/**', 'build/**', 'out/**', 'coverage/**'],
    rules: {
      // --- estilo base ---
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'quote-props': ['error', 'as-needed'],
      quotes: ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],

      // --- TypeScript rules - mais tolerantes para desenvolvimento ---
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',

      // --- React hooks ---
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
]

export default eslintConfig
