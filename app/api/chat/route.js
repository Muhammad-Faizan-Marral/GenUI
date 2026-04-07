import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      messages,
      systemPrompt,
      temperature = 0.7,
      max_tokens = 25000,
      reasoningEnabled = false,
    } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY missing" },
        { status: 500 },
      );
    }

    let finalMessages = [...messages];
    if (systemPrompt) {
      finalMessages.unshift({ role: "system", content: systemPrompt });
    }

    const body = {
      model: "qwen/qwen3.6-plus:free",
      messages: finalMessages,
      max_tokens: Math.min(max_tokens, 20000),
      temperature,
      ...(reasoningEnabled && { reasoning: { enabled: true } }),
    };
    // ✅ Dynamic referer (Vercel + local)
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": origin,
          "X-Title": "Qwen3.6-UI-Generator",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

  if (!response.ok) {
      console.error("OpenRouter Error:", data);
      // Forward exact error + headers for retry logic
      return NextResponse.json(data, { 
        status: response.status,
        headers: { "X-Retry-After": response.headers.get("Retry-After") || "60" }
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
