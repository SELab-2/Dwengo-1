import { test, expect } from './fixtures.js';

test('Users can filter', async ({ page }) => {
    await page.goto('/user');

    await page.getByRole('combobox').filter({ hasText: 'Select a themeAll' }).locator('i').click();
    await page.getByText('Nature and climate').click();
    await page.getByRole('combobox').filter({ hasText: 'Select ageAll agesSelect age' }).locator('i').click();
    await page.getByText('and older').click();

    await expect(page.getByRole('link', { name: 'AI and Climate Students in' })).toBeVisible();
});
