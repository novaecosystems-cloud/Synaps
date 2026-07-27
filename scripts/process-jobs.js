const http = require('http');

function processJob() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/api/jobs/process', res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve(data);
        } catch(e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runAll() {
  console.log("Starting to process pending documents...");
  let processing = true;
  while(processing) {
    const res = await processJob();
    if (res.message === 'No jobs available') {
      console.log("All jobs finished!");
      processing = false;
    } else if (res.success) {
      console.log(res.message);
    } else {
      console.log("Error or skipped:", res);
      // Avoid infinite loop on failure
      processing = false; 
    }
  }
}

runAll();
