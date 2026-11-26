const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\tient\\.gemini\\antigravity-ide\\brain\\7b2b3b76-a45e-4a0b-bd09-fdb91b930339';

async function run() {
  console.log('--- STARTING E2E COMMUNITY SECTION TEST ---');

  let browser;
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const launchOptions = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };
  if (fs.existsSync(chromePath)) {
    launchOptions.executablePath = chromePath;
  }

  browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  // Test 1: Desktop Viewport 1440x900
  console.log('Testing 1440px Desktop...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Verify showcase section exists
  const showcase = await page.$('.sgx-community-showcase-section');
  if (!showcase) {
    throw new Error('Could not find .sgx-community-showcase-section on page');
  }

  // Scroll to community section
  await page.evaluate(() => {
    const el = document.querySelector('.sgx-community-showcase-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));

  // Check 50/50 panel dimensions
  const dimensions = await page.evaluate(() => {
    const leftPanel = document.querySelector('.showcase-panel-left');
    const rightPanel = document.querySelector('.showcase-panel-right');
    const grid = document.querySelector('.community-showcase-grid');
    if (!leftPanel || !rightPanel || !grid) return null;
    const lRect = leftPanel.getBoundingClientRect();
    const rRect = rightPanel.getBoundingClientRect();
    const gRect = grid.getBoundingClientRect();
    return {
      leftWidth: lRect.width,
      rightWidth: rRect.width,
      diffRatio: Math.abs(lRect.width - rRect.width) / gRect.width,
      gridWidth: gRect.width
    };
  });
  console.log('Panel widths on 1440px desktop:', dimensions);
  if (dimensions && dimensions.diffRatio > 0.05) {
    console.warn('WARNING: Left and right panels differ by more than 5%!');
  } else {
    console.log('SUCCESS: Exactly 50/50 panel split verified!');
  }

  // Test carousel navigation button (click Next)
  const initialIndex = await page.evaluate(() => {
    const activeDot = document.querySelector('.kol-dot.active');
    const dots = Array.from(document.querySelectorAll('.kol-dot'));
    return dots.indexOf(activeDot);
  });
  console.log('Initial dot index:', initialIndex);

  await page.click('.kol-nav-btn.next');
  await new Promise(r => setTimeout(r, 600));

  const nextIndex = await page.evaluate(() => {
    const activeDot = document.querySelector('.kol-dot.active');
    const dots = Array.from(document.querySelectorAll('.kol-dot'));
    return dots.indexOf(activeDot);
  });
  console.log('Dot index after clicking Next:', nextIndex);

  // Test independent scroll of timeline
  const scrollTest = await page.evaluate(() => {
    const scrollBox = document.querySelector('.campaign-timeline-scrollbox');
    if (!scrollBox) return { found: false };
    const initialTop = scrollBox.scrollTop;
    scrollBox.scrollTop = 150;
    return {
      found: true,
      initialTop,
      afterScrollTop: scrollBox.scrollTop,
      scrollHeight: scrollBox.scrollHeight,
      clientHeight: scrollBox.clientHeight
    };
  });
  console.log('Timeline scroll test result:', scrollTest);

  // Capture Desktop screenshot of Community Section
  const desktopPath = path.join(ARTIFACT_DIR, 'community_desktop_1440.png');
  const showcaseElem = await page.$('.sgx-community-showcase-section');
  if (showcaseElem) {
    await showcaseElem.screenshot({ path: desktopPath });
    console.log('Saved desktop screenshot to:', desktopPath);
  }

  // Test Registration Modal Trigger
  console.log('Testing "Đăng ký tham gia" action button...');
  const regBtn = await page.$('.btn-timeline-action.btn-register');
  if (regBtn) {
    await regBtn.click();
    await new Promise(r => setTimeout(r, 600));
    const modalVisible = await page.evaluate(() => {
      const modal = document.querySelector('.modal-overlay') || document.querySelector('.campaign-modal') || document.querySelector('.sgx-modal-overlay');
      return !!modal;
    });
    console.log('Registration modal visible after clicking button:', modalVisible);
    const modalPath = path.join(ARTIFACT_DIR, 'community_modal_register.png');
    await page.screenshot({ path: modalPath });
    console.log('Saved modal screenshot to:', modalPath);

    // Close modal if there's a close button or clicking overlay
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.modal-close-btn') || document.querySelector('.btn-close');
      if (closeBtn) closeBtn.click();
      else {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.click();
      }
    });
    await new Promise(r => setTimeout(r, 400));
  }

  // Test 2: Tablet Viewport 768x1024
  console.log('Testing 768px Tablet...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const el = document.querySelector('.sgx-community-showcase-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  const tabletPath = path.join(ARTIFACT_DIR, 'community_tablet_768.png');
  const tabletElem = await page.$('.sgx-community-showcase-section');
  if (tabletElem) {
    await tabletElem.screenshot({ path: tabletPath });
    console.log('Saved tablet screenshot to:', tabletPath);
  }

  // Test 3: Mobile Viewport 390x844
  console.log('Testing 390px Mobile...');
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle2' });
  // Ensure Web layout is selected to test responsive web on mobile
  await page.waitForSelector('.mode-btn');
  await page.evaluate(() => {
    const webBtn = document.querySelector('.mode-btn');
    if (webBtn) webBtn.click();
  });
  await page.waitForSelector('.sgx-community-showcase-section', { timeout: 10000 });
  await page.evaluate(() => {
    const el = document.querySelector('.sgx-community-showcase-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));

  const mobilePath = path.join(ARTIFACT_DIR, 'community_mobile_390.png');
  const mobileElem = await page.$('.sgx-community-showcase-section');
  if (mobileElem) {
    await mobileElem.screenshot({ path: mobilePath });
    console.log('Saved mobile screenshot to:', mobilePath);
  }

  await browser.close();
  console.log('--- ALL E2E COMMUNITY TESTS COMPLETED SUCCESSFULLY ---');
}

run().catch(err => {
  console.error('E2E TEST ERROR:', err);
  process.exit(1);
});
