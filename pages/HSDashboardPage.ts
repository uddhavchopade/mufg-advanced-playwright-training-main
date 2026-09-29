import { Page, Locator } from '@playwright/test';

export class HSDashboardPage {
  readonly page: Page;
  readonly titleLabel: Locator;
  readonly balanceLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleLabel = page.getByRole('heading', { name: 'Welcome, demo' });
    this.balanceLabel = page.getByRole('region', { name: 'Account balance' });
  }

}