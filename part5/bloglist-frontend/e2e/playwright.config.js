/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  timeout: 30 * 1000,
  use: {
    headless: true,
    baseURL: 'http://localhost:5173'
  },
  testDir: './tests'
}
