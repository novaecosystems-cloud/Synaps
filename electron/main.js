const { app, BrowserWindow, Tray, Menu, shell, nativeImage, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

// Enable GPU Hardware Acceleration & WebGL
app.commandLine.appendSwitch('enable-webgl');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');

app.setName('Causarix AI');

// Prevent duplicate app instances
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  process.exit(0);
}

// ─── ERROR BOUNDARIES & RUNTIME RESILIENCE ─────────────────────────────────
process.on('uncaughtException', (error) => {
  console.error('[Causarix Main] Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Causarix Main] Unhandled Rejection at:', promise, 'reason:', reason);
});

let mainWindow = null;
let tray = null;
let serverProcess = null;
let pollTimer = null;
let serverReady = false;

const TARGET_URL = 'http://localhost:3000/login';
const HEALTH_URL = 'http://localhost:3000/api/offline/status';
const SYNAPS_DIR = path.resolve(__dirname, '..');

// ─── ICON ───────────────────────────────────────────────────────────────────
function getIcon() {
  const candidates = [
    path.join(__dirname, 'causarix.ico'),
    path.join(__dirname, 'favicon.ico'),
    path.join(__dirname, '..', 'public', 'favicon.ico'),
    path.join(__dirname, '..', 'public', 'causarix.ico'),
    path.join(__dirname, 'public', 'favicon.ico'),
    path.join(__dirname, 'public', 'causarix.ico'),
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

// ─── EMBEDDED ASSET RESOLVERS (OFFLINE AIR-GAPPED RESILIENCE) ───────────────
function getLogoDataURI() {
  const candidates = [
    path.join(__dirname, 'synaps_logo.webp'),
    path.join(__dirname, 'causarix_logo.webp'),
    path.join(__dirname, 'public', 'synaps_logo.webp'),
    path.join(__dirname, 'public', 'causarix_logo.webp'),
    path.join(__dirname, '..', 'public', 'synaps_logo.webp'),
    path.join(__dirname, '..', 'public', 'causarix_logo.webp'),
    path.join(__dirname, 'synaps_logo.png'),
    path.join(__dirname, '..', 'public', 'synaps_logo.png'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const buf = fs.readFileSync(p);
        const mime = p.endsWith('.png') ? 'image/png' : 'image/webp';
        return `data:${mime};base64,${buf.toString('base64')}`;
      } catch (_) {}
    }
  }
  return '';
}

function getThreeJSScript() {
  const candidates = [
    path.join(__dirname, 'three.min.js'),
    path.join(__dirname, '..', 'node_modules', 'three', 'build', 'three.min.js'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        return fs.readFileSync(p, 'utf8');
      } catch (_) {}
    }
  }
  return '';
}

// ─── SERVER HEALTH CHECK ─────────────────────────────────────────────────────
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(HEALTH_URL, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => { req.destroy(); resolve(false); });
  });
}

// ─── START NEXT.JS SERVER (FAST DEV / PROD SERVER) ───────────────────────────
function startNextServer() {
  if (serverProcess) return;

  try {
    serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: SYNAPS_DIR,
      shell: true,
      env: { ...process.env, PORT: '3000', NODE_ENV: 'development' },
      stdio: 'pipe',
    });

    serverProcess.stdout?.on('data', (d) => {
      const msg = d.toString();
      if (msg.includes('Ready in') || msg.includes('compiled') || msg.includes('localhost:3000')) {
        serverReady = true;
      }
      console.log('[Next.js]', msg.trim());
    });
    serverProcess.stderr?.on('data', (d) =>
      console.error('[Next.js ERR]', d.toString().trim())
    );
    serverProcess.on('exit', (code) => {
      console.log('[Next.js] Process exited with code', code);
      serverProcess = null;
    });
  } catch (err) {
    console.error('[Next.js] Spawn exception:', err.message);
    serverProcess = null;
  }
}

// ─── CINEMATIC THREE.JS CHROMATIC SPLASH HTML (MATCHES REFERENCE VISUAL) ──────
function getSplashHTML() {
  const logoData = getLogoDataURI();
  const threeScript = getThreeJSScript();

  return `data:text/html;charset=utf-8,${encodeURIComponent(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Causarix AI — Sovereign Decision OS</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: #000000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', Helvetica, Arial, sans-serif;
      color: #FAFAFA;
      user-select: none;
      -webkit-user-select: none;
      -webkit-app-region: drag;
      overflow: hidden;
    }

    /* Prismatic Chromatic WebGL Shader Canvas */
    #shader-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
      opacity: 0.88;
    }

    /* Radial Vignette Overlay */
    .vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, transparent 25%, rgba(0,0,0,0.85) 100%);
      z-index: 1;
      pointer-events: none;
    }

    /* Central Content Container */
    .content-wrap {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 580px;
      padding: 24px;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeIn {
      0% { opacity: 0; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }

    /* Glowing Cyan Rounded-Square Badge */
    .logo-badge {
      width: 104px;
      height: 104px;
      border-radius: 28px;
      background: #0D111A;
      border: 1px solid rgba(6, 182, 212, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      box-shadow: 0 0 50px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.12);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      animation: pulseGlow 4s infinite ease-in-out;
    }

    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 45px rgba(6, 182, 212, 0.35), inset 0 0 15px rgba(6, 182, 212, 0.1); }
      50% { box-shadow: 0 0 60px rgba(6, 182, 212, 0.55), inset 0 0 25px rgba(6, 182, 212, 0.2); }
    }

    .logo-badge img {
      width: 76px;
      height: 76px;
      object-fit: contain;
      border-radius: 18px;
      filter: drop-shadow(0 0 16px rgba(6, 182, 212, 0.85));
    }

    /* Brand Typography */
    h1 {
      font-size: 48px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
      color: #FFFFFF;
      text-transform: uppercase;
      text-shadow: 0 0 35px rgba(6, 182, 212, 0.65), 0 0 10px rgba(6, 182, 212, 0.4);
    }

    .subtitle {
      font-size: 11px;
      color: #06B6D4;
      font-family: 'SF Mono', Monaco, Menlo, Consolas, 'Ubuntu Mono', monospace;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      margin-bottom: 34px;
      font-weight: 700;
      text-shadow: 0 0 12px rgba(6, 182, 212, 0.5);
    }

    /* Progress Bar */
    .progress-track {
      width: 340px;
      height: 4px;
      background: #18181B;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 99px;
      overflow: hidden;
      margin-bottom: 14px;
      position: relative;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
    }

    .progress-fill {
      height: 100%;
      width: 25%;
      background: linear-gradient(90deg, #06B6D4, #3B82F6, #10B981);
      border-radius: 99px;
      box-shadow: 0 0 14px rgba(6, 182, 212, 0.9);
      transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Status Text & Percentage */
    .status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 340px;
      font-size: 10.5px;
      font-family: 'SF Mono', Monaco, Menlo, Consolas, 'Ubuntu Mono', monospace;
      letter-spacing: 0.08em;
      color: #06B6D4;
      text-transform: uppercase;
    }

    #status-text {
      transition: opacity 0.3s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 280px;
    }

    #percent-text {
      font-weight: 700;
    }

    /* Skip Intro Button */
    .skip-btn {
      position: absolute;
      bottom: 24px;
      right: 28px;
      z-index: 30;
      color: #A1A1AA;
      background: rgba(24, 24, 27, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 7px 16px;
      border-radius: 9999px;
      font-size: 11px;
      font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace;
      font-weight: 600;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      transition: all 0.2s ease;
      -webkit-app-region: no-drag;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .skip-btn:hover {
      color: #FFFFFF;
      background: rgba(6, 182, 212, 0.2);
      border-color: #06B6D4;
      box-shadow: 0 0 16px rgba(6, 182, 212, 0.35);
      transform: translateY(-1px);
    }
  </style>
  ${threeScript ? `<script>${threeScript}</script>` : `<script src="three.min.js"></script>`}
</head>
<body>
  <div id="shader-canvas"></div>
  <div class="vignette"></div>

  <div class="content-wrap">
    <div class="logo-badge">
      <img id="logo-img" src="${logoData || 'synaps_logo.webp'}" alt="Causarix" />
    </div>
    <h1>CAUSARIX</h1>
    <p class="subtitle">ADVANCED CAUSAL AI &bull; TECHNOLOGIES</p>
    
    <div class="progress-track">
      <div class="progress-fill" id="progress-fill"></div>
    </div>
    
    <div class="status-row">
      <span id="status-text">INITIALIZING CAUSARIX SCM ENGINE...</span>
      <span id="percent-text">25%</span>
    </div>
  </div>

  <button class="skip-btn" id="skip-btn" onclick="skipIntro()">Skip Intro &rarr;</button>

  <script>
    // Three.js Diagonal Chromatic Prismatic Shader
    (function initShader() {
      try {
        if (typeof THREE === 'undefined') {
          console.warn('[Splash] THREE.js not loaded, using background fallback.');
          return;
        }

        const container = document.getElementById('shader-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.Camera();
        camera.position.z = 1;

        const vertexShader = 'void main() { gl_Position = vec4(position, 1.0); }';

        const fragmentShader = \`
          uniform vec2 resolution;
          uniform float time;

          void main() {
            vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
            float a = time * 40.0;
            float d, e, f, g = 1.0 / 40.0, h, i, r, q;

            e = 400.0 * (p.x * 0.5 + 0.5);
            f = 400.0 * (p.y * 0.5 + 0.5);
            i = 200.0 + sin(e * g + a / 150.0) * 20.0;
            d = 200.0 + cos(f * g / 2.0) * 18.0 + cos(e * g) * 7.0;
            r = sqrt(pow(abs(i - e), 2.0) + pow(abs(d - f), 2.0));
            q = f / r;
            e = (r * cos(q)) - a / 2.0;
            f = (r * sin(q)) - a / 2.0;
            d = sin(e * g) * 176.0 + sin(e * g) * 164.0 + r;
            h = ((f + d) + a / 2.0) * g;
            i = cos(h + r * p.x / 1.3) * (e + e + a) + cos(q + g * 6.0) * (r + h / 3.0);
            h = sin(f * g) * 144.0 - sin(e * g) * 212.0 * p.x;
            h = (h + (f - e) * q + sin(r - (a + h) / 7.0) * 10.0 + i / 4.0) * g;
            i += cos(h * 2.3 * sin(a / 350.0 - q)) * 184.0 * sin(q - (r * 4.3 + a / 12.0) * g) + tan(r * g + h) * 184.0 * cos(r * g + h);
            i = mod(i / 5.6, 256.0) / 64.0;
            if (i < 0.0) i += 4.0;
            if (i >= 2.0) i = 4.0 - i;
            d = r / 350.0;
            d += sin(d * d * 8.0) * 0.52;
            f = (sin(a * g) + 1.0) / 2.0;
            gl_FragColor = vec4(vec3(f * i / 1.6, i / 2.0 + d / 13.0, i) * d * p.x + vec3(i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i) * d * (1.0 - p.x), 1.0);
          }
        \`;

        const uniforms = {
          time: { value: 1.0 },
          resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        };

        const material = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
        
        function resize() {
          const w = window.innerWidth;
          const h = window.innerHeight;
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(w, h);
          uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
        }

        resize();
        container.appendChild(renderer.domElement);

        let lastTime = performance.now();
        function animate(now) {
          requestAnimationFrame(animate);
          const dt = (now - lastTime) * 0.001;
          lastTime = now;
          uniforms.time.value += (dt > 0 && dt < 0.1 ? dt * 1.8 : 0.03);
          renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);

        window.addEventListener('resize', resize, false);
      } catch (err) {
        console.warn('[Splash WebGL] Fallback activated:', err);
      }
    })();

    // 4-Stage Multi-Phase Status Stepper
    const stages = [
      { text: 'INITIALIZING CAUSARIX SCM ENGINE...', percent: '25%', width: '25%' },
      { text: 'LOADING 10-AGENT BOARDROOM QUORUM...', percent: '55%', width: '55%' },
      { text: 'VERIFYING CAUSAL GRAPH & SCM DO-CALCULUS...', percent: '88%', width: '88%' },
      { text: 'SOVEREIGN DECISION OS READY', percent: '100%', width: '100%' }
    ];

    let currentStage = 0;
    const statusTextEl = document.getElementById('status-text');
    const percentTextEl = document.getElementById('percent-text');
    const progressFillEl = document.getElementById('progress-fill');

    function updateStage() {
      currentStage = (currentStage + 1) % stages.length;
      const stage = stages[currentStage];
      
      statusTextEl.style.opacity = '0';
      setTimeout(() => {
        statusTextEl.innerText = stage.text;
        percentTextEl.innerText = stage.percent;
        progressFillEl.style.width = stage.width;
        statusTextEl.style.opacity = '1';
      }, 150);
    }

    const stageInterval = setInterval(updateStage, 1100);

    // Skip Intro Navigation
    function skipIntro() {
      clearInterval(stageInterval);
      window.location.href = 'http://localhost:3000/login';
    }
  </script>
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
    backgroundColor: '#000000',
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

  mainWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  // ── GOOGLE & OAUTH POPUP WINDOW HANDLER ────────────────────────────────────
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
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
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('[Causarix Main] Render process gone:', details);
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.warn('[Causarix Main] Main window became unresponsive');
  });

  // Load local splashscreen file if present, fallback to embedded data URI
  const splashFile = path.join(__dirname, 'splash.html');
  if (fs.existsSync(splashFile)) {
    mainWindow.loadFile(splashFile);
  } else {
    mainWindow.loadURL(getSplashHTML());
  }

  // Fast Health Polling (Every 400ms)
  let polls = 0;
  pollTimer = setInterval(async () => {
    polls++;
    const ready = serverReady || await checkServer();
    if (ready && mainWindow && !mainWindow.isDestroyed()) {
      clearInterval(pollTimer);
      pollTimer = null;
      console.log(`[Causarix Desktop] Server ready after ${polls} polls — loading login portal`);
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.loadURL(TARGET_URL);
        }
      }, 1500); // Give user 1.5s to appreciate the cinematic splash
    }
  }, 400);

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
        label: '🏛️ 10-Agent Boardroom',
        click: () => { mainWindow?.show(); mainWindow?.loadURL('http://localhost:3000/dashboard/boardroom'); }
      },
      {
        label: '🔬 Causal SCM Simulations',
        click: () => { mainWindow?.show(); mainWindow?.loadURL('http://localhost:3000/dashboard/simulations'); }
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
