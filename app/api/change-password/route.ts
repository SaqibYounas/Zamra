import { badRequest, forwardPost } from '../_lib/backendClient';

interface ChangePasswordRequestBody {
  oldPassword?: string;
  newPassword?: string;
}

export async function POST(request: Request) {
  const { oldPassword, newPassword } =
    (await request.json()) as ChangePasswordRequestBody;

  if (!oldPassword?.trim() || !newPassword?.trim()) {
    return badRequest('Both the current and the new password are required.');
  }

  if (oldPassword === newPassword) {
    return badRequest('The new password must differ from the current one.');
  }

  return forwardPost(
    '/auth/update',
    { oldPassword, newPassword },
    'Change password'
  );
}
