// app/api/grok/route.js
import { NextResponse } from "next/server";
import { callOpenRouter } from "../../services/openrouterService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, systemPrompt, model, temperature, maxTokens } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const result = await callOpenRouter({
      messages,
      systemPrompt,
      model: model || "x-ai/grok-4.1-fast",
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 2048,
    });

    return NextResponse.json({
      success: true,
      content: result.content,
      modelUsed: result.modelUsed,
      fullResponse: result.fullResponse,   // debugging ke liye (production mein hata sakte ho)
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}