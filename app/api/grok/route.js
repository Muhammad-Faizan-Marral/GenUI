import { NextResponse } from "next/server";
import { callOpenRouter } from "../../services/openrouterService";   // ← sahi path use karo

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      messages,
      systemPrompt,
      model,
      temperature = 0.7,
      maxTokens = 10000,
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const result = await callOpenRouter({
      messages,
      systemPrompt,           // user se aaye to use karo, warna default
      model: model || "x-ai/grok-4.1-fast",
      temperature,
      maxTokens,
    });

    return NextResponse.json({
      success: true,
      content: result.content,
    });
  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}