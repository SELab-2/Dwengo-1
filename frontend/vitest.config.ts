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
                reporter: ['text', 'json-summary', 'json'],
                // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
                reportOnFailure: true,
                exclude: ['**/*config*'],
                thresholds: {
                    lines: 60,
                    branches: 60,
                    functions: 60,
                    statements: 60
                  },
              },
        },
    }),
);
