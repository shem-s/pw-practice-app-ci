import { defineConfig, devices } from '@playwright/test';

// NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// This is where the globals begin to be setup from the modified test obj 
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
import type { TestOptions } from './test-options';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// We uncomment this code to start using the package
// I was not able to get this aspect to work as there seems to be a difference between the course and the new version of playwright 
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
 require('dotenv').config()  // I tried this  but it didnt work


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  timeout: 60000,
  // globalTimeout: 100000,

  // expect:{
  //   timeout:2000
  // },

  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // you could save the results in json format by changing the reporter and using the below 
  // Also you can use more than one reporter as seen below
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  reporter: [
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // The line below "process.env.CI ? ["dot"] : ["list"]" is to setup Argos reporter in the project to handle screenshots in the CI 
    // Also you can use more than one reporter as seen below
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    process.env.CI ? ["dot"] : ["list"],
    // Add Argos reporter.
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,

        // Set your Argos token (required if not using GitHub Actions).
        // token: "<YOUR-ARGOS-TOKEN>",
      },
    ],
    ['json',{outputFile: 'test-results/jsonReport.json'}],
    ['junit',{outputFile: 'test-results/junitReport.xml'}],
    ['html']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:4200/',
    globalsQaURL:'https://www.globalsqa.com/demo-site/draganddrop/',

    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Another way of using globals with the baseURL property here is to use the env vars like below with some logic
    // But this also doesnt appear to work the same way as the course 
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'
            :process.env.STAGING === '1' ? 'http://localhost:4202/'
            :'http://localhost:4200/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot:'only-on-failure',

    // actionTimeout: 5000,
    // navigationTimeout: 5000,

    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // To add video for the test you can use the below property. These videos are automatically attached to the report
    //  there are different modes that can be used to record the video on failure for example
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // video: 'on'
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // you can also change the resolution to the video as seen below
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    video:{
      mode:'off',
      size: {width:1920, height: 1080}
    }

  },


  // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // Any item in the general settings (above) can be configured in the project settings on the project level
  // This in turn allows the project to overide any thing set in the general setting and apply to that project only
  // e.g. given with the webkit project
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  /* Configure projects for major browsers */
  projects: [

    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // If you want to use different URLs for different test then you can use different projects as below
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // {
    //   name: 'dev',
    //   use: { ...devices['Desktop Chrome'],
    //     baseURL: 'http://localhost:4201/'
    //    },
    // },
    // {
    //   name: 'staging',
    //   use: { ...devices['Desktop Chrome'],
    //     baseURL: 'http://localhost:4202/'
    //    },
    // },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      // instead of using teh below commented out code you can use the line below it
      // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      // use: { ...devices['Desktop Firefox'] },
      use: { browserName: 'firefox' },
      
      
      // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      // Can signify to only run a spcific browser in parallel if desired by using the below 
      // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      fullyParallel: true
    },

    {
      name: 'webkit',
      use: { 
        browserName:'webkit',
        video:{
          mode:'off',
          size: {width:1920, height: 1080}
        }
       },
    },

    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts', //Only this fill will run when this project is run
      use: { 
        browserName:'chromium',
        viewport:          {width:1920, height: 1080}        
       },
    },

    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts', //Only this fill will run when this project is run
      use: { 
        ...devices['iPhone 14 Pro'],             
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
  webServer:{
    command: 'npm run start',
    url: 'http://localhost:4200'
  }
});
