// services/grokService.js
const GROK_API_URL = 'https://api.x.ai/v1/responses';

export const DEFAULT_SYSTEM_PROMPT = `You are Grok, a helpful, truthful, and maximally truth-seeking AI built by xAI. Answer in a fun and witty way when possible.`;

export async function callGrok({
  messages,                    // array of { role: "user"|"assistant", content: "..." }
  systemPrompt = DEFAULT_SYSTEM_PROMPT,
  model = "grok-4.20-reasoning",   // latest model (tum badal sakte ho)
  temperature = 0.7,
  maxTokens = 2048,
}) {
  // System prompt ko messages ke start mein add karo
  let inputMessages = [...messages];

  const hasSystemMessage = inputMessages.some((msg) => msg.role === "system");
  if (!hasSystemMessage && systemPrompt) {
    inputMessages.unshift({ role: "system", content: systemPrompt });
  }

  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      input: inputMessages,
      temperature: temperature,
      max_output_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Grok API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    content: data.output_text,     // yeh final answer hai
    fullResponse: data,            // debugging ke liye
  };
}