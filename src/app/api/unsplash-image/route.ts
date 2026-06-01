import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  const serverKey = process.env.UNSPLASH_ACCESS_KEY;
  const clientKey = req.headers.get('x-user-unsplash-key');
  const apiKey = serverKey || clientKey;

  if (!apiKey || apiKey === 'your_unsplash_access_key') {
    return NextResponse.json({ imageUrl: null }, { status: 200 });
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' luxury travel landmark landscape')}&orientation=landscape&per_page=5&content_filter=high&featured=true`,
      {
        headers: { Authorization: `Client-ID ${apiKey}` },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ imageUrl: null }, { status: 200 });
    }

    const data = await response.json();
    const results = data.results || [];
    const imageUrl = results[0]?.urls?.regular || results[1]?.urls?.regular || null;

    return NextResponse.json({ imageUrl });
  } catch {
    return NextResponse.json({ imageUrl: null }, { status: 200 });
  }
}
