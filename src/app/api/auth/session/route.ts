import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('routemate-session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ user: null, isLoggedIn: false });
    }

    const userData = JSON.parse(sessionCookie.value);
    return NextResponse.json({ user: userData, isLoggedIn: true });
  } catch (err) {
    console.error('Session retrieval error:', err);
    return NextResponse.json({ user: null, isLoggedIn: false });
  }
}
