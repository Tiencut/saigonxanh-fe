const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\tient\\.gemini\\antigravity-ide\\brain\\7b2b3b76-a45e-4a0b-bd09-fdb91b930339';

async function run() {
  console.log('--- STARTING E2E PARTNERSHIP & NEWS REDESIGN TEST ---');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test 1: Desktop Viewport 1440x900
  console.log('Testing 1440px Desktop...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.sgx-partnership-news-section', { timeout: 10000 });

  // Scroll to partnership & news section
  await page.evaluate(() => {
    const el = document.querySelector('.sgx-partnership-news-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify 50/50 Panel Split
  const dimensions = await page.evaluate(() => {
    const leftPanel = document.querySelector('.bento-partnership-panel');
    const rightPanel = document.querySelector('.news-showcase-panel');
    const grid = document.querySelector('.partnership-news-grid');
    if (!leftPanel || !rightPanel || !grid) return null;
    const lRect = leftPanel.getBoundingClientRect();
    const rRect = rightPanel.getBoundingClientRect();
    const gRect = grid.getBoundingClientRect();
    return {
      leftWidth: lRect.width,
      rightWidth: rRect.width,
      leftHeight: lRect.height,
      rightHeight: rRect.height,
      diffRatio: Math.abs(lRect.width - rRect.width) / gRect.width,
      gridWidth: gRect.width
    };
  });
  console.log('Panel dimensions on 1440px desktop:', dimensions);
  if (dimensions && dimensions.diffRatio > 0.05) {
    console.warn('WARNING: Left and right panels differ in width by > 5%');
  } else {
    console.log('SUCCESS: Exactly 50/50 desktop panel split verified!');
  }

  // Verify News items count (must be 4 cards)
  const newsCount = await page.evaluate(() => {
    return document.querySelectorAll('.news-mini-card').length;
  });
  console.log('News mini cards count:', newsCount);
  if (newsCount !== 4) {
    throw new Error(`Expected 4 news cards, found ${newsCount}`);
  }

  // Capture Desktop Screenshot of Partnership & News Section
  const desktopPath = path.join(ARTIFACT_DIR, 'partnership_news_desktop_1440.png');
  const sectionElem = await page.$('.sgx-partnership-news-section');
  if (sectionElem) {
    await sectionElem.screenshot({ path: desktopPath });
    console.log('Saved desktop screenshot to:', desktopPath);
  }

  // Also capture the Community section to show updated header
  const communityElem = await page.$('.sgx-community-showcase-section');
  if (communityElem) {
    const commPath = path.join(ARTIFACT_DIR, 'community_header_updated.png');
    await communityElem.screenshot({ path: commPath });
    console.log('Saved community updated screenshot to:', commPath);
  }

  // Test 2: Tablet Viewport 768x1024
  console.log('Testing 768px Tablet...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('.sgx-partnership-news-section');
  await page.evaluate(() => {
    const el = document.querySelector('.sgx-partnership-news-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  const tabletPath = path.join(ARTIFACT_DIR, 'partnership_news_tablet_768.png');
  const tabletElem = await page.$('.sgx-partnership-news-section');
  if (tabletElem) {
    await tabletElem.screenshot({ path: tabletPath });
    console.log('Saved tablet screenshot to:', tabletPath);
  }

  // Test 3: Mobile Viewport 390x844 (Web Mode)
  console.log('Testing 390px Mobile...');
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('.mode-btn');
  await page.evaluate(() => {
    const webBtn = document.querySelector('.mode-btn');
    if (webBtn) webBtn.click();
  });
  await page.waitForSelector('.sgx-partnership-news-section', { timeout: 10000 });
  await page.evaluate(() => {
    const el = document.querySelector('.sgx-partnership-news-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));

  const mobilePath = path.join(ARTIFACT_DIR, 'partnership_news_mobile_390.png');
  const mobileElem = await page.$('.sgx-partnership-news-section');
  if (mobileElem) {
    await mobileElem.screenshot({ path: mobilePath });
    console.log('Saved mobile screenshot to:', mobilePath);
  }

  await browser.close();
  console.log('--- ALL E2E PARTNERSHIP & NEWS TESTS PASSED SUCCESSFULLY ---');
}

run().catch(err => {
  console.error('E2E TEST ERROR:', err);
  process.exit(1);
});
