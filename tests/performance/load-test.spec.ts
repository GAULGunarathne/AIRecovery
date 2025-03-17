import { LoginPage } from '../../pages/loginPage';
import { HomePage } from '../../pages/homePage';

export const config = {
  target: 'https://practicesoftwaretesting.com/auth/login',
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
        headless: false
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
  const homePage = new HomePage(page);

  await step('01.load-login-page', async () => {
    await loginPage.loadLoginPage();
  });

  await step('02.submit-login', async () => {
    await loginPage.Login("customer@practicesoftwaretesting.com", "welcome01");
  });

  await step('03.search-product', async () => {
    await homePage.clickHome();
    await homePage.SearchProduct("Thor Hammer");
    await homePage.assertValidSearchResult("Thor Hammer");
  });

}