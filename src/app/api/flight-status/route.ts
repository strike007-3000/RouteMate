import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const flightNumber = searchParams.get('flightNumber');

  if (!flightNumber) {
    return NextResponse.json({ error: 'No flight number provided' }, { status: 400 });
  }

  const serverKey = process.env.AVIATIONSTACK_API_KEY;
  const clientKey = req.headers.get('x-user-aviationstack-key');
  const apiKey = serverKey || clientKey;

  if (!apiKey) {
    return NextResponse.json({ error: 'No API Key' }, { status: 401 });
  }

  try {
    // AviationStack uses flight_iata for things like SN3151
    const res = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber}`);
    const data = await res.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.info }, { status: 500 });
    }

    const flight = data.data?.[0];
    if (!flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: flight.flight_status, // scheduled, active, landed, cancelled, incident, diverted
      gate: flight.departure.gate,
      terminal: flight.departure.terminal,
      delay: flight.departure.delay, // minutes
      estimated: flight.departure.estimated
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch flight status' }, { status: 500 });
  }
}
