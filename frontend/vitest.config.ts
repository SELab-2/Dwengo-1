import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: "jsdom",
            exclude: [...configDefaults.exclude, "e2e/**"],
            root: fileURLToPath(new URL("./", import.meta.url)),
            testTimeout: 100000,
            coverage: {
                reporter: ["text", "json-summary", "json"],
                // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
                reportOnFailure: true,
                exclude: [
                    "**/*config*",
                    "**/tests/**",
                    "playwright-report/**",
                    "**/dist/**",
                    "**/e2e/**",
                    "**/*config*",
                    "**/node_modules/**",

                    "src/main.ts",
                    "src/router/index.ts",
                    "src/utils/constants.ts",

                    "**/*.d.ts",

                    "src/**/*.vue",
                    "src/assets/**",
                    "src/i18n/**",

                    "src/data-objects/**",
                    "src/exception/**", // TODO Might be useful to test later
                    "src/queries/**", // TODO Might be useful to test later
                    "src/views/learning-paths/gift-adapters/**", // TODO Might be useful to test later
                    "src/services/auth/**", // TODO Might be useful to test later
                ],
                thresholds: {
                    lines: 50,
                    branches: 50,
                    functions: 50,
                    statements: 50,
                },
            },

            /*
             * The test-backend server can be started for each test-file individually using `beforeAll(() => setup())`,
             * or for all tests once using:
             globalSetup: ["./tests/setup-backend.ts"],
             * In this project, the backend server is started for each test-file individually.
             */
            globalSetup: ["./tests/setup-backend.ts"],
        },
    }),
);
