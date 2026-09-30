import { test, expect } from '@playwright/test';
import { HSLoginPage } from '../../pages/HSLoginPage';
import { HSDashboardPage } from '../../pages/HSDashboardPage';

test.describe.skip('Login flow holding sandbox', () => {
  test('successful login lands on the dashboard page', async ({ page }) => {
    const loginPage = new HSLoginPage(page);
    const dashboardPage = new HSDashboardPage(page);

    await loginPage.goto();
    await loginPage.login('Retail Banking','demo', 'demo1234');

    await expect(page).toHaveURL(/dashboard/);
    await expect(dashboardPage.titleLabel).toHaveText('Welcome, demo');
    await expect(dashboardPage.balanceLabel).toContainText('₹1,25,000.50');
  });
});