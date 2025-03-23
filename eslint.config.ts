import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    includeIgnoreFile(gitignorePath),
    {
        ignores: ['**/dist/**', '**/.node_modules/**', '**/coverage/**', '**/.github/**'],
        files: ['**/*.ts', '**/*.cts', '**.*.mts', '**/*.ts'],
    },
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        linterOptions: {
            reportUnusedInlineConfigs: 'error',
        },
        rules: {
            'consistent-return': 'off',
            '@typescript-eslint/consistent-return': 'off',
            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/consistent-type-exports': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',

            '@typescript-eslint/explicit-function-return-type': 'warn',

            '@typescript-eslint/naming-convention': [
                'warn',
                { // Enforce that all variables, functions and properties are camelCase
                    selector: 'variableLike',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow'
                },
                {
                    selector: 'variable',
                    modifiers: ['const'],
                    format: ['camelCase', 'UPPER_CASE'],
                    trailingUnderscore: 'allow'
                },
                { // Enforce that private members are prefixed with an underscore
                    selector: 'memberLike',
                    modifiers: ['private'],
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                }
            ],

            'no-dupe-class-members': 'off',
            '@typescript-eslint/no-dupe-class-members': 'off',
            '@typescript-eslint/no-duplicate-enum-values': 'error',
            'no-duplicate-imports': 'off',
            '@typescript-eslint/no-duplicate-type-constituents': 'off',

            // 'no-empty-function': 'off',
            '@typescript-eslint/no-empty-function': 'error',

            'no-loop-func': 'off',
            '@typescript-eslint/no-loop-func': 'error',

            '@typescript-eslint/no-type-alias': 'off',

            '@typescript-eslint/no-unnecessary-type-arguments': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/no-unnecessary-type-constraint': 'error',
            '@typescript-eslint/no-unnecessary-type-parameters': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'error',

            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    'args': 'all',
                    'argsIgnorePattern': '^_',
                    'caughtErrors': 'all',
                    'caughtErrorsIgnorePattern': '^_',
                    'varsIgnorePattern': '^_',
                    'ignoreRestSiblings': true,
                }
            ],
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': 'off',

            '@typescript-eslint/prefer-function-type': 'error',

            '@typescript-eslint/promise-function-async': 'warn',

            'no-await-in-loop': 'warn',
            'no-constructor-return': 'error',
            'no-inner-declarations': 'error',
            'no-self-compare': 'error',
            'no-template-curly-in-string': 'error',
            'no-unmodified-loop-condition': 'warn',
            'no-unreachable-loop': 'warn',
            'no-useless-assignment': 'error',

            'arrow-body-style': ['warn', 'as-needed'],
            'block-scoped-var': 'warn',
            'capitalized-comments': 'warn',
            'consistent-this': 'error',
            curly: 'error',
            'default-case': 'error',
            'default-case-last': 'error',
            'default-param-last': 'error',
            'dot-notation': 'warn',
            eqeqeq: 'error',
            'func-names': 'warn',
            'func-style': ['warn', 'declaration'],
            'grouped-accessor-pairs': ['warn', 'getBeforeSet'],
            'guard-for-in': 'warn',
            'logical-assignment-operators': 'warn',
            'max-classes-per-file': 'warn',
            'no-alert': 'error',
            'no-array-constructor': 'warn',
            'no-bitwise': 'warn',
            'no-console': 'warn',
            'no-continue': 'warn',
            'no-else-return': 'warn',
            'no-empty-function': 'warn',
            'no-eq-null': 'error',
            'no-eval': 'error',
            'no-extend-native': 'error',
            'no-extra-label': 'error',
            'no-implicit-coercion': 'warn',
            'no-implied-eval': 'error',
            'no-invalid-this': 'error',
            'no-iterator': 'error',
            'no-label-var': 'warn',
            'no-labels': 'warn',
            'no-multi-assign': 'error',
            'no-nested-ternary': 'error',
            'no-object-constructor': 'error',
        },
    },
];
