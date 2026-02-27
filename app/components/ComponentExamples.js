"use client";
import { Zap, LayoutDashboard, CreditCard, MonitorPlay } from "lucide-react";
import { SectionLabel } from "./UI/SectionLabel";

export function ComponentExamples() {
  const previews = [
    {
      icon: <MonitorPlay size={16} />,
      label: "Header",
      color: "from-violet-600/20 to-indigo-600/10",
      preview: (
        <div className="flex items-center justify-between px-4 py-3 bg-black/40 rounded-xl border border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-violet-500/50" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-1.5 w-8 rounded bg-white/10" />
              ))}
            </div>
          </div>
          <div className="h-6 w-16 rounded-full bg-violet-600/40" />
        </div>
      ),
    },
    {
      icon: <Zap size={16} />,
      label: "Hero Section",
      color: "from-indigo-600/20 to-violet-600/10",
      preview: (
        <div className="px-4 py-3 flex flex-col items-center gap-2 text-center">
          <div className="h-2 w-32 rounded bg-white/20 mb-1" />
          <div className="h-1.5 w-48 rounded bg-white/10" />
          <div className="h-1.5 w-40 rounded bg-white/10" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-16 rounded-lg bg-violet-600/50" />
            <div className="h-6 w-16 rounded-lg bg-white/[0.05] border border-white/[0.06]" />
          </div>
        </div>
      ),
    },
    {
      icon: <CreditCard size={16} />,
      label: "Pricing Section",
      color: "from-cyan-600/15 to-indigo-600/10",
      preview: (
        <div className="grid grid-cols-3 gap-2 px-3 py-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-lg p-2 border ${
                i === 1
                  ? "border-violet-500/40 bg-violet-950/40"
                  : "border-white/[0.05] bg-black/20"
              }`}
            >
              <div className="h-1.5 w-full rounded bg-white/15 mb-1" />
              <div className="h-1 w-3/4 rounded bg-white/8 mb-2" />
              <div className="h-4 w-full rounded bg-white/10" />
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <LayoutDashboard size={16} />,
      label: "Dashboard Layout",
      color: "from-violet-600/15 to-cyan-600/10",
      preview: (
        <div className="flex gap-2 px-3 py-2 h-[80px]">
          <div className="w-10 shrink-0 rounded-lg bg-black/40 border border-white/[0.05] flex flex-col gap-1 py-2 px-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-2 w-full rounded bg-white/10" />
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-7 rounded-lg bg-black/40 border border-white/[0.05]"
                />
              ))}
            </div>
            <div className="flex-1 rounded-lg bg-black/40 border border-white/[0.05]" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="examples" className="py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Component Library</SectionLabel>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white tracking-tight">
          What can you generate?
        </h2>
        <p className="mt-4 text-zinc-400 text-sm max-w-lg">
          Describe any section and get an instant preview. These are just a few
          of the components genUI can produce.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previews.map((p, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-white/[0.07] bg-gradient-to-br ${p.color} overflow-hidden group hover:border-violet-500/30 transition-all duration-300`}
            >
              <div className="px-4 pt-4 pb-2 border-b border-white/[0.05]">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-0.5">
                  {p.icon}
                  <span className="font-medium">{p.label}</span>
                </div>
              </div>
              <div className="py-3">{p.preview}</div>
              <div className="px-4 pb-4">
                <button className="w-full text-[11px] font-medium text-violet-400 hover:text-violet-300 border border-violet-500/20 hover:border-violet-500/40 rounded-lg py-1.5 transition-all">
                  Generate this →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
