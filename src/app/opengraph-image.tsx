import { ImageResponse } from 'next/og';

// ---------------------------------------------------------------------------
// Dynamic OpenGraph image — rendered at the edge using Next's ImageResponse.
//
// Produces a 1200×630 PNG shown whenever the site is shared on WhatsApp,
// Slack, LinkedIn, Twitter/X, Discord, etc. Uses no external image assets
// so it works on the edge runtime without bundling hassles.
// ---------------------------------------------------------------------------

export const alt =
  'Habaeb Creative Solutions — Criamos Sites, SaaS, Lojas Virtuais & Soluções com IA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundImage:
            'radial-gradient(ellipse at 25% 20%, rgba(220,38,38,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 85%, rgba(180,30,60,0.22) 0%, transparent 60%), linear-gradient(135deg, #040408 0%, #0a0410 100%)',
          backgroundColor: '#040408',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Corner accents */}
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: 36,
            width: 48,
            height: 48,
            borderLeft: '2px solid #dc2626',
            borderTop: '2px solid #dc2626',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 36,
            right: 36,
            width: 48,
            height: 48,
            borderRight: '2px solid #dc2626',
            borderTop: '2px solid #dc2626',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 36,
            width: 48,
            height: 48,
            borderLeft: '2px solid #dc2626',
            borderBottom: '2px solid #dc2626',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 36,
            width: 48,
            height: 48,
            borderRight: '2px solid #dc2626',
            borderBottom: '2px solid #dc2626',
            display: 'flex',
          }}
        />

        {/* Top row: brand mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background:
                'linear-gradient(135deg, #dc2626 0%, #7a1a20 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '0.02em',
              color: '#ffffff',
              boxShadow: '0 0 40px rgba(220,38,38,0.55)',
            }}
          >
            H
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: '#ffffff',
              }}
            >
              HABAEB
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: '0.3em',
                color: '#dc2626',
                marginTop: 8,
              }}
            >
              CREATIVE SOLUTIONS
            </div>
          </div>
        </div>

        {/* Center: headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: '0.4em',
              color: '#dc2626',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            01 / ORBIT · WEB · SAAS · AI
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              maxWidth: 980,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            Criamos Sites, SaaS, Lojas Virtuais & Soluções com IA
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              lineHeight: 1.35,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 900,
              display: 'flex',
            }}
          >
            Sites, e-commerces, SaaS e automações sob medida — atendemos Jacareí, São José dos Campos e todo o Brasil.
          </div>
        </div>

        {/* Bottom row: url + meta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 22,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: '#ffffff',
              display: 'flex',
            }}
          >
            habaeb.com
          </div>
          <div
            style={{
              display: 'flex',
              gap: 24,
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            <div style={{ display: 'flex' }}>React</div>
            <div style={{ display: 'flex' }}>Next.js</div>
            <div style={{ display: 'flex' }}>Python</div>
            <div style={{ display: 'flex' }}>AI</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
