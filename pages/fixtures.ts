import { test as base } from '@playwright/test';
import { LoginPage } from './loginPage';
import { HomePage } from './homePage';
import { ProductDetailsPage } from './productDetailsPage';

type MyFixtures = {
    loginPage: LoginPage;
    homePage: HomePage;
    productDetailsPage: ProductDetailsPage;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    }
});

export { expect } from '@playwright/test';