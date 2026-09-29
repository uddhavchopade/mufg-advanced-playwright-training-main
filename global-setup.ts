// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

async function globalSetup(_config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  // Wait for the real confirmation signal — the inventory page actually
  // loaded — not a fixed timeout and not just "navigation finished."
  // Capturing storageState before this would save state from mid-login.
  await inventoryPage.expectLoaded();

  const authFile = path.join(__dirname, 'playwright/.auth/user.json');
  await page.context().storageState({ path: authFile });

  await browser.close();
}

export default globalSetup;