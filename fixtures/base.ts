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
});

export { expect };
