// tests/network/mocked-empty-account.spec.ts
import { test, expect } from '@playwright/test';

test('a fully mocked empty-holdings account renders the real empty state', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://localhost:5173',
    storageState: {
      cookies: [],
      origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'holdingsSandbox.accountId', value: 'fake-acct-999' }] }],
    },
  });
  const page = await context.newPage();

  await page.route('**/api/account/fake-acct-999', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        account: { id: 'fake-acct-999', area: 'Retail Banking', username: 'empty-tester', balance: 0, holdings: [] },
      }),
    })
  );

  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Welcome, empty-tester' })).toBeVisible();
  await expect(page.getByText('No holdings remaining.')).toBeVisible();
  await expect(page.getByTestId('account-balance')).toHaveText('₹0.00');

  await context.close();
});