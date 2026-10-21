const {
    Before,
    After,
    Given,
    When,
    Then,
    setDefaultTimeout,
} = require("@cucumber/cucumber");

const { chromium } = require("playwright");
const { expect } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");

setDefaultTimeout(60 * 1000);

Before(async function () {
    this.browser = await chromium.launch();
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    const poManager = new POManager(this.page);

    this.loginPage = poManager.getLoginPage();
    this.dashboardPage = poManager.getDashBoardPage();
    this.cartPage = poManager.getCartPage();
    this.ordersPage = poManager.getOrdersPage();
});

After(async function () {
    if (this.browser) {
        await this.browser.close();
    }
});

Given(
    "a login to Ecommerce application with {string} and {string}",
    async function (username, password) {
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