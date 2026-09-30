// tests/api/sell-holding.spec.ts
import { test, expect } from '../../fixtures/base';

test.describe.configure({ mode: 'parallel' }); // the only line that changed

for (let i = 1; i <= 60; i++) {
  test(`independent seeded test #${i}`, async ({ seededAccount, apiContext }) => {
    const holding = seededAccount.holdings[0];
    const before = holding.quantity;
    await apiContext.post('sell', {
      data: {
        accountId: seededAccount.accountId,
        holdingId: holding.id,
        market: holding.market,
        quantity: 10,
        settlementType: 'cash',
        confirmed: true,
      },
    });
    const res = await apiContext.get(`account/${seededAccount.accountId}`);
    const { account } = await res.json();
    expect(account.holdings[0].quantity).toBe(before - 10);
  });
}