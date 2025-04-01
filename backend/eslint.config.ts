import globals from 'globals';
import rootConfig from '../eslint.config';

export default [
    ...rootConfig,
    {
        languageOptions: {
            globals: globals.node,
        },
    },
];
