import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  error: string;
}

export async function monthlyProfitPrice() {
  try {
    const response = await axios.get('/api/monthly-profit');

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
