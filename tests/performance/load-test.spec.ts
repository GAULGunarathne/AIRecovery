import { LoginPage } from '../../pages/loginPage';

export const config = {
  target: 'https://practicesoftwaretesting.com/auth/login',
  // phases: [
  //   // {
  //   //   name : 'constantArrivalRate',
  //   //   //2 users will arrive every second for 10 seconds
  //   //   arrivalRate: 1,
  //   //   duration: 10
  //   // }
  //   // {
  //   //   name : 'pause',
  //   //   pause: 5
  //   // },
  //   {
  //     name: 'ramp up',
  //     //ramps up the arrival rate of virtual users from 1 to 5 over 10 seconds
  //     duration: '5',
  //     arrivalRate: 1,
  //     rampTo: 2,
  //   },
  // ],
  engines: {
    playwright: {
      trace: {
        enabled: true
      },
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

  await step('landing page', async () => {
    await page.goto('https://practicesoftwaretesting.com/auth/login');
  });

  await step('login', async () => {
    await loginPage.Login("customer@practicesoftwaretesting.com", "welcome01");
  });
}