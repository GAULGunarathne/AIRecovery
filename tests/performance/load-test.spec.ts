import { LoginPage } from '../../pages/loginPage';

export const config = {
  target: 'https://practicesoftwaretesting.com/auth/login',
  metrics: {
    extended: true
  },
  phases: [
    {
      name: 'constantArrivalRate',
      //2 users will arrive every second for 3 seconds
      arrivalRate: 2,
      duration: 3
    }
  ],
  engines: {
    playwright: {
      launchOptions: {
        headless: true
      }
    }
  }
};

export const scenarios = [{
  engine: 'playwright',
  testFunction: pageLoadAndLogin
}];

async function pageLoadAndLogin(page, vuContext, events, test) {

  const { step } = test;
  const loginPage = new LoginPage(page);

  await step('login-page', async () => {
    await loginPage.loadLoginPage();
  });

  await step('submt-login', async () => {
    await loginPage.Login("customer@practicesoftwaretesting.com", "welcome01");
  });
}