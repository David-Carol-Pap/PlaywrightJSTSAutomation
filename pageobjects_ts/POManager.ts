import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { DashBoardPage } from './DashBoardPage';
import { OrdersPage } from './OrdersPage';
import { CartPage } from './CartPage';

export class POManager {
  readonly page: Page;
  readonly loginPage: LoginPage;
  readonly dashboardPage: DashBoardPage;
  readonly ordersPage: OrdersPage;
  readonly cartPage: CartPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashBoardPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.ordersPage = new OrdersPage(this.page);
  }

  getLoginPage(): LoginPage {
    return this.loginPage;
  }

  getDashBoardPage(): DashBoardPage {
    return this.dashboardPage;
  }

  getCartPage(): CartPage {
    return this.cartPage;
  }

  getOrdersPage(): OrdersPage {
    return this.ordersPage;
  }
}