import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'CAUSARIX™ — Causal Decision Operating System';
    const subtitle =
      searchParams.get('subtitle') ||
      '10-Agent Boardroom Quorum • Delaware DGCL § 141 Safe-Harbor Records • 0.00% Math Drift';
    const badge = searchParams.get('badge') || 'DELAWARE DGCL § 141 SAFE-HARBOR';
    const tag = searchParams.get('tag') || 'SOVEREIGN DECISION INTELLIGENCE';
    const metric1Title = searchParams.get('m1Title') || 'Autonomous Governance';
    const metric1Value = searchParams.get('m1Value') || '10-Agent Quorum';
    const metric2Title = searchParams.get('m2Title') || 'Fiduciary Shield';
    const metric2Value = searchParams.get('m2Value') || 'Delaware DGCL § 141';
    const metric3Title = searchParams.get('m3Title') || 'SCM Precision';
    const metric3Value = searchParams.get('m3Value') || '0.00% Math Drift';

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 70px',
            backgroundColor: '#070b14',
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
            color: '#f8fafc',
            fontFamily: 'sans-serif',
            position: 'relative',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            boxSizing: 'border-box',
          }}
        >
          {/* Subtle grid pattern background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              opacity: 0.6,
            }}
          />

          {/* Top Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                  border: '1.5px solid rgba(6, 182, 212, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22d3ee',
                  fontSize: '22px',
                  fontWeight: 900,
                }}
              >
                ◈
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    color: '#ffffff',
                  }}
                >
                  CAUSARIX™
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    letterSpacing: '0.15em',
                    color: '#06b6d4',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {tag}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 18px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: '#10b981',
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#34d399',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {badge}
              </span>
            </div>
          </div>

          {/* Center Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              zIndex: 10,
              marginTop: '16px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(6, 182, 212, 0.2)',
                  color: '#22d3ee',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                }}
              >
                INSTITUTIONAL METADATA ENGINE
              </span>
            </div>

            <h1
              style={{
                fontSize: title.length > 50 ? '42px' : '52px',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                margin: 0,
                maxWidth: '1060px',
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: '20px',
                fontWeight: 500,
                lineHeight: 1.4,
                color: '#94a3b8',
                margin: 0,
                maxWidth: '980px',
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom Feature Grid Cards */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              zIndex: 10,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '24px',
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '14px 18px',
                borderRadius: '14px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#22d3ee',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {metric1Title}
              </span>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              >
                {metric1Value}
              </span>
            </div>

            {/* Card 2 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '14px 18px',
                borderRadius: '14px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#34d399',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {metric2Title}
              </span>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              >
                {metric2Value}
              </span>
            </div>

            {/* Card 3 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '14px 18px',
                borderRadius: '14px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#a5b4fc',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {metric3Title}
              </span>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              >
                {metric3Value}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return new Response('Failed to generate OpenGraph image', { status: 500 });
  }
}
