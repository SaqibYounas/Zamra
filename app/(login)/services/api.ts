import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await axios.post('/api/login', {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: err.response?.data?.message || 'Server error',
    };
  }
}
