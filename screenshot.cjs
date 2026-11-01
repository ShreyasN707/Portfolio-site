const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/home/zoro/.gemini/antigravity/brain/6860e10c-f1dd-4116-81bc-248826871a99/scratch/screenshot.png' });
  await browser.close();
})();
