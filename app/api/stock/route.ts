import { BACKEND_API } from '../url';
import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface StockMangRequestBody {
  bottleType: string;
  totalPet: string;
  bottlePerPet?: string;
  bottleperPet?: string;
}

interface BackendErrorResponse {
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StockMangRequestBody;
    const { bottleType, totalPet, bottlePerPet, bottleperPet } = body;
    const normalizedBottlePerPet = bottlePerPet ?? bottleperPet;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    console.log(body);
    const response = await axios.post(
      `${BACKEND_API}/daily-stock/create`,
      {
        bottleType,
        totalPet,
        bottlePerPet: normalizedBottlePerPet,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );

    const data = response.data as unknown;

    return NextResponse.json(data);
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    console.error(
      'Stock Created Error:',
      axiosError.response?.data || axiosError.message
    );
    const errorMessage =
      axiosError.response?.data?.message || 'Something went wrong';
    const errorStatus = axiosError.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await axios.get(`${BACKEND_API}/daily-stock`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    const data = response.data as unknown;

    return NextResponse.json(data);
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    console.error(
      'Stock Fetch Error:',
      axiosError.response?.data || axiosError.message
    );
    const errorMessage =
      axiosError.response?.data?.message || 'Something went wrong';
    const errorStatus = axiosError.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
}
