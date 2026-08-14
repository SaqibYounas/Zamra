import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { NO_STORE, postUnauthenticated } from '../_lib/backendClient';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  sessionCookieOptions,
} from '../_lib/session';

/**
 * Admin sign-in.
 *
 * `POST` -> backend `/auth/login`
 *
 * On success the backend's access token is stored in an httpOnly cookie; it is
 * never returned to the browser, so the token cannot be read by client scripts.
 * This is the one route that runs without an existing session.
 */

interface LoginRequestBody {
  email?: string;
  password?: string;
}

interface BackendErrorPayload {
  message?: string;
  error?: string;
}

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as LoginRequestBody;

  if (!email?.trim() || !password?.trim()) {
    return NextResponse.json(
      { success: false, message: 'Email and password are required.' },
      { status: 400 }
    );
  }

  try {
    const { data } = await postUnauthenticated('/auth/login', {
      email,
      password,
    });

    if (!data?.access_token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Sign-in succeeded but no session token was returned.',
        },
        { status: 502 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: 'Welcome back!', user: data.user },
      // Carries a session cookie; must never be stored anywhere.
      { headers: { 'Cache-Control': NO_STORE } }
    );

    response.cookies.set({
      name: SESSION_COOKIE,
      value: data.access_token,
      maxAge: SESSION_MAX_AGE,
      ...sessionCookieOptions,
    });

    return response;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorPayload>;
    const payload = axiosError.response?.data;

    // Credentials must never reach the log; the status and reason are enough.
    console.error(
      '[api] Sign-in failed:',
      axiosError.response?.status ?? axiosError.code ?? 'unknown',
      axiosError.message
    );

    return NextResponse.json(
      {
        success: false,
        message:
          payload?.message ||
          payload?.error ||
          (error as Error).message ||
          'Sign-in failed. Please check your credentials and try again.',
      },
      { status: axiosError.response?.status || 502 }
    );
  }
}
