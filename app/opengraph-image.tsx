import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export const alt = 'Troas Bygg — Tømrer Ronny Osvaag AS'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

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
          padding: '80px',
          background:
            'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p
            style={{
              fontSize: 20,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#8b8b8b',
              margin: 0,
            }}
          >
            Tømrer Ronny Osvaag AS — Bergen
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1
              style={{
                fontSize: 120,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                margin: 0,
              }}
            >
              Troas Bygg
            </h1>
            <p
              style={{
                marginTop: 32,
                fontSize: 28,
                color: '#c0c0c0',
                letterSpacing: '0.05em',
                margin: 0,
              }}
            >
              Kvalitet i hvert prosjekt
            </p>
          </div>

          {/* TR-mark inline SVG */}
          <svg
            width="180"
            height="180"
            viewBox="360 110 360 240"
            fill="none"
            stroke="#ffffff"
            strokeWidth={20}
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <path d="M370 120 L560 120" />
            <path d="M465 120 L465 260" />
            <path d="M560 120 L560 280" />
            <path d="M560 120 Q700 120 700 190 Q700 250 620 250" />
            <path d="M620 250 L710 340" />
            <path d="M410 320 L535 220 L660 320" />
            <rect x="515" y="300" width="40" height="40" />
            <line x1="535" y1="300" x2="535" y2="340" />
            <line x1="515" y1="320" x2="555" y2="320" />
          </svg>
        </div>
      </div>
    ),
    { ...size },
  )
}
