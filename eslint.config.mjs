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
      indent: ['error', 2],

      // --- integração com prettier ---
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          trailingComma: 'none',
          printWidth: 100,
          tabWidth: 2,
          endOfLine: 'auto'
        }
      ]
    }
  }
]

export default eslintConfig
