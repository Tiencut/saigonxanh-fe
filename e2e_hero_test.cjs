const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\tient\\.gemini\\antigravity-ide\\brain\\7b2b3b76-a45e-4a0b-bd09-fdb91b930339';

async function runHeroTests() {
  console.log('🚀 Starting Hero Section E2E & Visual Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();

  try {
    // 1. Desktop Test (1440x900)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));

    // Check Hero and absence of old impact section
    const hasHero = await page.$('.sgx-hero-banner');
    const hasOldImpact = await page.$('.sgx-impact-section');
    const statNumbers = await page.$$eval('.hero-stats-grid .stat-number', els => els.map(e => e.innerText.trim()));

    console.log(`✓ Hero banner exists: ${!!hasHero}`);
    console.log(`✓ Old impact section absent: ${hasOldImpact === null}`);
    console.log(`✓ Stat numbers found in 2x2 grid: ${statNumbers.join(', ')}`);

    if (!hasHero) throw new Error('Hero banner not found!');
    if (hasOldImpact !== null) throw new Error('Old impact section is still present in DOM!');
    if (statNumbers.length !== 4) throw new Error(`Expected 4 stats, got ${statNumbers.length}`);

    // Screenshot Desktop
    const desktopScreenshot = path.join(ARTIFACT_DIR, '19_hero_desktop_1440.png');
    await page.screenshot({ path: desktopScreenshot, fullPage: false });
    console.log(`📸 Desktop screenshot saved to ${desktopScreenshot}`);

    // Test Navigation: Click "Xem Bản đồ môi trường"
    console.log('Testing Primary CTA: Click "Xem Bản đồ môi trường"...');
    await page.click('.hero-btn-primary');
    await new Promise(r => setTimeout(r, 1000));
    const currentUrl1 = page.url();
    console.log(`Current URL after clicking Primary CTA: ${currentUrl1}`);
    if (!currentUrl1.includes('/map')) throw new Error(`Primary CTA did not navigate to /map! Current: ${currentUrl1}`);

    // Return to home
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // Test Navigation: Click "Báo điểm rác cần dọn"
    console.log('Testing Secondary CTA: Click "Báo điểm rác cần dọn"...');
    await page.click('.hero-btn-secondary');
    await new Promise(r => setTimeout(r, 1000));
    const currentUrl2 = page.url();
    console.log(`Current URL after clicking Secondary CTA: ${currentUrl2}`);
    if (!currentUrl2.includes('/reports')) throw new Error(`Secondary CTA did not navigate to /reports! Current: ${currentUrl2}`);

    // 2. Tablet Test (768x1024)
    console.log('Testing Tablet Viewport (768x1024)...');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 1000));
    const tabletScreenshot = path.join(ARTIFACT_DIR, '20_hero_tablet_768.png');
    await page.screenshot({ path: tabletScreenshot, fullPage: false });
    console.log(`📸 Tablet screenshot saved to ${tabletScreenshot}`);

    // 3. Mobile Test (390x844)
    console.log('Testing Mobile Viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 1000));
    const mobileScreenshot = path.join(ARTIFACT_DIR, '21_hero_mobile_390.png');
    await page.screenshot({ path: mobileScreenshot, fullPage: false });
    console.log(`📸 Mobile screenshot saved to ${mobileScreenshot}`);

    console.log('🎉 ALL HERO SECTION E2E & VISUAL CHECKS PASSED 100%!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runHeroTests();
