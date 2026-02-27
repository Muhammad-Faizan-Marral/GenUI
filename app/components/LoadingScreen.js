"use client";
import { Cpu } from "lucide-react";
import { useState } from "react";

// ─── Loading animation ────────────────────────────────────────────────────────
export function LoadingScreen({ step }) {
  const [loadingStep, setLoadingStep] = useState(0);
  // ─── Loading steps shown during generation ────────────────────────────────────
  const LOADING_STEPS = [
    { text: "Parsing your prompt…", icon: "📝" },
    { text: "Selecting components…", icon: "🧩" },
    { text: "Designing layout…", icon: "🎨" },
    { text: "Writing Tailwind classes…", icon: "💅" },
    { text: "Finalizing code…", icon: "✨" },
  ];
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 py-20">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-violet-600/20 animate-ping"
          style={{ animationDuration: "1.5s" }}
        />
        <div
          className="absolute inset-3 rounded-full bg-violet-600/25 animate-ping"
          style={{ animationDuration: "1.5s", animationDelay: "0.3s" }}
        />
        <div
          className="absolute inset-6 rounded-full bg-violet-600/30 animate-ping"
          style={{ animationDuration: "1.5s", animationDelay: "0.6s" }}
        />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-900/60">
          <Cpu size={24} className="text-white" />
        </div>
      </div>

      <div className="space-y-3 text-center">
        {LOADING_STEPS.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-500 ${
              i === step
                ? "bg-violet-950/40 border border-violet-500/25 text-violet-300"
                : i < step
                  ? "text-emerald-500/70"
                  : "text-zinc-700"
            }`}
          >
            <span className="text-base">{i < step ? "✓" : s.icon}</span>
            <span
              className={`text-sm font-medium ${i === step ? "" : i < step ? "line-through" : ""}`}
            >
              {s.text}
            </span>
            {i === step && (
              <div className="flex gap-1 ml-1">
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-700">Usually takes 2–4 seconds</p>
    </div>
  );
}
