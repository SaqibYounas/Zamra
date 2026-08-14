import axios from 'axios';
import { toServiceError, type MutationOutcome } from './serviceResult';

/** Admin account operations for the signed-in user. */

/**
 * Replaces the signed-in admin's password. Toasts the outcome.
 *
 * The session cookie is unaffected, so the user stays signed in on this device.
 */
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
