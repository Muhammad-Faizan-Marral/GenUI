// app/api/chat/route.js
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { message, system } = await req.json();

    console.log("Received message:", message); // debug

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "";
    console.log("Groq reply:", reply); // debug

    return Response.json({ reply });

  } catch (error) {
    console.error("Route error:", error.message); // exact error server terminal mein
    return Response.json({ error: error.message }, { status: 500 });
  }
}