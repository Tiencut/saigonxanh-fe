const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\tient\\.gemini\\antigravity-ide\\brain\\7b2b3b76-a45e-4a0b-bd09-fdb91b930339';

async function runSponsorTests() {
  console.log('🚀 Starting Sponsorship Section E2E Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // 1. Desktop Test (1440x900)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll to sponsorship section
    await page.evaluate(() => {
      const el = document.querySelector('.sgx-sponsorship-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 1000));

    const hasSponsorSec = await page.$('.sgx-sponsorship-section');
    const cards = await page.$$('.sgx-sponsorship-section .sponsor-card');

    console.log(`✓ Sponsorship section exists: ${!!hasSponsorSec}`);
    console.log(`✓ Number of sponsor cards: ${cards.length}`);

    if (!hasSponsorSec || cards.length !== 3) {
      throw new Error(`Expected 3 sponsor cards, found ${cards.length}`);
    }

    // Screenshot Desktop Sponsorship Section
    const desktopScreenshot = path.join(ARTIFACT_DIR, '22_sponsorship_desktop.png');
    await page.screenshot({ path: desktopScreenshot, fullPage: false });
    console.log(`📸 Desktop screenshot saved to ${desktopScreenshot}`);

    // Click on Card 1
    console.log('Clicking on BOM NỔI card...');
    const firstCard = await page.$('.sgx-sponsorship-section .sponsor-card');
    await firstCard.click();
    await new Promise(r => setTimeout(r, 800));

    // Verify Donate Modal opened
    const modalVisible = await page.$('.modal-dialog');
    const donorMsgVal = await page.$eval('.form-group input[placeholder*="Cố lên"]', el => el.value);

    console.log(`✓ Modal dialog opened: ${!!modalVisible}`);
    console.log(`✓ Prefilled message in modal: "${donorMsgVal}"`);

    if (!modalVisible) throw new Error('Donation modal did not open upon clicking Liên hệ!');

    // Screenshot Modal
    const modalScreenshot = path.join(ARTIFACT_DIR, '23_sponsorship_modal.png');
    await page.screenshot({ path: modalScreenshot, fullPage: false });
    console.log(`📸 Modal screenshot saved to ${modalScreenshot}`);

    console.log('🎉 SPONSORSHIP SECTION E2E CHECKS PASSED 100%!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runSponsorTests();
