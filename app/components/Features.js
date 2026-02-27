"use client";

import { Zap, Layers, Smartphone, Edit3, Package, Wind } from "lucide-react";
import { SectionLabel } from "./UI/SectionLabel";

export function Features() {
  const features = [
    {
      icon: <Zap size={18} />,
      title: "Prompt → UI Generation",
      desc: "Natural language directly to production-ready component code. No drag-and-drop required.",
    },
    {
      icon: <Package size={18} />,
      title: "Reusable Component System",
      desc: "Every output follows your design system tokens. Components compose, not collide.",
    },
    {
      icon: <Wind size={18} />,
      title: "Tailwind & Modern CSS",
      desc: "Output uses utility-first classes out of the box. Drop it straight into your project.",
    },
    {
      icon: <Smartphone size={18} />,
      title: "Mobile Responsive by Default",
      desc: "Every component is built mobile-first. Responsive at every breakpoint, always.",
    },
    {
      icon: <Edit3 size={18} />,
      title: "Editable & Extendable",
      desc: "Generated layouts are clean, readable, and built to be extended — not black boxes.",
    },
    {
      icon: <Layers size={18} />,
      title: "Composable Layouts",
      desc: "Mix and match sections. Header + Hero + CTA in one prompt, exported as one file.",
    },
  ];

  return (
    <section id="components" className="py-24 px-5 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-6xl mx-auto relative">
        <SectionLabel>Features</SectionLabel>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white tracking-tight">
          Everything you need to ship UI fast.
        </h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-violet-500/25 hover:bg-violet-950/10 transition-all duration-300 cursor-default"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-950 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform duration-200">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2 text-[15px]">
                {f.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
