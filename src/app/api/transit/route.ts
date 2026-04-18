import { NextResponse } from 'next/server';
import { getCheapRoute } from '@/lib/transit';

export async function POST(req: Request) {
  try {
    const { from, to } = await req.json();

    if (!from || !to) {
      return NextResponse.json({ error: 'Missing from/to points' }, { status: 400 });
    }

    // Artificial delay to simulate real API latency
    await new Promise(r => setTimeout(r, 1200));

    const suggestion = getCheapRoute(from, to);

    return NextResponse.json({ suggestion });

  } catch (error) {
    console.error('Transit API Error:', error);
    return NextResponse.json({ error: 'Failed to calculate route' }, { status: 500 });
  }
}
