// tests/ui/inventory-authenticated.spec.ts
import { test, expect } from '../../fixtures/base';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe.skip('Inventory page (pre-authenticated)', () => {
  test('logged-in user can log out', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    await authenticatedPage.goto('https://www.saucedemo.com/inventory.html');
    await inventoryPage.expectLoaded();

    await inventoryPage.logout();
    await expect(authenticatedPage).toHaveURL('https://www.saucedemo.com/');
  });
});