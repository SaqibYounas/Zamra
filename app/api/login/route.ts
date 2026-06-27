import { BACKEND_API } from '../url';
import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

interface LoginRequestBody {
  email?: string;
  password?: string;
}

interface BackendErrorResponse {
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequestBody;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const response = await axios.post(`${BACKEND_API}/auth/login`, {
      email,
      password,
    });

    const data = response.data as unknown;

    return NextResponse.json(data);
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    console.error(
      'Login Error:',
      axiosError.response?.data || axiosError.message
    );
    const errorMessage =
      axiosError.response?.data?.message || 'Something went wrong';
    const errorStatus = axiosError.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
}
