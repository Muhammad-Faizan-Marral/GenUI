"use client";

import { useState } from "react";
import { Wand2, Copy, Check, RotateCcw, Code2, Star } from "lucide-react";

export function ResultCard({ projectViewUrl, output, prompt, onReset }) {
  const [copied, setCopied] = useState(false);
  const [starred, setStarred] = useState(false);

  const link = projectViewUrl;
  const currentOrigin = window.location.origin;
  console.log(currentOrigin);
  const handleCopy = async () => {
    const fullUrl = `${currentOrigin}/${link.replace(/^\//, "")}`;
    await navigator.clipboard.writeText(fullUrl);
    console.log("Link copied to clipboard:", fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* ── Success badge ── */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 border border-emerald-500/25 flex items-center justify-center shadow-xl shadow-emerald-900/20">
            <Check size={26} className="text-emerald-400" strokeWidth={2.5} />
          </div>
          <div
            className="absolute inset-0 rounded-2xl border border-emerald-500/20 animate-ping"
            style={{ animationDuration: "2.5s" }}
          />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-medium">
            Generated
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
          Your UI is ready
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          <span className="text-violet-400 font-medium">{output.label}</span>{" "}
          has been crafted and is live.
        </p>
      </div>

      {/* ── Link box ── */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 mb-3 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 font-semibold">
            Preview Link
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-500/70">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/[0.06] rounded-xl px-4 py-3 font-mono text-xs overflow-hidden">
            <span className="text-zinc-700 shrink-0">
              {window.location.origin}
            </span>
            <span className="text-violet-400 truncate">{link}</span>
          </div>

          <button
            onClick={handleCopy}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-zinc-500 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200"
            title="Copy link"
          >
            {copied ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>

      {/* ── Star button ── */}
      <button
        onClick={() => window.open(link, "_blank")}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl 
             border border-blue-500/30 bg-blue-500/10 
             text-blue-400 hover:bg-blue-500/20 
             hover:border-blue-500/50 transition-all duration-200 
             text-sm font-medium mb-6"
      >
        <Star size={14} className="fill-blue-400" />
        Preview Project
      </button>
      {/* ── Meta tags ── */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[
          { icon: <Code2 size={10} />, text: "JSX + Tailwind" },
          { icon: <span className="text-[10px]">📱</span>, text: "Responsive" },
          { icon: <span className="text-[10px]">⚡</span>, text: "Zero deps" },
        ].map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 text-[11px] text-zinc-700 bg-white/[0.02] border border-white/[0.05] rounded-lg px-2.5 py-1"
          >
            {tag.icon} {tag.text}
          </span>
        ))}
      </div>

      {/* ── Prompt recap ── */}
      <div className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3.5 mb-4">
        <Wand2 size={12} className="text-violet-400 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-600 leading-relaxed">
          <span className="text-zinc-500 font-medium">Prompt: </span>
          {prompt}
        </p>
      </div>

      {/* ── Reset ── */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 text-xs text-zinc-600 hover:text-violet-400 transition-colors py-2"
      >
        <RotateCcw size={11} />
        Generate another UI
      </button>
    </div>
  );
}
