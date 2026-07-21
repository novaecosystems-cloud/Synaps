const pdfParse = require('pdf-parse');
const fs = require('fs');

console.warn = () => {};
console.error = () => {};
console.info = () => {};
console.log = () => {};

async function run() {
  const file = process.argv[2];
  const buffer = fs.readFileSync(file);
  const renderPage = async (pageData) => {
    const renderOptions = { normalizeWhitespace: false, disableCombineTextItems: false };
    const textContent = await pageData.getTextContent(renderOptions);
    let lastY, text = '';
    for (const item of textContent.items) {
      if (lastY == item.transform[5] || !lastY) text += item.str;
      else text += '\n' + item.str;
      lastY = item.transform[5];
    }
    return `\n\n[[PAGE_${pageData.pageIndex + 1}]]\n\n${text}`;
  };

  try {
    const data = await pdfParse(buffer, { pagerender: renderPage });
    process.stdout.write(JSON.stringify({ 
      text: data.text, 
      numpages: data.numpages, 
      info: data.info || {}, 
      metadata: data.metadata || {} 
    }));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
