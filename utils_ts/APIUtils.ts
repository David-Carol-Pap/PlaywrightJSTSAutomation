import { APIRequestContext } from '@playwright/test';

export type LoginPayload = {
  userEmail: string;
  userPassword: string;
};

export type OrderPayload = {
  orders: Array<{
    country: string;
    productOrderedId: string;
  }>;
};

export type CreateOrderResponse = {
  token: string;
  orderId: string;
};

export class APIUtils {
  private readonly apiContext: APIRequestContext;
  private readonly loginPayload: LoginPayload;

  constructor(apiContext: APIRequestContext, loginPayload: LoginPayload) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
  }

  async getToken(): Promise<string> {
    const loginResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      { data: this.loginPayload }
    );

    const loginResponseJson = (await loginResponse.json()) as { token: string };
    return loginResponseJson.token;
  }

  async createOrder(orderPayload: OrderPayload): Promise<CreateOrderResponse> {
    const token = await this.getToken();

    const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayload,
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    const orderResponseJson = (await orderResponse.json()) as { orders: string[] };
    return { token, orderId: orderResponseJson.orders[0] };
  }
}