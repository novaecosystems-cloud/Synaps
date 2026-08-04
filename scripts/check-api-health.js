const fs = require('fs');
const path = require('path');

// Load environment variables from .env and .env.local
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx > 0) {
          const key = trimmed.slice(0, idx).trim();
          let value = trimmed.slice(idx + 1).trim();
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    });
  }
}

loadEnvFile(path.join(__dirname, '..', '.env.local'));
loadEnvFile(path.join(__dirname, '..', '.env'));

async function checkGoogleGemini() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey.startsWith('AQ.')) {
    return { provider: 'Google Gemini AI (Google AI Studio)', status: 'INVALID FORMAT ❌', message: 'API key is missing or invalid format (Google AI Studio keys must start with AIzaSy...). Get free key: https://aistudio.google.com/app/apikey' };
  }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Ping test' }] }] })
    });
    const data = await res.json();
    if (res.ok && data.candidates) {
      return { provider: 'Google Gemini AI (gemini-1.5-flash)', status: 'HEALTHY ✅', message: 'API Key active & operational.' };
    } else {
      return { provider: 'Google Gemini AI', status: 'FAILED ❌', message: data.error?.message || JSON.stringify(data) };
    }
  } catch (err) {
    return { provider: 'Google Gemini AI', status: 'FAILED ❌', message: err.message };
  }
}

async function checkGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return { provider: 'Groq AI (Llama 3.3 70B)', status: 'INVALID FORMAT ❌', message: 'Groq keys must start with gsk_. Get free key: https://console.groq.com/keys' };
  }
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'Ping test' }],
        max_tokens: 5
      })
    });
    const data = await res.json();
    if (res.ok && data.choices) {
      return { provider: 'Groq AI (Llama 3.3 70B)', status: 'HEALTHY ✅', message: 'API Key active & operational.' };
    } else {
      return { provider: 'Groq AI', status: 'FAILED ❌', message: data.error?.message || JSON.stringify(data) };
    }
  } catch (err) {
    return { provider: 'Groq AI', status: 'FAILED ❌', message: err.message };
  }
}

async function checkOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder';
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
        messages: [{ role: 'user', content: 'Ping test' }],
        max_tokens: 5
      })
    });
    const data = await res.json();
    if (res.ok && data.choices) {
      return { provider: 'OpenRouter (Unified Free AI Gateway)', status: 'HEALTHY ✅', message: 'Free Tier model response received successfully.' };
    } else {
      return { provider: 'OpenRouter Free AI Gateway', status: 'NOTICE ℹ️', message: process.env.OPENROUTER_API_KEY ? (data.error?.message || JSON.stringify(data)) : 'Add free key from https://openrouter.ai/keys (No Credit Card required)' };
    }
  } catch (err) {
    return { provider: 'OpenRouter Free AI Gateway', status: 'NOTICE ℹ️', message: err.message };
  }
}

async function checkLemonSqueezy() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    return { provider: 'LemonSqueezy Billing API', status: 'SKIPPED', message: 'No API Key set in env (LEMONSQUEEZY_API_KEY)' };
  }
  try {
    const res = await fetch('https://api.lemonsqueezy.com/v1/users/me', {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const data = await res.json();
    if (res.ok && data.data) {
      return { provider: 'LemonSqueezy Billing API', status: 'HEALTHY ✅', message: `Authenticated as ${data.data.attributes?.name || data.data.attributes?.email || 'Store User'}.` };
    } else {
      return { provider: 'LemonSqueezy Billing API', status: 'FAILED ❌', message: data.errors?.[0]?.detail || JSON.stringify(data) };
    }
  } catch (err) {
    return { provider: 'LemonSqueezy Billing API', status: 'FAILED ❌', message: err.message };
  }
}

async function runHealthCheck() {
  console.log('\n======================================================');
  console.log('🔍 SYNAPS API HEALTH & APIVAULT DIRECTORY CHECK');
  console.log('======================================================\n');

  const results = await Promise.all([
    checkGoogleGemini(),
    checkGroq(),
    checkOpenRouter(),
    checkLemonSqueezy()
  ]);

  results.forEach(r => {
    console.log(`[${r.status}] ${r.provider}`);
    console.log(`   Message: ${r.message}\n`);
  });

  console.log('======================================================\n');
}

runHealthCheck();
