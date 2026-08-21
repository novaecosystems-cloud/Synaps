const { app, BrowserWindow, Tray, Menu, ipcMain, shell, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

// 1. Permanently eliminate GPU Compositor Black Screen freezes on Windows
app.disableHardwareAcceleration();

app.setName('Causarix AI');

const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
}

let mainWindow = null;
let serverProcess = null;
const localUrl = 'http://localhost:3000/dashboard';

function getIcon() {
  const iconPaths = [
    path.join(__dirname, 'public', 'favicon.ico'),
    path.join(__dirname, 'favicon.ico'),
    path.join(__dirname, '..', 'public', 'favicon.ico'),
    path.join(process.resourcesPath || '', 'app', 'public', 'favicon.ico'),
    'D:\\Synaps\\public\\favicon.ico'
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

function checkServerReady(callback) {
  const req = http.get('http://localhost:3000/api/offline/status', (res) => {
    if (res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 307) {
      callback(true);
    } else {
      callback(false);
    }
  });
  req.on('error', () => callback(false));
  req.setTimeout(1500, () => {
    req.destroy();
    callback(false);
  });
}

function ensureServerRunning() {
  checkServerReady((isReady) => {
    if (!isReady && !serverProcess) {
      console.log('[Causarix Desktop] Starting local Next.js engine on port 3000...');
      const rootDir = path.resolve(__dirname, '..');
      serverProcess = spawn('npm.cmd', ['run', 'dev'], {
        cwd: fs.existsSync(path.join(rootDir, 'package.json')) ? rootDir : 'D:\\Synaps',
        shell: true,
        env: { ...process.env, PORT: '3000' }
      });
      serverProcess.stdout?.on('data', (d) => console.log(`[Next.js] ${d.toString().trim()}`));
    }
  });
}

function createMainWindow() {
  const icon = getIcon();

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 700,
    title: 'Causarix AI — Sovereign Decision OS',
    backgroundColor: '#07080B',
    icon: icon,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 CausarixDesktop/3.0.0');

  // Load a sleek initial loading state
  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Causarix AI</title>
        <style>
          body {
            background-color: %2307080B;
            color: %23E2E8F0;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            user-select: none;
          }
          .spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(6, 182, 212, 0.15);
            border-top-color: %2306B6D4;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 24px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          h2 { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px 0; color: %23FFFFFF; }
          p { font-size: 12px; color: %2364748B; font-family: monospace; margin: 0; }
        </style>
      </head>
      <body>
        <div class="spinner"></div>
        <h2>Causarix Sovereign OS</h2>
        <p>INITIALIZING 100% AIR-GAPPED HARDWARE ENGINE...</p>
      </body>
    </html>
  `)}`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Poll server until ready then transition seamlessly
  const pollInterval = setInterval(() => {
    checkServerReady((isReady) => {
      if (isReady && mainWindow && !mainWindow.isDestroyed()) {
        clearInterval(pollInterval);
        console.log('[Causarix Desktop] Port 3000 ready! Loading dashboard...');
        mainWindow.loadURL(localUrl);
      }
    });
  }, 1000);

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

app.whenReady().then(() => {
  ensureServerRunning();
  createMainWindow();

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
  if (serverProcess) {
    try {
      serverProcess.kill();
    } catch {}
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
