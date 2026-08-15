const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const tempDir = path.join(rootDir, 'build_desktop_temp');

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// 1. Write desktop package.json
const desktopPkg = {
  name: 'synaps-desktop',
  version: '1.0.0',
  main: 'main.js',
  description: 'Synaps AI - Sovereign Enterprise OS Desktop Native App',
};
fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(desktopPkg, null, 2));

// 2. Copy desktop shell files
fs.copyFileSync(path.join(rootDir, 'electron', 'main.js'), path.join(tempDir, 'main.js'));
fs.copyFileSync(path.join(rootDir, 'electron', 'preload.js'), path.join(tempDir, 'preload.js'));

// 3. Copy icon if available
const publicDir = path.join(tempDir, 'public');
fs.mkdirSync(publicDir, { recursive: true });
const iconSrc = path.join(rootDir, 'public', 'favicon.ico');
if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, path.join(publicDir, 'favicon.ico'));
}

// 4. Pack into app.asar
const targetAsar = path.join(rootDir, 'node_modules', 'electron', 'dist', 'resources', 'app.asar');
const resourcesDir = path.dirname(targetAsar);
if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir, { recursive: true });
}

console.log('[Desktop Build] Packing Synaps Desktop into app.asar...');
execSync(`npx asar pack "${tempDir}" "${targetAsar}"`, { stdio: 'inherit' });

// 5. Cleanup
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('[Desktop Build] Synaps Desktop App successfully packaged to:', targetAsar);
