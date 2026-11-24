import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.', testMatch: 'public-browser.spec.mjs',
  workers: 2, reporter: 'list', timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:3000', browserName: 'chromium' },
  webServer: { command: 'npm start', url: 'http://127.0.0.1:3000', env: { NODE_ENV: 'production' }, timeout: 30000 },
});
