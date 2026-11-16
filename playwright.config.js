// Tests open index.html directly via file://, no server needed.
module.exports = {
  testDir: './tests',
  timeout: 30000,
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'mobile',  use: { viewport: { width: 390, height: 844 } } },
  ],
  use: process.env.CHROME_PATH
    ? { launchOptions: { executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] } }
    : {},
};
