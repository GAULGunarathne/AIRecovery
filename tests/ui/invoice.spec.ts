import { test, expect } from '@playwright/test';
import * as cartPayloadData from '../../test-data/req-json/cartPayload.json';
import path from 'path';
import fs from 'fs/promises';
let token, cartId, product_price, invoice_id, invoice_number;

let cartPayload = { ...cartPayloadData };

test.describe('Example Test Suite', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ request }) => {
        await test.step('Log in', async () => {
            const loginResponse = await request.post(`${process.env.API_URL}/users/login`,
                {
                    data: {
                        email: `${process.env.CUSTOMER_02_USERNAME}`,
                        password: `${process.env.CUSTOMER_02_PASSWORD}`
                    }
                }
            )
            expect(loginResponse.status()).toBe(200);
            const loginResponseJson = await loginResponse.json();
            token = loginResponseJson.access_token;
            console.log("##########################\n" + token + "\n##########################");
        });

        await test.step('Get product id', async () => {
            const productDetailsResponse = await request.get(`${process.env.API_URL}/products?between=price,1,100&page=1`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            expect(productDetailsResponse.status()).toBe(200);
            const productDetailsResponseJson = await productDetailsResponse.json();
            const product_name = productDetailsResponseJson.data[0].name;
            const product_id = productDetailsResponseJson.data[0].id;
            product_price = productDetailsResponseJson.data[0].price;
            console.log("\n" + "##########################\n" + 'product_name : ' + product_name);
            console.log('product_id : ' + product_id);
            console.log('product_price : ' + product_price + "\n##########################");

            //Saving product details into cartPayload.json
            cartPayload.product_id = product_id;
            const filePath = path.join(__dirname, "../../test-data/req-json", "cartPayload.json");
            const existingData = await fs.readFile(filePath, 'utf-8');
            const existingPayload = JSON.parse(existingData);
            existingPayload.product_id = product_id;
            await fs.writeFile(filePath, JSON.stringify(existingPayload, null, 2));
        });

        await test.step('Create cart id', async () => {
            const creatCartResponse = await request.post(`${process.env.API_URL}/carts`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            expect(creatCartResponse.status()).toBe(201);
            const creatCartResponseJson = await creatCartResponse.json();
            cartId = creatCartResponseJson.id;
            console.log("\n" + "##########################\n" + 'cart ID : ' + cartId + "\n##########################");
        });

        await test.step('Add to cart', async () => {
            const addToCartResponse = await request.post(`${process.env.API_URL}/carts/${cartId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: cartPayload
                }
            )
            expect(addToCartResponse.status()).toBe(200);
            const addToCartResponseJson = await addToCartResponse.json();
            console.log("\n" + "##########################\n");
            console.log(addToCartResponseJson);
        });

        await test.step('Check-out', async () => {
            const checkoutResponse = await request.post(`${process.env.API_URL}/payment/check`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        payment_method: "cash-on-delivery"
                    }
                }
            )
            expect(checkoutResponse.status()).toBe(200);
            const checkoutResponseJson = await checkoutResponse.json();
            console.log("\n" + "##########################\n");
            console.log(checkoutResponseJson);
        });

        await test.step('Generate invoice', async () => {
            const invoiceResponse = await request.post(`${process.env.API_URL}/invoices`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        billing_street: "Rosenwag Road",
                        billing_city: "Berlin",
                        billing_state: "Western",
                        billing_country: "Germany",
                        billing_postal_code: "120990",
                        payment_method: "cash-on-delivery",
                        cart_id: `${cartId}`
                    }
                }
            )
            expect(invoiceResponse.status()).toBe(201);
            const invoiceResponseJson = await invoiceResponse.json();
            invoice_number = invoiceResponseJson.invoice_number;
            invoice_id = invoiceResponseJson.id;
            console.log("\n" + "##########################\n");
            console.log(invoiceResponseJson);
        });

    });

    test('Verify invoice details', async ({ page }) => {
        page.addInitScript(value => {
            window.localStorage.setItem('auth-token', value);
        }, token);
        await page.goto(`${process.env.UI_URL}/account/invoices/${invoice_id}`);
        await expect.soft(page.getByTestId('invoice-number')).toHaveValue(`${invoice_number}`);
        await page.waitForTimeout(5000);
    });
});