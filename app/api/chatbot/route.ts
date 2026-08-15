import { badRequest, forwardPost } from '../_lib/backendClient';

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
