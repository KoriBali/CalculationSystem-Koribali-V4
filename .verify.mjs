import { chromium } from 'playwright';

const OUT = '/tmp/claude-1000/-home-kbuser-rifa-web-development-project-pole-calculation-app/4ac6b50b-07e8-4957-90d3-5a900abf592e/scratchpad';
const shot = async (page, name) => {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
};
const base = 'http://localhost:5180';

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });

await page.goto(`${base}/login`);
await page.fill('input[type=email]', 'test@example.com');
await page.fill('input[type=password]', 'password123');
await page.click('button:has-text("Sign In")');
await page.waitForLoadState('networkidle');

await page.click('button:has-text("Signboard")');
await page.waitForLoadState('networkidle');
await page.click('button:has-text("New Calculation")');
await page.waitForLoadState('networkidle');
console.log('project setup url:', page.url());
await shot(page, 'v1-project-setup-empty');

// Fill identity fields
await page.fill('input[placeholder="e.g. YSC-26-0107"]', 'REQ-001');
await page.fill('input[placeholder="e.g. YS Pole"]', 'PT Test Company');
await page.selectOption('select', 'Revision');
await page.fill('input[placeholder="e.g. 77732"]', 'PRJ-99');
await page.fill('input[type=date]', '2026-07-13');
await page.fill('input[placeholder="e.g. Miyashita Children\'s Playground"]', 'Test Project A');
await page.click('button:has-text("Calculation Only")');
await shot(page, 'v2-project-setup-filled');

const identityLS = await page.evaluate(() => {
  const keys = Object.keys(localStorage).filter(k => k.includes('signboard'));
  const out = {};
  keys.forEach(k => out[k] = localStorage.getItem(k));
  return out;
});
console.log('localStorage keys after fill:', JSON.stringify(identityLS, null, 2));

await page.click('button:has-text("Go to Calculation")');
await page.waitForLoadState('networkidle');
console.log('after go to calc url:', page.url());

// Fill Initial Input page: design standard + wind/seismic + enable report
const select = page.locator('select').first();
await select.selectOption({ index: 1 });
const numberInputs = await page.locator('input[type=text], input[type=number]').all();
for (const inp of numberInputs) {
  if (await inp.isVisible()) {
    const val = await inp.inputValue();
    if (!val) await inp.fill('10');
  }
}
// Toggle "Include Report"
const includeReportToggle = page.locator('text=Include Report').locator('xpath=following-sibling::button, xpath=./ancestor::div[1]//button').first();
await page.locator('button[role=switch], button:near(:text("Include Report"))').last().click().catch(async () => {
  // fallback: click the toggle element directly by finding the switch near the label
  const toggles = await page.locator('button').all();
});
await shot(page, 'v3-initial-input');

await page.click('button:has-text("Next Step")');
await page.waitForTimeout(500);
const okBtn = page.locator('button:has-text("OK")');
if (await okBtn.isVisible().catch(() => false)) {
  await okBtn.click();
}
const selectOptions = await select.locator('option').allTextContents();
const selectValue = await select.inputValue();
console.log('select options:', selectOptions, 'current value:', selectValue);
const allInputsDump = await page.locator('input:visible').evaluateAll(els =>
  els.map(e => ({ type: e.type, value: e.value, placeholder: e.placeholder }))
);
console.log('all visible inputs:', JSON.stringify(allInputsDump, null, 2));
await shot(page, 'v4b-initial-with-errors');
console.log('JS ERRORS SO FAR:', JSON.stringify(errors.filter(e => e.startsWith('PAGEERROR'))));

const html = await page.locator('body').innerHTML();
const idx = html.indexOf('Include Report');
console.log('AROUND INCLUDE REPORT:', html.slice(Math.max(0, idx - 300), idx + 500));

await browser.close();
