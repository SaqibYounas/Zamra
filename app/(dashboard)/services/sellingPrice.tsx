import axios, { AxiosError } from 'axios';

interface sellingPriceRequestBody {
  sellingPrice: string;
  priceManagementId: number;
}

interface ErrorResponse {
  error: string;
}

export async function saveSellingPrice(data: sellingPriceRequestBody) {
  try {
    const response = await axios.post('/api/selling-price', {
      ...data,
    });

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
