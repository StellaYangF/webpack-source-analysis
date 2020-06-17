module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
  parser: 'babel-eslint',
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ['dist/**/*', 'node_modules/**/*', 'history'],
  rules: {
    indent: ['error', 2],
    semi: ['error', 'always'],
    'import/no-extraneous-dependencies': [1, { devDependencies: true }],
    'no-param-reassign': 1,
    'no-unused-vars': 1,
  },
};
