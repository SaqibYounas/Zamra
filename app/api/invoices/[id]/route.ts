import {
  badRequest,
  endpointNotConfigured,
  forwardDelete,
  forwardGet,
  forwardPut,
} from '../../_lib/backendClient';

const READ_BASE = '';

/** TODO: backend base path for updating an invoice, e.g. `/invoice`. */
const UPDATE_BASE = '';

/** TODO: backend base path for deleting an invoice, e.g. `/invoice`. */
const DELETE_BASE = '';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return badRequest('An invoice id is required.');
  if (!READ_BASE) return endpointNotConfigured('invoice detail');

  return forwardGet(`${READ_BASE}/${id}`, 'Fetch invoice');
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return badRequest('An invoice id is required.');
  if (!UPDATE_BASE) return endpointNotConfigured('update invoice');

  const body = await request.json();

  return forwardPut(`${UPDATE_BASE}/${id}`, body, 'Update invoice', {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return badRequest('An invoice id is required.');
  if (!DELETE_BASE) return endpointNotConfigured('delete invoice');

  return forwardDelete(`${DELETE_BASE}/${id}`, 'Delete invoice');
}
