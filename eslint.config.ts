import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const gitignorePath = path.resolve(dirname, '.gitignore');

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    includeIgnoreFile(gitignorePath),
    {
        ignores: [
            '**/dist/**',
            '**/.node_modules/**',
            '**/coverage/**',
            '**/.github/**',
            '**/prettier.config.js',
            'docs/.venv/**',
            'prettier.config.js',
            'frontend/prettier.config.js',
        ],
        files: ['**/*.ts', '**/*.cts', '**.*.mts'],
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
            // All @typescript-eslint configuration options are listed.
            // If the rules are commented, they are configured by the inherited configurations.

            '@typescript-eslint/adjacent-overload-signatures': 'error',
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/ban-ts-comment': ['error', { minimumDescriptionLength: 10 }],
            '@typescript-eslint/ban-tslint-comment': 'error',
            camelcase: 'off',
            '@typescript-eslint/class-literal-property-style': 'error',
            'class-methods-use-this': 'off',
            '@typescript-eslint/class-methods-use-this': ['error', { ignoreOverrideMethods: true }],
            '@typescript-eslint/consistent-generic-constructors': 'error',
            '@typescript-eslint/consistent-indexed-object-style': 'error',
            'consistent-return': 'off',
            '@typescript-eslint/consistent-return': 'off',
            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/consistent-type-exports': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            'default-param-last': 'off',
            '@typescript-eslint/default-param-last': 'error',
            'dot-notation': 'off',
            '@typescript-eslint/dot-notation': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-member-accessibility': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            'init-declarations': 'off',
            '@typescript-eslint/init-declarations': 'off',
            'max-params': 'off',
            '@typescript-eslint/max-params': 'off',
            '@typescript-eslint/member-ordering': 'error',
            '@typescript-eslint/method-signature-style': 'off', // Don't care about TypeScript strict mode.
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    // Enforce that all variables, functions and properties are camelCase
                    selector: 'variableLike',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'variable',
                    modifiers: ['const'],
                    format: ['camelCase', 'UPPER_CASE'],
                    trailingUnderscore: 'allow',
                    leadingUnderscore: 'allow',
                },
                {
                    // Enforce that private members are prefixed with an underscore
                    selector: 'memberLike',
                    modifiers: ['private'],
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
            ],
            'no-array-constructor': 'off',
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/no-array-delete': 'error',
            '@typescript-eslint/no-base-to-string': 'off',
            '@typescript-eslint/no-confusing-non-null-assertion': 'error',
            '@typescript-eslint/no-confusing-void-expression': 'error',
            '@typescript-eslint/no-deprecated': 'error',
            'no-dupe-class-members': 'off',
            '@typescript-eslint/no-dupe-class-members': 'off',
            '@typescript-eslint/no-duplicate-enum-values': 'error',
            'no-duplicate-imports': 'off',
            '@typescript-eslint/no-duplicate-type-constituents': 'off',
            '@typescript-eslint/no-dynamic-delete': 'error',
            'no-empty-function': 'off',
            '@typescript-eslint/no-empty-function': 'error',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-empty-object-type': 'error',
            '@typescript-eslint/no-explicit-any': 'error', // Once in production, this should be an error.
            '@typescript-eslint/no-extra-non-null-assertion': 'error',
            '@typescript-eslint/no-extraneous-class': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-for-in-array': 'error',
            'no-implied-eval': 'off',
            '@typescript-eslint/no-implied-eval': 'error',
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/no-inferrable-types': 'error',
            'no-invalid-this': 'off',
            '@typescript-eslint/no-invalid-this': 'off',
            '@typescript-eslint/no-invalid-void-type': 'error',
            'no-loop-func': 'off',
            '@typescript-eslint/no-loop-func': 'error',
            'no-loss-of-precision': 'off',
            '@typescript-eslint/no-loss-of-precision': 'off',
            'no-magic-numbers': 'off',
            '@typescript-eslint/no-magic-numbers': 'off',

            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': 'off',

            '@typescript-eslint/no-type-alias': 'off',

            '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',

            '@typescript-eslint/no-unnecessary-type-arguments': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/no-unnecessary-type-constraint': 'error',
            '@typescript-eslint/no-unnecessary-type-parameters': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'error',

            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': 'error',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': 'off',

            '@typescript-eslint/parameter-properties': 'off',

            '@typescript-eslint/prefer-find': 'error',

            '@typescript-eslint/prefer-function-type': 'error',

            '@typescript-eslint/prefer-readonly-parameter-types': 'off',
            '@typescript-eslint/prefer-reduce-type-parameter': 'error',

            '@typescript-eslint/promise-function-async': 'error',

            '@typescript-eslint/require-array-sort-compare': 'error',

            'no-await-in-loop': 'error',
            'no-constructor-return': 'error',
            'no-inner-declarations': 'error',
            'no-self-compare': 'error',
            'no-template-curly-in-string': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-unreachable-loop': 'error',
            'no-useless-assignment': 'error',

            'arrow-body-style': ['error', 'as-needed'],
            'block-scoped-var': 'error',
            'capitalized-comments': 'error',
            'consistent-this': 'error',
            curly: 'error',
            'default-case': 'error',
            'default-case-last': 'error',
            eqeqeq: 'error',
            'func-names': 'error',
            'func-style': ['error', 'declaration'],
            'grouped-accessor-pairs': ['error', 'getBeforeSet'],
            'guard-for-in': 'error',
            'logical-assignment-operators': 'error',
            'max-classes-per-file': 'error',
            'no-alert': 'error',
            'no-bitwise': 'error',
            'no-console': 'error',
            'no-continue': 'error',
            'no-else-return': 'error',
            'no-eq-null': 'error',
            'no-eval': 'error',
            'no-extend-native': 'error',
            'no-extra-label': 'error',
            'no-implicit-coercion': 'error',
            'no-iterator': 'error',
            'no-label-var': 'error',
            'no-labels': 'error',
            'no-multi-assign': 'error',
            'no-nested-ternary': 'error',
            'no-object-constructor': 'error',
        },
    },
];
