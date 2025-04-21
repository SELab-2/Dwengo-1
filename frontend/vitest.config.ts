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

            /*
             * The test-backend server can be started for each test-file individually using `beforeAll(() => setup())`,
             * or for all tests once using:
             globalSetup: ["./tests/setup-backend.ts"],
             * In this project, the backend server is started for each test-file individually.
             */
        },
    }),
);
