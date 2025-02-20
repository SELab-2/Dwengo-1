/**
 * @type {import("prettier").Options}
 */

const rootConfig = import ('../prettier.config.js');

export default {
    ...rootConfig,
    vueIndentScriptAndStyle: true,
    singleAttributePerLine: true
};
