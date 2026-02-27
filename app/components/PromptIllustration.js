"use client";

import { useState, useEffect } from "react";
import { Terminal, Cpu } from "lucide-react";

export function PromptIllustration() {
  const [typed, setTyped] = useState("");
  const full = "Build a SaaS pricing section with 3 tiers and a toggle...";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= full.length) {
        setTyped(full.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-[#0d0d10] overflow-hidden shadow-2xl shadow-black/60">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        <span className="ml-2 text-xs text-zinc-600 font-mono">
          genUI prompt
        </span>
      </div>

      {/* Prompt area */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex gap-2">
          <Terminal size={14} className="text-violet-400 mt-0.5 shrink-0" />
          <p className="text-sm font-mono text-zinc-300 min-h-[20px]">
            {typed}
            <span className="animate-pulse text-violet-400">|</span>
          </p>
        </div>
      </div>

      {/* Output preview */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={12} className="text-violet-400" />
          <span className="text-xs text-zinc-500">Generating components…</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["Starter", "Pro", "Enterprise"].map((t, i) => (
            <div
              key={t}
              className={`rounded-xl p-4 border ${
                i === 1
                  ? "border-violet-500/40 bg-violet-950/30"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              <div
                className={`text-xs font-semibold mb-2 ${
                  i === 1 ? "text-violet-400" : "text-zinc-400"
                }`}
              >
                {t}
              </div>
              <div className="h-2 w-10 rounded bg-white/10 mb-3" />
              <div className="space-y-1">
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="h-1.5 rounded bg-white/[0.06] w-full"
                  />
                ))}
              </div>
              <div
                className={`mt-4 h-7 rounded-lg text-xs flex items-center justify-center ${
                  i === 1
                    ? "bg-violet-600/50 text-violet-200"
                    : "bg-white/[0.05] text-zinc-500"
                }`}
              >
                {i === 1 ? "Get started" : "Choose plan"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
