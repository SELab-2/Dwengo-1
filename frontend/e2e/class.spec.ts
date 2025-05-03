import { test, expect } from "@playwright/test"

test("Teacher create a class", async ({ page }) => {
    const className = "DeTijdLoze"

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

    // Check if the class page is visible
    await expect(page.getByRole('heading', { name: 'Classes' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'classname classname' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'create' })).toBeVisible();

    // Create a class
    await page.getByRole('textbox', { name: 'classname classname' }).click();
    await page.getByRole('textbox', { name: 'classname classname' }).fill(className);
    await page.getByRole('button', { name: 'create' }).click();

    // Check if the class is created
    await expect(page.getByRole('dialog').getByText('code')).toBeVisible();
    await expect(page.getByRole('button', { name: 'close' })).toBeVisible();
});

test("Student can join class by code", async ({ page }) => {
    await page.goto("/")

    // Login
    await page.getByRole("link", { name: "log in" }).click();
    await page.getByRole("button", { name: "student" }).click();
    await page.getByRole("textbox", { name: "Username or email" }).fill("testleerling1");
    await page.getByRole("textbox", { name: "Password" }).fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Go to class
    await expect(page.getByRole('banner').getByRole('link', { name: 'Classes' })).toBeVisible();
    await page.getByRole('banner').getByRole('link', { name: 'Classes' }).click();

    // Check if the class page is visible
    await expect(page.getByRole('heading', { name: 'Classes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Join class' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'CODE CODE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'submit' })).toBeVisible();

    // Join a class
    await page.getByRole('textbox', { name: 'CODE CODE' }).click();
    await page.getByRole('textbox', { name: 'CODE CODE' }).fill('16c822ca-633d-49e3-89fc-8d7a291450e6');
    await page.getByRole('button', { name: 'submit' }).click();
    await expect(page.getByText('failed: Request failed with status code 404', { exact: true })).toBeVisible();
});
