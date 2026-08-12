import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export type LLMProvider = 'gemini' | 'openai' | 'anthropic' | 'openrouter' | 'ollama' | 'lmstudio';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string; // e.g. http://localhost:11434 for Ollama or http://localhost:1234/v1 for LM Studio
}

export async function generateMultiLLMResponse(
  prompt: string,
  config: LLMConfig = { provider: 'gemini' },
  systemPrompt?: string
): Promise<{ text: string; provider: string; model: string }> {
  const provider = config.provider || 'gemini';

  // 1. Ollama Local LLM
  if (provider === 'ollama') {
    const baseUrl = config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = config.model || 'llama3';
    try {
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt,
          stream: false,
        }),
      });
      if (!res.ok) throw new Error(`Ollama HTTP error ${res.status}`);
      const data = await res.json();
      return { text: data.response || 'No response from Ollama', provider: 'ollama', model };
    } catch (e: any) {
      console.warn(`[LLM Router] Ollama offline (${e.message}), falling back to Gemini...`);
    }
  }

  // 2. LM Studio Local LLM
  if (provider === 'lmstudio') {
    const baseUrl = config.baseUrl || process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1';
    const model = config.model || 'local-model';
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt }
          ],
        }),
      });
      if (!res.ok) throw new Error(`LM Studio HTTP error ${res.status}`);
      const data = await res.json();
      return {
        text: data.choices?.[0]?.message?.content || 'No response from LM Studio',
        provider: 'lmstudio',
        model
      };
    } catch (e: any) {
      console.warn(`[LLM Router] LM Studio offline (${e.message}), falling back to Gemini...`);
    }
  }

  // 3. OpenAI
  if (provider === 'openai') {
    const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    if (apiKey) {
      const openai = new OpenAI({ apiKey });
      const model = config.model || 'gpt-4o-mini';
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
          { role: 'user' as const, content: prompt }
        ],
      });
      return {
        text: completion.choices[0]?.message?.content || '',
        provider: 'openai',
        model
      };
    }
  }

  // 4. OpenRouter Gateway
  if (provider === 'openrouter') {
    const apiKey = config.apiKey || process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      const model = config.model || 'anthropic/claude-3.5-sonnet';
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt }
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          text: data.choices?.[0]?.message?.content || '',
          provider: 'openrouter',
          model
        };
      }
    }
  }

  // 5. Default Fallback: Gemini AI
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      text: `[SYNAPS AI Engine] Grounded Analysis:\nPrompt processed. (Configure GEMINI_API_KEY or OLLAMA_BASE_URL for live LLM execution)`,
      provider: 'mock-engine',
      model: 'synaps-v1'
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = config.model || 'gemini-2.5-flash';
  const model = genAI.getGenerativeModel({ model: modelName });

  const finalPrompt = systemPrompt ? `${systemPrompt}\n\nTask: ${prompt}` : prompt;
  const result = await model.generateContent(finalPrompt);
  const text = result.response.text();

  return {
    text,
    provider: 'gemini',
    model: modelName
  };
}
