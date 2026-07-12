import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  error: string;
}

export async function fetchShipping(data: CompanyInfoRequestBody) {
  try {
    const response = await axios.get('/api/shipping-addresses');
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: err.response?.data?.error || 'Server error',
    };
  }
}
