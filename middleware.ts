import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  // Paths that require authentication
  const isProtectedRoute = 
    path.startsWith('/admin') || 
    path.startsWith('/controller') || 
    path.startsWith('/worker') ||
    path.startsWith('/accountant');
  
  if (isProtectedRoute) {
    // If no session, redirect to login
    if (!session) {
      const segment = path.split('/')[1] || 'worker';
      const role = segment === 'worker' ? 'member' : segment;
      return NextResponse.redirect(new URL(`/login?role=${role}`, request.url));
    }

    // Verify session
    const payload = await verifyToken(session);
    if (!payload) {
      const segment = path.split('/')[1] || 'worker';
      const role = segment === 'worker' ? 'member' : segment;
      return NextResponse.redirect(new URL(`/login?role=${role}`, request.url));
    }

    // Role-based access control
    const role = String(payload.role || '').toUpperCase();

    if (path.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/login?role=admin&error=unauthorized`, request.url));
    }
    if (path.startsWith('/controller') && role !== 'CONTROLLER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/login?role=controller&error=unauthorized`, request.url));
    }
    if (path.startsWith('/worker') && role !== 'WORKER' && role !== 'MEMBER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/login?role=member&error=unauthorized`, request.url));
    }
    if (path.startsWith('/accountant') && role !== 'ACCOUNTANT' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/login?role=accountant&error=unauthorized`, request.url));
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
