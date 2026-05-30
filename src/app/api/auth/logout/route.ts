import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const cookieStore = await cookies();
  cookieStore.delete('routemate-session');
  return NextResponse.redirect(`${appUrl}/login`);
}
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('routemate-session');
  return NextResponse.json({ success: true });
}
