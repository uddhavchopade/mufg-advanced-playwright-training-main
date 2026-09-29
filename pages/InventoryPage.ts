import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.menuButton = page.getByRole('button', { name: /open menu/i });
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async expectLoaded() {
    await expect(this.title).toHaveText('Products');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  // Used by the test to pick one product without relying on its position —
  // same pattern as the .filter({ hasText }) exercise from Lab 1
  productByName(name: string) {
    return this.page.locator('.inventory_item').filter({ hasText: name });
  }
}