import pluginVue from "eslint-plugin-vue";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVitest from "@vitest/eslint-plugin";
import pluginPlaywright from "eslint-plugin-playwright";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import rootConfig from "../eslint.config";

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// Import { configureVueProject } from '@vue/eslint-config-typescript'
// ConfigureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

const vueConfig = defineConfigWithVueTs(
    {
        name: "app/files-to-lint",
        files: ["**/*.{ts,mts,tsx,vue}"],
        rules: {
            "no-useless-assignment": "off", // Depend on `no-unused-vars` to catch this
        },
    },

    {
        name: "app/files-to-ignore",
        ignores: [
            "**/dist/**",
            "**/dist-ssr/**",
            "**/coverage/**",
            "prettier.config.js",
            "**/test-results/**",
            "**/playwright-report/**",
        ],
    },

    pluginVue.configs["flat/essential"],
    vueTsConfigs.recommended,

    {
        ...pluginVitest.configs.recommended,
        files: ["src/**/__tests__/*"],
    },

    {
        ...pluginPlaywright.configs["flat/recommended"],
        files: ["e2e/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    },
    skipFormatting,
);

export default [...rootConfig, ...vueConfig];
