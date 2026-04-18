import { NextResponse } from 'next/server';
import { transitService } from '@/services/transit/TransitService';

export async function POST(req: Request) {
  try {
    const { from, to } = await req.json();

    if (!from || !to) {
      return NextResponse.json({ error: 'Missing from/to points' }, { status: 400 });
    }

    // Artificial delay to simulate real API latency removed 
    // because providers now handle their own latency/logic

    const suggestion = await transitService.getCheapRoute(from, to);

    return NextResponse.json({ suggestion });

  } catch (error) {
    console.error('Transit API Error:', error);
    return NextResponse.json({ error: 'Failed to calculate route' }, { status: 500 });
  }
}

