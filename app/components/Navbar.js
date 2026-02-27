"use client";

import { useState, useEffect } from "react";
import { Sparkles, Menu, X, User } from "lucide-react";
import { getUserId } from "../services/uiService";
import Link from "next/link";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [login, setLogin] = useState();

  async function isLogin() {
    var check = await getUserId();
    if (check) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }

  useEffect(() => {
    isLogin();

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

        {/* Desktop nav links */}
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

        {/* Desktop CTA */}
        {login ? (
          <div className="hidden md:flex items-center gap-3">
            <Link href="/profile">
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
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/40 text-sm"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-zinc-300 font-medium px-6 py-3 rounded-xl transition-all duration-200 text-sm"
            >
              Signup
            </Link>
          </div>
        )}

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
          {/* Nav links */}
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

          {/* Divider */}
          <div className="border-t border-white/[0.06] my-1" />

          {/* Mobile CTA - same as desktop */}
          {login ? (
            <Link href="/profile" onClick={() => setOpen(false)}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "11px 20px",
                  background: "linear-gradient(135deg, #6b21a8, #a855f7)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                  fontFamily: "'Segoe UI', sans-serif",
                  boxShadow: "0 4px 16px rgba(168,85,247,0.45)",
                }}
              >
                <User size={18} />
                Profile
              </button>
            </Link>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/40 text-sm"
              >
                Login
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-zinc-300 font-medium px-6 py-3 rounded-xl transition-all duration-200 text-sm"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}