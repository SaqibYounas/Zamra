import axios, { AxiosError } from 'axios';

interface StockMangRequestBody {
  bottleType?: string;
  totalPet: string;
  perBottlePrice?: string;
}
interface ErrorResponse {
  error: string;
}

export async function saveStock(data: StockMangRequestBody) {
  try {
    const response = await axios.post('/api/stock', {
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
