import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// ES module workaround for __dirname
const _dirname = __dirname; 

// Load the environment variables
const dotenvPath = path.resolve(__dirname, '../../.env'); // 2 levels up from script_generator.ts
dotenv.config({ path: dotenvPath });


console.log("Loading .env from:", dotenvPath);
console.log("FSIGNUP:", process.env.FSIGNUP);





export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    // ['blob'],
    // ['@artillery/playwright-reporter', { name: 'artillery-report' }],
  ],
  timeout: 120000,
  expect: {
    timeout: 10000,
  },
  use: {
    launchOptions: {
      slowMo: 1500,
    },
    baseURL: `${process.env.UI_URL}`,
    testIdAttribute: 'data-test',
    trace: 'on',
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'on-first-failure',
    headless: false,
    // extraHTTPHeaders: {
    //   'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
    // }
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['clipboard-read'],
      },
    },
  ],
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});