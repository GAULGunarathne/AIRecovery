import { Page, expect, Locator } from '@playwright/test';

export class ProductDetailsPage {
    readonly page: Page;
    readonly btnAddToCart: any;
    readonly txtSearch: any;
    readonly btnSearch: any;
    readonly lblProductName: any;
    readonly locatorProductCard: any;
    readonly locatorNoResults: any;;

    constructor(page: Page) {
        this.page = page;
        this.btnAddToCart = page.getByTestId("add-to-cart");
        this.txtSearch = page.getByTestId("search-query");
        this.btnSearch = page.getByTestId("search-submit");
        this.locatorProductCard = page.locator(`//a[@class='card']`);
        this.lblProductName = page.getByTestId("product-name");
        this.locatorNoResults = page.getByTestId(`no-results`);
    }

    async addItemToCart() {
        await this.btnAddToCart.click();
        await expect.soft(this.page.getByLabel('Product added to shopping')).toBeVisible();
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
    }
}