import { BACKEND_API } from '../url';
import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface PriceMangRequestBody {
  type?: string;
  price?: string;
  labelCap: string;
  otherExpense: string;
}

interface BackendErrorResponse {
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PriceMangRequestBody;
    const { type, price, labelCap, otherExpense } = body;

    if (!type || !price || !labelCap || !otherExpense) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please fill in all required fields before submitting.',
        },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await axios.post(
      `${BACKEND_API}/price/create`,
      {
        bottleType: type,
        perBottlePrice: price,
        labelCapPrice: labelCap,
        otherExpenses: otherExpense,
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
      'Update Password Error:',
      axiosError.response?.data || axiosError.message
    );
    const errorMessage =
      axiosError.response?.data?.message || 'Something went wrong';
    const errorStatus = axiosError.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
}
