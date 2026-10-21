const {
  Given,
  When,
  Then,
  setDefaultTimeout,
  setWorldConstructor,
} = require("@cucumber/cucumber");

const { chromium } = require("playwright");
const { expect } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");

setDefaultTimeout(60 * 1000);

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;

    this.loginPage = null;
    this.dashboardPage = null;
    this.cartPage = null;
    this.ordersPage = null;

    this.username = null;
    this.orderId = null;
  }

  async startBrowser() {
    this.browser = await chromium.launch();

    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    this.poManager = new POManager(this.page);

    this.loginPage = this.poManager.getLoginPage();
    this.dashboardPage = this.poManager.getDashBoardPage();
    this.cartPage = this.poManager.getCartPage();
    this.ordersPage = this.poManager.getOrdersPage();
  }

  async closeBrowser() {
    if (this.browser) {
      const browser = this.browser;
      this.browser = null;
      await browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);

// Închide browserul și re-aruncă eroarea dacă un pas pică.
function withBrowserCleanup(stepFunction) {
  const run = async (world, args) => {
    try {
      return await stepFunction.apply(world, args);
    } catch (error) {
      await world.closeBrowser();
      throw error;
    }
  };

  if (stepFunction.length === 0) {
    return async function () {
      return run(this, []);
    };
  }

  if (stepFunction.length === 1) {
    return async function (arg1) {
      return run(this, [arg1]);
    };
  }

  if (stepFunction.length === 2) {
    return async function (arg1, arg2) {
      return run(this, [arg1, arg2]);
    };
  }

  throw new Error(
    `Număr de parametri neacceptat: ${stepFunction.length}`
  );
}

Given(
  "a login to Ecommerce application with {string} and {string}",
  withBrowserCleanup(async function (username, password) {
    await this.startBrowser();

    this.username = username;

    await this.loginPage.goTo();
    await this.loginPage.validLogin(username, password);
  })
);

When(
  "Add {string} to Cart",
  withBrowserCleanup(async function (productName) {
    await this.dashboardPage.searchProductAddCart(productName);
    await this.dashboardPage.navigateToCart();
  })
);

Then(
  "Verify {string} is displayed in the Cart",
  withBrowserCleanup(async function (productName) {
    await this.cartPage.waitForCart();

    expect(
      await this.cartPage.isProductVisible(productName)
    ).toBeTruthy();
  })
);

When(
  "Enter valid details and Place the Order",
  withBrowserCleanup(async function () {
    await this.cartPage.checkout();
    await this.cartPage.selectCountryIndia();

    expect(await this.cartPage.getUserEmail()).toBe(this.username);

    await this.cartPage.submitOrder();

    await expect(this.page.locator(".hero-primary")).toHaveText(
      " Thankyou for the order. "
    );

    this.orderId = await this.cartPage.getOrderId();
    console.log("Order ID:", this.orderId);
  })
);

Then(
  "Verify order is present in the OrderHistory",
  withBrowserCleanup(async function () {
    try {
      await this.ordersPage.openOrders();
      await this.ordersPage.openOrderDetails(this.orderId);

      const orderIdDetails = await this.ordersPage.getOrderIdDetails();

      expect(this.orderId.includes(orderIdDetails)).toBeTruthy();
    } finally {
      await this.closeBrowser();
    }
  })
);