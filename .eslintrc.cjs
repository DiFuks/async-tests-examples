require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['eslint-config-fuks'],
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  rules: {
    'jsdoc/require-jsdoc': 'off',
    'no-relative-imports/no-relative-imports': 'off',
    'i18next/no-literal-string': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
  },
  overrides: [
    {
      files: ['*.json'],
      parserOptions: {
        project: false,
      },
    },
    {
      files: ['*.spec.ts', '*.spec.tsx'],
      extends: ['plugin:vitest/recommended', 'plugin:testing-library/react'],
      rules: {
        'vitest/no-disabled-tests': 'warn',
        'vitest/no-focused-tests': 'warn',
        'vitest/no-conditional-expect': 'warn',
        'vitest/no-conditional-tests': 'warn',
        'vitest/valid-expect': [
          'error',
          {
            maxArgs: 2,
          },
        ],
        'testing-library/prefer-user-event': ['error'],
      },
    },
  ],
};
