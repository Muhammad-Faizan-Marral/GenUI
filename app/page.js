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
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { ComponentExamples } from "./components/ComponentExamples";
import { WhoIsThisFor } from "./components/WhoIsThisFor";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

export default function GenerativeUILanding() {
  return (
    <div className="bg-[#080809] text-white min-h-screen  overflow-hidden antialiased">
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
