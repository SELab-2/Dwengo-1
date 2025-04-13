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
