import { test, expect } from "./fixtures.js";

test("myTest", async ({ page }) => {
    await expect(page).toHaveURL("/");
});
