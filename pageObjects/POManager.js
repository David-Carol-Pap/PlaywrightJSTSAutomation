const { LoginPage } = require("./LoginPage");
const { DashBoardPage } = require("./DashBoardPage");
const { CartPage } = require("./CartPage");
const { OrdersPage } = require("./OrdersPage");

class POManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashBoardPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.ordersPage = new OrdersPage(this.page);

    }

    getLoginPage() {
        return this.loginPage;
    }

    getDashBoardPage() {
        return this.dashboardPage;
    }

    getCartPage() {
        return this.cartPage;
    }

    getOrdersPage() {
        return this.ordersPage;
    }
}

module.exports = { POManager };