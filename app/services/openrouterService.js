// ====================== openrouterService.js ======================

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const DEFAULT_SYSTEM_PROMPT = `You are Grok, built by xAI. 
Be helpful, truthful, and witty. You are an expert at generating high-quality JSON for UI generation.`;

export async function callOpenRouter({
  messages,
  systemPrompt = DEFAULT_SYSTEM_PROMPT,   // ← Ab yeh sahi se defined hai
  model = "x-ai/grok-4.1-fast",
  temperature = 0.7,
  maxTokens = 10000,
}) {
  if (!process.env.NEXT_OPENROUTER_API_KEY) {
    throw new Error("NEXT_OPENROUTER_API_KEY is not set in .env.local");
  }

  let inputMessages = [...messages];

  if (systemPrompt) {
    inputMessages.unshift({ role: "system", content: systemPrompt });
  }

  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-OpenRouter-Title": "Skillifiy Grok App",
    },
    body: JSON.stringify({
      model,
      messages: inputMessages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Open-Router-Service ERROR:", res.status, errText);
    throw new Error(`OpenRouter Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No response content from Grok");
  }

  return { content, fullResponse: data };
}