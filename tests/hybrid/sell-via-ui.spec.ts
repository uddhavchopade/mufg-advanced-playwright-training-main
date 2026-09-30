// tests/hybrid/sell-via-ui.spec.ts
import { test, expect } from '../../fixtures/base';

test('seed via API, sell via real UI, verify via API', async ({ hybridPage, apiContext }) => {
  const { page, account } = hybridPage;
  const holding = account.holdings[0];

  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: `Welcome, ${account.username}` })).toBeVisible();
  await expect(page.getByTestId(`holding-${holding.id}`)).toContainText('Hybrid Test Fund');

  await page.getByTestId(`holding-${holding.id}`).getByRole('button', { name: 'Sell / Redeem' }).click();
  await expect(page).toHaveURL(new RegExp(`/sell/${holding.id}`));

  // The form has two radio groups. Choose both on purpose instead of trusting the defaults.
  await page.getByRole('radio', { name: 'NSE' }).check();   // Market
  await page.getByLabel('Quantity to sell').fill('10');
  await page.getByRole('radio', { name: 'Cash' }).check();  // Settlement type
  await page.getByLabel('I confirm the above details are correct').check();
  await page.getByRole('button', { name: 'Submit for Redemption' }).click();

  await expect(page).toHaveURL(/\/confirmation\//);
  await expect(page.getByTestId('confirmation-heading')).toBeVisible();
  await expect(page.getByTestId('transaction-status')).toHaveText(/pending|processing|submitted/i);

  const accountRes = await apiContext.get(`account/${account.accountId}`);
  const { account: refreshed } = await accountRes.json();
  expect(refreshed.holdings[0].quantity).toBe(holding.quantity - 10);
});