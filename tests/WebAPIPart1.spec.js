const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('../utils/APIUtils');
const loginPayload = {userEmail: "papinho@gmail.com",userPassword: "Iamking@000"}
const orderPayload={orders:[{country:"Cuba",productOrderedId:"6960eac0c941646b7a8b3e68"}]}
let response;

test.beforeAll( async()=> 
{

    //Login API
   const apiContext = await request.newContext();
   const apiUtils = new APIUtils(apiContext, loginPayload);
   response= await apiUtils.createOrder(orderPayload);

})

//create order is success
test('@testapi Place the order', async ({page}) => {

    // await page.goto("https://rahulshettyacademy.com/client");
    // await page.locator("#userEmail").fill("papinho@gmail.com");
    // await page.locator("#userPassword").type("Iamking@000");
    // await page.locator("[value='Login']").click();
    // await page.waitForLoadState('networkidle');


    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token );

    await page.goto("https://rahulshettyacademy.com/client");


    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();

    const rows = await page.locator("tbody tr");

    for(let i = 0; i < await rows.count(); ++i)
    {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if(response.orderId.includes(rowOrderId))
      {
        await rows.nth(i).locator("button").first().click();
        break;
      }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy(); 
})

//verify if order created is showing in history page
// Precondition - create order 
