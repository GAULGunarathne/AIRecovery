import { test } from '../pages/fixtures';

test.describe('Search Test Suite', () => {
    test.use({ storageState: ".auth/customer01.json" });

    test(`Valid search`, async ({page, homePage}) => {
        await page.goto("/");
        await homePage.clickHome();
        await homePage.SearchProduct("Thor Hammer");
        await homePage.assertValidSearchResult("Thor Hammer");
    });

    test(`Invalid search`, async ({page, homePage}) => {
        await page.goto("/");
        await homePage.clickHome();
        await homePage.SearchProduct("test");
        await homePage.assertInvalidSearchResult();
    });
});