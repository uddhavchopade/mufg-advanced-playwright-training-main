import { test, expect } from "@playwright/test";

test.describe("Login flow", () => {
  test("Login flow", async ({ page }) => {
    await page.goto("https://www.saucedemo.com");

    await page.getByLabel("Username").fill("standard_user");
    await page.getByLabel("Password").fill("secret_sauce");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(page.locator(".title")).toHaveText("Products");
  });

  test("Stretch: find a specific product by name and check its price", async ({
    page,
  }) => {
    await page.goto("https://www.saucedemo.com");

    await page.getByLabel("Username").fill("standard_user");
    await page.getByLabel("Password").fill("secret_sauce");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(page.locator(".title")).toHaveText("Products");

    const targetItem = page.locator('.inventory_item').filter({hasText: 'Sauce Labs Backpack'});
    await expect(targetItem).toBeVisible();
    await expect(targetItem.locator('.inventory_item_price').filter({hasText: '$29.99'}))
  });

  
  test("Stretch: Add to cart a specific product by name and check its price", async ({
    page,
  }) => {
    await page.goto("https://www.saucedemo.com");

    await page.getByLabel("Username").fill("standard_user");
    await page.getByLabel("Password").fill("secret_sauce");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(page.locator(".title")).toHaveText("Products");

    const targetItem = page.locator('.inventory_item')
    .filter({hasText: 'Sauce Labs Backpack'})
    .filter({has: page.getByRole('button', {name: /add to cart/i })});

    await expect(targetItem).toBeVisible();
    await expect(targetItem.locator('.inventory_item_price').filter({hasText: '$29.99'}))

    await targetItem.getByRole('button',{ name: 'Add to cart' }).click();
  
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});
