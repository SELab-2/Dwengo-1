import { test, expect } from "@playwright/test";

test("Users can filter", async ({ page }) => {
    await page.goto("/");

    // Login
    await page.getByRole("link", { name: "log in" }).click();
    await page.getByRole("button", { name: "teacher" }).click();
    await page.getByRole("textbox", { name: "Username or email" }).fill("testleerkracht1");
    await page.getByRole("textbox", { name: "Password" }).fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Filter
    await page.getByRole("combobox").filter({ hasText: "Select a themeAll" }).locator("i").click();
    await page.getByText("Nature and climate").click();
    await page.getByRole("combobox").filter({ hasText: "Select ageAll agesSelect age" }).locator("i").click();
    await page.getByText("and older").click();

    await expect(page.getByRole("link", { name: "AI and Climate Students in" })).toBeVisible();
});
