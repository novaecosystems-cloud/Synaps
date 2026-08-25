import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { inspectResponse } from '@/lib/ai-firewall';

export type LLMProvider = 'gemini' | 'openai' | 'anthropic' | 'openrouter' | 'vercel-gateway' | 'ollama' | 'lmstudio' | 'kimi' | 'moonshot';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string; // e.g. http://localhost:11434 for Ollama or Vercel AI Gateway endpoint
}

export async function generateMultiLLMResponse(
  prompt: string,
  config: LLMConfig = { provider: 'gemini' },
  systemPrompt?: string
): Promise<{ text: string; provider: string; model: string }> {
  const result = await generateMultiLLMResponseRaw(prompt, config, systemPrompt);
  return {
    ...result,
    text: inspectResponse(result.text).sanitizedOutput
  };
}

async function generateMultiLLMResponseRaw(
  prompt: string,
  config: LLMConfig = { provider: 'gemini' },
  systemPrompt?: string
): Promise<{ text: string; provider: string; model: string }> {
  const provider = config.provider || 'gemini';

  // 1. Vercel AI Gateway (GLM-5.2 Free Promo through Aug 27 via Blackbox)
  if (provider === 'vercel-gateway') {
    const apiKey = config.apiKey || process.env.VERCEL_AI_GATEWAY_KEY || process.env.BLACKBOX_API_KEY;
    const model = config.model || 'blackbox/glm-5.2'; // 1M Token Context Window
    const gatewayUrl = config.baseUrl || 'https://ai-gateway.vercel.app/v1/chat/completions';
    
    try {
      const res = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
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
          text: data.choices?.[0]?.message?.content || 'No response from Vercel AI Gateway GLM-5.2',
          provider: 'vercel-gateway',
          model
        };
      }
    } catch (e: any) {
      console.warn(`[LLM Router] Vercel AI Gateway GLM-5.2 error (${e.message}), falling back to Gemini...`);
    }
  }

  // 2. Ollama Local LLM
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

  // 3. LM Studio Local LLM
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
            ...(systemPrompt ? [{ role: 'system' }] : []),
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

  // 4. OpenAI
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

  // 5. OpenRouter Gateway
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

  // 6. Moonshot AI / Kimi-K3
  if (provider === 'kimi' || provider === 'moonshot') {
    const apiKey = config.apiKey || process.env.MOONSHOT_API_KEY || process.env.KIMI_API_KEY;
    if (apiKey) {
      const baseURL = config.baseUrl || process.env.MOONSHOT_BASE_URL || 'https://api.moonshot.cn/v1';
      const model = config.model || 'kimi-k3';
      const client = new OpenAI({ baseURL, apiKey });
      try {
        const completion = await client.chat.completions.create({
          model,
          messages: [
            ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
            { role: 'user' as const, content: prompt }
          ],
        });
        return {
          text: completion.choices[0]?.message?.content || '',
          provider: 'moonshot',
          model
        };
      } catch (e: any) {
        console.warn(`[LLM Router] Moonshot/Kimi-K3 error (${e.message}), falling back to Gemini...`);
      }
    }
  }

  // 7. Default Fallback: Gemini AI
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      text: `[SYNAPS AI Engine] Grounded Analysis:\nPrompt processed. (Configure GEMINI_API_KEY or VERCEL_AI_GATEWAY_KEY for live LLM execution)`,
      provider: 'mock-engine',
      model: 'synaps-v1'
    };
  }

  try {
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
  } catch (err: any) {
    return {
      text: `[Causarix AI Router] Analysis fallback: Prompt queued (${err.message || 'Upstream provider offline'})`,
      provider: 'fallback-engine',
      model: config.model || 'causarix-fallback'
    };
  }
}
