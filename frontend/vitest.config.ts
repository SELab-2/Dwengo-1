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
            coverage: {
                reporter: ["text", "json-summary", "json"],
                // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
                reportOnFailure: true,
                exclude: [
                    "**/*config*",
                    "**/tests/**",
                    "src/**/*.vue",
                    "src/**/*.d.ts",
                    "src/assets/**",
                    "**/dist/**",
                    "**/e2e/**",
                    "**/*config*",
                    "**/node_modules/**",
                ],
                thresholds: {
                    lines: 60,
                    branches: 60,
                    functions: 60,
                    statements: 60,
                },
            },

            /*
             * The test-backend server can be started for each test-file individually using `beforeAll(() => setup())`,
             * or for all tests once using:
             globalSetup: ["./tests/setup-backend.ts"],
             * In this project, the backend server is started for each test-file individually.
             */
        },
    }),
);
