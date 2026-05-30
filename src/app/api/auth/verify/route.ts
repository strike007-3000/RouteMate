import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!token) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid`);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT Secret is missing in verify route');
    return NextResponse.redirect(`${appUrl}/login?error=server`);
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jose.jwtVerify(token, secret);

    const email = payload.email as string;
    if (!email) {
      return NextResponse.redirect(`${appUrl}/login?error=invalid`);
    }

    // Set HttpOnly session cookie
    const cookieStore = await cookies();
    cookieStore.set('routemate-session', JSON.stringify({
      email,
      name: email.split('@')[0],
      status: 'Elite Traveler',
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.redirect(`${appUrl}/trips`);
  } catch (err) {
    console.error('Token verification failed:', err);
    return NextResponse.redirect(`${appUrl}/login?error=expired`);
  }
}
