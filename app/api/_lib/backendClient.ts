import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from './session';

const BACKEND_URL = process.env.BACKEND;

interface ErrorBody {
  success: false;
  message: string;
}

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

async function authorizationHeader(): Promise<Record<string, string> | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : null;
}

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

export function endpointNotConfigured(label: string) {
  return errorResponse(
    `The ${label} endpoint is not configured yet. Add its backend path in app/api to enable this action.`,
    501
  );
}

export async function postUnauthenticated(path: string, body: unknown) {
  if (!BACKEND_URL) {
    throw new Error(
      'The backend URL is not configured. Set BACKEND in your environment file.'
    );
  }

  return axios.post(`${BACKEND_URL}${path}`, body);
}

export { handleBackendError, errorResponse, assertBackendConfigured, NO_STORE };
