import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const flightNumber = searchParams.get('flightNumber');
  const depIata = searchParams.get('dep_iata');
  const arrIata = searchParams.get('arr_iata');
  const date = searchParams.get('date');

  const serverKey = process.env.AVIATIONSTACK_API_KEY;
  const clientKey = req.headers.get('x-user-aviationstack-key');
  const apiKey = serverKey || clientKey;

  if (!apiKey) {
    return NextResponse.json({ error: 'No API Key' }, { status: 401 });
  }

  try {
    let apiUrl = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}`;
    
    if (flightNumber) {
      apiUrl += `&flight_iata=${flightNumber}`;
    } else if (depIata && arrIata) {
      apiUrl += `&dep_iata=${depIata}&arr_iata=${arrIata}`;
      if (date) apiUrl += `&flight_date=${date.split('T')[0]}`;
    } else {
      return NextResponse.json({ error: 'Missing flight identifier (number or route)' }, { status: 400 });
    }

    const res = await fetch(apiUrl);
    const data = await res.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.info }, { status: 500 });
    }

    if (!flightNumber) {
      // Return list for selection
      const list = (data.data || []).map((f: { flight?: { iata: string }; airline?: { name: string }; departure?: { scheduled: string; gate?: string; terminal?: string }; flight_status?: string }) => ({
        flightNumber: f.flight?.iata,
        airline: f.airline?.name,
        departureTime: f.departure?.scheduled,
        status: f.flight_status || 'scheduled',
        gate: f.departure?.gate,
        terminal: f.departure?.terminal
      })).filter((f: { flightNumber?: string }) => !!f.flightNumber);
      return NextResponse.json({ flights: list });
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
  } catch {
    return NextResponse.json({ error: 'Failed to fetch flight status' }, { status: 500 });
  }
}
