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
    const response = await axios.post(
      '/api/price',
      {
        ...data,
      },
      {
        showToast: true,
      }
    );

    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    const payload = err.response?.data as
      | { error?: string; message?: string }
      | undefined;

    return {
      success: false,
      message: payload?.message || payload?.error || 'Server error',
    };
  }
}

export async function fetchActivePrices() {
  try {
    const response = await axios.get('/api/active-price');
    const data = response.data;

    return Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: err.response?.data?.error || 'Server error',
    };
  }
}
