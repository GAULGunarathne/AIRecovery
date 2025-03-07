import { test } from '../../pages/fixtures';
import productlist from '../../test-data/mock-data-json/productlist-mock.json';

test.use({ storageState: ".auth/customer01.json" });

test.describe('Search Test Suite', () => {

    test.beforeEach(async ({ page }) => {
        // Mock the api call before navigating
        await page.route(`${process.env.API_URL}/products**`, async route => {
            await route.fulfill({ body: JSON.stringify(productlist) });
        });
        await page.goto("/");
    });

    test(`Valid search`, async ({ homePage }) => {
        await homePage.SearchProduct("Thor Hammer");
        await homePage.assertValidSearchResult("Thor Hammer");
    });

    test(`Invalid search`, async ({ homePage }) => {
        await homePage.SearchProduct("test tool");
        await homePage.assertInvalidSearchResult();
    });
});