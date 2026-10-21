const { test, expect } = require('@playwright/test');
const { customtest } = require('../utils/test-base.js');
const { POManager } = require("../pageObjects/POManager");
const dataSet = JSON.parse(JSON.stringify(require("../utils/placeorderTestData.js")));

//test.describe.configure({mode:'parallel'})
//test.describe.configure({mode:'serial'});
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

    // Câmpul este un input, deci verificăm valoarea lui.
    expect(await cartPage.getUserEmail()).toBe(data.username);

    await cartPage.submitOrder();
    await expect(page.locator(".hero-primary"))
      .toHaveText(" Thankyou for the order. ");

    const orderId = await cartPage.getOrderId();
    console.log(orderId);

    await ordersPage.openOrders();
    await ordersPage.openOrderDetails(orderId);

    const orderIdDetails = await ordersPage.getOrderIdDetails();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
  })
}

customtest(`Client App login`, async ({ page, testDataForOrder }) => {

    const poManager = new POManager(page);

    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashBoardPage();
    const cartPage = poManager.getCartPage();
    const ordersPage = poManager.getOrdersPage();

    await loginPage.goTo();
    await loginPage.validLogin(testDataForOrder.username, testDataForOrder.password);

    await dashboardPage.searchProductAddCart(testDataForOrder.productName);
    await dashboardPage.navigateToCart();

    await cartPage.waitForCart();
    expect(await cartPage.isProductVisible(testDataForOrder.productName)).toBeTruthy();

    await cartPage.checkout();
})

