"use client";
import { Zap, ArrowRight, Code2 } from "lucide-react";

export function FinalCTA() {
  return (
    <section id="get-started" className="py-32 px-5 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />
      </div>
      <div className="max-w-3xl mx-auto text-center relative">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-950/30 text-violet-400 text-xs font-medium">
          Free to start · No credit card required
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight mb-6">
          Stop Designing
          <br />
          <span className="text-zinc-500">From Scratch.</span>
        </h2>
        <p className="text-zinc-400 text-base mb-10 max-w-lg mx-auto">
          Your next UI is one prompt away. Join thousands of developers already
          building faster with genUI.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#"
            className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-xl shadow-violet-900/50 text-sm"
          >
            <Zap size={16} />
            Start Generating UI Now
            <ArrowRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors px-4 py-3.5"
          >
            <Code2 size={15} />
            View API Docs
          </a>
        </div>
      </div>
    </section>
  );
}
