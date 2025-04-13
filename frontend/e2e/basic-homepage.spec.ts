import { test, expect } from '@playwright/test';

test('User can pick their language', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'translate' })).toBeVisible();
    await page.getByRole('button', { name: 'translate' }).click();
    await page.getByText('Nederlands').click();
    await expect(page.locator('h1')).toContainText('Onze sterke punten');
    await expect(page.getByRole('heading', { name: 'Innovatief' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'vertalen' })).toBeVisible();
    await page.getByRole('button', { name: 'vertalen' }).click();
    await page.getByText('English').click();
    await expect(page.locator('h1')).toContainText('Our strengths');
    await expect(page.getByRole('heading', { name: 'Innovative' })).toBeVisible();
});

test('Teacher can sign in', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'log in' })).toBeVisible();
    await page.getByRole('link', { name: 'log in' }).click();

    await expect(page.getByRole('button', { name: 'teacher' })).toBeVisible();
    await page.getByRole('button', { name: 'teacher' }).click();

    await expect(page.getByText('teacher')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Username or email' }).fill('testleerkracht1');
    await page.getByRole('textbox', { name: 'Password' }).fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByRole('link', { name: 'Dwengo logo teacher' })).toBeVisible();
    await expect(page.getByRole('button').nth(1)).toBeVisible();
});

test('Student can sign in', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'log in' })).toBeVisible();
    await page.getByRole('link', { name: 'log in' }).click();

    await expect(page.getByRole('button', { name: 'student' })).toBeVisible();
    await page.getByRole('button', { name: 'student' }).click();

    await expect(page.getByText('student')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Username or email' }).fill('testleerling1');
    await page.getByRole('textbox', { name: 'Password' }).fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByRole('link', { name: 'Dwengo logo student' })).toBeVisible();
    await expect(page.getByRole('button').nth(1)).toBeVisible();
});
