const { app, BrowserWindow, Tray, Menu, ipcMain, dialog, globalShortcut, nativeImage, session } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

app.setName('Synaps AI');

// Ensure persistent user data directory
const userDataDir = path.join(app.getPath('appData'), 'SynapsAI-App');
if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir, { recursive: true });
}
app.setPath('userData', userDataDir);

// ── BULLETPROOF LOCAL SESSION VAULT ──
const VAULT_DIR = path.join(os.homedir(), '.synaps');
const SESSION_FILE = path.join(VAULT_DIR, 'desktop-session.json');

function getStoredSession() {
  try {
    if (fs.existsSync(SESSION_FILE)) {
      const data = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
      if (data && data.sessionCookie) return data;
    }
  } catch (e) {}
  return null;
}

function persistSession(cookieVal, userEmail) {
  try {
    if (!fs.existsSync(VAULT_DIR)) fs.mkdirSync(VAULT_DIR, { recursive: true });
    fs.writeFileSync(SESSION_FILE, JSON.stringify({
      sessionCookie: cookieVal,
      userEmail: userEmail || '',
      updatedAt: Date.now()
    }, null, 2));
    console.log('[Synaps Desktop] Session token securely saved to disk vault.');
  } catch (e) {
    console.error('[Synaps Desktop] Failed to save session:', e.message);
  }
}

let mainWindow = null;
let spotlightWindow = null;
let tray = null;

function getAppIcon() {
  const candidates = [
    path.join(__dirname, 'public', 'favicon.ico'),
    path.join(__dirname, 'favicon.ico'),
    path.join(__dirname, 'public', 'synaps_logo.png'),
    path.join(__dirname, '../public/favicon.ico'),
    path.join(process.resourcesPath, 'app', 'public', 'favicon.ico'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      try {
        const icon = nativeImage.createFromPath(c);
        if (!icon.isEmpty()) return icon;
      } catch (e) {}
    }
  }

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

async function createWindow() {
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
    },
  });

  mainWindow.setMenuBarVisibility(true);
  mainWindow.autoHideMenuBar = false;

  const isDev = process.env.NODE_ENV === 'development';
  const startBaseUrl = isDev ? 'http://localhost:3000' : 'https://synaps-one.vercel.app';
  const startUrl = `${startBaseUrl}/dashboard`;

  createApplicationMenu(startBaseUrl);

  // Restore saved session cookie if available
  const stored = getStoredSession();
  if (stored && stored.sessionCookie) {
    console.log('[Synaps Desktop] Restoring persistent login session for active user...');
    const domain = isDev ? 'localhost' : 'synaps-one.vercel.app';
    try {
      await session.defaultSession.cookies.set({
        url: startBaseUrl,
        name: 'synaps-session',
        value: stored.sessionCookie,
        domain: domain,
        path: '/',
        httpOnly: true,
        secure: !isDev,
        sameSite: 'lax',
        expirationDate: Math.floor(Date.now() / 1000) + (365 * 86400)
      });
      console.log('[Synaps Desktop] Restored cookie into session successfully!');
    } catch (err) {
      console.warn('[Synaps Desktop] Cookie injection warning:', err.message);
    }
  }

  // Hook cookie persistence so all future logins/refreshes are instantly saved to disk vault
  session.defaultSession.cookies.on('changed', async (event, cookie, cause, removed) => {
    if (cookie.name === 'synaps-session' && !removed && cookie.value) {
      persistSession(cookie.value);
    }
    try {
      await session.defaultSession.cookies.flushStore();
    } catch (e) {}
  });

  mainWindow.webContents.on('did-finish-load', async () => {
    try {
      const cookies = await session.defaultSession.cookies.get({ name: 'synaps-session' });
      if (cookies && cookies.length > 0 && cookies[0].value) {
        persistSession(cookies[0].value);
      }
    } catch (e) {}
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

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
    console.log('[Synaps Desktop] Tray icon not found, skipping tray.');
    return;
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
    backgroundColor: '#0b1121',
    alwaysOnTop: true,
    show: false,
    resizable: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const spotlightFile = path.join(__dirname, 'spotlight.html');
  spotlightWindow.loadFile(spotlightFile).catch(err => {
    console.error('[Spotlight] Failed to load HTML:', err);
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
    spotlightWindow.setAlwaysOnTop(true, 'screen-saver');
    spotlightWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    spotlightWindow.center();
    const [x, y] = spotlightWindow.getPosition();
    spotlightWindow.setPosition(x, Math.max(80, Math.floor(y * 0.35)));
    spotlightWindow.show();
    spotlightWindow.focus();
    spotlightWindow.moveTop();
  }
}

app.whenReady().then(async () => {
  await createWindow();
  createSpotlightWindow();
  try { createTray(); } catch (e) { console.log('Tray setup note:', e.message); }

  // Register multiple global shortcuts for maximum OS compatibility
  ['CommandOrControl+Space', 'CommandOrControl+Shift+Space', 'Alt+Shift+S'].forEach(key => {
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

app.on('before-quit', async () => {
  app.isQuitting = true;
  try {
    await session.defaultSession.cookies.flushStore();
  } catch (e) {}
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
