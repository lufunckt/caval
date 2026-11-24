import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const pages = JSON.parse(fs.readFileSync('content/editorial-pages.json', 'utf8'));
for (const width of [1440, 768, 390]) {
  for (const pageInfo of pages) {
    test(`public layout ${width}: ${pageInfo.path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(pageInfo.path);
      await expect(page.locator('main')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        for (const image of document.images) image.loading = 'eager';
        await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
      });
      const metrics = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        broken: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.getAttribute('src')),
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width + 1);
      expect(metrics.broken).toEqual([]);
      await expect(page.locator('body')).toHaveCSS('color', 'rgb(16, 38, 92)');
      if (width === 390) {
        await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
        await expect(page.locator('#site-navigation')).toBeHidden();
        await page.getByRole('button', { name: 'Abrir menu' }).click();
        await expect(page.locator('#site-navigation')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('#site-navigation')).toBeHidden();
      }
      if (pageInfo.path === '/' && [1440, 390].includes(width)) {
        await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
      }
    });
  }
}
test('questionnaire still prepares the WhatsApp message without sending it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/questionario-comportamento-canino');
  await page.getByLabel('Nome do cão', { exact: true }).fill('Biscoito');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByLabel('Agitação ou puxões na guia', { exact: true }).check();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.locator('#review')).toContainText('Biscoito');
  await expect(page.locator('#send')).toHaveAttribute('href', /https:\/\/wa\.me\/5555997240369\?text=/);
});
test('mobile navigation remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3000/');
  await expect(page.locator('#site-navigation')).toBeVisible();
  await expect(page.locator('#site-navigation').getByRole('link', { name: 'Método', exact: true })).toBeVisible();
  await context.close();
});
