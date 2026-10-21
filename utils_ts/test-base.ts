import { test as baseTest } from '@playwright/test';

export type TestDataForOrder = {
  username: string;
  password: string;
  productName: string;
};

type Fixtures = {
  testDataForOrder: TestDataForOrder;
};

export const customtest = baseTest.extend<Fixtures>({
  testDataForOrder: {
    username: 'papinho@gmail.com',
    password: 'Iamking@000',
    productName: 'ZARA COAT 3',
  },
});