"use client";
import React, { useState } from "react";

async function sendToGrok(userMessage) {
  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: userMessage }],
      systemPrompt: "You are a helpful assistant.",
      model: "x-ai/grok-4.1-fast",
      temperature: 0.75,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server Error: ${response.status}`);
  }

  return await response.json();
}

const Page = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
        
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await sendToGrok(text);
      console.log(data)
      setResult(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
    console.log(result)
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <div className="max-w-2xl mx-auto">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Apna prompt yahan likho..."
          className="w-full h-40 bg-gray-900 border border-gray-700 rounded-2xl p-5"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="mt-4 w-full bg-blue-600 py-4 rounded-2xl text-lg disabled:bg-gray-700"
        >
          {loading ? "Grok soch raha hai..." : "Send to Grok"}
        </button>

        <div className="mt-8 bg-red-900 p-6 rounded-3xl border border-gray-700 ">
          {error && <p className="text-red-500">❌ {error}</p>}
          {result && <div className="whitespace-pre-wrap">{result.content}</div>}
          {!result && !error && <p className="text-gray-500">Response yahan aayega...</p>}
        </div>
      </div>
    </div>
  );
};

export default Page;