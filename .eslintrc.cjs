/* eslint-env node */
module.exports = {
  // extends: [
  //   "plugin:@typescript-eslint/recommended",
  //   "plugin:@typescript-eslint/recommended-requiring-type-checking"
  // ],
  extends: [
    'eslint:recommended',
   'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
};
