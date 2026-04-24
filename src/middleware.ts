import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'admin_session';
const PUBLIC_PATHS = ['/admin/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run on /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Allow login page through without auth
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // Check for session cookie
  const session = req.cookies.get(ADMIN_COOKIE);
  if (!session?.value) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validate session value matches the secret
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  if (session.value !== secret) {
    const loginUrl = new URL('/admin/login', req.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(ADMIN_COOKIE);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
