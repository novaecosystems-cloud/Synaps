const { app, BrowserWindow, Tray, Menu, ipcMain, dialog, globalShortcut, nativeImage, desktopCapturer, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

// GPU Acceleration & Zero-Blackscreen Flags
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');

app.setName('Causarix AI');

// Prevent duplicate instances
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
}

let mainWindow = null;
let spotlightWindow = null;
let tray = null;

const isDev = process.env.SYNAPS_DEV !== 'false';
const localUrl = 'http://localhost:3000/dashboard';

function getIcon() {
  const iconPaths = [
    path.join(__dirname, 'public', 'favicon.ico'),
    path.join(__dirname, 'favicon.ico'),
    path.join(__dirname, '..', 'public', 'favicon.ico'),
    path.join(process.resourcesPath || '', 'app', 'public', 'favicon.ico'),
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

function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
      label: '⚡ Causarix OS',
      submenu: [
        {
          label: 'Executive Dashboard',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow && mainWindow.loadURL(localUrl),
        },
        {
          label: 'Action Board (Jira)',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow && mainWindow.loadURL('http://localhost:3000/dashboard/projects'),
        },
        {
          label: 'Team Stream (Slack)',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow && mainWindow.loadURL('http://localhost:3000/dashboard/chat'),
        },
        {
          label: 'SCM Simulations',
          accelerator: 'CmdOrCtrl+4',
          click: () => mainWindow && mainWindow.loadURL('http://localhost:3000/dashboard/simulations'),
        },
        { type: 'separator' },
        {
          label: 'Reload App',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow && mainWindow.reload(),
        },
        {
          label: 'Quit Causarix',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.isQuitting = true;
            app.quit();
          },
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
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createMainWindow() {
  const icon = getIcon();

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 700,
    title: 'Causarix AI — Sovereign Decision OS',
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

  mainWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 CausarixDesktop/3.0.0');

  // Seamless Auto-Retry when Next.js is warming up on localhost
  let retryCount = 0;
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.log(`[Causarix Electron] Waiting for local engine (${validatedURL}, code: ${errorCode}). Retrying...`);
    retryCount++;
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.loadURL(localUrl);
      }
    }, 1200);
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('[Causarix Electron] Render crash recovery:', details.reason);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadURL(localUrl);
    }
  });

  buildMenu();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Load the local dashboard
  mainWindow.loadURL(localUrl);

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

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Causarix Sovereign OS',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: 'Action Board (Jira)',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.loadURL('http://localhost:3000/dashboard/projects');
        }
      },
    },
    {
      label: 'Team Stream (Slack)',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.loadURL('http://localhost:3000/dashboard/chat');
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Causarix AI — Sovereign Decision OS (100% Offline)');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.focus();
      } else {
        mainWindow.show();
      }
    }
  });
}

app.whenReady().then(() => {
  createMainWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
