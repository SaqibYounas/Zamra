import {
  badRequest,
  endpointNotConfigured,
  forwardDelete,
  forwardPut,
} from '../../_lib/backendClient';

/**
 * A single customer billing profile. Both paths are empty placeholders: the
 * backend does not publish customer update/delete endpoints yet.
 */

/** TODO: backend base path for updating a customer, e.g. `/customers`. */
const UPDATE_BASE = '';

/** TODO: backend base path for deleting a customer, e.g. `/customers`. */
const DELETE_BASE = '';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return badRequest('A customer id is required.');
  if (!UPDATE_BASE) return endpointNotConfigured('update customer');

  const body = await request.json();

  return forwardPut(`${UPDATE_BASE}/${id}`, body, 'Update customer', {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return badRequest('A customer id is required.');
  if (!DELETE_BASE) return endpointNotConfigured('delete customer');

  return forwardDelete(`${DELETE_BASE}/${id}`, 'Delete customer');
}
