import { Groq } from 'groq-sdk';
import OpenAI from 'openai';

// Lazy client getters — instantiated only at request time, never at build time
function getGroq() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing in Vercel Environment Variables.');
  }
  
  // Support multiple comma-separated keys for load balancing to avoid rate limits
  const keys = process.env.GROQ_API_KEY.split(',').map(k => k.trim()).filter(k => k);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  
  return new Groq({ apiKey: randomKey });
}

function getOpenRouter() {
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || 'placeholder',
  });
}

function getMistral() {
  return new OpenAI({
    baseURL: 'https://api.mistral.ai/v1',
    apiKey: process.env.MISTRAL_API_KEY || 'placeholder',
  });
}

function getGithub() {
  return new OpenAI({
    baseURL: 'https://models.inference.ai.azure.com',
    apiKey: process.env.GITHUB_TOKEN || 'placeholder',
  });
}

function getHuggingface() {
  return new OpenAI({
    baseURL: 'https://router.huggingface.co/v1',
    apiKey: process.env.HF_TOKEN || 'placeholder',
  });
}

interface LLMProvider {
  name: string;
  invoke: (messages: any[], options?: any) => Promise<string>;
}

// Fallback Chain Definition — clients created lazily inside each invoke()
const providers: LLMProvider[] = [];

// Dynamically add all Groq keys as separate primary/fallback providers
// Supports GROQ_API_KEY, GROQ_API_KEY_2, GROQ_API_KEY_3 as individual Vercel env vars
const groqKeyEnvVars = ['GROQ_API_KEY', 'GROQ_API_KEY_2', 'GROQ_API_KEY_3'];
const groqKeys = groqKeyEnvVars
  .map(varName => process.env[varName]?.trim())
  .filter((k): k is string => !!k && k.startsWith('gsk_'));

if (groqKeys.length > 0) {
  groqKeys.forEach((key, index) => {
    providers.push({
      name: `Groq (Key ${index + 1})`,
      invoke: async (messages, options) => {
        const groq = new Groq({ apiKey: key });
        const result = await groq.chat.completions.create({
          messages,
          model: 'llama-3.3-70b-versatile',
          ...options
        });
        return result.choices[0]?.message?.content || '';
      }
    });
  });
} else {
  providers.push({
    name: 'Groq',
    invoke: async () => { throw new Error('No valid GROQ_API_KEY found in environment variables'); }
  });
}

providers.push(
  {
    name: 'OpenRouter',
    invoke: async (messages, options) => {
      const { response_format, ...safeOptions } = options || {};
      const result = await getOpenRouter().chat.completions.create({
        messages,
        model: 'google/gemini-flash-1.5',
        ...safeOptions
      });
      return result.choices[0]?.message?.content || '';
    }
  },
  {
    name: 'Mistral',
    invoke: async (messages, options) => {
      const { response_format, ...safeOptions } = options || {};
      const result = await getMistral().chat.completions.create({
        messages,
        model: 'mistral-small-latest',
        ...safeOptions
      });
      return result.choices[0]?.message?.content || '';
    }
  },
  {
    name: 'GitHub Models',
    invoke: async (messages, options) => {
      const { response_format, ...safeOptions } = options || {};
      const result = await getGithub().chat.completions.create({
        messages,
        model: 'gpt-4o-mini',
        ...safeOptions
      });
      return result.choices[0]?.message?.content || '';
    }
  },
  {
    name: 'HuggingFace',
    invoke: async (messages, options) => {
      const { response_format, ...safeOptions } = options || {};
      const result = await getHuggingface().chat.completions.create({
        messages,
        model: 'zai-org/GLM-5.2:novita',
        ...safeOptions
      });
      return result.choices[0]?.message?.content || '';
    }
  }
);

export async function invokeLLMWithFallback(messages: any[], options: any = {}): Promise<string> {
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      console.log(`[LLM Router] Attempting generation with ${provider.name}...`);
      const response = await provider.invoke(messages, options);
      console.log(`[LLM Router] Success using ${provider.name}.`);
      return response;
    } catch (error: any) {
      console.warn(`[LLM Router] Provider ${provider.name} failed:`, error.message);
      errors.push(`${provider.name}: ${error.message}`);
    }
  }

  throw new Error(`All LLM providers failed. Errors:\n${errors.join('\n')}`);
}
