import { test, expect } from '@playwright/test';

test('Teacher can create new assignment', async ({ page }) => {
    // Login
    await page.getByRole("link", { name: "log in" }).click();
    await page.getByRole("button", { name: "teacher" }).click();
    await page.getByRole("textbox", { name: "Username or email" }).fill("testleerkracht1");
    await page.getByRole("textbox", { name: "Password" }).fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Go to assignments
    await expect(page.getByRole('banner').getByRole('link', { name: 'Assignments' })).toBeVisible();
    await page.getByRole('banner').getByRole('link', { name: 'Assignments' }).click();
    await expect(page.getByRole('heading', { name: 'Assignments' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Assignment' })).toBeVisible();

    // Create new assignment
    await page.getByRole('button', { name: 'New Assignment' }).click();
    await expect(page.getByRole('button', { name: 'submit' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'cancel' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Title Title' }).fill('Assignment test 1');
    await page.getByRole('textbox', { name: 'Select a learning path Select' }).click();
    await page.getByText('Using notebooks').click();
    await page.getByRole('textbox', { name: 'Pick a class Pick a class' }).click();
    await page.getByText('class01').click();
    await page.getByRole('textbox', { name: 'Select Deadline Select' }).fill('2099-01-01T12:34');
    await page.getByRole('textbox', { name: 'Description Description' }).fill('Assignment description');

    await page.getByRole('button', { name: 'submit' }).click();

    await expect(page.getByText('Assignment test')).toBeVisible();
    await expect(page.getByRole('main').getByRole('button').first()).toBeVisible();
    await expect(page.getByRole('main')).toContainText('Assignment test 1');
    await expect(page.getByRole('link', { name: 'Learning path' })).toBeVisible();
    await expect(page.getByRole('main')).toContainText('Assignment description');
});
