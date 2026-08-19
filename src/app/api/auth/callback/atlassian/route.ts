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
      <title>Atlassian Authorization - Causarix</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #091e42;
          color: #deebff;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        .card {
          background: #172b4d;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 32px;
          max-width: 380px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .icon { font-size: 40px; margin-bottom: 16px; }
        h2 { color: #4c9aff; margin: 0 0 8px; font-size: 18px; }
        p { color: #8993a4; font-size: 13px; margin: 0 0 16px; }
        .status {
          background: rgba(0,82,204,0.3);
          border: 1px solid rgba(76,154,255,0.4);
          color: #4c9aff;
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
        <div class="icon">🎫</div>
        <h2>${error ? 'Authorization Failed' : 'Atlassian Jira Authorized!'}</h2>
        <p>${error ? error : 'Successfully connected Jira Cloud to Causarix Autonomous Boardroom.'}</p>
        <div class="status">${error ? 'ERROR' : '✓ ATLASSIAN 3LO CONNECTED'}</div>
      </div>
      <script>
        try {
          if (window.opener) {
            window.opener.postMessage({
              type: 'OAUTH_AUTH_SUCCESS',
              provider: 'jira',
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
