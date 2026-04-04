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

// ─── Step 1: Schema Generate karo ────────────────────────────────────────────
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

  const res = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: schemaPrompt }],
      systemPrompt:
        "You are a JSON generator. Return ONLY valid JSON. No markdown, no explanation.",
      model: "x-ai/grok-4.1-fast",
      temperature: 0.3, // Low temperature for consistent JSON
      maxTokens: 14000,
    }),
  });

  if (!res.ok) throw new Error(`Schema API failed: ${res.status}`);

  const data = await res.json();
  const raw = data.content || "";

  // JSON extract karo
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Schema JSON nahi mila");

  return JSON.parse(raw.slice(start, end + 1));
}

// ─── Step 2: Full HTML Generate karo using Schema ─────────────────────────────
async function generateHTMLFromSchema(schema, userPrompt) {
  const sectionsDesc = schema.sections
    .map(
      (s, i) =>
        `${i + 1}. ${s.name} (${s.id}): ${s.description}. Components: ${s.components?.join(", ")}. ${s.content?.heading ? `Heading: "${s.content.heading}"` : ""} ${s.content?.subheading ? `Subheading: "${s.content.subheading}"` : ""} ${s.content?.items?.length ? `Items: ${JSON.stringify(s.content.items)}` : ""}`,
    )
    .join("\n");

  const colors = schema.design_system.colors;

  const htmlPrompt = `You are given a complete website schema. Build the ENTIRE website as a single HTML output strictly following this schema.

SCHEMA:
${JSON.stringify(schema, null, 2)}

OUTPUT RULES:
- Output ONLY raw HTML inside ONE root <div>
- NO markdown, NO backticks, NO explanations, NO HTML comments ()
- Start with <div and end with </div>
- Use class="" (NOT className="")
- All tags properly closed
- NO <html> <head> <body> <script> tags
- NO JavaScript or event handlers

STRICTLY FOLLOW FROM SCHEMA:
- Use EXACT colors from design_system.colors
- Use EXACT font from design_system.typography.font_family
- Use EXACT border_radius from design_system.ui.border_radius
- Build ALL sections from sections array in ORDER
- Use content (heading, subheading, items) from each section's content field
- Follow each section's layout.type and components list

INLINE STYLE RULES (mandatory):
- Page wrapper: style="background: ${colors.background}; min-height: 100vh; font-family: ${schema.design_system.typography.font_family};"
- Cards: style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: ${schema.design_system.ui.border_radius}; backdrop-filter: blur(20px); padding: 32px;"
- Primary button: style="background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); color: #fff; padding: 12px 28px; border-radius: 10px; font-weight: 600; border: none; display: inline-block; cursor: pointer;"
- Gradient heading: style="background: linear-gradient(135deg, ${colors.text_primary}, ${colors.primary}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 800;"
- Glow card: style="box-shadow: 0 0 40px ${colors.primary}33;"
- Navbar: style="position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: ${colors.background}cc; backdrop-filter: blur(20px); border-bottom: 1px solid ${colors.border}; height: ${schema.layout_globals.navbar.height};"
- Hero section: style="min-height: 100vh; padding-top: ${schema.layout_globals.navbar.height}; display: flex; align-items: center; justify-content: center;"

ICON FORMAT: <icon name="LucideIconName" class="w-5 h-5"></icon>
IMAGES: Use real Unsplash URLs relevant to the project type`;

  const res = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: htmlPrompt }],
      systemPrompt: `You are a world-class Frontend Developer. Generate premium HTML with exact colors and design system provided. Never deviate from the color values given. Output only raw HTML starting with <div. Always self-close void elements: <input />, <img />, <br />, <hr /> `,
      model: "x-ai/grok-4.1-fast",
      temperature: 0.7,
      maxTokens: 14000,
    }),
  });

  if (!res.ok) throw new Error(`HTML API failed: ${res.status}`);

  const data = await res.json();
  const raw = data.content || "";

  const cleaned = raw
    .replace(/^```(html|jsx|tsx|xml)?\n?/im, "")
    .replace(/\n?```\s*$/im, "")
    .trim();

  if (!cleaned.includes("<div")) {
    throw new Error("Valid HTML nahi mila");
  }
  const fixed = cleaned
    .replace(/<input([^>]*)>/gi, "<input$1 />")
    .replace(/<br([^>]*)>/gi, "<br$1 />")
    .replace(/<hr([^>]*)>/gi, "<hr$1 />")
    .replace(/<img([^>]*)(?<!\/)>/gi, "<img$1 />");

  if (!fixed.includes("<div")) {
    throw new Error("Valid HTML nahi mila");
  }

  // Duplicate style attributes merge karo
  let result = fixed.replace(
    /style="([^"]*)"([^>]*)\sstyle="([^"]*)"/gi,
    (match, s1, middle, s2) => `style="${s1}; ${s2}"${middle}`
  );

  // Duplicate class attributes merge karo  
  result = result.replace(
    /class="([^"]*)"([^>]*)\sclass="([^"]*)"/gi,
    (match, c1, middle, c2) => `class="${c1} ${c2}"${middle}`
  );

  return result;
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export async function generateUI(userPrompt) {
  // Step 1: Schema banao
  const schema = await generateSchema(userPrompt);
  console.log("✅ Schema generated:", schema.project.name);

  // Step 2: HTML banao using schema
  const html = await generateHTMLFromSchema(schema, userPrompt);
  console.log("✅ HTML generated");

  return html;
}
