import axios, { AxiosError } from 'axios';

interface PriceMangRequestBody {
  type: string;
  price: string;
  labelCap: string;
  otherExpense: string;
}

interface ErrorResponse {
  error: string;
}

export async function savePrice(data: PriceMangRequestBody) {
  try {
    const response = await axios.post('/api/price', {
      ...data,
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: err.response?.data?.error || 'Server error',
    };
  }
}
