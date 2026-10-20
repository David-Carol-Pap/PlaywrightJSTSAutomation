const base = require('@playwright/test')

exports.customtest = base.test.extend(
    {
        testDataForOrder: {
            username : "papinho@gmail.com",
            password:  "Iamking@000",
            productName: "ZARA COAT 3"
        } 
    }
)