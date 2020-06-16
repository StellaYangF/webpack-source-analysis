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
  rules: {
    indent: ['error', 2],
    semi: ['error', 'always'],
  },
};
