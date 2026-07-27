const fs = require('fs');
const path = require('path');

// Generate Pitch Deck PDF using Puppeteer or Chrome CLI if available
async function generatePDF() {
  console.log("Generating Pitch Deck PDF...");
  const htmlPath = path.join(__dirname, 'pitch-deck.html');
  const pdfPath = path.join(__dirname, 'synaps_pitch_deck.pdf');

  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: pdfPath,
      width: '1920px',
      height: '1080px',
      printBackground: true
    });
    await browser.close();
    console.log(`✅ Pitch Deck PDF successfully created at: ${pdfPath}`);
  } catch (err) {
    console.warn("Puppeteer not installed, attempting fallback Chrome CLI print...", err.message);
    const { execSync } = require('child_process');
    try {
      execSync(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless --disable-gpu --print-to-pdf="${pdfPath}" "file://${htmlPath}"`);
      console.log(`✅ Pitch Deck PDF created via Chrome CLI at: ${pdfPath}`);
    } catch (e) {
      console.error("Chrome CLI error:", e.message);
    }
  }
}

generatePDF();
