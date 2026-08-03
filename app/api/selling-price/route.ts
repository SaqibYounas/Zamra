import { BACKEND_API } from '../url';
import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface sellingPriceRequestBody {
  sellingPrice: string;
  priceManagementId: number;
}

interface BackendErrorResponse {
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as sellingPriceRequestBody;
    const { sellingPrice, priceManagementId } = body;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await axios.post(
      `${BACKEND_API}/selling-price/create`,
      {
        sellingPrice: sellingPrice,
        priceManagementId: priceManagementId,
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
      'Price Error:',
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
    const response = await axios.get(`${BACKEND_API}/selling-price/active`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    const data = response.data as unknown;
    console.log(data);
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
