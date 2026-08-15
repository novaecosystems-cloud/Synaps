const { app, BrowserWindow, Tray, Menu, ipcMain, dialog, globalShortcut, shell } = require('electron');
const path = require('path');
const fs = require('fs');

app.setName('Synaps AI');
try {
  app.setPath('userData', path.join(app.getPath('appData'), 'SynapsDesktopApp'));
} catch (e) {}

let mainWindow = null;
let tray = null;

function createApplicationMenu(startBaseUrl) {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac ? [{
      label: 'Synaps',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'Executive Suite',
      submenu: [
        {
          label: 'Executive Dashboard',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard`),
        },
        {
          label: '10-Agent AI Boardroom',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/boardroom`),
        },
        {
          label: 'Chief of Staff Memo',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/chief-of-staff`),
        },
        {
          label: 'Synaps Cowork & MCP Den',
          accelerator: 'CmdOrCtrl+4',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/cowork`),
        },
        {
          label: 'Playbook to Skill (24x RAG)',
          accelerator: 'CmdOrCtrl+5',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/skills`),
        },
        {
          label: 'Matter Notebooks & Audio',
          accelerator: 'CmdOrCtrl+6',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/notebooks`),
        },
        {
          label: 'ARLM Chart Studio',
          accelerator: 'CmdOrCtrl+7',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/charts`),
        },
        { type: 'separator' },
        {
          label: 'AI Infrastructure & Colibrì MoE Settings',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/settings/ai`),
        },
      ]
    },
    {
      label: 'Sovereign MoE',
      submenu: [
        {
          label: 'Colibrì 744B Local MoE Status',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/settings/ai`),
        },
        {
          label: 'Open Colibrì GitHub Docs',
          click: () => shell.openExternal('https://github.com/JustVugg/colibri'),
        },
        { type: 'separator' },
        {
          label: 'Air-Gapped Zero-Egress Status: Active',
          enabled: false,
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1080,
    minHeight: 700,
    title: 'Synaps AI - Sovereign Enterprise OS',
    backgroundColor: '#070c18',
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = process.env.NODE_ENV === 'development';
  const startBaseUrl = isDev 
    ? 'http://localhost:3000' 
    : 'https://synaps-one.vercel.app';
  const startUrl = `${startBaseUrl}/dashboard`;

  createApplicationMenu(startBaseUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Set session cookie for native desktop auto-login
  const domain = isDev ? 'localhost' : 'synaps-one.vercel.app';
  mainWindow.webContents.session.cookies.set({
    url: startBaseUrl,
    name: 'synaps-session',
    value: 'TEST_TOKEN_desktop_native_user',
    domain: domain,
    path: '/',
    httpOnly: true,
    expirationDate: Math.floor(Date.now() / 1000) + (365 * 86400)
  }).then(() => {
    console.log(`[Synaps Desktop] Session initialized. Loading ${startUrl}`);
    mainWindow.loadURL(startUrl);
    mainWindow.show();
  }).catch((err) => {
    console.warn(`[Synaps Desktop] Session cookie warning:`, err.message);
    mainWindow.loadURL(startUrl);
    mainWindow.show();
  });

  // Handle window close -> minimize to system tray instead of terminating
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
  const fallbackIcon = path.join(__dirname, 'icon.png');
  const trayIcon = fs.existsSync(iconPath) ? iconPath : (fs.existsSync(fallbackIcon) ? fallbackIcon : null);

  if (!trayIcon) return;

  tray = new Tray(trayIcon);

  const isDev = process.env.NODE_ENV === 'development';
  const startBaseUrl = isDev ? 'http://localhost:3000' : 'https://synaps-one.vercel.app';

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Synaps OS', click: () => { mainWindow.show(); mainWindow.focus(); } },
    { label: '10-Agent Boardroom', click: () => { mainWindow.show(); mainWindow.loadURL(`${startBaseUrl}/dashboard/boardroom`); } },
    { label: 'Matter Notebooks', click: () => { mainWindow.show(); mainWindow.loadURL(`${startBaseUrl}/dashboard/notebooks`); } },
    { type: 'separator' },
    { label: 'Colibrì 744B MoE: Ready', enabled: false },
    { type: 'separator' },
    { label: 'Quit Synaps', click: () => { app.isQuitting = true; app.quit(); } },
  ]);

  tray.setToolTip('Synaps AI - Sovereign Enterprise OS');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  try { createTray(); } catch (e) { console.log('Tray setup note:', e.message); }

  // Register Global Hotkey (CmdOrCtrl+Shift+S) to bring Synaps to front
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.focus();
      } else {
        mainWindow.show();
      }
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Listener: Native directory picker for 24/7 background folder monitoring
ipcMain.handle('select-watched-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Folder for Synaps AI 24/7 Monitoring',
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});
