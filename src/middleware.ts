import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('routemate-session');
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/trips', '/trip', '/account', '/explore', '/radar'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/trips', request.url));
  }

  // If user is not logged in and tries to access a protected route, redirect to login
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/trips/:path*',
    '/trip/:path*',
    '/account/:path*',
    '/explore/:path*',
    '/radar/:path*',
  ],
};
