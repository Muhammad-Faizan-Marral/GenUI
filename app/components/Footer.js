"use client";

import { Github, Sparkles } from "lucide-react";

export function Footer() {
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
