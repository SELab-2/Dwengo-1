/* eslint-disable no-await-in-loop */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { test as baseTest, expect } from "@playwright/test";
import type { Browser } from "playwright-core";
import fs from "fs";
import path from "path";

/* Based on https://playwright.dev/docs/auth#moderate-one-account-per-parallel-worker */

export * from "@playwright/test";
export const ROOT_URL = "http://localhost:5173";

interface Account {
    username: string;
    password: string;
}

/**
 * Acquire an account by logging in or creating a new one.
 * @param id
 * @param browser
 */
async function acquireAccount(id: number, browser: Browser): Promise<Account> {
    const account = {
        username: `worker${id}`,
        password: "password",
    };

    const page = await browser.newPage();
    await page.goto(ROOT_URL);

    await page.getByRole("link", { name: "log in" }).click();
    await page.getByRole("button", { name: "student" }).click();

    await page.getByRole("textbox", { name: "Username" }).fill(account.username);
    await page.getByRole("textbox", { name: "Password", exact: true }).fill(account.password);
    await page.getByRole("button", { name: "Sign In" }).click();

    let failed = await page.getByText("Invalid username or password.").isVisible();

    if (failed) {
        await page.getByRole("link", { name: "Register" }).click();
    }

    const MAX_RETRIES = 5;
    let retries = 0;
    while (failed && retries < MAX_RETRIES) {
        // Retry with a different username, based on Unix timestamp.
        account.username = `worker${id}-${Date.now()}`;

        await page.getByRole("textbox", { name: "Username" }).fill(account.username);
        await page.getByRole("textbox", { name: "Password", exact: true }).fill(account.password);
        await page.getByRole("textbox", { name: "Confirm password" }).fill(account.password);
        await page.getByRole("textbox", { name: "Email" }).fill(`${account.username}@dwengo.org`);
        await page.getByRole("textbox", { name: "First name" }).fill("Worker");
        await page.getByRole("textbox", { name: "Last name" }).fill(id.toString());
        await page.getByRole("button", { name: "Register" }).click();

        await page.waitForURL(/localhost/);

        failed = await page.getByText("Username already exists.").isVisible();
        retries += failed ? 1 : 0;
    }

    await page.waitForURL(/localhost/);
    await page.close();

    return account;
}

export const test = baseTest.extend<object, { workerStorageState: string }>({
    // Use the same storage state for all tests in this worker.
    storageState: async ({ workerStorageState }, use) => use(workerStorageState),

    // Authenticate once per worker with a worker-scoped fixture.
    workerStorageState: [
        async ({ browser }, use): Promise<void> => {
            // Use parallelIndex as a unique identifier for each worker.
            const id = test.info().parallelIndex;
            const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

            if (fs.existsSync(fileName)) {
                // Reuse existing authentication state if any.
                await use(fileName);
                return;
            }

            // Important: make sure we authenticate in a clean environment by unsetting storage state.
            const page = await browser.newPage({ storageState: undefined });

            // Acquire a unique account by creating a new one.
            const account = await acquireAccount(id, browser);

            // Perform authentication steps. Replace these actions with your own.
            await page.goto(ROOT_URL);
            await page.getByRole("link", { name: "log in" }).click();
            await page.getByRole("button", { name: "student" }).click();
            await page.getByRole("textbox", { name: "Username or email" }).fill(account.username);
            await page.getByRole("textbox", { name: "Password" }).fill(account.password);
            await page.getByRole("button", { name: "Sign In" }).click();
            // Wait until the page receives the cookies.
            //
            // Sometimes login flow sets cookies in the process of several redirects.
            // Wait for the final URL to ensure that the cookies are actually set.
            await page.waitForLoadState("domcontentloaded");
            // Alternatively, you can wait until the page reaches a state where all cookies are set.

            // End of authentication steps.

            await page.context().storageState({ path: fileName });
            await page.close();
            await use(fileName);
        },
        { scope: "worker" },
    ],
});
