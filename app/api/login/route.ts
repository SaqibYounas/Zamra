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

    const data = response.data;

    const res = NextResponse.json({
      success: true,
      user: data.user,
    });

    res.cookies.set({
      name: 'token',
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    const errorMessage =
      axiosError.response?.data?.message || 'Something went wrong';

    const errorStatus = axiosError.response?.status || 500;

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: errorStatus }
    );
  }
}
