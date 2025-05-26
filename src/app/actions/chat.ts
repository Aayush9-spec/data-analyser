
'use server';

import { simpleChat, type SimpleChatInput } from '@/ai/flows/basic-chat-flow';

export async function askChatbot(userMessage: string): Promise<string> {
  if (!userMessage.trim()) {
    return "Please provide a message.";
  }

  try {
    const input: SimpleChatInput = { prompt: userMessage };
    const result = await simpleChat(input);
    return result.response;
  } catch (error)
  {
    console.error('Error in askChatbot Server Action:', error);
    // Check if the error object has a message property
    let errorMessage = 'An unexpected error occurred while processing your request.';
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    return `Sorry, there was an issue: ${errorMessage}`;
  }
}