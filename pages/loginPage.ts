import { Page, expect, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly linkSignIn: any;
    readonly formLogin: any;
    readonly txtEmail: any;
    readonly txtPassword: any;
    readonly btnLogin: any;
    readonly titleLocator: any;

    constructor(page: Page) {
        this.page = page;
        this.linkSignIn = page.getByTestId('nav-sign-in');
        this.formLogin = page.getByTestId('login-form');
        this.txtEmail = page.getByTestId('email');
        this.txtPassword = page.getByTestId('password');
        this.btnLogin = page.getByTestId('login-submit');
        this.titleLocator = page.getByTestId('page-title');
    }
    
    async goto() {
        await this.page.goto("/auth/login");
    }

    async Login(username, password) {
        await this.linkSignIn.click();
        await expect(this.formLogin, `Verify loading the login page`).toBeVisible();
        await this.txtEmail.fill(username);
        await this.txtPassword.fill(password);
        await this.btnLogin.click();
        await expect(this.titleLocator).toContainText('My account');
    }
}