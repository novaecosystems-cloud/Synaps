import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, generateObject, streamText, LanguageModel, Schema } from 'ai';
import { z } from 'zod';

// Helper to get active language models with available API keys
function getAvailableLanguageModels(): { name: string; model: LanguageModel }[] {
  const models: { name: string; model: LanguageModel }[] = [];

  // 1. Google Gemini Models
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_2;
  if (geminiKey) {
    const google = createGoogleGenerativeAI({ apiKey: geminiKey });
    models.push({ name: 'Google Gemini 1.5 Flash', model: google('gemini-1.5-flash') });
  }

  // 2. Groq Models
  const groqKey = process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_2;
  if (groqKey && groqKey.startsWith('gsk_')) {
    const groq = createGroq({ apiKey: groqKey });
    models.push({ name: 'Groq Llama 3.3 70B', model: groq('llama-3.3-70b-versatile') });
    models.push({ name: 'Groq Llama 3.1 8B', model: groq('llama-3.1-8b-instant') });
  }

  // 3. OpenRouter Free AI Gateway (Ranked #1 on APIVault)
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey && !openRouterKey.includes('placeholder')) {
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openRouterKey,
    });
    models.push({ name: 'OpenRouter DeepSeek R1', model: openrouter('deepseek/deepseek-r1:free') });
    models.push({ name: 'OpenRouter Meta Llama 3.3 70B', model: openrouter('meta-llama/llama-3.3-70b-instruct:free') });
  }

  // 4. DeepSeek API (Featured on APIVault)
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (deepseekKey) {
    const deepseek = createOpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: deepseekKey,
    });
    models.push({ name: 'DeepSeek Chat V3', model: deepseek('deepseek-chat') });
  }

  // 5. OpenAI Models
  const openAIKey = process.env.OPENAI_API_KEY;
  if (openAIKey && !openAIKey.includes('placeholder')) {
    const openai = createOpenAI({ apiKey: openAIKey });
    models.push({ name: 'OpenAI GPT-4o Mini', model: openai('gpt-4o-mini') });
  }

  // Fallback if no specific keys found (e.g. OpenRouter or default Gemini)
  if (models.length === 0 && geminiKey) {
    const google = createGoogleGenerativeAI({ apiKey: geminiKey });
    models.push({ name: 'Google Gemini Fallback', model: google('gemini-1.5-flash') });
  }

  return models;
}

/**
 * Generate text response with automatic model failover using Vercel AI SDK
 */
export async function generateTextWithAISDK(options: {
  prompt?: string;
  system?: string;
  messages?: any[];
}): Promise<{ text: string; providerUsed: string }> {
  const models = getAvailableLanguageModels();

  if (models.length === 0) {
    throw new Error('No AI provider API keys configured in environment');
  }

  let lastError: Error | null = null;

  for (const { name, model } of models) {
    try {
      const result = await generateText({
        model,
        system: options.system,
        prompt: options.prompt,
        messages: options.messages,
      });

      return {
        text: result.text,
        providerUsed: name,
      };
    } catch (err: any) {
      console.warn(`[AI-SDK] Failover from ${name}:`, err.message || err);
      lastError = err;
    }
  }

  throw new Error(`All AI SDK models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Generate structured object (JSON) conforming to a Zod schema using Vercel AI SDK
 */
export async function generateObjectWithAISDK<T>(options: {
  schema: z.ZodSchema<T>;
  prompt?: string;
  system?: string;
  messages?: any[];
}): Promise<{ object: T; providerUsed: string }> {
  const models = getAvailableLanguageModels();

  if (models.length === 0) {
    throw new Error('No AI provider API keys configured in environment');
  }

  let lastError: Error | null = null;

  for (const { name, model } of models) {
    try {
      const result = await generateObject({
        model,
        schema: options.schema,
        system: options.system,
        prompt: options.prompt,
        messages: options.messages,
      });

      return {
        object: result.object as T,
        providerUsed: name,
      };
    } catch (err: any) {
      console.warn(`[AI-SDK-Object] Failover from ${name}:`, err.message || err);
      lastError = err;
    }
  }

  throw new Error(`All AI SDK generateObject attempts failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Stream text response using Vercel AI SDK
 */
export async function streamTextWithAISDK(options: {
  prompt?: string;
  system?: string;
  messages?: any[];
}) {
  const models = getAvailableLanguageModels();

  if (models.length === 0) {
    throw new Error('No AI provider API keys configured in environment');
  }

  const primaryModel = models[0];
  return streamText({
    model: primaryModel.model,
    system: options.system,
    prompt: options.prompt,
    messages: options.messages,
  });
}
