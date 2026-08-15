import { NextResponse } from 'next/server';
import { NO_STORE } from '../_lib/backendClient';
import { SESSION_COOKIE, sessionCookieOptions } from '../_lib/session';

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
