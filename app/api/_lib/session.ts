/**
 * Session cookie contract, shared by the login/logout handlers, the route
 * guard in `proxy.ts` and the client-side sign-out helper.
 *
 * Constants only — no server-only imports — so it is safe to reference from
 * middleware, route handlers and browser code alike.
 */

/** Name of the cookie holding the backend access token. */
export const SESSION_COOKIE = 'token';

/** How long a session lasts, in seconds (24 hours). */
export const SESSION_MAX_AGE = 60 * 60 * 24;

/**
 * Cookie attributes used when issuing the session.
 *
 * `httpOnly` keeps the token out of reach of client scripts, which is why the
 * browser never attaches it manually — it rides along with same-origin requests
 * to `/api/*` and is read server-side.
 */
export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
} as const;
