import {
  badRequest,
  forwardDelete,
  forwardPut,
} from '../../_lib/backendClient';

const UPDATE_BASE = '/shipping-address';
const DELETE_BASE = '/shipping-address';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return badRequest('A shipping address id is required.');
  }

  const body = await request.json();

  return forwardPut(`${UPDATE_BASE}/${id}`, body, 'Update shipping address', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return badRequest('A shipping address id is required.');
  }

  return forwardDelete(`${DELETE_BASE}/${id}`, 'Delete shipping address');
}
