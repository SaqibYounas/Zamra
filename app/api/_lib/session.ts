export const SESSION_COOKIE = 'token';
export const SESSION_MAX_AGE = 60 * 60 * 24;

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
} as const;
