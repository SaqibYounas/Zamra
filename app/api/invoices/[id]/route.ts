import {
  badRequest,
  forwardDelete,
  forwardGet,
  forwardPut,
} from '../../_lib/backendClient';

const READ_BASE = '/invoice';
const UPDATE_BASE = '/invoice';
const DELETE_BASE = '/invoice';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return badRequest('An invoice id is required.');
  }

  return forwardGet(`${READ_BASE}/${id}`, 'Fetch invoice');
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return badRequest('An invoice id is required.');
  }

  const body = await request.json();

  return forwardPut(`${UPDATE_BASE}/${id}`, body, 'Update invoice', {
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
    return badRequest('An invoice id is required.');
  }

  return forwardDelete(`${DELETE_BASE}/${id}`, 'Delete invoice');
}
