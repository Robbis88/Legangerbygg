import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export const alt = 'Leganger Bygg AS'
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
            Leganger Bygg AS — Bergen
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1
              style={{
                fontSize: 84,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                margin: 0,
              }}
            >
              Leganger Bygg AS
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

          {/* Leganger-merke inline SVG (hvitt på mørk bakgrunn) */}
          <svg width="200" height="200" viewBox="50 10 120 120" fill="none" strokeWidth={6}>
            <path d="M 70 40 L 70 110 L 110 110" stroke="#ffffff" strokeLinecap="square" />
            <path
              d="M 60 55 L 95 30 L 130 55"
              stroke="#C9842B"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 120 40 L 120 110 L 145 110 Q 160 110 160 95 Q 160 80 145 80 L 120 80 M 145 80 Q 158 80 158 65 Q 158 50 145 50 L 120 50"
              stroke="#ffffff"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        </div>
      </div>
    ),
    { ...size },
  )
}
