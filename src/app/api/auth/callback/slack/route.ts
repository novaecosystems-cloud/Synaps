import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Slack Authorization - Causarix</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #3f0e40;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        .card {
          background: #4a154b;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 32px;
          max-width: 380px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .icon { font-size: 40px; margin-bottom: 16px; }
        h2 { color: #ffffff; margin: 0 0 8px; font-size: 18px; }
        p { color: #d1d2d3; font-size: 13px; margin: 0 0 16px; }
        .status {
          background: rgba(0,122,90,0.4);
          border: 1px solid rgba(46,182,125,0.5);
          color: #2eb67d;
          padding: 8px 12px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 12px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">💬</div>
        <h2>${error ? 'Authorization Failed' : 'Slack Workspace Connected!'}</h2>
        <p>${error ? error : 'Successfully authorized Causarix Chief of Staff for daily executive briefings.'}</p>
        <div class="status">${error ? 'ERROR' : '✓ SLACK BOT CONNECTED'}</div>
      </div>
      <script>
        try {
          if (window.opener) {
            window.opener.postMessage({
              type: 'OAUTH_AUTH_SUCCESS',
              provider: 'slack',
              code: ${JSON.stringify(code || '')},
              error: ${JSON.stringify(error || '')}
            }, '*');
            setTimeout(() => {
              window.close();
            }, 1200);
          }
        } catch (e) {
          console.error(e);
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
