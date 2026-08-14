import {
  badRequest,
  endpointNotConfigured,
  forwardDelete,
  forwardPut,
} from '../../_lib/backendClient';

/**
 * A single delivery destination. Both paths are empty placeholders: the backend
 * does not publish shipping-address update/delete endpoints yet.
 */

/** TODO: backend base path for updating an address, e.g. `/shipping-address`. */
const UPDATE_BASE = '';

/** TODO: backend base path for deleting an address, e.g. `/shipping-address`. */
const DELETE_BASE = '';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return badRequest('A shipping address id is required.');
  if (!UPDATE_BASE) return endpointNotConfigured('update shipping address');

  const body = await request.json();

  return forwardPut(`${UPDATE_BASE}/${id}`, body, 'Update shipping address', {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return badRequest('A shipping address id is required.');
  if (!DELETE_BASE) return endpointNotConfigured('delete shipping address');

  return forwardDelete(`${DELETE_BASE}/${id}`, 'Delete shipping address');
}
