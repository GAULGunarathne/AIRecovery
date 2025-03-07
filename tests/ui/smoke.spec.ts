import { test } from '../../pages/fixtures';
import { runAccessibilityCheck } from '../../utils/accessibilityChecker';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Smoke Test Suite', () => {

    test('Check out flow verification', async ({ page, loginPage, homePage, productDetailsPage }, testInfo) => {

        await loginPage.goto();
        try {
            await runAccessibilityCheck(page, testInfo, 'login-page');
        } catch (error) {
        }

        await loginPage.Login(process.env.CUSTOMER_01_USERNAME, process.env.CUSTOMER_01_PASSWORD);
        await homePage.clickHome();
        try {
            await runAccessibilityCheck(page, testInfo, 'home-page');
        } catch (error) {
        }

        await homePage.selectProduct();
        try {
            await runAccessibilityCheck(page, testInfo, 'product-details-page');
        } catch (error) {
        }

        await productDetailsPage.addItemToCart();

        // Smoke Test Code to be added here
    });
});