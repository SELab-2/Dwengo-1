import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// Require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: "./e2e",
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000,
    },
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: Boolean(process.env.CI),
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 1,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: "html",
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.CI ? "http://localhost:4173" : "http://localhost:5173",

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",

        /* Only on CI systems run the tests headless */
        headless: Boolean(process.env.CI),
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
            },
        },
        {
            name: "firefox",
            use: {
                ...devices["Desktop Firefox"],
            },
        },
        {
            name: "webkit",
            use: {
                ...devices["Desktop Safari"],
            },
        },

        /* Test against mobile viewports. */
        {
            name: "Mobile Chrome",
            use: {
                ...devices["Pixel 5"],
            },
        },
        {
            name: "Mobile Safari",
            use: {
                ...devices["iPhone 12"],
            },
        },

        /* Test against branded browsers. */
        // {
        //   Name: 'Microsoft Edge',
        //   Use: {
        //     Channel: 'msedge',
        //   },
        // },
        // {
        //   Name: 'Google Chrome',
        //   Use: {
        //     Channel: 'chrome',
        //   },
        // },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // OutputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    webServer: [
        // Assuming the idp is already running (because it is slow)
        {
            /* Frontend */
            command: `VITE_API_BASE_URL='http://localhost:9876/api' ${process.env.CI ? "npm run preview" : "npm run dev"}`,
            port: process.env.CI ? 4173 : 5173,
            timeout: 120 * 1000,
            reuseExistingServer: !process.env.CI,
        },
        {
            /* Backend */
            command: `
            cd .. \
            && npx tsc --build common/tsconfig.json \
            && cd backend \
            && npx tsx --env-file=./.env.test ./tool/startTestApp.ts
            `,
            port: 9876,
            reuseExistingServer: !process.env.CI,
        },
    ],
});
