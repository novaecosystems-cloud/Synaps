import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { inspectPrompt, inspectResponse } from '@/lib/ai-firewall';
import { validateSafeUrl } from '@/lib/security';

export type LLMProvider = 'k2-horizon' | 'gemini' | 'openai' | 'anthropic' | 'openrouter' | 'vercel-gateway' | 'ollama' | 'lmstudio' | 'kimi' | 'moonshot';

export interface LLMConfig {
  provider?: LLMProvider | 'auto';
  apiKey?: string;
  model?: string;
  baseUrl?: string; // e.g. http://localhost:11434 for Ollama or Vercel AI Gateway endpoint
  temperature?: number;
  max_tokens?: number;
}

/**
 * Detects if a prompt/systemPrompt targets K2-Horizon based on strategic governance ontology:
 * - Long-horizon strategy / trajectory modeling
 * - Delaware DGCL § 141 / safe-harbor / business judgment rule
 * - MoVA boardroom consensus / arbitration
 * - Fiduciary duties / director liability / safe-harbor
 */
export function isK2HorizonStrategicTask(prompt: string, systemPrompt: string = ''): boolean {
  if (typeof prompt !== 'string') return false;
  const combined = `${prompt} ${typeof systemPrompt === 'string' ? systemPrompt : ''}`.toLowerCase();

  const strategicKeywords = [
    'dgcl',
    'dgcl § 141',
    'dgcl 141',
    '§ 141(e)',
    '141(e)',
    'mova',
    'mixture-of-value attention',
    'mixture of value attention',
    'boardroom consensus',
    'boardroom arbitration',
    'fiduciary safe harbor',
    'statutory safe harbor',
    'business judgment rule',
    'director liability',
    'fiduciary mandate',
    'long-horizon',
    'long horizon',
    'trajectory modeling',
    'multi-year horizon',
    'horizon decomposition',
    '36 months',
    '48 months',
    '60 months',
    '120 months',
    'insolvency pruning',
    'merkle defense',
    'k2-horizon',
    'k2_horizon',
  ];

  return strategicKeywords.some((keyword) => combined.includes(keyword));
}

export interface K2HorizonStatusResult {
  available: boolean;
  isOnline: boolean;
  endpoint: string;
  model: string;
  modelName: string;
  engine?: string;
  architecture?: string;
  error?: string;
  latencyMs?: number;
}

/**
 * Checks live health status of Causarix K2-Horizon inference server.
 */
export async function checkK2HorizonStatus(customUrl?: string): Promise<K2HorizonStatusResult> {
  const K2_URL = customUrl || process.env.K2_HORIZON_API_URL || process.env.K2_HORIZON_BASE_URL || 'http://127.0.0.1:8082';
  const urlCheck = validateSafeUrl(K2_URL, { allowLocalhost: true });
  if (!urlCheck.valid) {
    return {
      available: false,
      isOnline: false,
      endpoint: K2_URL,
      model: 'causarix-global-k2-horizon',
      modelName: 'causarix-global-k2-horizon (Blocked SSRF)',
      architecture: 'IFM/k2-horizon-0.9b + Quad-Core LoRA',
      error: `SSRF blocked: ${urlCheck.error}`,
    };
  }

  const start = Date.now();
  const safeBase = (urlCheck.cleanUrl || K2_URL).replace(/\/$/, '');
  const rootBase = safeBase.replace(/\/v1$/, '');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);

  try {
    const res = await fetch(`${rootBase}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    const latencyMs = Date.now() - start;
    if (res.ok) {
      let data: any = {};
      try {
        data = await res.json();
      } catch {}
      return {
        available: true,
        isOnline: true,
        endpoint: K2_URL,
        model: data.model || 'causarix-global-k2-horizon',
        modelName: data.model || 'causarix-global-k2-horizon',
        engine: data.engine || 'live',
        architecture: 'IFM/k2-horizon-0.9b + Quad-Core LoRA',
        latencyMs,
      };
    }
    return {
      available: false,
      isOnline: false,
      endpoint: K2_URL,
      model: 'causarix-global-k2-horizon',
      modelName: 'causarix-global-k2-horizon (HTTP Error)',
      architecture: 'IFM/k2-horizon-0.9b + Quad-Core LoRA',
      error: `K2-Horizon responded with HTTP ${res.status}`,
      latencyMs,
    };
  } catch (err: any) {
    clearTimeout(timeout);
    return {
      available: false,
      isOnline: false,
      endpoint: K2_URL,
      model: 'causarix-global-k2-horizon',
      modelName: 'causarix-global-k2-horizon (Offline)',
      architecture: 'IFM/k2-horizon-0.9b + Quad-Core LoRA',
      error: err.message || 'Connection failed',
    };
  }
}

export async function generateMultiLLMResponse(
  prompt: string,
  config: LLMConfig = { provider: 'gemini' },
  systemPrompt?: string
): Promise<{ text: string; provider: string; model: string }> {
  const sanitizedPrompt = inspectPrompt(prompt).sanitizedPrompt;
  const result = await generateMultiLLMResponseRaw(sanitizedPrompt, config, systemPrompt);
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
  let provider = config.provider || 'gemini';

  // Auto-routing: detect strategic governance / DGCL § 141 / MoVA
  if (provider === 'auto' || !config.provider) {
    if (isK2HorizonStrategicTask(prompt, systemPrompt)) {
      provider = 'k2-horizon';
    } else {
      provider = 'gemini';
    }
  }

  // 0. Causarix K2-Horizon Sovereign Strategy & MoVA Engine
  if (provider === 'k2-horizon') {
    const rawBaseUrl = config.baseUrl || process.env.K2_HORIZON_API_URL || process.env.K2_HORIZON_BASE_URL || 'http://127.0.0.1:8082/v1';
    const model = config.model || process.env.K2_HORIZON_MODEL || 'causarix-global-k2-horizon';
    const urlCheck = validateSafeUrl(rawBaseUrl, { allowLocalhost: true });

    if (!urlCheck.valid) {
      console.warn(`[LLM Router] K2-Horizon base URL blocked (SSRF): ${urlCheck.error}`);
    } else {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const safeBase = (urlCheck.cleanUrl || rawBaseUrl).replace(/\/$/, '');
        const completionsUrl = safeBase.endsWith('/v1')
          ? `${safeBase}/chat/completions`
          : `${safeBase}/v1/chat/completions`;

        const res = await fetch(completionsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey || process.env.K2_HORIZON_API_KEY || 'k2-horizon-local'}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
              { role: 'user', content: prompt }
            ],
            temperature: config.temperature ?? 0.2,
            max_tokens: config.max_tokens ?? 2048,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`K2-Horizon returned HTTP ${res.status}`);
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return { text: content, provider: 'k2-horizon', model };
        }
        throw new Error('Empty response from K2-Horizon endpoint');
      } catch (e: any) {
        clearTimeout(timeout);
        console.warn(`[LLM Router] K2-Horizon endpoint error (${e.message}), falling back to failover chain...`);
      }
    }
  }

  // 1. Vercel AI Gateway (GLM-5.2 Free Promo through Aug 27 via Blackbox)
  if (provider === 'vercel-gateway') {
    const apiKey = config.apiKey || process.env.VERCEL_AI_GATEWAY_KEY || process.env.BLACKBOX_API_KEY;
    const model = config.model || 'blackbox/glm-5.2'; // 1M Token Context Window
    const gatewayUrl = config.baseUrl || 'https://ai-gateway.vercel.app/v1/chat/completions';
    const urlCheck = validateSafeUrl(gatewayUrl, { allowLocalhost: false });
    
    if (!urlCheck.valid) {
      console.warn(`[LLM Router] Vercel AI Gateway URL blocked (SSRF): ${urlCheck.error}`);
    } else {
      try {
        const res = await fetch(urlCheck.cleanUrl || gatewayUrl, {
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
  }

  // 2. Ollama Local LLM
  if (provider === 'ollama') {
    const baseUrl = config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = config.model || 'llama3';
    const urlCheck = validateSafeUrl(baseUrl, { allowLocalhost: true });

    if (!urlCheck.valid) {
      console.warn(`[LLM Router] Ollama base URL blocked (SSRF): ${urlCheck.error}`);
    } else {
      try {
        const safeBase = (urlCheck.cleanUrl || baseUrl).replace(/\/$/, '');
        const res = await fetch(`${safeBase}/api/generate`, {
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
  }

  // 3. LM Studio Local LLM
  if (provider === 'lmstudio') {
    const baseUrl = config.baseUrl || process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1';
    const model = config.model || 'local-model';
    const urlCheck = validateSafeUrl(baseUrl, { allowLocalhost: true });

    if (!urlCheck.valid) {
      console.warn(`[LLM Router] LM Studio base URL blocked (SSRF): ${urlCheck.error}`);
    } else {
      try {
        const safeBase = (urlCheck.cleanUrl || baseUrl).replace(/\/$/, '');
        const res = await fetch(`${safeBase}/chat/completions`, {
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
      const urlCheck = validateSafeUrl(baseURL, { allowLocalhost: false });
      if (!urlCheck.valid) {
        console.warn(`[LLM Router] Moonshot base URL blocked (SSRF): ${urlCheck.error}`);
      } else {
        const model = config.model || 'kimi-k3';
        const client = new OpenAI({ baseURL: urlCheck.cleanUrl || baseURL, apiKey });
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
