"use client";

import { Terminal, Cpu, Download } from "lucide-react";
import { SectionLabel } from "./UI/SectionLabel";

export function HowItWorks() {
  const steps = [
    {
      icon: <Terminal size={20} />,
      step: "01",
      title: "Write a Prompt",
      desc: "Describe what you want in plain English. Be as vague or specific as you like.",
      example: '"Create a dashboard with a stats grid and sidebar nav"',
    },
    {
      icon: <Cpu size={20} />,
      step: "02",
      title: "AI Designs the Layout",
      desc: "Our model interprets intent, picks the right components, and assembles a layout.",
      example: "Responsive grid · Semantic HTML · Accessible markup",
    },
    {
      icon: <Download size={20} />,
      step: "03",
      title: "Export or Customize",
      desc: "Copy the code, tweak props, or keep iterating with follow-up prompts.",
      example: "JSX · Tailwind · Zero dependencies",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-5 relative">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white tracking-tight">
          From idea to component <br className="hidden md:block" />
          <span className="text-zinc-500">in three steps.</span>
        </h2>

        <div className="mt-14 grid md:grid-cols-3 gap-6 relative">
       
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-violet-950 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  {s.icon}
                </div>
                <span className="text-xs font-mono text-zinc-600">
                  {s.step}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {s.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {s.desc}
              </p>
              <div className="text-xs font-mono text-violet-400/70 bg-violet-950/30 border border-violet-500/10 rounded-lg px-3 py-2">
                {s.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
