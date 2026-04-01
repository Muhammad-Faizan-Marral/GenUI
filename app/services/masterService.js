// masterService.js — Single call, no loops, no continuation logic

export async function masterService(userMessage) {
  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "x-ai/grok-4.1-fast",
      maxTokens: 10000,
      messages: [
        {
          role: "user",
          content: buildPrompt(userMessage),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  const rawText =
    typeof data.content === "string"
      ? data.content
      : (data.content?.[0]?.text ?? "");

  return parseJSON(rawText);
}

// ─── JSON Parser ───────────────────────────────────────────────────────────────

function parseJSON(raw) {
  // 1. Strip markdown code fences if model adds them
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  // 2. Extract only the JSON object (first { to last })
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
  return `You are a strict JSON generator for a Next.js + Tailwind CSS website builder.

OUTPUT RULES (mandatory):
- Return ONLY a single valid JSON object. Nothing else.
- No markdown, no code fences, no explanations before or after.
- Start your response with { and end with }

USER REQUEST: ${userMessage}

Return this JSON structure completely filled:

{
  "meta": {
    "version": "7.0",
    "purpose": "Master schema for Gen UI — Next.js + Tailwind CSS website generation",
    "strict_mode": true,
    "premium_output": true
  },

  "input": {
    "prompt": "string — original user prompt"
  },

  "project": {
    "name": "string",
    "type": "enum: portfolio | ecommerce | landing | blog | saas | agency | restaurant",
    "style": "string — e.g. 'dark glassmorphism'",
    "tone": "string — e.g. 'professional'",
    "platform": "next.js",
    "font_import": "string — Google Fonts URL"
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
      "font_family": "string",
      "heading_weight": "700",
      "body_weight": "400",
      "base_size": "16px",
      "scale": "enum: tight | normal | loose"
    },
    "ui": {
      "border_radius": "string",
      "border_radius_sm": "string",
      "border_radius_lg": "string",
      "shadow": "string",
      "border_style": "string"
    },
    "motion": {
      "animation_style": "enum: none | subtle | smooth | energetic",
      "duration_fast": "150ms",
      "duration_base": "300ms",
      "duration_slow": "600ms",
      "easing": "string"
    }
  },

  "layout_globals": {
    "navbar": {
      "height": "64px",
      "position": "fixed",
      "z_index": 50,
      "background": "string",
      "backdrop_blur": true
    },
    "page_wrapper": {
      "padding_top": "pt-16",
      "max_width": "string",
      "horizontal_padding": "string"
    },
    "section_defaults": {
      "padding_y": "py-20 md:py-28",
      "padding_x": "string",
      "max_width": "string"
    }
  },

  "generation_control": {
    "total_sections": 0,
    "sections_list": [],
    "done": false
  },

  "sections": [
    {
      "id": "string",
      "name": "string",
      "order": 1,
      "is_last": false,
      "complexity": "enum: low | medium | high",
      "layout": {
        "type": "enum: full_width | contained | split | grid | centered",
        "min_height": "auto",
        "position": "static",
        "z_index": null,
        "padding_top_override": null
      },
      "components": [],
      "responsive": {
        "mobile": "string",
        "tablet": "string",
        "desktop": "string"
      },
      "content": {
        "heading": null,
        "subheading": null,
        "body": null,
        "cta_label": null,
        "cta_href": null,
        "items": []
      },
      "style": {
        "background": "string",
        "custom_tailwind": null
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
      "include_use_client_when_needed": true
    },
    "layout_rules": {
      "navbar_is_fixed_z50": true,
      "hero_must_have_padding_top_equal_to_navbar_height": true,
      "no_section_should_overlap_another": true
    },
    "quality_rules": {
      "premium_ui": true,
      "smooth_tailwind_animations": true,
      "fully_responsive": true,
      "follow_design_system_strictly": true
    }
  },

  "response_format": {
    "rules": [
      "Return ONLY the component code.",
      "Start with first line of code, end with last line.",
      "Code block format: tsx ... ",
      "Low complexity ~60 lines, Medium ~100 lines, High ~150 lines."
    ]
  }
}`;
}
