"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  Layers,
  Smartphone,
  Edit3,
  Package,
  Wind,
  ArrowRight,
  Terminal,
  Cpu,
  Download,
  Code2,
  Github,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  CreditCard,
  MonitorPlay,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["How it Works", "Examples", "Components", "Docs"];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold tracking-tight text-[15px]">
            gen<span className="text-violet-400">UI</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className="text-[13px] text-zinc-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/[0.06] transition-all"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#get-started"
            className="text-[13px] font-medium bg-white text-black px-4 py-1.5 rounded-full hover:bg-violet-100 transition-all duration-200"
          >
            Start Generating UI
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/95 border-b border-white/[0.06] px-5 pb-5 pt-2 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setOpen(false)}
              className="text-sm text-zinc-300 py-1"
            >
              {l}
            </a>
          ))}
          <a
            href="#get-started"
            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full text-center mt-1"
            onClick={() => setOpen(false)}
          >
            Start Generating UI
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
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

function PromptIllustration() {
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

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
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
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-[calc(33.33%+24px)] right-[calc(33.33%+24px)] h-px bg-gradient-to-r from-violet-600/40 to-violet-600/40" />

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

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
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

// ─── Component Examples ───────────────────────────────────────────────────────
function ComponentExamples() {
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

// ─── Who Is This For ──────────────────────────────────────────────────────────
function WhoIsThisFor() {
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

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
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

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles size={11} className="text-white" />
          </div>
          <span className="text-zinc-400 text-sm font-medium">
            gen<span className="text-violet-400">UI</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          {["Docs", "GitHub", "Privacy", "Terms"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              {link === "GitHub" && <Github size={12} />}
              {link}
            </a>
          ))}
        </div>

        <p className="text-xs text-zinc-700">
          © {new Date().getFullYear()} genUI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-violet-400">
      <span className="w-3 h-px bg-violet-500" />
      {children}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GenerativeUILanding() {
  return (
    <div className="bg-[#080809] text-white min-h-screen antialiased">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <ComponentExamples />
        <WhoIsThisFor />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
