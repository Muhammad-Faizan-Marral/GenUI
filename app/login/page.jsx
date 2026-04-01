"use client";

import { useState } from "react";
import { signup } from "../lib/auth";
import { login } from "../lib/auth";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Chrome,
  Check,
  Zap,
  Layers,
  Cpu,
  Lock,
  Mail,
  User,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

// ─── Animated background grid + orbs ─────────────────────────────────────────
function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[#07070a]" />

      {/* Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-700/10 rounded-full blur-[130px] animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-700/8 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07070a]/80" />
    </div>
  );
}

// ─── Left panel — social proof / feature preview ───────────────────────────
function LeftPanel() {
  const features = [
    { icon: <Zap size={13} />, text: "Generate UI from natural language" },
    { icon: <Layers size={13} />, text: "Reusable, composable components" },
    { icon: <Cpu size={13} />, text: "Tailwind & modern CSS ready" },
  ];

  const avatars = [
    { initials: "AK", color: "bg-violet-600" },
    { initials: "TM", color: "bg-indigo-600" },
    { initials: "SR", color: "bg-cyan-700" },
    { initials: "+2k", color: "bg-zinc-700" },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-12 relative">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/50">
          <Sparkles size={15} className="text-white" />
        </div>
        <span className="text-white text-lg font-semibold tracking-tight">
          gen<span className="text-violet-400">UI</span>
        </span>
      </Link>

      {/* Floating code card */}
      <div className="my-auto">
        <div className="relative max-w-sm">
          {/* Glow behind card */}
          <div className="absolute -inset-6 bg-violet-600/10 rounded-3xl blur-2xl" />

          <div className="relative rounded-2xl border border-white/[0.08] bg-black/50 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Terminal bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              <span className="ml-2 text-[10px] text-zinc-600 font-mono">
                prompt.txt
              </span>
            </div>

            {/* Prompt text */}
            <div className="p-5 space-y-3">
              <div className="font-mono text-[11px] leading-relaxed">
                <span className="text-violet-400">$ </span>
                <span className="text-zinc-300">
                  Create a dashboard with a sidebar nav,
                  <br />
                  stats cards, and a data table
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.05] pt-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Generated in 1.2s
                  </span>
                </div>

                {/* Mini preview */}
                <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 flex gap-2">
                  <div className="w-10 shrink-0 rounded-lg bg-violet-950/60 border border-violet-500/10 flex flex-col gap-1.5 py-2 px-1.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded ${i === 1 ? "bg-violet-500/60 w-full" : "bg-white/10 w-3/4"}`}
                      />
                    ))}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="grid grid-cols-2 gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-6 rounded-lg bg-white/[0.04] border border-white/[0.04]"
                        />
                      ))}
                    </div>
                    <div className="h-10 rounded-lg bg-white/[0.03] border border-white/[0.04]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 bg-emerald-950 border border-emerald-500/30 rounded-full px-3 py-1.5 shadow-lg">
            <Check size={10} className="text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-medium">
              Production ready
            </span>
          </div>
        </div>
      </div>

      {/* Features list */}
      <div className="space-y-4">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-violet-950 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              {f.icon}
            </div>
            <span className="text-sm text-zinc-400">{f.text}</span>
          </div>
        ))}

        {/* Social proof */}
        <div className="pt-4 flex items-center gap-3 border-t border-white/[0.05]">
          <div className="flex -space-x-2">
            {avatars.map((a, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full ${a.color} border-2 border-[#07070a] flex items-center justify-center text-[9px] font-bold text-white`}
              >
                {a.initials}
              </div>
            ))}
          </div>
          <p className="text-[12px] text-zinc-500">
            Joined by{" "}
            <span className="text-zinc-300 font-medium">2,000+ builders</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function InputField({
  label,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  rightEl,
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-medium text-zinc-400">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white/[0.04] border border-white/[0.09] rounded-xl text-sm text-white placeholder:text-zinc-600 py-3 pr-4 outline-none transition-all duration-200 focus:border-violet-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/20 ${icon ? "pl-10" : "pl-4"}`}
        />
        {rightEl && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightEl}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Auth form ────────────────────────────────────────────────────────────────
function AuthForm() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

    const router = useRouter();

  const isSignup = mode === "signup";

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        // 🔹 Password match check
        if (form.password !== form.confirm) {
          alert("Passwords do not match");
          setLoading(false);
          return;
        }
        await signup(form.email, form.password, form.name);
        setDone(true);
      } else {
        await login(form.email, form.password);
        router.push("/generate"); // login redirect
      }
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };
  const switchMode = (m) => {
    setMode(m);
    setDone(false);
    setForm({ name: "", email: "", password: "", confirm: "" });
    setAgreed(false);
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      {/* Mobile logo */}
      <div className="flex lg:hidden items-center gap-2 mb-8">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <Sparkles size={13} className="text-white" />
        </div>
        <span className="text-white font-semibold tracking-tight text-[15px]">
          gen<span className="text-violet-400">UI</span>
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          {isSignup
            ? "Start generating UI in seconds."
            : "Sign in to continue building."}
        </p>
      </div>

      {/* Success state */}
      {done ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Check size={22} className="text-emerald-400" />
          </div>
          <h3 className="text-white font-semibold mb-1">
            {isSignup ? "Account created!" : "Signed in!"}
          </h3>
          <p className="text-sm text-zinc-400 mb-5">
            {isSignup
              ? "Check your email to verify your account."
              : "Redirecting you to your dashboard…"}
          </p>
          <button
            onClick={() => setDone(false)}
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            ← Back
          </button>
        </div>
      ) : (
        <>
            {/* OAuth buttons */}
            

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[11px] text-zinc-600">
              Continue with email
            </span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <InputField
                label="Full name"
                placeholder="Ada Lovelace"
                icon={<User size={14} />}
                value={form.name}
                onChange={set("name")}
              />
            )}

            <InputField
              label="Email address"
              type="email"
              placeholder="you@company.com"
              icon={<Mail size={14} />}
              value={form.email}
              onChange={set("email")}
            />

            <InputField
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder={
                isSignup ? "Min. 8 characters" : "Enter your password"
              }
              icon={<Lock size={14} />}
              value={form.password}
              onChange={set("password")}
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            {isSignup && (
              <InputField
                label="Confirm password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                icon={<Lock size={14} />}
                value={form.confirm}
                onChange={set("confirm")}
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />
            )}

            {/* Forgot password */}
            {!isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[12px] text-zinc-500 hover:text-violet-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms */}
            {isSignup && (
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5">
                  <div
                    onClick={() => setAgreed(!agreed)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 ${
                      agreed
                        ? "bg-violet-600 border-violet-600"
                        : "bg-white/[0.04] border-white/[0.12] group-hover:border-violet-500/40"
                    }`}
                  >
                    {agreed && <Check size={9} className="text-white" />}
                  </div>
                </div>
                <span className="text-[12px] text-zinc-500 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-violet-400 hover:text-violet-300">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-violet-400 hover:text-violet-300">
                    Privacy Policy
                  </a>
                </span>
              </label>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (isSignup && !agreed)}
              className="group w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/40 text-sm mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {isSignup ? "Creating account…" : "Signing in…"}
                </>
              ) : (
                <>
                  {isSignup ? "Create account" : "Sign in"}
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <p className="mt-6 text-center text-[13px] text-zinc-500">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Create one free
                </button>
              </>
            )}
          </p>
        </>
      )}

      {/* Back to home */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <ChevronLeft size={12} />
          Back to genUI.io
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AuthPage() {
  return (
    <div className="relative min-h-screen text-white antialiased">
      <Background />

      <div className="relative min-h-screen grid lg:grid-cols-[1fr_1px_1fr]">
        {/* Left panel */}
        <LeftPanel />

        {/* Vertical divider */}
        <div className="hidden lg:block bg-white/[0.05]" />

        {/* Right panel — form */}
        <div className="flex items-center justify-center min-h-screen px-6 py-16 lg:py-0">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
