import { test as base, Page, request } from '@playwright/test';
import { APIUtils, CreateOrderResponse, LoginPayload, OrderPayload } from './APIUtils';

export type TestDataForOrder = {
  username: string;
  password: string;
  productName: string;
};

export type CustomFixtures = {
  authenticatedPage: Page;
  createOrder: CreateOrderResponse;
  testDataForOrder: TestDataForOrder;
};

const loginPayload: LoginPayload = {
  userEmail: 'papinho@gmail.com',
  userPassword: 'Iamking@000',
};

const orderPayload: OrderPayload = {
  orders: [{ country: 'Cuba', productOrderedId: '6960eac0c941646b7a8b3e68' }],
};

export const customtest = base.extend<CustomFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill(loginPayload.userEmail);
    await page.locator('#userPassword').type(loginPayload.userPassword);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');

    await use(page);
    await context.close();
  },

  createOrder: async ({}, use) => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);

    const response = await apiUtils.createOrder(orderPayload);
    await use(response);

    await apiContext.dispose();
  },

  testDataForOrder: async ({}, use) => {
    await use({
      username: 'papinho@gmail.com',
      password: 'Iamking@000',
      productName: 'ZARA COAT 3',
    });
  },
});