const { app, BrowserWindow, Tray, Menu, shell, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

// CRITICAL: Disable GPU hardware acceleration to eliminate black screen
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

app.setName('Causarix AI');

// Prevent duplicate app instances
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  process.exit(0);
}

let mainWindow = null;
let tray = null;
let serverProcess = null;
let pollTimer = null;

const DASHBOARD_URL = 'http://localhost:3000/dashboard';
const HEALTH_URL = 'http://localhost:3000/api/offline/status';
const SYNAPS_DIR = 'D:\\Synaps';

// ─── ICON ───────────────────────────────────────────────────────────────────
function getIcon() {
  const candidates = [
    path.join(__dirname, 'causarix.ico'),
    path.join(__dirname, '..', 'public', 'causarix.ico'),
    'D:\\Synaps\\electron\\causarix.ico',
    'D:\\Synaps\\public\\favicon.ico',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const img = nativeImage.createFromPath(p);
        if (!img.isEmpty()) return img;
      } catch (_) {}
    }
  }
  return nativeImage.createEmpty();
}

// ─── SERVER HEALTH CHECK ─────────────────────────────────────────────────────
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(HEALTH_URL, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => { req.destroy(); resolve(false); });
  });
}

// ─── START NEXT.JS SERVER ────────────────────────────────────────────────────
function startNextServer() {
  if (serverProcess) return;

  try {
    serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: SYNAPS_DIR,
      shell: true,
      env: { ...process.env, PORT: '3000', NODE_ENV: 'development' },
      stdio: 'pipe',
    });

    serverProcess.stdout?.on('data', (d) =>
      console.log('[Next.js]', d.toString().trim())
    );
    serverProcess.stderr?.on('data', (d) =>
      console.error('[Next.js ERR]', d.toString().trim())
    );
    serverProcess.on('exit', (code) => {
      console.log('[Next.js] Process exited with code', code);
      serverProcess = null;
    });
    serverProcess.on('error', (err) => {
      console.error('[Next.js] Failed to start:', err.message);
      serverProcess = null;
    });
  } catch (err) {
    console.error('[Next.js] Spawn exception:', err.message);
    serverProcess = null;
  }
}

// ─── SPLASH HTML ─────────────────────────────────────────────────────────────
function getSplashHTML() {
  return `data:text/html;charset=utf-8,${encodeURIComponent(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Causarix AI</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%;
      background: #07080B;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
      color: #E2E8F0;
      user-select: none;
      -webkit-app-region: drag;
    }
    .logo-box {
      width: 80px; height: 80px; border-radius: 20px;
      background: #0D1117;
      border: 1px solid #1E293B;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 24px;
      box-shadow: 0 0 50px rgba(6, 182, 212, 0.25);
    }
    .logo-box img {
      width: 64px; height: 64px; object-fit: contain; border-radius: 12px;
    }
    h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 6px; color: #FFFFFF; }
    .sub { font-size: 11px; color: #64748B; font-family: 'Courier New', monospace;
           letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 32px; }
    .bar-wrap { width: 220px; height: 3px; background: #1E293B; border-radius: 99px; overflow: hidden; }
    .bar { height: 100%; background: linear-gradient(90deg, #06B6D4, #6366F1, #EF4444);
           border-radius: 99px; animation: load 2.4s ease-in-out infinite; }
    @keyframes load {
      0%   { width: 0%;   margin-left: 0%; }
      50%  { width: 70%;  margin-left: 15%; }
      100% { width: 0%;   margin-left: 100%; }
    }
    .status { margin-top: 16px; font-size: 11px; color: #475569; font-family: monospace; }
  </style>
</head>
<body>
  <div class="logo-box">
    <img src="file:///D:/Synaps/public/synaps_logo.png" onerror="this.style.display='none'; this.parentElement.innerText='⚡';" />
  </div>
  <h1>CAUSARIX</h1>
  <p class="sub">Advanced Causal AI Technologies</p>
  <div class="bar-wrap"><div class="bar"></div></div>
  <p class="status">INITIALIZING ENTERPRISE DECISION OS...</p>
</body>
</html>`)}`;
}

// ─── MAIN WINDOW ─────────────────────────────────────────────────────────────
function createWindow() {
  const icon = getIcon();

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1080,
    minHeight: 680,
    title: 'Causarix AI — Advanced Causal AI Technologies',
    backgroundColor: '#07080B',
    icon,
    show: false,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Standard Chrome User-Agent to avoid Google OAuth "disallowed_useragent" 403 error
  mainWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  // ── GOOGLE & OAUTH POPUP WINDOW HANDLER ────────────────────────────────────
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Allow Google, Firebase & OAuth login popups inside secure Electron popup frame
    if (
      url.includes('accounts.google.com') ||
      url.includes('firebaseapp.com') ||
      url.includes('googleapis.com') ||
      url.includes('google.com/auth') ||
      url.includes('github.com/login/oauth')
    ) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 520,
          height: 680,
          autoHideMenuBar: true,
          title: 'Sign in with Google — Causarix AI',
          icon: getIcon(),
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
          }
        }
      };
    }
    // Open external browser for non-auth external links
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.loadURL(getSplashHTML());

  let polls = 0;
  pollTimer = setInterval(async () => {
    polls++;
    const ready = await checkServer();
    if (ready && mainWindow && !mainWindow.isDestroyed()) {
      clearInterval(pollTimer);
      pollTimer = null;
      console.log(`[Causarix Desktop] Server ready after ${polls} polls — loading dashboard`);
      mainWindow.loadURL(DASHBOARD_URL);
    } else {
      console.log(`[Causarix Desktop] Poll #${polls}: waiting for port 3000...`);
    }
  }, 1500);

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

// ─── TRAY ────────────────────────────────────────────────────────────────────
function createTray() {
  try {
    const icon = getIcon();
    tray = new Tray(icon);
    tray.setToolTip('Causarix AI — Advanced Causal AI Technologies');
    tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: '⚡ Open Causarix Dashboard',
        click: () => { mainWindow?.show(); mainWindow?.focus(); }
      },
      {
        label: 'Action Board (Jira)',
        click: () => { mainWindow?.show(); mainWindow?.loadURL('http://localhost:3000/dashboard/projects'); }
      },
      {
        label: 'Team Stream (Slack)',
        click: () => { mainWindow?.show(); mainWindow?.loadURL('http://localhost:3000/dashboard/chat'); }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => { app.isQuitting = true; app.quit(); }
      },
    ]));
    tray.on('click', () => { mainWindow?.show(); mainWindow?.focus(); });
  } catch (e) {
    console.error('[Tray] Failed to create tray:', e.message);
  }
}

// ─── APP LIFECYCLE ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  startNextServer();
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else mainWindow?.show();
  });
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (pollTimer) clearInterval(pollTimer);
  if (serverProcess) {
    try { serverProcess.kill('SIGTERM'); } catch (_) {}
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});
