import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from './app/api/_lib/session';

/**
 * Route guard. In Next.js 16 this file replaces `middleware.ts`.
 *
 * It only checks that a session cookie exists — the backend remains the
 * authority on whether the token is valid, and rejects expired ones with a 401
 * that the client turns into a "session expired" notice.
 *
 * Every protected page must be listed in `config.matcher` below; a route that
 * is missing from it is publicly reachable.
 */
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
    // Invoice detail and edit pages; without this they would be public.
    '/invoices/:path*',
    '/company-info',
    '/change-password',
  ],
};
