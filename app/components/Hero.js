"use client";

import { Zap,ChevronRight } from "lucide-react";
import Link from "next/link";
import { PromptIllustration } from "./PromptIllustration";

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 left-1/4 w-[300px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Badge */}
      <div className="mb-6 flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 text-[12px] text-zinc-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Now in public beta — AI-powered UI generation
      </div>

      {/* Headline */}
      <h1 className="text-center max-w-3xl font-bold leading-[1.08] tracking-tighter">
        <span className="block text-4xl md:text-6xl lg:text-7xl text-white">
          Generate Beautiful UI
        </span>
        <span className="block text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          From Simple Prompts
        </span>
      </h1>

      <p className="mt-6 text-center text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
        Describe your UI in words. Get clean, responsive components instantly.
        No Figma. No boilerplate. Just ship.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="generate"
          className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/40 text-sm"
        >
          <Zap size={15} />
          Generate UI
          <ChevronRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
        <a
          href="#examples"
          className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-zinc-300 font-medium px-6 py-3 rounded-xl transition-all duration-200 text-sm"
        >
          View Examples
        </a>
      </div>

      {/* Prompt illustration */}
      <div className="mt-16 w-full max-w-2xl">
        <PromptIllustration />
      </div>
    </section>
  );
}
