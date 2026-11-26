const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\tient\\.gemini\\antigravity-ide\\brain\\7b2b3b76-a45e-4a0b-bd09-fdb91b930339';

async function testDrag() {
  console.log('--- TESTING HORIZONTAL DRAG & SWIPE ON CAROUSEL ---');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.kol-carousel-viewport');

  // Scroll to carousel
  await page.evaluate(() => {
    const el = document.querySelector('.kol-carousel-viewport');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Get initial active dot index
  const getActiveDot = async () => {
    return await page.evaluate(() => {
      const dots = Array.from(document.querySelectorAll('.kol-dot'));
      const active = document.querySelector('.kol-dot.active');
      return dots.indexOf(active);
    });
  };

  const initialDot = await getActiveDot();
  console.log('Initial Active Dot Index:', initialDot);

  // Get carousel bounding box
  const viewportBox = await page.evaluate(() => {
    const el = document.querySelector('.kol-carousel-viewport');
    const rect = el.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });

  console.log('Performing mouse drag left (next slide)...');
  await page.mouse.move(viewportBox.x + 100, viewportBox.y);
  await page.mouse.down();
  // Drag left by 180px
  for (let i = 0; i <= 10; i++) {
    await page.mouse.move(viewportBox.x + 100 - (180 * (i / 10)), viewportBox.y);
    await new Promise(r => setTimeout(r, 20));
  }
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 600));

  const afterDragDot = await getActiveDot();
  console.log('Active Dot Index after dragging left:', afterDragDot);

  // Capture screenshot after drag
  const dragScreenshot = path.join(ARTIFACT_DIR, 'carousel_after_drag.png');
  const showcaseElem = await page.$('.sgx-community-showcase-section');
  if (showcaseElem) {
    await showcaseElem.screenshot({ path: dragScreenshot });
    console.log('Saved screenshot after drag to:', dragScreenshot);
  }

  // Now perform mouse drag right (prev slide)
  console.log('Performing mouse drag right (prev slide)...');
  await page.mouse.move(viewportBox.x - 100, viewportBox.y);
  await page.mouse.down();
  // Drag right by 180px
  for (let i = 0; i <= 10; i++) {
    await page.mouse.move(viewportBox.x - 100 + (180 * (i / 10)), viewportBox.y);
    await new Promise(r => setTimeout(r, 20));
  }
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 600));

  const afterPrevDragDot = await getActiveDot();
  console.log('Active Dot Index after dragging right:', afterPrevDragDot);

  await browser.close();

  if (afterDragDot !== initialDot) {
    console.log('SUCCESS: Mouse drag horizontally advanced carousel slides!');
  } else {
    throw new Error('FAILED: Mouse drag did not change active slide');
  }
}

testDrag().catch(err => {
  console.error('ERROR in drag test:', err);
  process.exit(1);
});
