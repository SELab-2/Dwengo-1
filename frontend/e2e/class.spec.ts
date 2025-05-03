import { test, expect } from "@playwright/test"

test("Teacher create a class", async ({ page }) => {
    await page.goto("/")

    // Login
    await page.getByRole("link", { name: "log in" }).click();
    await page.getByRole("button", { name: "teacher" }).click();
    await page.getByRole("textbox", { name: "Username or email" }).fill("testleerkracht1");
    await page.getByRole("textbox", { name: "Password" }).fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Go to class
    await expect(page.getByRole('banner').getByRole('link', { name: 'Classes' })).toBeVisible();
    await page.getByRole('banner').getByRole('link', { name: 'Classes' }).click();

    await expect(page.getByRole('heading', { name: 'Classes' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'classname classname' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'create' })).toBeVisible();

    await page.getByRole('textbox', { name: 'classname classname' }).click();
    await page.getByRole('textbox', { name: 'classname classname' }).fill('DeTijdLoze');
    await page.getByRole('button', { name: 'create' }).click();

    await expect(page.getByRole('dialog').getByText('code')).toBeVisible();
    await expect(page.getByRole('button', { name: 'close' })).toBeVisible();
});
