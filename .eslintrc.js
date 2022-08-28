module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['regex'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/no-unused-vars': [
            'error',
            { 'argsIgnorePattern': '^_', 'destructuredArrayIgnorePattern': '^_' },
        ],
        '@typescript-eslint/ban-ts-comment': 'error',
        '@typescript-eslint/ban-types': 'error',
    },
    env: {
        jest: true,
        node: true,
    },
};
