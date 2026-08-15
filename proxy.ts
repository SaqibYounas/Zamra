import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from './app/api/_lib/session';

export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/price',
    '/selling-price',
    '/production',
    '/monthly-records',
    '/bill-generate',
    '/invoices',
    '/invoices/:path*',
    '/company-info',
    '/change-password',
  ],
};
