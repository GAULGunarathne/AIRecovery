import { Page, expect, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly linkHome: any;
    readonly txtSearch: any;
    readonly btnSearch: any;
    readonly lblProductName: any;
    readonly locatorProductCard: any;
    readonly locatorNoResults: any;

    constructor(page: Page) {
        this.page = page;
        this.linkHome = page.getByTestId("nav-home");
        this.txtSearch = page.getByTestId("search-query");
        this.btnSearch = page.getByTestId("search-submit");
        this.lblProductName = page.locator(`//a[@class='card']`);
        this.locatorProductCard = page.getByTestId("product-name");
        this.locatorNoResults = page.getByTestId(`no-results`);
    }

    async clickHome() {
        await this.linkHome.click();
    };

    async SearchProduct(productName: string) {
        await this.txtSearch.fill(productName);
        await this.btnSearch.click();
    }

    async assertValidSearchResult(productName: string) {
        await expect(this.locatorProductCard).toHaveCount(1);
        await expect(this.locatorProductCard).toContainText(productName);
    }

    async assertInvalidSearchResult() {
        await expect(this.locatorNoResults).toContainText("There are no products found.");
    }
}