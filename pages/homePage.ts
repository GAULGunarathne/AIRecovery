import { Page, expect, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly linkHome: any;
    readonly txtSearch: any;
    readonly btnSearch: any;
    readonly lblProductName: any;
    readonly locatorProductCard: any;
    readonly locatorNoResults: any;;

    constructor(page: Page) {
        this.page = page;
        this.linkHome = page.locator('[data-test="nav-home"]');
        this.txtSearch = page.locator('[data-test="search-query"]');
        this.btnSearch = page.locator('[data-test="search-submit"]');
        this.locatorProductCard = page.locator(`//a[@class='card']`);
        this.lblProductName = page.locator('[data-test="product-name"]');
        this.locatorNoResults = page.getByTestId(`no-results`);
    }

    async clickHome() {
        await this.linkHome.click();
        await expect.soft(this.locatorProductCard.locator('nth=0')).toBeVisible();
    };

    async SearchProduct(productName: string) {
        await this.txtSearch.fill(productName);
        await this.btnSearch.click();
    }

    async assertValidSearchResult(productName: string) {
        await expect.soft(this.locatorProductCard).toHaveCount(1);
        await expect.soft(this.lblProductName).toContainText(productName);
    }

    async assertInvalidSearchResult() {
        await expect.soft(this.locatorNoResults).toContainText("There are no products found.");
    }

    async selectProduct(){
        await this.locatorProductCard.locator('nth=0').click();
        await this.page.waitForURL(/\/product\/[A-Z0-9]+$/);
    }
}