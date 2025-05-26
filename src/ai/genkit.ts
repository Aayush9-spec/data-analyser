import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// WARNING: Hardcoding API keys is a security risk and not recommended for production.
// Please use environment variables (e.g., GEMINI_API_KEY or GOOGLE_API_KEY) instead.
// This is for temporary debugging or non-production use.
const geminiApiKey = "AIzaSyD3xtbib9kzG21XG7IXC2dZx3YbMbbJyPM";

export const ai = genkit({
  plugins: [googleAI({apiKey: geminiApiKey})],
  model: 'googleai/gemini-2.0-flash',
});
