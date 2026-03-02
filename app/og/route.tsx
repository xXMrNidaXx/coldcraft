import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1e3a5f 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>✉️</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          ColdCraft
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#93c5fd',
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          AI cold emails that get replies
        </div>
        <div
          style={{
            display: 'flex',
            gap: 40,
            fontSize: 24,
            color: '#d1d5db',
          }}
        >
          <span>✅ 3 variants per email</span>
          <span>✅ Free to start</span>
          <span>✅ $9/mo unlimited</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
