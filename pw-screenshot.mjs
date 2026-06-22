import { chromium } from './node_modules/playwright/index.mjs';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });

// Navigate to app
await page.goto('http://localhost:5174');
await page.screenshot({ path: '/tmp/home.png' });

// Get navigation buttons/links
const els = await page.$$eval('a, button', els => 
  els.map(e => ({ text: e.textContent?.trim().slice(0,60), href: e.getAttribute('href') })).filter(e => e.text)
);
console.log('NAV:', JSON.stringify(els.slice(0, 15), null, 2));
await browser.close();
