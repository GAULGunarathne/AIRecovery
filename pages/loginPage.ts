import { Page, expect, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly btnSignIn: any;
    readonly formLogin: any;
    readonly txtEmail: any;
    readonly txtPassword: any;
    readonly btnLogin: any;
    readonly titleLocator: any;

    constructor(page: Page) {
        this.page = page;
        this.btnSignIn = page.locator('[data-test="nav-sign-in"]');
        this.formLogin = page.getByText('Login Sign in with Google or');
        this.txtEmail = page.locator('[data-test="email"]');
        this.txtPassword = page.locator('[data-test="password"]');
        this.btnLogin = page.locator('[data-test="login-submit"]');
        this.titleLocator = page.locator('[data-test="page-title"]');
    }

    async loadLoginPage() {
        const requestPromise = this.page.waitForRequest('/auth/login');
        await this.page.goto('/auth/login');
        const req = await requestPromise;
    }

    async Login(username, password) {
        await this.txtEmail.fill(username);
        await this.txtPassword.fill(password);
        await this.btnLogin.click();
        await this.page.waitForURL('/account');
    }
}