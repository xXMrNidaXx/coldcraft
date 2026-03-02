import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json();
    
    const timestamp = new Date().toISOString();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    console.log(JSON.stringify({
      timestamp,
      event,
      data,
      ip: ip.split(',')[0],
    }));

    return NextResponse.json({ tracked: true });
  } catch (error) {
    return NextResponse.json({ tracked: false });
  }
}
