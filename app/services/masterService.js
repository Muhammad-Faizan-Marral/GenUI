export async function masterService(userMessage) {
  console.log("📤 Sending request to Master JSON API...");

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      maxTokens: 10000,
      messages: [{ role: "user", content: buildPrompt(userMessage) }],
    }),
  });

  if (!response.ok) throw new Error(`Master API Error: ${response.status}`);

  const data = await response.json();
  const rawText =
    typeof data.content === "string"
      ? data.content
      : (data.content?.[0]?.text ?? "");

  console.log("📥 Raw Master Response received");
  return parseJSON(rawText);
}

export async function generateAllComponents(masterJson, sectionId) {
  console.log(`📤 Calling AI for section: ${sectionId}`);

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      maxTokens: 12000,
      messages: [
        { role: "user", content: buildComponentAndItem(masterJson, sectionId) },
      ],
    }),
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);

  const data = await response.json();
  const rawText =
    typeof data.content === "string"
      ? data.content
      : (data.content?.[0]?.text ?? "");

  return parseComponentResponse(rawText); 
}

// ─── Naya Parser (Full Code + Items) ─────────────────────────────────────
function parseComponentResponse(raw) {
  const fullCodeMatch = raw.match(/FULL SECTION CODE:([\s\S]*?)(?=ITEMS:|$)/i);
  const itemsMatch = raw.match(/ITEMS:([\s\S]*)$/i);

  if (!fullCodeMatch) {
    throw new Error("FULL SECTION CODE not found in AI response");
  }

  const fullCode = fullCodeMatch[1].trim();

  let items = [];
  if (itemsMatch) {
    try {
      let itemsStr = itemsMatch[1].trim();
      // Clean JSON
      itemsStr = itemsStr.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      items = JSON.parse(itemsStr);
    } catch (e) {
      console.error("Items parse failed", e);
    }
  }

  return {
    component_name: "section",
    ai_response_code: fullCode,        // yeh ComponentTable mein jayega
    items: items                       // yeh ItemsTable mein jayega
  };
}

// ─── JSON Parser ────────────────────────────────────────────────────────────
function parseJSON(raw) {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in response");
  }

  const jsonStr = stripped.slice(start, end + 1);

  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    throw new Error(`JSON parse failed: ${err.message}`);
  }
}

// ─── Prompt ────────────────────────────────────────────────────────────────────
function buildPrompt(userMessage) {
  return `You are a UI architect. Analyze the user's request and return ONLY a valid JSON schema. No markdown, no backticks, no explanation. Start with { and end with }.

USER REQUEST: "${userMessage}"

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
}

// ─── generateComponentPrompt ───────────────────────────────────────────────────
function buildComponentAndItem(masterJson, section) {
  return `You are an expert Tailwind + React developer.
First, generate a beautiful, modern, fully responsive code for this section: "${section}"
Then break it into logical small editable parts.
Return in this EXACT format:
FULL SECTION CODE:
<section className="flex h-[64px] ...">
  {children}
</section>
ITEMS:
[
  {
    "id": "logo-001",
    "type": "logo",
    "order_num": 1,
    "code": "<div className=\"flex items-center space-x-3\"><span className=\"text-xl font-semibold text-primary\">AlexDev</span></div>"
  },
  {
    "id": "nav-links-001",
    "type": "nav_links",
    "order_num": 2,
    "code": "<div className=\"hidden md:flex space-x-6\">...</div>"
  },
  {
    "id": "mobile-menu-001",
    "type": "mobile_menu",
    "order_num": 3,
    "code": "<div className=\"md:hidden\">...</div>"
  }
]

Rules:
Main Wrapper: Use only the {children} placeholder within the main wrapper.
Granular Elements: Break down every meaningful section into individual items (e.g., logo, link groups, buttons, cards, headings).
Sequential Ordering: Ensure the order_num follows a logical flow (left-to-right and top-to-bottom).
Styling: Use className for all styling within the code.
Code Constraints: Do not include import statements, export statements, or function definitions.
Content Only: Provide only the inner HTML/JSX code for items; do not wrap them in a full component structure.
USe real unsplash url according to requirenment
Master JSON:
${JSON.stringify(masterJson, null, 2)}

Generate for section: "${section}"`;
}
