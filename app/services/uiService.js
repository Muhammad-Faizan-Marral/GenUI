"use client";

import { createClient } from "../lib/supabase/client";

export async function getUserId() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw new Error("User not authenticated");
  if (!user) throw new Error("No active session found");
  return user.id;
}

// ─── Simple Fetch with longer timeout (no undici) ─────────────────────
async function fetchWithLongTimeout(url, options = {}, timeoutMs = 120000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API failed: ${response.status}`);
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs / 1000} seconds`);
    }
    throw error;
  }
}

// ─── Generate Schema ────────────────────────────────────────────────
async function generateSchema(userPrompt) {
   const schemaPrompt = `You are a UI architect. Analyze the user's request and return ONLY a valid JSON schema. No markdown, no backticks, no explanation. Start with { and end with }.

USER REQUEST: "${userPrompt}"

Return this exact JSON structure filled with real values:
{
  "meta": {
    "version": "6.0",
    "purpose": "Master schema for Gen UI — Next.js + Tailwind CSS step-by-step website generation",
    "strict_mode": true,
    "premium_output": true,
    "instructions": "AI must fill ALL fields completely when the user submits a prompt. This JSON is generated once upfront. The frontend then loops through sections array in order, sending one section at a time to the AI for code generation."
  },

  "input": {
    "prompt": "string — the original user prompt e.g. 'create a dark portfolio site for a developer'"
  },

  "project": {
    "name": "string — e.g. 'Alex Dev Portfolio'",
    "type": "enum: portfolio | ecommerce | landing | blog | saas | agency | restaurant",
    "style": "string — e.g. 'dark glassmorphism', 'minimal clean', 'bold editorial'",
    "tone": "string — e.g. 'professional', 'playful', 'luxury'",
    "platform": "next.js",
    "font_import": "string — Google Fonts @import URL e.g. 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'"
  },

  "design_system": {
    "colors": {
      "primary": "#hex",
      "secondary": "#hex",
      "accent": "#hex",
      "background": "#hex",
      "surface": "#hex",
      "surface_2": "#hex",
      "text_primary": "#hex",
      "text_secondary": "#hex",
      "text_muted": "#hex",
      "border": "rgba(255,255,255,0.1)",
      "error": "#hex",
      "success": "#hex"
    },
    "typography": {
      "font_family": "string — e.g. 'Inter, sans-serif'",
      "heading_weight": "700",
      "body_weight": "400",
      "base_size": "16px",
      "scale": "enum: tight | normal | loose"
    },
    "ui": {
      "border_radius": "string — e.g. '12px'",
      "border_radius_sm": "string — e.g. '6px'",
      "border_radius_lg": "string — e.g. '20px'",
      "shadow": "string — e.g. '0 4px 24px rgba(0,0,0,0.2)'",
      "border_style": "string — e.g. '1px solid rgba(255,255,255,0.1)'"
    },
    "motion": {
      "animation_style": "enum: none | subtle | smooth | energetic",
      "duration_fast": "150ms",
      "duration_base": "300ms",
      "duration_slow": "600ms",
      "easing": "string — e.g. 'cubic-bezier(0.4, 0, 0.2, 1)'"
    }
  },

  "layout_globals": {
    "navbar": {
      "height": "string — e.g. '64px'. This value is critical — all sections must account for it to prevent overlap.",
      "position": "fixed",
      "z_index": 50,
      "background": "string — e.g. 'rgba(10,10,10,0.85)'",
      "backdrop_blur": true
    },
    "page_wrapper": {
      "padding_top": "string — MUST equal navbar.height e.g. 'pt-16'. This prevents the hero from hiding behind the fixed navbar.",
      "max_width": "string — e.g. '1280px'",
      "horizontal_padding": "string — e.g. 'px-4 md:px-8 lg:px-16'"
    },
    "section_defaults": {
      "padding_y": "string — e.g. 'py-20 md:py-28'",
      "padding_x": "string — e.g. 'px-4 md:px-8 lg:px-16'",
      "max_width": "string — e.g. 'max-w-7xl mx-auto'"
    }
  },

  "generation_control": {
    "total_sections": "number — total count of sections in the sections array below",
    "sections_list": [
      "string — ordered list of section IDs e.g. ['navbar', 'hero', 'about', 'skills', 'projects', 'contact', 'footer']"
    ],
    "done": false,
    "done_rule": "The frontend reads this field after receiving each AI response. When done is true, stop the generation loop. The AI sets done to true only when returning the final section's code."
  },

  "sections": [
    {
      "id": "string — unique identifier e.g. 'navbar'",
      "name": "string — human readable e.g. 'Navigation Bar'",
      "order": 1,
      "is_last": false,
      "layout": {
        "type": "enum: full_width | contained | split | grid | centered",
        "min_height": "string — e.g. '100vh' for hero, 'auto' for everything else",
        "position": "enum: static | fixed | sticky — navbar is fixed, all others static",
        "z_index": "number | null — 50 for navbar only, null for all others",
        "padding_top_override": "string | null — only set if this section needs special top padding beyond the page_wrapper default"
      },
      "components": [
        "string — list of UI components in this section e.g. 'Logo', 'NavLinks', 'CTAButton', 'MobileMenu'"
      ],
      "responsive": {
        "mobile": "string — e.g. 'hamburger menu, stacked layout'",
        "tablet": "string — e.g. 'condensed nav'",
        "desktop": "string — e.g. 'full horizontal nav with CTA'"
      },
      "content": {
        "heading": "string | null",
        "subheading": "string | null",
        "body": "string | null",
        "cta_label": "string | null",
        "cta_href": "string | null",
        "items": []
      },
      "style": {
        "background": "string — use a value from design_system.colors or a specific hex/rgba",
        "custom_tailwind": "string | null — any extra Tailwind classes specific to this section"
      }
    }
  ],

  "render_rules": {
    "framework": "next.js + tailwindcss",
    "code_style": {
      "one_root_div_only": true,
      "use_className_not_class": true,
      "no_html_comments": true,
      "svg_props_camelCase": true,
      "inline_style_format": "style={{ color: 'red', fontSize: '16px' }}",
      "include_use_client_when_needed": true,
      "include_react_imports_when_needed": true
    },
    "layout_rules": {
      "navbar_is_fixed_z50": true,
      "hero_must_have_padding_top_equal_to_navbar_height": true,
      "all_sections_use_section_defaults_unless_overridden": true,
      "no_section_should_overlap_another": true
    },
    "quality_rules": {
      "premium_ui": true,
      "smooth_tailwind_animations": true,
      "fully_responsive": true,
      "follow_design_system_strictly": true,
      "visual_consistency_over_creativity": true
    }
  },

  "completion_signal": {
    "description": "This object is returned by the AI alongside the final section's code. The frontend polls this to decide whether to continue or stop.",
    "done": false,
    "last_section_generated": "string — ID of the last section that was just generated",
    "total_generated": 0,
    "message": "string — e.g. 'All sections generated. Website is complete.'"
  }
}`;

  const res = await fetchWithLongTimeout("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: schemaPrompt }],
      systemPrompt: "You are a JSON generator. Return ONLY valid JSON.",
      temperature: 0.3,
      max_tokens: 20000,
    }),
  }, 480000);   // 90 seconds

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "";

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Schema JSON not found");

  return JSON.parse(raw.slice(start, end + 1));
}

// ─── Generate HTML ─────────────────────────────────────────────────
async function generateHTMLFromSchema(schema, userPrompt) {
  const colors = schema.design_system?.colors || {};

   const htmlPrompt = `You are a world-class Frontend Developer. Generate a complete website as a single HTML output.

SCHEMA:
${JSON.stringify(schema, null, 2)}

OUTPUT RULES — READ CAREFULLY:
- Output ONLY raw HTML inside ONE root <div>
- NO markdown, NO backticks, NO explanations
- Start with <div and end with </div>
- Use class="" (NOT className="")
- All tags properly closed
- NO <html> <head> <body> <script> tags

⚠️ CRITICAL — STYLING RULES:
- Use ONLY Tailwind CSS utility classes for ALL styling
- NEVER use inline style="" attributes for colors, spacing, layout, or effects
- For hover effects: use Tailwind hover: prefix e.g. hover:bg-blue-500 hover:scale-105
- For transitions: use Tailwind classes e.g. transition-all duration-300 ease-in-out
- For animations: use Tailwind animate- classes e.g. animate-fade-in animate-bounce
- For gradients: use Tailwind bg-gradient-to-r from-blue-500 to-purple-600
- For backdrop blur: use Tailwind backdrop-blur-md
- For glass effect: use bg-white/10 backdrop-blur-md border border-white/20

TAILWIND COLOR MAPPING FROM SCHEMA:
- primary color (${colors.primary}): use closest Tailwind class e.g. bg-blue-600 text-blue-600 border-blue-600
- secondary color (${colors.secondary}): use closest Tailwind class e.g. bg-purple-600
- accent color (${colors.accent}): use closest Tailwind class e.g. bg-emerald-500
- background (${colors.background}): bg-zinc-950 or bg-gray-950
- surface: bg-zinc-900, surface-2: bg-zinc-800
- text primary: text-white or text-slate-50
- text secondary: text-slate-300
- text muted: text-slate-500

COMPONENT PATTERNS (use these exact Tailwind patterns):
- Card: class="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
- Primary Button: class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
- Navbar: class="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-8"
- Hero section: class="min-h-screen pt-16 flex items-center justify-center text-center"
- Gradient text: class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
- Skill bar: use width percentage with Tailwind e.g. class="h-1.5 bg-blue-600 rounded-full" style="width: 90%" (width% only is ok)
- Section: class="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto"

IMAGES: Use real Unsplash URLs relevant to the project type`;

  const res = await fetchWithLongTimeout("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: htmlPrompt }],
      systemPrompt: "You are a world-class Frontend Developer. Output only raw HTML.",
      temperature: 0.7,
      max_tokens: 20000,
    }),
  }, 480000);   // 3 minutes (180 seconds) – slow internet pe bhi wait karega

  const data = await res.json();
  let raw = data.choices?.[0]?.message?.content || "";

  // cleaning (same as before)
  let result = raw
    .replace(/^```(html|jsx)?\n?/im, "")
    .replace(/\n?```\s*$/im, "")
    .trim();

  result = result
    .replace(/<input([^>]*)>/gi, "<input$1 />")
    .replace(/<img([^>]*)(?<!\/)>/gi, "<img$1 />");

  return result;
}

// ─── Main Function ─────────────────────────────────────────────────
export async function generateUI(userPrompt) {
  try {
    console.log("🚀 Starting generation...");

    const schema = await generateSchema(userPrompt);
    console.log("✅ Schema done");

    const html = await generateHTMLFromSchema(schema, userPrompt);
    console.log("✅ HTML done");

    return html;
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  }
}