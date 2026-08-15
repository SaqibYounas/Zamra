import axios from 'axios';
import { toServiceError, type MutationOutcome } from './serviceResult';

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<MutationOutcome> {
  try {
    const response = await axios.post(
      '/api/change-password',
      { oldPassword, newPassword },
      { showToast: true }
    );
    return response.data;
  } catch (error) {
    return toServiceError(error, 'The password could not be changed.');
  }
}
