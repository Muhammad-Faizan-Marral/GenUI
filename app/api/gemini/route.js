import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// API Key ko check karein ke load ho rahi hai ya nahi
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const { prompt, system } = await req.json();

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in environment variables");
    }

    // Stable model use karein
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    });

    // Chat start karein with system instructions
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: system }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will generate only the raw code as a Senior UI/UX Designer." }],
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error("Detailed Gemini Error:", error);
    return NextResponse.json(
      { error: error.message || "Fetch failed or Network issue" }, 
      { status: 500 }
    );
  }
}