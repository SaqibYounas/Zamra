import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  error: string;
}

export async function fetchShipping() {
  try {
    const response = await axios.get('/api/shipping-addresses');
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
