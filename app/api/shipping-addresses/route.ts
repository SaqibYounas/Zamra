import { BACKEND_API } from '../url';
import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface BackendErrorResponse {
  message?: string;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await axios.get(`${BACKEND_API}/shipping-addresses`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    const data = response.data as unknown;
    return NextResponse.json(data);
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    console.error(
      'Price Error:',
      axiosError.response?.data || axiosError.message
    );
    const errorMessage =
      axiosError.response?.data?.message || 'Something went wrong';
    const errorStatus = axiosError.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
}
