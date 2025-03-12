import globals from 'globals';
import rootConfig from '../eslint.config';

export default [
    ...rootConfig,
    {
        languageOptions: {
            globals: globals.node,
        },
    },

    {
        files: [ 'tests/**/*.ts'],
        languageOptions: {
            globals: globals.node
        },
        rules: {
            'no-console': 'off'
        }
    }
];
