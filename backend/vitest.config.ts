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
            exclude: ['**/*config*', '**/tests/**', 'src/*.ts'],
            thresholds: {
                lines: 60,
                branches: 60,
                functions: 60,
                statements: 60
              },
          },
    },
});
