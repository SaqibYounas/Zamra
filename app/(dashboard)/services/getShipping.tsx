import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  error: string;
}

export async function fetchShipping() {
  try {
    const response = await axios.get('/api/shipping-addresses');
    console.log(response);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: err.response?.data?.error || 'Server error',
    };
  }
}
