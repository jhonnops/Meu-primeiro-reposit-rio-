// Uso: node render.js [inicio] [fim] [passo]  -> grava saida/frames/fNNNNN.jpg
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const out = path.join(__dirname, 'saida', 'frames'); fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error') console.log('[pagina]', m.text()); });
  page.on('pageerror', e => console.log('[erro]', e.message));
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForFunction('window.pronto === true', null, { timeout: 30000 });
  const total = await page.evaluate('window.TOTAL');
  const a = +(process.argv[2] ?? 0), b = Math.min(+(process.argv[3] ?? total), total), passo = +(process.argv[4] ?? 1);
  const t0 = Date.now();
  for (let i = a; i < b; i += passo) {
    await page.evaluate(n => window.renderFrame(n), i);
    await page.screenshot({ path: path.join(out, 'f' + String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 93 });
  }
  console.log(`quadros ${a}-${b} em ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  await browser.close();
})();
