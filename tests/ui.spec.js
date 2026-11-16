const { test, expect } = require('@playwright/test');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, '..', 'index.html');

const IDS = ['board','status','tutorial','game-controls','mode','level','hint','undo','restart',
  'tut-open','tut-prev','tut-next','tut-reset','tut-exit','tut-title','tut-text','tut-count'];

let errors;
test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url);
  await expect(page.locator('#status')).not.toBeEmpty();
});
test.afterEach(() => { expect(errors).toEqual([]); });

test('all DOM ids used by the script exist', async ({ page }) => {
  for (const id of IDS) await expect(page.locator('#' + id)).toHaveCount(1);
});

test('no horizontal scroll', async ({ page }) => {
  const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  expect(sw).toBeLessThanOrEqual(cw);
});

test('normal mode shows all game controls, tutorial hidden', async ({ page }) => {
  for (const id of ['mode','level','hint','undo','restart','tut-open']) await expect(page.locator('#' + id)).toBeVisible();
  await expect(page.locator('#tutorial')).toBeHidden();
});

test('tutorial hides every game control (regression: mode change must not reset a lesson)', async ({ page }) => {
  await page.click('#tut-open');
  await expect(page.locator('#tutorial')).toBeVisible();
  for (const id of ['mode','level','hint','undo','restart','tut-open']) await expect(page.locator('#' + id)).toBeHidden();
  await expect(page.locator('#tut-title')).toContainText('第 1 課');
  await expect(page.locator('#tut-count')).toHaveText('1 / 10');
});

test('tutorial navigation and exit', async ({ page }) => {
  await page.click('#tut-open');
  await expect(page.locator('#tut-prev')).toBeDisabled();
  await page.click('#tut-next');
  await expect(page.locator('#tut-title')).toContainText('第 2 課');
  await page.click('#tut-prev');
  await expect(page.locator('#tut-title')).toContainText('第 1 課');
  await page.click('#tut-exit');
  await expect(page.locator('#tutorial')).toBeHidden();
  for (const id of ['mode','hint','undo','restart']) await expect(page.locator('#' + id)).toBeVisible();
});

test('pvp mode starts with red to move and undo is clickable', async ({ page }) => {
  await page.selectOption('#mode', 'pvp');
  await expect(page.locator('#status')).toContainText('輪到紅方');
  await page.click('#undo');
});
