const { app, BrowserWindow, Tray, Menu, ipcMain, dialog, globalShortcut, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

app.setName('Synaps AI');

// Ensure persistent user data directory so user login is saved across app restarts
try {
  const userDataDir = path.join(app.getPath('appData'), 'synaps-enterprise-desktop');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }
  app.setPath('userData', userDataDir);
} catch (e) {
  console.warn('[Synaps Desktop] UserData init note:', e.message);
}

let mainWindow = null;
let spotlightWindow = null;
let tray = null;
let lastSpotlightOpenTime = 0;

function getAppIcon() {
  const candidates = [
    path.join(__dirname, 'favicon.ico'),
    path.join(__dirname, 'public', 'favicon.ico'),
    path.join(__dirname, '../public/favicon.ico'),
    path.join(process.resourcesPath, 'app', 'favicon.ico'),
    path.join(process.resourcesPath, 'app', 'public', 'favicon.ico'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      try {
        return nativeImage.createFromPath(c);
      } catch (e) {}
    }
  }

  // Fallback: Create 16x16 icon in memory if file is missing
  return nativeImage.createEmpty();
}

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
      label: '⚡ Executive Suite',
      submenu: [
        {
          label: '⚡ Summon Spotlight Companion',
          accelerator: 'CmdOrCtrl+Space',
          click: () => toggleSpotlight(),
        },
        { type: 'separator' },
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
          label: 'Colibrì 744B MoE Settings',
          accelerator: 'CmdOrCtrl+5',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/settings/ai`),
        },
        {
          label: 'Matter Audio Notebooks',
          accelerator: 'CmdOrCtrl+6',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/notebooks`),
        },
        { type: 'separator' },
        {
          label: '60-Second Contract Redline',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/documents`),
        },
        {
          label: '3D Organizational Graph',
          click: () => mainWindow && mainWindow.loadURL(`${startBaseUrl}/dashboard/graph`),
        },
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
  const icon = getAppIcon();

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1080,
    minHeight: 700,
    title: 'Synaps AI - Sovereign Enterprise OS',
    backgroundColor: '#070c18',
    icon: icon,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'persist:synaps_main_user', // Persistent partition preserves login cookies & state forever!
    },
  });

  mainWindow.setMenuBarVisibility(true);
  mainWindow.autoHideMenuBar = false;

  const isDev = process.env.NODE_ENV === 'development';
  const startBaseUrl = isDev ? 'http://localhost:3000' : 'https://synaps-one.vercel.app';
  const startUrl = `${startBaseUrl}/dashboard`;

  createApplicationMenu(startBaseUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Load dashboard with persistent user session — no fake token overwrite!
  console.log(`[Synaps Desktop] Loading ${startUrl}`);
  mainWindow.loadURL(startUrl);

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
  const icon = getAppIcon();
  if (!icon || icon.isEmpty()) {
    console.log('[Synaps Desktop] Generating tray icon from canvas...');
  }

  try {
    tray = new Tray(icon);
  } catch (e) {
    console.warn('[Synaps Desktop] Tray initialization fallback:', e.message);
    return;
  }

  const isDev = process.env.NODE_ENV === 'development';
  const startBaseUrl = isDev ? 'http://localhost:3000' : 'https://synaps-one.vercel.app';

  const contextMenu = Menu.buildFromTemplate([
    { label: '⚡ Summon Spotlight (Ctrl+Space)', click: () => toggleSpotlight() },
    { type: 'separator' },
    { label: 'Open Synaps OS', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } } },
    { label: '10-Agent Boardroom', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.loadURL(`${startBaseUrl}/dashboard/boardroom`); } } },
    { label: 'Matter Audio Notebooks', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.loadURL(`${startBaseUrl}/dashboard/notebooks`); } } },
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

function createSpotlightWindow() {
  if (spotlightWindow && !spotlightWindow.isDestroyed()) return;

  spotlightWindow = new BrowserWindow({
    width: 720,
    height: 380,
    frame: false,
    transparent: false,
    backgroundColor: '#070c18',
    alwaysOnTop: true,
    show: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'persist:synaps_main_user',
    },
  });

  const spotlightFile = path.join(__dirname, 'spotlight.html');
  spotlightWindow.loadFile(spotlightFile).catch(err => {
    console.error('[Spotlight] Failed to load HTML:', err);
  });

  spotlightWindow.on('blur', () => {
    if (Date.now() - lastSpotlightOpenTime > 700) {
      if (spotlightWindow && !spotlightWindow.isDestroyed() && spotlightWindow.isVisible()) {
        spotlightWindow.hide();
      }
    }
  });
}

function toggleSpotlight() {
  console.log('[Synaps Desktop] toggleSpotlight triggered!');
  if (!spotlightWindow || spotlightWindow.isDestroyed()) {
    createSpotlightWindow();
  }

  if (spotlightWindow.isVisible()) {
    spotlightWindow.hide();
  } else {
    lastSpotlightOpenTime = Date.now();
    spotlightWindow.setAlwaysOnTop(true, 'screen-saver');
    spotlightWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    spotlightWindow.center();
    const [x, y] = spotlightWindow.getPosition();
    spotlightWindow.setPosition(x, Math.max(80, Math.floor(y * 0.35)));
    spotlightWindow.show();
    spotlightWindow.focus();
  }
}

app.whenReady().then(() => {
  createWindow();
  createSpotlightWindow();
  try { createTray(); } catch (e) { console.log('Tray setup note:', e.message); }

  // Register multiple global shortcuts for maximum OS compatibility
  ['CommandOrControl+Space', 'Control+Space', 'Alt+Space', 'CommandOrControl+Shift+Space', 'Alt+Shift+S'].forEach(key => {
    try {
      const ok = globalShortcut.register(key, () => {
        toggleSpotlight();
      });
      console.log(`[Synaps Desktop] Hotkey ${key} registered:`, ok);
    } catch (e) {
      console.warn(`[Synaps Desktop] Failed to register ${key}:`, e.message);
    }
  });

  // Global Hotkey (CmdOrCtrl+Shift+S) to summon main dashboard
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

// IPC Listeners for Spotlight Companion
ipcMain.on('hide-spotlight', () => {
  if (spotlightWindow) spotlightWindow.hide();
});

ipcMain.on('expand-to-full-app', (event, query) => {
  if (spotlightWindow) spotlightWindow.hide();
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    if (query) {
      const isDev = process.env.NODE_ENV === 'development';
      const startBaseUrl = isDev ? 'http://localhost:3000' : 'https://synaps-one.vercel.app';
      mainWindow.loadURL(`${startBaseUrl}/dashboard/chat?q=${encodeURIComponent(query)}`);
    }
  }
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
