import { Locator, Page } from '@playwright/test';

export class DashBoardPage {
  readonly page: Page;
  readonly products: Locator;
  readonly productsText: Locator;
  readonly cart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.products = page.locator('.card-body');
    this.productsText = page.locator('.card-body b');
    this.cart = page.locator("[routerlink*='cart']");
  }

  async searchProductAddCart(productName: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');

    const count = await this.products.count();
    for (let i = 0; i < count; i++) {
      const name = ((await this.products.nth(i).locator('b').textContent()) ?? '').trim();
      if (name === productName) {
        await this.products.nth(i).locator('text=Add To Cart').click();
        break;
      }
    }
  }

  async navigateToCart(): Promise<void> {
    await this.cart.click();
  }
}