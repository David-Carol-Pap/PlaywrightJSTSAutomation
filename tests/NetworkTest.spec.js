const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('../utils/APIUtils.js');
const loginPayload = {userEmail: "papinho@gmail.com",userPassword: "Iamking@000"}
const orderPayload={orders:[{country:"Cuba",productOrderedId:"6960eac0c941646b7a8b3e68"}]}
const fakePayLoadOrders = {data:[], message:"No Orders"};
let response;

test.beforeAll( async()=> 
{

    //Login API
   const apiContext = await request.newContext();
   const apiUtils = new APIUtils(apiContext, loginPayload);
   response= await apiUtils.createOrder(orderPayload);

})

//create order is success
test('Place the order', async ({page}) => {

    // await page.goto("https://rahulshettyacademy.com/client");
    // await page.locator("#userEmail").fill("papinho@gmail.com");
    // await page.locator("#userPassword").type("Iamking@000");
    // await page.locator("[value='Login']").click();
    // await page.waitForLoadState('networkidle');


    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token );

    await page.goto("https://rahulshettyacademy.com/client");

await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async route => 
        {
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayLoadOrders);
            route.fulfill(
                {
                    response,
                    body,
                });
            //intercepting response - API 
        });

    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");

    console.log(await page.locator(".mt-4").textContent());


})

//verify if order created is showing in history page
// Precondition - create order 
