import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'CAUSARIX™ — Causal Decision Operating System';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpenGraphImage() {
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
            'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.18) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.18) 0%, transparent 45%)',
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
                Sovereign Causal Decision OS
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
              DGCL § 141 Safe-Harbor Verified
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
            marginTop: '20px',
            marginBottom: '20px',
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
              ENTERPRISE INTELLIGENCE CORE
            </span>
            <span
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              • SCM PROTOCOL v2.5.0
            </span>
          </div>

          <h1
            style={{
              fontSize: '54px',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: 0,
            }}
          >
            Causal Decision Operating System
          </h1>

          <p
            style={{
              fontSize: '21px',
              fontWeight: 500,
              lineHeight: 1.4,
              color: '#94a3b8',
              margin: 0,
              maxWidth: '960px',
            }}
          >
            10-Agent Boardroom Quorum • Delaware DGCL § 141 Safe-Harbor Records • 0.00% Math Drift
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
              Autonomous Governance
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#ffffff',
                marginTop: '4px',
              }}
            >
              10-Agent Boardroom Quorum
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
              Statutory Fiduciary Shield
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#ffffff',
                marginTop: '4px',
              }}
            >
              Delaware DGCL § 141 Sealed
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
              Deterministic SCM Math
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#ffffff',
                marginTop: '4px',
              }}
            >
              0.00% Arithmetic Drift
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
