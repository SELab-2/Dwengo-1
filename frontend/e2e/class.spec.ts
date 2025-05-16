import { test, expect } from "@playwright/test"

test("Teacher can create a class", async ({ page }) => {
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

test('Teacher can share a class by code', async ({ page }) => {
    await page.goto("/")

    // Login
    await page.getByRole("link", { name: "log in" }).click();
    await page.getByRole("button", { name: "teacher" }).click();
    await page.getByRole("textbox", { name: "Username or email" }).fill("testleerkracht1");
    await page.getByRole("textbox", { name: "Password" }).fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Go to classes
    await expect(page.getByRole('banner').getByRole('link', { name: 'Classes' })).toBeVisible();
    await page.getByRole('banner').getByRole('link', { name: 'Classes' }).click();

    await expect(page.getByRole('row', { name: 'class01' }).locator('i').nth(1)).toBeVisible();
    await page.getByRole('row', { name: 'class01' }).locator('i').nth(1).click();
    await expect(page.getByRole('button').filter({ hasText: /^$/ }).nth(2)).toBeVisible();
    await expect(page.getByRole('button').filter({ hasText: /^$/ }).nth(3)).toBeVisible();
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
    await expect(page.getByText('copied!')).toBeVisible();
    await page.getByRole('button', { name: 'close' }).click();
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
    await page.getByRole('textbox', { name: 'CODE CODE' }).fill('X2J9QT');
    await page.getByRole('button', { name: 'submit' }).click();
    await expect(page.getByText('failed: Request failed with status code 404', { exact: true })).toBeVisible();
});

test('Teacher can remove student from class', async ({ page }) => {
    await page.goto("/")

    // Login
    await page.getByRole("link", { name: "log in" }).click();
    await page.getByRole("button", { name: "teacher" }).click();
    await page.getByRole("textbox", { name: "Username or email" }).fill("testleerkracht1");
    await page.getByRole("textbox", { name: "Password" }).fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole('banner').getByRole('link', { name: 'Classes' })).toBeVisible();
    await page.getByRole('banner').getByRole('link', { name: 'Classes' }).click();
    await expect(page.getByRole('link', { name: 'class01' })).toBeVisible();
    await expect(page.locator('#app')).toContainText('8');
    await page.getByRole('link', { name: 'class01' }).click();
    await expect(page.getByRole('cell', { name: 'Kurt Cobain' })).toBeVisible();
    await expect(page.getByRole('row', { name: 'Kurt Cobain remove' }).getByRole('button')).toBeVisible();
    await page.getByRole('row', { name: 'Kurt Cobain remove' }).getByRole('button').click();
    await expect(page.getByText('Are you sure?')).toBeVisible();
    await expect(page.getByRole('button', { name: 'cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'yes' })).toBeVisible();
    await page.getByRole('button', { name: 'yes' }).click();
    await page.getByRole('banner').getByRole('link', { name: 'Classes' }).click();
    await expect(page.locator('#app')).toContainText('7');
});
