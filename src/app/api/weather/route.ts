import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  const serverKey = process.env.WEATHERSTACK_API_KEY;
  const clientKey = req.headers.get('x-user-weatherstack-key');
  const apiKey = serverKey || clientKey;

  if (!apiKey) {
    return NextResponse.json({ error: 'No API Key' }, { status: 401 });
  }

  try {
    const res = await fetch(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.info }, { status: 500 });
    }

    return NextResponse.json({
      temp: data.current.temperature,
      icon: data.current.weather_icons[0],
      desc: data.current.weather_descriptions[0]
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
