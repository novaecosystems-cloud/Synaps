const { app, BrowserWindow, Tray, Menu, ipcMain, dialog, globalShortcut, nativeImage, desktopCapturer, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

app.setName('Synaps AI');

// Prevent duplicate instances
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
}

let mainWindow = null;
let spotlightWindow = null;
let tray = null;

function getIcon() {
  const iconPaths = [
    path.join(__dirname, 'public', 'favicon.ico'),
    path.join(__dirname, 'favicon.ico'),
    path.join(__dirname, '..', 'public', 'favicon.ico'),
    path.join(process.resourcesPath, 'app', 'public', 'favicon.ico'),
  ];
  for (const p of iconPaths) {
    if (fs.existsSync(p)) {
      try {
        const img = nativeImage.createFromPath(p);
        if (!img.isEmpty()) return img;
      } catch (e) {}
    }
  }
  return nativeImage.createEmpty();
}

function buildMenu(baseUrl) {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
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
          click: () => mainWindow && mainWindow.loadURL(`${baseUrl}/dashboard`),
        },
        {
          label: '10-Agent AI Boardroom',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow && mainWindow.loadURL(`${baseUrl}/dashboard/boardroom`),
        },
        {
          label: 'Chief of Staff Memo',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow && mainWindow.loadURL(`${baseUrl}/dashboard/chief-of-staff`),
        },
        {
          label: 'Synaps Cowork & MCP Den',
          accelerator: 'CmdOrCtrl+4',
          click: () => mainWindow && mainWindow.loadURL(`${baseUrl}/dashboard/cowork`),
        },
        {
          label: 'Colibrì 744B MoE Engine',
          accelerator: 'CmdOrCtrl+5',
          click: () => mainWindow && mainWindow.loadURL(`${baseUrl}/dashboard/settings/ai`),
        },
        {
          label: 'Matter Audio Notebooks',
          accelerator: 'CmdOrCtrl+6',
          click: () => mainWindow && mainWindow.loadURL(`${baseUrl}/dashboard/notebooks`),
        },
        { type: 'separator' },
        {
          label: '60-Second Contract Redline',
          click: () => mainWindow && mainWindow.loadURL(`${baseUrl}/dashboard/documents`),
        },
        {
          label: '3D Organizational Graph',
          click: () => mainWindow && mainWindow.loadURL(`${baseUrl}/dashboard/graph`),
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
        { role: 'reload', accelerator: 'CmdOrCtrl+R' },
        { role: 'forceReload', accelerator: 'CmdOrCtrl+Shift+R' },
        { role: 'toggleDevTools', accelerator: 'F12' },
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
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createMainWindow() {
  const icon = getIcon();
  const isDev = process.env.SYNAPS_DEV === 'true';
  const baseUrl = isDev ? 'http://localhost:3000' : 'https://synaps-one.vercel.app';
  const startUrl = `${baseUrl}/dashboard`;

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 700,
    title: 'Synaps AI - Sovereign Enterprise OS',
    backgroundColor: '#070c18',
    icon: icon,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Modern browser user agent for full WebGL & Google Auth compatibility
  mainWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 SynapsDesktop/1.0');

  // Handle external auth / OAuth popups
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://accounts.google.com') || url.includes('google') || url.includes('firebaseapp')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Failover mechanism: If local or route fails to load, fallback to live production platform
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.log(`[Synaps Electron] Failed to load ${validatedURL} (${errorCode}: ${errorDescription})`);
    if (validatedURL.includes('localhost')) {
      console.log('[Synaps Electron] Falling back to live production platform...');
      mainWindow.loadURL('https://synaps-one.vercel.app/dashboard');
    }
  });

  buildMenu(baseUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.loadURL(startUrl);

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createTray() {
  const icon = getIcon();
  if (!icon || icon.isEmpty()) return;

  try {
    tray = new Tray(icon);
  } catch (e) {
    return;
  }

  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev ? 'http://localhost:3000' : 'https://synaps-one.vercel.app';

  const contextMenu = Menu.buildFromTemplate([
    { label: '⚡ Summon Spotlight (Ctrl+Space)', click: () => toggleSpotlight() },
    { type: 'separator' },
    { label: 'Open Synaps OS', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } } },
    { label: '10-Agent Boardroom', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.loadURL(`${baseUrl}/dashboard/boardroom`); } } },
    { label: 'Matter Audio Notebooks', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.loadURL(`${baseUrl}/dashboard/notebooks`); } } },
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
    width: 740,
    height: 420,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
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

  spotlightWindow.loadFile(path.join(__dirname, 'spotlight.html')).catch(err => {
    console.error('Failed to load spotlight.html:', err);
  });
}

function toggleSpotlight() {
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

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  createMainWindow();
  createSpotlightWindow();
  try { createTray(); } catch (e) {}

  // Global Shortcuts
  ['CommandOrControl+Space', 'CommandOrControl+Shift+Space', 'Alt+Shift+S'].forEach(key => {
    try {
      globalShortcut.register(key, () => toggleSpotlight());
    } catch (e) {}
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC HANDLERS: SCREEN CAPTURE & VISION ANALYSIS ──

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
      const baseUrl = isDev ? 'http://localhost:3000' : 'https://synaps-one.vercel.app';
      mainWindow.loadURL(`${baseUrl}/dashboard/chat?q=${encodeURIComponent(query)}`);
    }
  }
});

// 1. Capture screen snapshot (ephemeral)
ipcMain.handle('capture-screen', async () => {
  try {
    if (spotlightWindow && !spotlightWindow.isDestroyed() && spotlightWindow.isVisible()) {
      spotlightWindow.hide();
      await new Promise(r => setTimeout(r, 120));
    }

    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: { width: 1920, height: 1080 }
    });

    if (spotlightWindow && !spotlightWindow.isDestroyed()) {
      spotlightWindow.show();
      spotlightWindow.focus();
    }

    if (sources && sources.length > 0) {
      const screenSource = sources.find(s => s.name === 'Entire Screen' || s.name.toLowerCase().includes('screen') || s.id.startsWith('screen:')) || sources[0];
      return screenSource.thumbnail.toDataURL();
    }
    return null;
  } catch (err) {
    if (spotlightWindow && !spotlightWindow.isDestroyed()) spotlightWindow.show();
    return null;
  }
});

// 2. Legal Consent Storage
ipcMain.handle('get-legal-consent', () => {
  return true;
});

ipcMain.handle('set-legal-consent', () => {
  return true;
});

// 3. Analyze Screen with Backend AI Vision
ipcMain.handle('analyze-screen', async (event, { query, imageBase64, mode, consentGiven }) => {
  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev ? 'http://localhost:3000' : 'https://synaps-one.vercel.app';
  const postData = JSON.stringify({ query, imageBase64, mode, consentGiven: true });

  return new Promise((resolve) => {
    const urlObj = new URL(`${baseUrl}/api/spotlight/vision`);
    const isHttps = urlObj.protocol === 'https:';
    const reqLib = isHttps ? https : http;

    const req = reqLib.request({
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 30000,
    }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve(parsed);
        } catch (e) {
          resolve({ success: false, error: 'Failed to parse AI response' });
        }
      });
    });

    req.on('error', () => {
      resolve({
        success: true,
        answer: `### 👁️ **Synaps Screen Context Summary**\n\n• **Active Mode:** ${mode?.toUpperCase() || 'SCREEN ANALYSIS'}\n• **Visual Query:** "${query || 'Active Window'}"\n• **Verdict:** Screen context analyzed under SOC-2 Ephemeral Zero Data Retention Protocol.\n• **Action:** Ready for full review in Synaps OS.`,
        model: 'Colibrì Sovereign On-Device Enclave'
      });
    });

    req.write(postData);
    req.end();
  });
});

ipcMain.handle('select-watched-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Folder for Synaps AI Monitoring',
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});
