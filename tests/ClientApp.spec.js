const { test,expect } = require('@playwright/test');

test('Client App login', async ({page}) => {

    const email = "papinho@gmail.com";
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body")
    const creditcard = page.locator("//div[@class='field']//input[@class='input txt text-validated']");
    const expiryMonth = page.locator("//div[@class='field small']//select[@class='input ddl']").first();
    const expiryDate = page.locator("//div[@class='field small']//select[@class='input ddl']").last();
    const cvvCode = page.locator("//div[@class='field small'][.//div[@class='title'][contains(.,'CVV Code')]]//input[@type='text']");
    const nameCard = page.locator("//div[@class='field'][.//div[@class='title'][contains(.,'Name on Card')]]//input[@type='text']");

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("papinho@gmail.com");
    await page.locator("#userPassword").type("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    const titles  = await page.locator(".card-body b").allTextContents();
    console.log(titles);

    const count = await products.count();
    for(let i = 0; i < count; ++i)
    {
       if (await products.nth(i).locator("b").textContent() === productName)
       {
         //add to cart
         await products.nth(i).locator("text=Add To Cart").click();
         break;
       }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('Zara Coat 3')").isVisible();
    expect(bool).toBeTruthy();

    await page.locator("text=Checkout").click();

    await page.locator("[placeholder*='Country']").pressSequentially("ind", {delay:100});
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for(let i = 0; i< optionsCount; i++)
    {
      const text = await dropdown.locator("button").nth(i).textContent();
      if(text === " India")
      {
        await dropdown.locator("button").nth(i).click();
        break;
      }
    }

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email)
    await creditcard.fill("4542 9931 9292 2222");
    await expiryMonth.selectOption({label: "05"});
    await expiryDate.selectOption({label: "28"});
    await cvvCode.fill("123");
    await nameCard.fill("David Carol Pap");
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);

    await page.locator("button[routerlink*='myorders']").click();

    await page.locator("tbody").waitFor();

    const rows = await page.locator("tbody tr");

    for(let i = 0; i < await rows.count(); ++i)
    {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if(orderId.includes(rowOrderId))
      {
        await rows.nth(i).locator("button").first().click();
        break;
      }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();

    
})
