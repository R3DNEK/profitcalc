module.exports = {
    extends: ['@ni/eslint-config/typescript', '@ni/eslint-config/typescript-requiring-type-checking'],
    env: {
        es6: true,
        node: true,
        'jest/globals': true
    },
    plugins: ['@typescript-eslint', 'jest'],
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        project: 'tsconfig.json'
    },
    rules: {
        'no-console': 'off',
        'import/no-default-export': 'off'
    },
    settings: {
        jest: {
            version: 26
        }
    }
};
