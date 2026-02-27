"use client";

import { useState } from "react";
import Script from "next/script"; // Next.js Script component import karein

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPuterReady, setIsPuterReady] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;

    // Check karein window object aur puter availability
    if (typeof window === "undefined" || !window.puter) {
      setResponse("Puter library abhi tak load nahi hui. Please wait...");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      // Puter.js AI Chat call
      const res = await window.puter.ai.chat(prompt, { 
        model: "gpt-5-nano" 
      });
      
      setResponse(res?.toString() || "AI ne koi jawab nahi diya.");
    } catch (error) {
      console.error("Puter Error:", error);
      setResponse("Error: AI se connect nahi ho pa raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 text-black">
      {/* Puter Script load karne ka sahi tareeka */}
      <Script 
        src="https://js.puter.com/v2/" 
        onLoad={() => {
          console.log("Puter loaded successfully!");
          setIsPuterReady(true);
        }}
      />

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
          Free AI Assistant 
          {isPuterReady ? 
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Online</span> : 
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Loading...</span>
          }
        </h2>
        
        <input
          type="text"
          placeholder="Yahan apna sawal likhein..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !isPuterReady}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Response"}
        </button>

        <textarea
          value={response}
          readOnly
          placeholder="AI response will appear here..."
          className="w-full h-60 border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none bg-gray-50 font-mono text-sm"
        />
      </div>
    </div>
  );
}










