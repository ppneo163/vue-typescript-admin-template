module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/member-delimiter-style': ['error',
      {
        multiline: {
          delimiter: 'none'
        },
        singleline: {
          delimiter: 'comma'
        }
      }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/match-component-file-name': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': ['error', 'never'],
    'array-bracket-spacing': 'error',
    'arrow-spacing': 'error',
    'block-spacing': 'error',
    'brace-style': 'error',
    'comma-dangle': 'error',
    'key-spacing': 'error',
    'object-curly-spacing': 'error',
    'default-case': 'error',
    'dot-location': ['error', 'object'],
    'dot-notation': ['error', { allowKeywords: true }],
    'guard-for-in': 'error',
    camelcase: 'error',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    curly: ['error', 'all'],
    eqeqeq: ['error', 'always']
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
