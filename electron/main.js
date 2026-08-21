const { app, BrowserWindow, Tray, Menu, shell, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

// CRITICAL: Disable GPU hardware acceleration to eliminate black screen
// on Intel Iris Xe / Windows 11 DirectX compositor freeze bug
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
    path.join(__dirname, '..', 'public', 'favicon.ico'),
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
      res.resume(); // drain
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => { req.destroy(); resolve(false); });
  });
}

// ─── START NEXT.JS SERVER ────────────────────────────────────────────────────
function startNextServer() {
  if (serverProcess) return; // already running

  try {
    // shell:true is required on Windows for npm.cmd to resolve correctly
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
    .logo {
      width: 72px; height: 72px; border-radius: 16px;
      background: linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; margin-bottom: 24px;
      box-shadow: 0 0 40px rgba(99,102,241,0.4);
    }
    h1 { font-size: 20px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 6px; }
    .sub { font-size: 11px; color: #475569; font-family: 'Courier New', monospace;
           letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 32px; }
    .bar-wrap { width: 220px; height: 2px; background: #1E293B; border-radius: 99px; overflow: hidden; }
    .bar { height: 100%; background: linear-gradient(90deg, #0EA5E9, #6366F1);
           border-radius: 99px; animation: load 2.4s ease-in-out infinite; }
    @keyframes load {
      0%   { width: 0%;   margin-left: 0%; }
      50%  { width: 70%;  margin-left: 15%; }
      100% { width: 0%;   margin-left: 100%; }
    }
    .status { margin-top: 16px; font-size: 11px; color: #334155; font-family: monospace; }
  </style>
</head>
<body>
  <div class="logo">⚡</div>
  <h1>Causarix AI</h1>
  <p class="sub">Sovereign Offline Decision OS</p>
  <div class="bar-wrap"><div class="bar"></div></div>
  <p class="status">Initializing local engine...</p>
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
    title: 'Causarix AI — Sovereign Decision OS',
    backgroundColor: '#07080B',
    icon,
    show: false,            // shown only after ready-to-show
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  // Show window as soon as first paint is done
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Load the animated splash immediately — no black frame ever
  mainWindow.loadURL(getSplashHTML());

  // ── Poll loop: every 1.5 s check if Next.js is up ────────────────────────
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
    tray.setToolTip('Causarix AI — Sovereign Offline OS');
    tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: '⚡ Open Causarix Dashboard',
        click: () => { mainWindow?.show(); mainWindow?.focus(); }
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
  startNextServer();   // fire Next.js in background
  createWindow();      // show splash immediately
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

// Bring window to front if user tries to open a second instance
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});
