import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  readonly cartFirstItem: Locator;
  readonly checkoutButton: Locator;
  readonly countryInput: Locator;
  readonly dropdown: Locator;
  readonly userEmail: Locator;
  readonly submitButton: Locator;
  readonly orderConfirmation: Locator;
  readonly orderId: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartFirstItem = page.locator('div li').first();
    this.checkoutButton = page.locator('text=Checkout');
    this.countryInput = page.locator("[placeholder*='Country']");
    this.dropdown = page.locator('.ta-results');
    this.userEmail = page.locator(".user__name [type='text']").first();
    this.submitButton = page.locator('.action__submit');
    this.orderConfirmation = page.locator('.hero-primary');
    this.orderId = page.locator('.em-spacer-1 .ng-star-inserted');
  }

  productInCart(productName: string): Locator {
    return this.page.locator('h3').filter({ hasText: productName });
  }

  async waitForCart(): Promise<void> {
    await this.cartFirstItem.waitFor();
  }

  async isProductVisible(productName: string): Promise<boolean> {
    return this.productInCart(productName).isVisible();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async selectCountryIndia(): Promise<void> {
    await this.countryInput.pressSequentially('ind', { delay: 100 });
    await this.dropdown.waitFor();

    const options = this.dropdown.locator('button');
    const optionsCount = await options.count();

    for (let i = 0; i < optionsCount; i++) {
      const text = (await options.nth(i).textContent())?.trim();
      if (text === 'India') {
        await options.nth(i).click();
        return;
      }
    }

    throw new Error('India nu a fost găsită în lista de țări.');
  }

  async getUserEmail(): Promise<string> {
    return ((await this.userEmail.textContent()) ?? '').trim();
  }

  async submitOrder(): Promise<void> {
    await this.submitButton.click();
  }

  async getOrderConfirmation(): Promise<string> {
    await this.orderConfirmation.waitFor();
    return ((await this.orderConfirmation.textContent()) ?? '').trim();
  }

  async getOrderId(): Promise<string> {
    return ((await this.orderId.textContent()) ?? '').trim();
  }
}