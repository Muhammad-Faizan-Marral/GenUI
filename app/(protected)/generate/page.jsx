"use client";

import { useState, useEffect, useRef } from "react";
import {Sparkles,Wand2,Copy,Check,RotateCcw,ChevronRight,Cpu,Code2,Star,Zap,ArrowRight,Layers,MousePointer2,Box,User} from "lucide-react";
import Link from "next/link";
import { generateUI, getUserId, uiLayout } from "../../services/uiService";
import { createProject, slugValue } from "../../services/projectService";
import { useProfile } from "../../hooks/useProfile";
import { LoadingScreen } from "../../components/LoadingScreen";
import { ResultCard } from "../../components/ResultCard";

// ─── Loading steps shown during generation ────────────────────────────────────
const LOADING_STEPS = [
  { text: "Parsing your prompt…", icon: "📝" },
  { text: "Selecting components…", icon: "🧩" },
  { text: "Designing layout…", icon: "🎨" },
  { text: "Writing Tailwind classes…", icon: "💅" },
  { text: "Finalizing code…", icon: "✨" },
];

// ─── Example prompts ──────────────────────────────────────────────────────────
const EXAMPLES = [
  "A developer portfolio landing page with hero, skills section, and project cards",
  "A SaaS pricing page with 3 plans, feature list, and monthly/yearly toggle",
  "A restaurant website with hero banner, menu grid, and reservation section",
  "A dashboard UI with sidebar navigation, stats cards, and recent activity table",
];
// ─── Output metadata ──────────────────────────────────────────────────────────
const OUTPUTS = {
  pricing: { label: "Pricing Page", previewId: "pricing-ui-x7k2m" },
  hero: { label: "Hero Section", previewId: "hero-ui-a3p9q" },
  dashboard: { label: "Dashboard Layout", previewId: "dashboard-ui-b5r1n" },
  login: { label: "Login Form", previewId: "login-ui-c8s4w" },
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PromptPage() {
  const [phase, setPhase] = useState("prompt");
  const [prompt, setPrompt] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [output, setOutput] = useState(null);
  const textareaRef = useRef(null);
  const [projectViewUrl, setProjectViewUrl] = useState();
  const { profile } = useProfile();

  const detectOutput = (p) => {
    const lc = p.toLowerCase();
    if (lc.includes("pric") || lc.includes("plan")) return OUTPUTS.pricing;
    if (lc.includes("hero") || lc.includes("landing") || lc.includes("cta"))
      return OUTPUTS.hero;
    if (lc.includes("dash") || lc.includes("sidebar") || lc.includes("stat"))
      return OUTPUTS.dashboard;
    return OUTPUTS.login;
  };

 const handleGenerate = async () => {
  if (!prompt.trim()) return;

  setPhase("loading");
  setLoadingStep(0);

  // Loading animation steps
  const stepInterval = setInterval(() => {
    setLoadingStep((prev) => {
      if (prev >= LOADING_STEPS.length - 1) {
        clearInterval(stepInterval);
        return prev;
      }
      return prev + 1;
    });
  }, 700);

  try {
    const userId = await getUserId();
    const aiResponse = await generateUI(prompt);

    if (!aiResponse) {
      throw new Error("AI returned an empty response");
    }

    const projectData = {
      projectTitle: prompt.substring(0, 50) || "New Project",
      html_design: aiResponse,
    };

    const savedProject = await createProject(
      userId,
      profile.username,
      projectData
    );

    setProjectViewUrl(`/p/${savedProject.slug}`);
    setOutput(detectOutput(prompt));

    clearInterval(stepInterval);
    await new Promise((r) => setTimeout(r, 400));
    setPhase("done");

  } catch (error) {
    console.error("Error:", error.message);
    clearInterval(stepInterval);
    alert("Failed to generate UI: " + error.message);
    setPhase("prompt"); // Error pe wapas prompt par le jao
  }
};

  const handleReset = () => {
    setPhase("prompt");
    setPrompt("");
    setOutput(null);
    setLoadingStep(0);
  };

  return (
    <div className="min-h-screen bg-[#080809] text-white antialiased flex flex-col">
      {/* ── Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main violet glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-700/10 rounded-full blur-[160px]" />
        {/* Secondary blue hint */}
        <div className="absolute bottom-[-5%] right-[-10%] w-[500px] h-[500px] bg-indigo-800/8 rounded-full blur-[120px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Top edge shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </div>

      {/* ── Navbar ── */}
      <header className="relative border-b border-white/[0.05] h-14 flex items-center justify-between px-6 bg-[#080809]/70 backdrop-blur-xl shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-900/50">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">
            gen<span className="text-violet-400">UI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {phase === "done" && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 rounded-lg transition-all"
            >
              <RotateCcw size={12} /> New prompt
            </button>
          )}
          <Link href="profile">
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "linear-gradient(135deg, #6b21a8, #a855f7)",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                fontFamily: "'Segoe UI', sans-serif",
                boxShadow: "0 4px 16px rgba(168,85,247,0.45)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(168,85,247,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(168,85,247,0.45)";
              }}
            >
              <User size={18} />
              Profile
            </button>
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative flex-1 flex flex-col">
        {/* ══ PROMPT PHASE ══ */}
        {phase === "prompt" && (
          <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">
            {/* ── Hero copy ── */}
            <div className="text-center mb-12 max-w-2xl">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-500/20 rounded-full px-4 py-1.5 text-[11px] text-violet-400/80 mb-7 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                AI-powered UI generation · Now in beta
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
                <span className="text-white">Describe it.</span>
                <br />
                <span
                  className="bg-gradient-to-br from-violet-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  We build it.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-zinc-500 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                Type a UI idea in plain English — get clean, production-ready
                React + Tailwind code in seconds.
              </p>

              {/* Stats row */}
              <div className="flex items-center justify-center gap-6 mt-8 mb-0">
                {[
                  { value: "12k+", label: "UIs generated" },
                  { value: "< 5s", label: "Generation time" },
                  { value: "100%", label: "Tailwind native" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-[11px] text-zinc-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Prompt box ── */}
            <div className="w-full max-w-2xl mb-5">
              <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] focus-within:border-violet-500/40 focus-within:bg-white/[0.04] transition-all duration-300 overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-sm">
                {/* Top glow on focus */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/0 to-transparent group-focus-within:via-violet-500/50 transition-all" />

                <textarea
                  ref={textareaRef}
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                      handleGenerate();
                  }}
                  placeholder="e.g. A pricing page with 3 plans and a yearly/monthly toggle..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-zinc-700 p-6 pb-4 outline-none resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.05] bg-black/20">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] text-zinc-700">
                      ⌘ + Enter to generate
                    </span>
                    {prompt.length > 0 && (
                      <span className="text-[11px] text-zinc-700">
                        {prompt.length} chars
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-25 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/50"
                  >
                    <Sparkles size={13} />
                    Generate UI
                    <ChevronRight
                      size={13}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Example prompts ── */}
            <div className="w-full max-w-2xl">
              <p className="text-[10px] text-zinc-700 mb-3 text-center uppercase tracking-[0.2em]">
                Try an example
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex)}
                    className="group text-left text-xs text-zinc-600 hover:text-zinc-200 border border-white/[0.05] hover:border-violet-500/20 bg-white/[0.015] hover:bg-white/[0.04] rounded-xl px-4 py-3.5 transition-all duration-200 leading-relaxed flex items-start gap-2.5"
                  >
                    <ArrowRight
                      size={11}
                      className="text-zinc-700 group-hover:text-violet-500 mt-0.5 shrink-0 transition-colors"
                    />
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Feature pills ── */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
              {[
                { icon: <Box size={11} />, text: "50+ components" },
                { icon: <Layers size={11} />, text: "Multi-section layouts" },
                {
                  icon: <MousePointer2 size={11} />,
                  text: "Interactive states",
                },
                { icon: <Zap size={11} />, text: "Instant results" },
              ].map((pill, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-[11px] text-zinc-600 border border-white/[0.05] rounded-full px-3.5 py-1.5"
                >
                  <span className="text-zinc-500">{pill.icon}</span>
                  {pill.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ LOADING PHASE ══ */}
        {phase === "loading" && (
          <LoadingScreen
            step={Math.min(loadingStep, LOADING_STEPS.length - 1)}
          />
        )}

        {/* ══ DONE PHASE ══ */}
        {phase === "done" && output && (
          <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">
            <ResultCard
              projectViewUrl={projectViewUrl}
              output={output}
              prompt={prompt}
              onReset={handleReset}
            />
          </div>
        )}
      </main>
    </div>
  );
}
