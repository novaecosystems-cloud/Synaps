const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Download standalone zip or exe of ffmpeg
const ffmpegUrl = 'https://github.com/eugeneware/ffmpeg-static/releases/download/b6.0/ffmpeg-win32-x64';
const targetExe = path.join(__dirname, 'ffmpeg.exe');

console.log(`Downloading ffmpeg executable to ${targetExe}...`);

function downloadFile(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if (response.statusCode === 301 || response.statusCode === 302) {
      return downloadFile(response.headers.location, dest, cb);
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    if (cb) cb(err.message);
  });
}

downloadFile(ffmpegUrl, targetExe, (err) => {
  if (err) {
    console.error('Download error:', err);
  } else {
    console.log('✅ ffmpeg.exe downloaded successfully!');
  }
});
