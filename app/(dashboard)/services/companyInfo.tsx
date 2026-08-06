import axios, { AxiosError } from 'axios';

interface CompanyInfoRequestBody {
  companyName?: string;
  ownerName?: string;
  city: string;
  contact: string;
  address: string;
  email: string;
}

interface ErrorResponse {
  error: string;
}

export async function saveCompanyInfo(data: CompanyInfoRequestBody) {
  try {
    const response = await axios.post(
      '/api/company-info',
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

    return {
      success: false,
      message: err.response?.data?.error || 'Server error',
    };
  }
}
