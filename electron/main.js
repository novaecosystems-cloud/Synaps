const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 900,
    title: 'Synapse AI - Enterprise Knowledge Engine',
    backgroundColor: '#070c18',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Bypass landing page: Navigate directly to /dashboard for Desktop App users
  const isDev = process.env.NODE_ENV === 'development';
  const startUrl = isDev 
    ? 'http://localhost:3000/dashboard' 
    : 'https://synaps-one.vercel.app/dashboard';

  console.log(`[Synapse Desktop] Booting directly to Dashboard: ${startUrl}`);
  mainWindow.loadURL(startUrl);

  // Handle window close -> minimize to system tray instead of exiting
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../public/favicon.ico');
  // Use tray icon if exists, fallback gracefully if not
  if (fs.existsSync(iconPath)) {
    tray = new Tray(iconPath);
  } else {
    tray = new Tray(path.join(__dirname, 'icon.png')); // Fallback icon path
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Synapse Dashboard', click: () => mainWindow.show() },
    { label: 'Run 60s Contract Redline', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Status: 24/7 Cloud Sync Active', enabled: false },
    { type: 'separator' },
    { label: 'Quit Synapse', click: () => { app.isQuitting = true; app.quit(); } },
  ]);

  tray.setToolTip('Synapse AI - Enterprise Knowledge Engine');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  try { createTray(); } catch (e) { console.log('Tray creation note:', e.message); }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Listener: Request native local folder permission
ipcMain.handle('select-watched-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Folder for Synapse AI 24/7 Monitoring',
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});
