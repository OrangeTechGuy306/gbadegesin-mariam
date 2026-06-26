import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

// Define route types
const protectedRoutes = ['/admin'];
const authRoutes = ['/login'];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // If request has clear or logout parameter, delete session cookie and let it pass to login
  if (request.nextUrl.searchParams.has('clear') || request.nextUrl.searchParams.has('logout')) {
    const response = NextResponse.next();
    response.cookies.delete('session');
    return response;
  }

  // Determine matching routes
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // Get session cookie
  const cookie = request.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // If visiting admin dashboard and not logged in, redirect to login page
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If visiting login page and already logged in, redirect to admin dashboard
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, sw.js, manifest.ts (PWA and metadata files)
     * - images, assets (static public directory folders)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw.js|manifest.json|images|assets).*)',
  ],
};
