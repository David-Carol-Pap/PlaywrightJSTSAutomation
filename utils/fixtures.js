const base = require('@playwright/test');
const {APIUtils} = require('./APIUtils.js');
const {request} = require('@playwright/test')
const loginPayload = {userEmail: "papinho@gmail.com",userPassword: "Iamking@000"}
const orderPayload={orders:[{country:"Cuba",productOrderedId:"6960eac0c941646b7a8b3e68"}]}


exports.customtest = base.test.extend(
    {
        authenticatedPage: async ({ browser }, use) => {
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto("https://rahulshettyacademy.com/client");
            await page.locator("#userEmail").fill("papinho@gmail.com");
            await page.locator("#userPassword").type("Iamking@000");
            await page.locator("[value='Login']").click();
            await page.waitForLoadState('networkidle');

            await use(page);
            //tear down
            await context.close();
        },

        createOrder: async ({ }, use) => {
            const apiContext = await request.newContext();
            const apiUtils = new APIUtils(apiContext, loginPayload);
            const response = await apiUtils.createOrder(orderPayload);
            await use(response);
            await apiContext.dispose();

        },

        testDataForOrder : {
            productName : 'ADIDAS ORIGINAL'
        }
    }
)