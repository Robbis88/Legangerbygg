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
          <svg
            width="200"
            height="200"
            viewBox="0 0 100 100"
            fill="none"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 18 38 L 50 14 L 82 38" stroke="#C9842B" />
            <path d="M 32 30 L 32 80 L 74 80" stroke="#ffffff" />
          </svg>
        </div>
      </div>
    ),
    { ...size },
  )
}
