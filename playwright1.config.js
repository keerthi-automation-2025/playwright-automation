// @ts-check
const { devices } = require('@playwright/test');
const { permission } = require('node:process');

const config = {
  testDir: './tests',
  retries : 1,
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
  
    timeout: 10000
  },
  
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  projects: [
    {
      name:'chrome',
  use: {

    browserName : 'chromium',
    headless : false,
   // viewport : {width: 720, height: 720},
    screenshot : 'on',
    video:'on',
    trace : 'on',//off,on
    ignorehttpserrors : true,
    ...devices['android OnePlus 9 Pro']
    },
  },
  {
    name:'webkitprofile',
use: {

  browserName : 'webkit',
  headless : true,
  screenshot : 'on',
  trace : 'on',//off,on
  ignorehttpserrors : true,
  permissions : ['geolocation'],
  ...devices['iPhone 11']
  },
}
]


};

module.exports = config;
