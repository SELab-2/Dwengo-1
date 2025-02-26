import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
    pluginJs.configs.recommended,
    prettierConfig,
    includeIgnoreFile(gitignorePath),
    {
        rules: {
            'no-await-in-loop': 'warn',
            'no-constructor-return': 'error',
            'no-duplicate-imports': 'error',
            'no-inner-declarations': 'error',
            'no-self-compare': 'error',
            'no-template-curly-in-string': 'error',
            'no-unmodified-loop-condition': 'warn',
            'no-unreachable-loop': 'warn',
            'no-use-before-define': 'error',
            'arrow-body-style': ['warn', 'always'],
            'block-scoped-var': 'warn',
            camelcase: 'warn',
            'capitalized-comments': 'warn',
            'consistent-return': 'warn',
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
            'no-loop-func': 'error',
            'no-multi-assign': 'error',
            'no-nested-ternary': 'error',
            'no-object-constructor': 'error',
        },
    },
];
