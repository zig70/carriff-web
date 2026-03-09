import { defineConfig, devices } from '@playwright/test';

// When PRODUCTION_URL is set (smoke tests in CI), hit the live service directly
// and skip starting a local dev server.
const productionUrl = process.env['PRODUCTION_URL'];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: process.env['CI'] ? 'github' : 'html',

  use: {
    baseURL: productionUrl ?? 'http://localhost:4200',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Skip the dev server when running smoke tests against a live deployment
  webServer: productionUrl
    ? undefined
    : {
        command: 'npm run start',
        url: 'http://localhost:4200',
        reuseExistingServer: !process.env['CI'],
        timeout: 120 * 1000,
      },
});
