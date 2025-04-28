import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isDashboardPage = request.nextUrl.pathname === '/dashboard';

  // If on login page and has token, redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', 'http://localhost:3002'));
  }

  // If on dashboard and no token, redirect to login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', 'http://localhost:3002'));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard'],
}; 