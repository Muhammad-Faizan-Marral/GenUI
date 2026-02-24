"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  RotateCcw,
  ChevronRight,
  Cpu,
  Code2,
  Star,
  Zap,
  ArrowRight,
  Layers,
  MousePointer2,
  Box,
} from "lucide-react";
import Link from "next/link";
import { getUserId, uiLayout } from "../../services/uiService";
import { createProject, slugValue } from "../../services/projectService";
import { useProfile } from "../../hooks/useProfile";

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
  "A pricing page with 3 plans and a monthly/yearly toggle",
  "A hero section with gradient background and CTA button",
  "A dashboard with sidebar and stats cards",
  "A login form with email and password fields",
];

// ─── Output metadata ──────────────────────────────────────────────────────────
const OUTPUTS = {
  pricing: { label: "Pricing Page", previewId: "pricing-ui-x7k2m" },
  hero: { label: "Hero Section", previewId: "hero-ui-a3p9q" },
  dashboard: { label: "Dashboard Layout", previewId: "dashboard-ui-b5r1n" },
  login: { label: "Login Form", previewId: "login-ui-c8s4w" },
};

// ─── Loading animation ────────────────────────────────────────────────────────
function LoadingScreen({ step }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 py-20">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-violet-600/20 animate-ping"
          style={{ animationDuration: "1.5s" }}
        />
        <div
          className="absolute inset-3 rounded-full bg-violet-600/25 animate-ping"
          style={{ animationDuration: "1.5s", animationDelay: "0.3s" }}
        />
        <div
          className="absolute inset-6 rounded-full bg-violet-600/30 animate-ping"
          style={{ animationDuration: "1.5s", animationDelay: "0.6s" }}
        />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-900/60">
          <Cpu size={24} className="text-white" />
        </div>
      </div>

      <div className="space-y-3 text-center">
        {LOADING_STEPS.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-500 ${
              i === step
                ? "bg-violet-950/40 border border-violet-500/25 text-violet-300"
                : i < step
                  ? "text-emerald-500/70"
                  : "text-zinc-700"
            }`}
          >
            <span className="text-base">{i < step ? "✓" : s.icon}</span>
            <span
              className={`text-sm font-medium ${i === step ? "" : i < step ? "line-through" : ""}`}
            >
              {s.text}
            </span>
            {i === step && (
              <div className="flex gap-1 ml-1">
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-700">Usually takes 2–4 seconds</p>
    </div>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ projectViewUrl, output, prompt, onReset }) {
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
    console.log("generate page prompt is..." + prompt);
    setOutput(detectOutput(prompt));
    setPhase("loading");
    setLoadingStep(0);

    for (let i = 0; i < LOADING_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 200));
      setLoadingStep(i + 1);
    }

    console.log(output);

    // 2️⃣ Generate AI output (hardcoded for now)

    // const aiResponse = uiLayout(prompt);
    // console.log(aiResponse)

    // 3️⃣ Save project to DB

    try {
      const userId = await getUserId(); // get logged-in user ID
      const projectData = {
        projectTitle: "Gernal Title",
        html_design: "<div>" + prompt + "</div>", // hardcoded html/design
      };

      const savedProject = await createProject(
        userId,
        profile.username,
        projectData,
      );
      const slug = savedProject.slug;

      const projectUrl = `/p/${slug}`;
      setProjectViewUrl(projectUrl);
      console.log("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error.message);
    }

    await new Promise((r) => setTimeout(r, 400));
    setPhase("done");
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
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
            AL
          </div>
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
