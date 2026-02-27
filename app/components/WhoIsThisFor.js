import { SectionLabel } from "./UI/SectionLabel";

export function WhoIsThisFor() {
  const audience = [
    {
      emoji: "⌨️",
      title: "Frontend Developers",
      desc: "Skip the scaffolding. Prompt your layout, tweak the output, ship faster.",
    },
    {
      emoji: "🚀",
      title: "Startup Founders",
      desc: "Don't wait for a designer. Prototype and iterate your product pages yourself.",
    },
    {
      emoji: "🎨",
      title: "Designers",
      desc: "Bring your design intent to life in code — without learning a new tool.",
    },
    {
      emoji: "🔧",
      title: "Indie Hackers",
      desc: "Launch polished landing pages and dashboards faster than ever.",
    },
  ];

  return (
    <section className="py-24 px-5 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-900/8 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-6xl mx-auto relative">
        <SectionLabel>Who is this for?</SectionLabel>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white tracking-tight">
          Built for builders.
        </h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audience.map((a, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-violet-500/20 hover:bg-violet-950/10 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{a.emoji}</div>
              <h3 className="text-white font-semibold mb-2">{a.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
