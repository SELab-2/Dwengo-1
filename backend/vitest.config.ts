import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        testTimeout: 100000,
        coverage: {
            reporter: ['text', 'json-summary', 'json'],
            // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
            reportOnFailure: true,
            exclude: ['**/*config*', '**/tests/**', 'src/*.ts', '**/dist/**', '**/node_modules/**', 'src/logging/**', 'src/routes/**'],
            thresholds: {
                lines: 50,
                branches: 50,
                functions: 50,
                statements: 50,
            },
        },
    },
});
