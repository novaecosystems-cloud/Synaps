const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
// Electron loads resources/app/ BEFORE app.asar — no integrity check applies
const appDir = path.join(rootDir, 'node_modules', 'electron', 'dist', 'resources', 'app');
const oldAsar = path.join(rootDir, 'node_modules', 'electron', 'dist', 'resources', 'app.asar');

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
  name: 'synaps-desktop',
  version: '1.0.0',
  main: 'main.js',
  description: 'Synaps AI — Sovereign Enterprise OS',
};
fs.writeFileSync(
  path.join(appDir, 'package.json'),
  JSON.stringify(desktopPkg, null, 2)
);

// 2. Copy Electron shell files
fs.copyFileSync(path.join(rootDir, 'electron', 'main.js'),       path.join(appDir, 'main.js'));
fs.copyFileSync(path.join(rootDir, 'electron', 'preload.js'),    path.join(appDir, 'preload.js'));
if (fs.existsSync(path.join(rootDir, 'electron', 'spotlight.html'))) {
  fs.copyFileSync(path.join(rootDir, 'electron', 'spotlight.html'), path.join(appDir, 'spotlight.html'));
}

// 3. Copy favicon if available
const publicDir = path.join(appDir, 'public');
fs.mkdirSync(publicDir, { recursive: true });
const iconSrc = path.join(rootDir, 'public', 'favicon.ico');
if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, path.join(publicDir, 'favicon.ico'));
}

console.log('[Desktop Build] Synaps Desktop app deployed to resources/app/ →', appDir);

