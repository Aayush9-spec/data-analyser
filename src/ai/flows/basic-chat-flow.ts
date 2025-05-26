'use server';
/**
 * @fileOverview A basic conversational AI flow, now enhanced for data analysis tasks.
 *
 * - simpleChat - A function that handles a simple chat interaction, geared towards data analysis.
 * - SimpleChatInput - The input type for the simpleChat function.
 * - SimpleChatOutput - The return type for the simpleChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit'; // Genkit's re-export of Zod

const SimpleChatInputSchema = z.object({
  prompt: z.string().describe('The user message to the chatbot, potentially including information about attached files.'),
});
export type SimpleChatInput = z.infer<typeof SimpleChatInputSchema>;

const SimpleChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s analysis or response to the user.'),
});
export type SimpleChatOutput = z.infer<typeof SimpleChatOutputSchema>;

// Exported wrapper function to be called by Server Actions or API routes
export async function simpleChat(input: SimpleChatInput): Promise<SimpleChatOutput> {
  return basicChatFlow(input);
}

const chatPrompt = ai.definePrompt(
  {
    name: 'dataAnalysisChatPrompt',
    input: { schema: SimpleChatInputSchema },
    output: { schema: SimpleChatOutputSchema },
    prompt: `You are a friendly and helpful data analysis assistant.

    `,
  },
);

const basicChatFlow = ai.defineFlow(
  {
    name: 'basicChatFlow',
    inputSchema: SimpleChatInputSchema,
    outputSchema: SimpleChatOutputSchema,
  },
  async (input) => {
    const llmResponse = await chatPrompt(input);
    // FIX: The correct property is 'llmResponse', not 'llmResponse.output'
    // The output from definePrompt is usually just the object itself
    // If llmResponse has 'response' directly, use it; otherwise, fallback to text
    if (llmResponse && typeof llmResponse.response === 'string') {
      return { response: llmResponse.response };
    }
    const textResponse = llmResponse?.text;
    return { response: textResponse ?? "I'm sorry, I couldn't generate a response for that." };
  }
);

