module.exports = {
  extends: [
    'next/core-web-vitals',
  ],
  rules: {
    // Temporarily disable some rules during development
    '@typescript-eslint/no-unused-vars': 'warn', // Downgrade from error to warning
    '@typescript-eslint/no-explicit-any': 'warn', // Downgrade from error to warning
    'react/no-unescaped-entities': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-empty-object-type': 'warn'
  },
};
