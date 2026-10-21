import { Locator, Page } from '@playwright/test';

export class OrdersPage {
  readonly page: Page;

  // Locators
  readonly ordersButton: Locator;
  readonly ordersTable: Locator;
  readonly rows: Locator;
  readonly orderIdDetails: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ordersButton = page.locator("button[routerlink*='myorders']");
    this.ordersTable = page.locator('tbody');
    this.rows = page.locator('tbody tr');
    this.orderIdDetails = page.locator('.col-text');
  }

  async openOrders(): Promise<void> {
    await this.ordersButton.click();
    await this.ordersTable.waitFor();
  }

  async openOrderDetails(orderId: string): Promise<void> {
    const rowsCount = await this.rows.count();

    for (let i = 0; i < rowsCount; i++) {
      const row = this.rows.nth(i);
      const rowOrderId = (await row.locator('th').textContent()) ?? '';

      if (orderId.includes(rowOrderId)) {
        await row.locator('button').first().click();
        return;
      }
    }

    throw new Error(`Comanda ${orderId} nu a fost găsită în istoric.`);
  }

  async getOrderIdDetails(): Promise<string> {
    return (await this.orderIdDetails.textContent()) ?? '';
  }
}
