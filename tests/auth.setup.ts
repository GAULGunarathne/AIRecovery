import { test as setup, expect } from '@playwright/test';
import user from '../.auth/customer01.json';
import fs from 'fs';

setup("Create customer 01 auth via API", async ({ request }) => {
  const customer01AuthFile = ".auth/customer01.json";

  const loginResponse = await request.post(`${process.env.API_URL}/users/login`,
    {
      data: {
        email: `${process.env.CUSTOMER_01_USERNAME}`,
        password: `${process.env.CUSTOMER_01_PASSWORD}`
      }
    }
  )
  expect(loginResponse.ok()).toBeTruthy();
  const loginResponseJson = await loginResponse.json();
  const token = loginResponseJson.access_token;
  user.origins[0].localStorage[0].value = token;
  fs.writeFileSync(customer01AuthFile, JSON.stringify(user));

});