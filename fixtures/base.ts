// fixtures/base.ts
import { test as base, expect, Page } from '@playwright/test';
import path from 'path';

type Fixtures = {
  authenticatedPage: Page;
};

type WorkerFixtures = {
  workerAuthedContext: Awaited<ReturnType<Page['context']>>;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
  workerAuthedContext: [
    async ({ browser }, use) => {
      const authFile = path.join(__dirname, '../playwright/.auth/user.json');
      const context = await browser.newContext({ storageState: authFile });
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],

  authenticatedPage: async ({ workerAuthedContext }, use) => {
    const page = await workerAuthedContext.newPage();
    await use(page);
    await page.close();
  },
});

export { expect };