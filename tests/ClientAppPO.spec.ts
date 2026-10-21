import { test, expect } from '@playwright/test';

import { POManager } from '../pageobjects_ts/POManager';
import dataSet from '../utils_ts/placeorderTestData';
import { customtest } from '../utils_ts/test-base';

for (const data of dataSet) {
  test(`Client App login for ${data.productName}`, async ({ page }) => {
    const poManager = new POManager(page);

    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashBoardPage();
    const cartPage = poManager.getCartPage();
    const ordersPage = poManager.getOrdersPage();

    await loginPage.goTo();
    await loginPage.validLogin(data.username, data.password);

    await dashboardPage.searchProductAddCart(data.productName);
    await dashboardPage.navigateToCart();

    await cartPage.waitForCart();
    expect(await cartPage.isProductVisible(data.productName)).toBeTruthy();

    await cartPage.checkout();
    await cartPage.selectCountryIndia();

    expect(await cartPage.getUserEmail()).toBe(data.username);

    await cartPage.submitOrder();
    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');

    const orderId = await cartPage.getOrderId();

    await ordersPage.openOrders();
    await ordersPage.openOrderDetails(orderId);

    const orderIdDetails = await ordersPage.getOrderIdDetails();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
  });
}

customtest(`Client App login`, async ({ page, testDataForOrder }) => {
  const poManager = new POManager(page);

  const loginPage = poManager.getLoginPage();
  const dashboardPage = poManager.getDashBoardPage();
  const cartPage = poManager.getCartPage();

  await loginPage.goTo();
  await loginPage.validLogin(testDataForOrder.username, testDataForOrder.password);

  await dashboardPage.searchProductAddCart(testDataForOrder.productName);
  await dashboardPage.navigateToCart();

  await cartPage.waitForCart();
  expect(await cartPage.isProductVisible(testDataForOrder.productName)).toBeTruthy();

  await cartPage.checkout();
});