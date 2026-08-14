import { NextResponse } from 'next/server';
import { NO_STORE } from '../_lib/backendClient';
import { SESSION_COOKIE, sessionCookieOptions } from '../_lib/session';

/**
 * Admin sign-out.
 *
 * Local only — the backend has no logout endpoint, so this simply expires the
 * session cookie. It always succeeds, which means a user can never be trapped
 * in a signed-in state by a failing request.
 */
export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { headers: { 'Cache-Control': NO_STORE } }
  );

  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    maxAge: 0,
    expires: new Date(0),
    ...sessionCookieOptions,
  });

  return response;
}
