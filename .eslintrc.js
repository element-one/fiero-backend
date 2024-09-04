module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'simple-import-sort',
    'unused-imports',
    'prettier',
  ],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages. `react` related packages come first.
          [
            '^@nestjs',
            'typeorm|express|class-validator|class-transformer|joi|axios|generate-password|uuid|mongodb|rxjs|nestjs-twilio|jwks-client|dayjs|path|@aws-sdk|aws-sdk|passport-twitter|handlebars|@ntegral/nestjs-sentry|@sentry/node|moment|twitter-api-v2|passport-instagram|randomstring|bignumber.js|csv-parse|bcrypt|graphql-request',
            '^(ethers|google|lodash|bn.js|@hapi|cookie-parser|passport-jwt|eth-sig-util|ethereumjs-util|jsonwebtoken|dotenv|passport-google-oauth20|fs|@sendgrid/mail|plaid|stripe|csv-parser|https|request-context|stream|pubnub)',
          ],
          // Internal packages.
          ['^@?\\w'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Side effect imports.
          ['^\\u0000'],
        ],
      },
    ],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
