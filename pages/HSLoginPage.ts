import { Page, Locator } from '@playwright/test';

export class HSLoginPage {
  readonly page: Page;
  readonly businessAreaDropdown: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.businessAreaDropdown = page.getByLabel('Business Area');
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: /log in/i });
  }

  async goto() {
    await this.page.goto('http://localhost:5173');
  }

  async login(businessArea: string, username: string, password: string) {
    await this.businessAreaDropdown.selectOption(businessArea);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}