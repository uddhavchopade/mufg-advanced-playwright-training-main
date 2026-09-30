// fixtures/base.ts
import {
  test as base,
  expect,
  APIRequestContext,
  Page,
} from "@playwright/test";
import path from "path";

type SeededAccount = {
  accountId: string;
  area: string;
  username: string;
  password: string;
  balance: number;
  holdings: {
    id: string;
    name: string;
    market: string;
    quantity: number;
    avgPrice: number;
  }[];
};

type Fixtures = {
  authenticatedPage: Page;
  apiContext: APIRequestContext;
  seededAccount: SeededAccount;
  hybridPage: { page: Page; account: SeededAccount }
};
  
type WorkerFixtures = {
  workerAuthedContext: Awaited<ReturnType<Page["context"]>>;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
  workerAuthedContext: [
    async ({ browser }, use) => {
      const authFile = path.join(__dirname, "../playwright/.auth/user.json");
      const context = await browser.newContext({ storageState: authFile });
      await use(context);
      await context.close();
    },
    { scope: "worker" },
  ],
  authenticatedPage: async ({ workerAuthedContext }, use) => {
    const page = await workerAuthedContext.newPage();
    await use(page);
    await page.close();
  },
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: "http://localhost:5173/api/",
    });
    await use(context);
    await context.dispose();
  },

  // New. Depends on apiContext — a custom fixture, not a built-in one —
  // which Playwright resolves automatically before this one runs.
  seededAccount: async ({ apiContext }, use) => {
    const response = await apiContext.post("test/seed-account", { data: {} });
    const account: SeededAccount = await response.json();
    await use(account);
  },
  // Depends on browser, not page — the default page fixture is already
  // built from a context with no storageState by the time a test-scoped
  // fixture runs, so this one builds its own context instead.
  hybridPage: async ({ browser, apiContext }, use) => {
    const response = await apiContext.post('test/seed-account', {
      data: { holdings: [{ name: 'Hybrid Test Fund', market: 'NSE', quantity: 25, avgPrice: 100 }] },
    });
    const account = await response.json();

    const context = await browser.newContext({
      baseURL: 'http://localhost:5173',
      storageState: {
        cookies: [],
        origins: [
          {
            origin: 'http://localhost:5173',
            localStorage: [{ name: 'holdingsSandbox.accountId', value: account.accountId }],
          },
        ],
      },
    });
    const page = await context.newPage();

    await use({ page, account });
    await context.close();
  },
});

export { expect };
