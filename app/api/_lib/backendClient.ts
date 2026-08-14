import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from './session';

/**
 * Thin proxy layer between this app's `/api/*` routes and the Zamra backend.
 *
 * Every route handler was previously repeating the same thirty lines: read the
 * session cookie, attach a bearer header, call axios, then translate an
 * `AxiosError` into a response. That logic lives here once, so all routes
 * authenticate the same way and fail with the same response shape.
 *
 * Routes stay server-side only. The token is in an httpOnly cookie, so this is
 * the only place it can be read.
 */

/** Base URL of the backend API, e.g. `https://api.example.com`. */
const BACKEND_URL = process.env.BACKEND;

/** Uniform error body. Clients read `message`; `success` allows a quick check. */
interface ErrorBody {
  success: false;
  message: string;
}

/**
 * Every response here is authenticated and account-specific, so no shared cache
 * may ever store one.
 *
 * `private` forbids proxies and CDNs from keeping a copy; `no-store` also keeps
 * it out of the browser's HTTP cache. The second half is a deliberate choice
 * rather than an oversight: the client caches these payloads itself, in memory,
 * with explicit invalidation after each write (see
 * `(dashboard)/services/requestCache.ts`). A browser-level `max-age` on top of
 * that would be a second cache with different rules, able to serve a
 * pre-mutation response to a refetch that was triggered *because* of the
 * mutation. One cache with one invalidation path is the safer design.
 *
 * Without this header the responses carry no directive at all, which leaves
 * heuristic caching of customer records up to whatever sits in front of the app.
 */
const NO_STORE = 'private, no-store';

/** JSON response carrying the no-store policy. */
function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': NO_STORE },
  });
}

/** Error shapes the backend uses, in the order they are checked. */
interface BackendErrorPayload {
  message?: string;
  error?: string;
  detail?: string;
}

function errorResponse(message: string, status: number) {
  return jsonResponse({ success: false, message } satisfies ErrorBody, status);
}

/** 400 for a request this app rejects before contacting the backend. */
export function badRequest(message: string) {
  return errorResponse(message, 400);
}

/**
 * Converts a failed backend call into a response.
 *
 * The backend's own message is preferred so the UI can show something specific;
 * `context` only labels the server-side log line.
 */
function handleBackendError(error: unknown, context: string) {
  const axiosError = error as AxiosError<BackendErrorPayload>;
  const payload = axiosError.response?.data;

  // Logged without the response body: these payloads contain customer records.
  console.error(
    `[api] ${context} failed:`,
    axiosError.response?.status ?? axiosError.code ?? 'unknown',
    axiosError.message
  );

  return errorResponse(
    payload?.message ||
      payload?.error ||
      payload?.detail ||
      'Something went wrong. Please try again.',
    axiosError.response?.status || 502
  );
}

/**
 * Bearer header for the signed-in admin, or `null` when there is no session.
 *
 * Returning `null` lets callers answer 401 immediately instead of sending an
 * unauthenticated request the backend will reject anyway.
 */
async function authorizationHeader(): Promise<Record<string, string> | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : null;
}

/**
 * Guard for a misconfigured deployment.
 *
 * Without this the base URL would be the string `"undefined"`, producing an
 * opaque failure on every call; the message names the missing variable instead.
 */
function assertBackendConfigured() {
  return BACKEND_URL
    ? null
    : errorResponse(
        'The backend URL is not configured. Set BACKEND in your environment file and restart the server.',
        500
      );
}

/** Forwards an authenticated GET and returns the backend's JSON verbatim. */
export async function forwardGet(path: string, context: string) {
  const misconfigured = assertBackendConfigured();
  if (misconfigured) return misconfigured;

  const headers = await authorizationHeader();
  if (!headers) return errorResponse('Your session has expired.', 401);

  try {
    const response = await axios.get(`${BACKEND_URL}${path}`, { headers });
    return jsonResponse(response.data);
  } catch (error) {
    return handleBackendError(error, context);
  }
}

/** Forwards an authenticated POST and returns the backend's JSON verbatim. */
export async function forwardPost(
  path: string,
  body: unknown,
  context: string,
  config?: AxiosRequestConfig
) {
  const misconfigured = assertBackendConfigured();
  if (misconfigured) return misconfigured;

  const headers = await authorizationHeader();
  if (!headers) return errorResponse('Your session has expired.', 401);

  try {
    const response = await axios.post(`${BACKEND_URL}${path}`, body, {
      ...config,
      headers: { ...headers, ...config?.headers },
    });
    return jsonResponse(response.data);
  } catch (error) {
    return handleBackendError(error, context);
  }
}

/** Forwards an authenticated PUT and returns the backend's JSON verbatim. */
export async function forwardPut(
  path: string,
  body: unknown,
  context: string,
  config?: AxiosRequestConfig
) {
  const misconfigured = assertBackendConfigured();
  if (misconfigured) return misconfigured;

  const headers = await authorizationHeader();
  if (!headers) return errorResponse('Your session has expired.', 401);

  try {
    const response = await axios.put(`${BACKEND_URL}${path}`, body, {
      ...config,
      headers: { ...headers, ...config?.headers },
    });
    return jsonResponse(response.data);
  } catch (error) {
    return handleBackendError(error, context);
  }
}

/** Forwards an authenticated DELETE and returns the backend's JSON verbatim. */
export async function forwardDelete(path: string, context: string) {
  const misconfigured = assertBackendConfigured();
  if (misconfigured) return misconfigured;

  const headers = await authorizationHeader();
  if (!headers) return errorResponse('Your session has expired.', 401);

  try {
    const response = await axios.delete(`${BACKEND_URL}${path}`, { headers });
    return jsonResponse(response.data ?? { success: true });
  } catch (error) {
    return handleBackendError(error, context);
  }
}

/**
 * Answers 501 for a route whose backend path is still an empty placeholder, so
 * an unconfigured endpoint reports itself instead of calling the wrong URL.
 */
export function endpointNotConfigured(label: string) {
  return errorResponse(
    `The ${label} endpoint is not configured yet. Add its backend path in app/api to enable this action.`,
    501
  );
}

/**
 * POSTs without a session — used only by sign-in, which is what establishes one.
 * Returns the raw axios response so the caller can read the token it contains.
 */
export async function postUnauthenticated(path: string, body: unknown) {
  if (!BACKEND_URL) {
    throw new Error(
      'The backend URL is not configured. Set BACKEND in your environment file.'
    );
  }

  return axios.post(`${BACKEND_URL}${path}`, body);
}

export { handleBackendError, errorResponse, assertBackendConfigured, NO_STORE };
