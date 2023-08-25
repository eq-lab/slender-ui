const path = require('path')

module.exports = {
  env: { es2020: true, jest: true },
  extends: ['airbnb', 'next/core-web-vitals', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'import',
    'unused-imports',
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'prettier',
  ],
  rules: {
    'no-param-reassign': ['error', { props: false }],
    'no-return-await': 'error',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
    ],
    '@typescript-eslint/no-shadow': 'error',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/jsx-key': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-no-constructed-context-values': 'off',
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'import/no-unresolved': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': ['error', 'never', { json: 'always' }],
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    'no-unused-vars': 'off',
    '@next/next/no-html-link-for-pages': [
      'error',
      [
        path.join(__dirname, 'packages/app/src/app/'),
        path.join(__dirname, 'packages/landing/src/app/'),
      ],
    ],
  },
  globals: {
    globalThis: false,
    React: 'readonly',
    AriaAttributes: 'readonly',
    DOMAttributes: 'readonly',
    HTMLAnchorElement: 'readonly',
    JSX: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: path.join(__dirname, 'packages/*/tsconfig.json'),
      },
    },
  },
}
