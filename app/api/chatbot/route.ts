import { badRequest, forwardPost } from '../_lib/backendClient';

/**
 * Assistant queries.
 *
 * `POST` -> backend `/rag/query`
 *
 * The backend answers from the plant's own records, so this is forwarded with
 * the caller's session like every other route.
 */

interface ChatbotRequestBody {
  message?: string;
}

export async function POST(request: Request) {
  const { message } = (await request.json()) as ChatbotRequestBody;

  if (!message?.trim()) {
    return badRequest('Ask a question to get an answer.');
  }

  return forwardPost('/rag/query', { question: message }, 'Assistant query');
}
