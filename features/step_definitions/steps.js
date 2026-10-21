const {
  Given,
  When,
  Then,
  setDefaultTimeout,
  setWorldConstructor,
} = require("@cucumber/cucumber");

const { expect } = require("@playwright/test");

setDefaultTimeout(60 * 1000);

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.poManager = null;

    this.loginPage = null;
    this.dashboardPage = null;
    this.cartPage = null;
    this.ordersPage = null;

    this.username = null;
    this.orderId = null;
  }
}

setWorldConstructor(CustomWorld);

Given(
  "a login to Ecommerce application with {string} and {string}",
  async function (username, password) {
    // this.poManager și this.page sunt create în hook-ul Before.
    this.loginPage = this.poManager.getLoginPage();
    this.dashboardPage = this.poManager.getDashBoardPage();
    this.cartPage = this.poManager.getCartPage();
    this.ordersPage = this.poManager.getOrdersPage();

    this.username = username;

    await this.loginPage.goTo();
    await this.loginPage.validLogin(username, password);
  }
);

When("Add {string} to Cart", async function (productName) {
  await this.dashboardPage.searchProductAddCart(productName);
  await this.dashboardPage.navigateToCart();
});

Then(
  "Verify {string} is displayed in the Cart",
  async function (productName) {
    await this.cartPage.waitForCart();

    expect(
      await this.cartPage.isProductVisible(productName)
    ).toBeTruthy();
  }
);

When("Enter valid details and Place the Order", async function () {
  await this.cartPage.checkout();
  await this.cartPage.selectCountryIndia();

  expect(await this.cartPage.getUserEmail()).toBe(this.username);

  await this.cartPage.submitOrder();

  await expect(this.page.locator(".hero-primary")).toHaveText(
    " Thankyou for the order. "
  );

  this.orderId = await this.cartPage.getOrderId();
  console.log("Order ID:", this.orderId);
});

Then(
  "Verify order is present in the OrderHistory",
  async function () {
    await this.ordersPage.openOrders();
    await this.ordersPage.openOrderDetails(this.orderId);

    const orderIdDetails = await this.ordersPage.getOrderIdDetails();

    expect(this.orderId.includes(orderIdDetails)).toBeTruthy();
  }
);

Given('a login to Ecommerce2 application with {string} and {string}', async function (username, password) {
    const userName = this.page.locator('#username');
    const signIn = this.page.locator("#signInBtn");
    await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await this.page.title());

    await userName.type(username);
    await this.page.locator("[type='password']").type(password);
    await signIn.click();
  }
);

Then('Verify error message is displayed', async function () {
    console.log(await this.page.locator("[style*='block']").textContent());
    await expect(this.page.locator("[style*='block']")).toContainText("Incorrect username/password.");
})