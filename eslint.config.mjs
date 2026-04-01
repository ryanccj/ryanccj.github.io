import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const customNextVitals = nextVitals.map((config) =>
  config.name === 'next'
    ? {
        ...config,
        rules: {
          ...config.rules,
          'jsx-a11y/anchor-is-valid': [
            'error',
            {
              components: ['Link'],
              specialLink: ['hrefLeft', 'hrefRight'],
              aspects: ['invalidHref', 'preferButton'],
            },
          ],
          'react-hooks/set-state-in-effect': 'off',
          'react/no-unescaped-entities': 'off',
        },
      }
    : config
)

const customNextTypescript = nextTypescript.map((config) =>
  config.rules
    ? {
        ...config,
        rules: {
          ...config.rules,
          '@typescript-eslint/ban-ts-comment': 'off',
          '@typescript-eslint/explicit-module-boundary-types': 'off',
          '@typescript-eslint/no-require-imports': 'off',
          '@typescript-eslint/no-unused-vars': 'off',
        },
      }
    : config
)

export default defineConfig([
  ...customNextVitals,
  ...customNextTypescript,
  globalIgnores(['node_modules/**', '.contentlayer/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
