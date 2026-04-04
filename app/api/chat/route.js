import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages, reasoningEnabled = false } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY missing in .env" }, { status: 500 });
    }

    const body = {
      model: "qwen/qwen3.6-plus:free",
      messages: messages,
      max_tokens: 20000,         
      temperature: 0.7,            
      ...(reasoningEnabled && {
        reasoning: { enabled: true }
      })
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Optional — leaderboard pe app dikhane ke liye
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Qwen3.6-NextJS-Chat",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}