"use client";

import * as LucideIcons from "lucide-react";
import parse from "html-react-parser";

export default function HeaderUI({ isOpen, handleClick }) {
  const html = `<header
    data-component="header"
    class="w-full border-b border-neutral-200 bg-gray-400 text-white"
  >
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center text-sm font-semibold">
            S
          </div>

          <span class="text-lg font-semibold text-neutral-900">
            Startup
          </span>
        </div>

        <nav class="hidden md:flex items-center gap-8">
          <button data-action="scroll" data-target="#features">Features</button>
          <button data-action="scroll" data-target="#pricing">Pricing</button>
          <button data-action="scroll" data-target="#about">About</button>
          <button data-action="scroll" data-target="#contact">Contact</button>
        </nav>

        <div class="hidden md:flex">
          <button
            data-action="scroll"
            data-target="#get-started"
            class="px-5 py-2 bg-black text-white rounded-full"
          >
            Get Started
          </button>
        </div>

        <button class="md:hidden" data-role="menu-icon">
          <icon name="${isOpen ? "X" : "Menu"}" />
        </button>
      </div>
    </div>
  </header>`;

  const options = {
    replace(domNode) {
      if (domNode.name === "icon") {
        const name = domNode.attribs.name;
        const Icon = LucideIcons[name];
        
        if (Icon) {
          return <Icon size={24} />;
        }
      }
    },
  };

  return (
    <div onClick={handleClick}>
      {parse(html, options)}
    </div>
    
  );
}
