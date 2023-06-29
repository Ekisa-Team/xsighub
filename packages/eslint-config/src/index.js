module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    plugins: ['@typescript-eslint'],
    ignorePatterns: ['*.cjs'],
    overrides: [
        {
            files: ['*.ts'],
            rules: {
                '@typescript-eslint/no-unused-vars': 'error',
                '@typescript-eslint/explicit-function-return-type': [
                    'error',
                    {
                        allowHigherOrderFunctions: true,
                        allowFunctionsWithoutTypeParameters: true,
                        allowIIFEs: true,
                    },
                ],
                '@typescript-eslint/no-explicit-any': 'error',
            },
        },
    ],
    rules: {
        '@typescript-eslint/no-empty-function': 'off',
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
    },
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
};
