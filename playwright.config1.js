const { devices } = require("@playwright/test");

const config = ({
  testDir: './tests',
  retries :2,
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: 'html',
  projects: [
    {
      name: 'safari',
      use: {
        browserName: 'webkit',
        headless: true,
        screenshot: 'off',
        trace: 'on',
        ...devices['iPhone 11'],

      },
    },
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        headless: true,
        screenshot: 'on',
        video: 'retain-on-failure',
        ignoreHttpsErrors:true,
        permissions:['geolocation'],
        trace: 'on',
      },

    },

  ]

});

module.exports = config;