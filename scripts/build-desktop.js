const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
// Electron loads resources/app/ BEFORE app.asar — no integrity check applies
const appDir = path.join(rootDir, 'node_modules', 'electron', 'dist', 'resources', 'app');
const oldAsar = path.join(rootDir, 'node_modules', 'electron', 'dist', 'resources', 'app.asar');

// Ensure splash assets are bundled and up to date
const splashHtmlPath = path.join(rootDir, 'electron', 'splash.html');
const threeMinPath = path.join(rootDir, 'electron', 'three.min.js');
if (!fs.existsSync(splashHtmlPath) || !fs.existsSync(threeMinPath)) {
  try {
    require('./build-splash.js');
  } catch (e) {
    console.warn('[Desktop Build] Splash builder warning:', e.message);
  }
}

// Always delete stale app.asar — Electron validates its hash even when resources/app/ exists
if (fs.existsSync(oldAsar)) {
  fs.rmSync(oldAsar, { force: true });
  console.log('[Desktop Build] Removed stale app.asar.');
}

// Clean and recreate resources/app/
if (fs.existsSync(appDir)) {
  fs.rmSync(appDir, { recursive: true, force: true });
}
fs.mkdirSync(appDir, { recursive: true });

// 1. Write desktop package.json
const desktopPkg = {
  name: 'causarix-desktop',
  version: '1.0.0',
  main: 'main.js',
  description: 'Causarix AI — Sovereign Enterprise Decision Intelligence OS',
};
fs.writeFileSync(
  path.join(appDir, 'package.json'),
  JSON.stringify(desktopPkg, null, 2)
);

// 2. Copy Electron shell files and splashscreen assets
const shellFiles = [
  'main.js',
  'preload.js',
  'splash.html',
  'three.min.js',
  'spotlight.html',
  'offline.html',
  'causarix.ico',
];

for (const file of shellFiles) {
  const src = path.join(rootDir, 'electron', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(appDir, file));
  }
}

// 3. Copy brand logos and icons to public and app root for offline resilience
const publicDir = path.join(appDir, 'public');
fs.mkdirSync(publicDir, { recursive: true });

const publicAssets = [
  'favicon.ico',
  'synaps_logo.webp',
  'causarix_logo.webp',
  'synaps_logo.png',
  'causarix_logo.png',
];

for (const asset of publicAssets) {
  const src = path.join(rootDir, 'public', asset);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, asset));
    fs.copyFileSync(src, path.join(appDir, asset));
  }
}

console.log('[Desktop Build] Synaps Desktop app deployed to resources/app/ →', appDir);
