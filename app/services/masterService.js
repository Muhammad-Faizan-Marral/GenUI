// ==================== MASTER JSON SERVICE ====================
export async function masterService(userMessage) {
  console.log("📤 Generating Master JSON...");

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openrouter/elephant-alpha",
      maxTokens: 10000,
      messages: [{ role: "user", content: buildMasterPrompt(userMessage) }],
    }),
  });

  if (!response.ok) throw new Error(`Master API Error: ${response.status}`);

  const data = await response.json();
  const rawText =
    typeof data.content === "string"
      ? data.content
      : (data.content?.[0]?.text ?? "");

  console.log("✅ Master JSON Raw Response Received");
  return parseJSON(rawText);
}
// ── JSON Parser ───────────────────────────────────────────────────────────────
function parseJSON(raw) {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\*\*[\s\S]*?\*\*/g, "")
    .replace(/^\s*[\*\-\#]+\s*/gm, "")
    .trim();

  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in response");
  }

  try {
    return JSON.parse(stripped.slice(start, end + 1));
  } catch (err) {
    throw new Error(`JSON parse failed: ${err.message}`);
  }
}
// ==================== FULL SECTION GENERATION ====================
export async function generateFullSection(masterJson, sectionId) {
  console.log(`🤖 Generating FULL premium section: ${sectionId}`);

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openrouter/elephant-alpha",
      maxTokens: 15000,
      messages: [
        {
          role: "user",
          content: buildFullSectionPrompt(masterJson, sectionId),
        },
      ],
    }),
  });

  if (!response.ok)
    throw new Error(`Full Section API Error: ${response.status}`);

  const data = await response.json();
  const rawText =
    typeof data.content === "string"
      ? data.content
      : (data.content?.[0]?.text ?? "");

  // Simple cleaning
  return rawText
    .replace(/```(?:jsx|html|tsx)?/gi, "")
    .replace(/```/g, "")
    .trim();
}

// ==================== CONVERT TO DB FORMAT ====================
export async function convertToDbFormat(
  fullSectionCode,
  sectionId,
  masterJson,
) {
  console.log(`🤖 [2/2] Converting to DB Format: ${sectionId}`);

  const safeCode =
    fullSectionCode.length > 12000
      ? fullSectionCode.substring(0, 12000) + "\n..."
      : fullSectionCode;

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openrouter/elephant-alpha",
      maxTokens: 10000,
      messages: [
        {
          role: "user",
          content: buildConverterPrompt(safeCode, sectionId),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error(`Converter API Failed ${response.status}:`, errorText);
    throw new Error(`Converter API Error: ${response.status}`);
  }

  const data = await response.json();
  const rawText =
    typeof data.content === "string"
      ? data.content
      : (data.content?.[0]?.text ?? "");

  return parseComponentResponse(rawText, sectionId, fullSectionCode);
}
// ── Universal Converter Prompt ────────────────────────────────────────────────
function buildConverterPrompt(fullSectionCode, sectionId) {
  return `You are a code analyzer. Look at this JSX/HTML section code and split it into a wrapper and items.
 
SECTION ID: "${sectionId}"
 
━━━ INPUT CODE ━━━
${fullSectionCode}
━━━ END INPUT ━━━
 
━━━ HOW TO DECIDE WHAT BECOMES AN ITEM ━━━
Look at the code carefully. Ask yourself:
"Are there multiple elements that have the SAME structure but DIFFERENT data/content?"
 
Examples of repeating patterns = items:
- 3 cards with same layout but different title/description/image → each card is an item
- 5 nav links with same <a> structure but different href/label → each link is an item  
- 4 stat boxes with same design but different number/label → each stat is an item
- 6 menu dishes with same card layout but different name/price → each dish is an item
- 3 team members with same card structure but different photo/name → each member is an item
- 8 skill badges with same design but different skill name → each badge is an item
 
Examples of NON-repeating = stays in wrapper:
- One hero heading + one paragraph + one background blob → no items, wrapper only
- One contact form with input fields → no items, wrapper only  
- One reservation form → no items, wrapper only
- Decorative background elements, blobs, gradients → always wrapper
- Section heading/subheading → always wrapper
- A single unique CTA button that is not part of a repeating group → wrapper
 
━━━ DECISION RULE ━━━
If you find 2 or more elements with same structure, different data → extract as items
If nothing repeats → items = [] and wrapper = full original code unchanged
 
━━━ OUTPUT FORMAT — EXACTLY THIS, NOTHING ELSE ━━━
 
WRAPPER:
[full section code with {children} where the repeating items were — OR full original code if no items]
 
ITEMS_JSON:
[{"id":"unique-id","type":"descriptive_type","order_num":1,"label":"short label","code":"<div class='...'>complete single item html</div>"}]
 
━━━ STRICT RULES ━━━
1. Start your response with "WRAPPER:" — nothing before it
2. After wrapper code, write "ITEMS_JSON:" on a new line
3. ITEMS_JSON value must be a valid JSON array on a SINGLE LINE — no line breaks inside
4. If no items: ITEMS_JSON: []
5. If items exist: wrapper must have {children} exactly where items were
6. If no items: wrapper must be full original code — do NOT add {children} anywhere
7. In "code" field: use ONLY single quotes for all HTML attribute values
8. Keep ALL class/className values exactly as they are — do not simplify
9. No markdown backticks, no explanation text, nothing outside the format above`;
}

// ==================== PROMPTS ====================

function buildMasterPrompt(userMessage) {
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
    "sections_list": ["string — ordered list of section IDs"],
    "done": false,
    "done_rule": "Frontend reads this after each AI response. When done is true, stop loop."
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
        "position": "enum: static | fixed | sticky",
        "z_index": "number | null",
        "padding_top_override": "string | null"
      },
      "components": ["string — list of UI components"],
      "responsive": {
        "mobile": "string",
        "tablet": "string",
        "desktop": "string"
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
        "background": "string",
        "custom_tailwind": "string | null"
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
      "inline_style_format": "style={{ color: 'red' }}",
      "include_use_client_when_needed": true,
      "include_react_imports_when_needed": true
    }
  },

  "completion_signal": {
    "done": false,
    "last_section_generated": "",
    "total_generated": 0,
    "message": ""
  }
}`;
}

// ── 1. Full Premium Section Prompt ─────────────────────────────────────
function buildFullSectionPrompt(masterJson, sectionId) {
  return `You are a Senior Frontend Engineer creating **premium luxury websites**.

Here is complete MasterJson : ${masterJson}
Create only this section : ${sectionId}
Must follow STRICT REQUIREMENTS and create code only ${sectionId}
━━━ STRICT REQUIREMENTS ━━━
- Return **ONLY** one complete <section> or <nav> or <footer> tag.
- Make it extremely beautiful, modern, and premium.
- Use real dummy content according to the section.
- Make it fully responsive (mobile-first).
- Do NOT use {children}, placeholders, or comments like "// replace with image".
- Do NOT add any explanation. Just return the clean code.
- Follow Json theme and make it premium Ui.


Return only the code like this example:

<section className="relative ...">
  {/* all beautiful content */}
</section>`;
}

// ── Parser ────────────────────────────────────────────────────────────────────
function parseComponentResponse(rawText, sectionId, fallbackCode) {
  if (!rawText) throw new Error("Empty response from converter");
 
  const cleaned = rawText.replace(/```[\s\S]*?```/g, "").trim();
 
  // ── Wrapper extract ──────────────────────────────────────────────────────
  const wrapperMatch = cleaned.match(/WRAPPER:\s*([\s\S]*?)(?=\nITEMS_JSON:)/i);
  let ai_response_code = wrapperMatch
    ? wrapperMatch[1].trim()
    : fallbackCode;
 
  // ── Items extract ────────────────────────────────────────────────────────
  let items = [];
  const itemsMatch = cleaned.match(/ITEMS_JSON:\s*(\[[\s\S]*?\])\s*$/im);
 
  if (itemsMatch) {
    try {
      const parsed = JSON.parse(itemsMatch[1]);
      items = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn(`⚠️ Items JSON parse failed for "${sectionId}":`, e.message);
      // Parse fail → original full code as wrapper, no items
      ai_response_code = fallbackCode;
      items = [];
    }
  }
 
  // ── Safety checks ────────────────────────────────────────────────────────
 
  // Items hain but {children} wrapper mein nahi → inject karo
  if (items.length > 0 && !ai_response_code.includes("{children}")) {
    ai_response_code = ai_response_code.replace(
      /(<\/(section|div|main|nav|aside|footer|header)>\s*)$/i,
      "\n  {children}\n</$2>"
    );
  }
 
  // Items nahi hain but {children} wrapper mein aa gaya → hata do
  if (items.length === 0 && ai_response_code.includes("{children}")) {
    ai_response_code = ai_response_code.replace(/\{children\}/g, "");
  }
 
  // className → class (iframe rendering ke liye)
  ai_response_code = ai_response_code.replace(/\bclassName=/gi, "class=");
 
  console.log(
    `✅ Parsed "${sectionId}" | Items: ${items.length} | {children}: ${ai_response_code.includes("{children}")}`
  );
 
  return {
    component_name: sectionId,
    ai_response_code: ai_response_code.trim(),
    items,
  };
}

 // masterService.js
export async function generateSectionWithItems(masterJson, sectionId) {
  console.log(`🤖 Generating Section: ${sectionId}`);

  const prompt = buildProductionPrompt(masterJson, sectionId);

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openrouter/elephant-alpha",
      maxTokens: 15000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    console.error(`API Error ${response.status}:`, errorText);
    throw new Error(`Section Generation Error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = typeof data.content === "string" 
    ? data.content 
    : (data.content?.[0]?.text ?? "");

  return parseProductionResponse(rawText, sectionId);
}

// ==================== STRONG PRODUCTION PROMPT ==============
function buildProductionPrompt(masterJson, sectionId) {
  const project = masterJson.project || {};
  const colors = masterJson.design_system?.colors || {};
  const sectionData = masterJson.sections?.find(s => s.id === sectionId) || {};

  return `You are an expert frontend developer building high-end websites.

Project Name: "${project.name || 'Premium Website'}"
Style: "${project.style || 'modern elegant'}"
Section: "${sectionId}" (${sectionData.name || ''})

Create this section in **premium quality**.

Return **EXACTLY** this format and nothing else:

FULL SECTION WRAPPER:
<section class="...">
  ... complete beautiful Tailwind + JSX code ...
  {children}
</section>

ITEMS:
[
  {
    "id": "item-1",
    "type": "card|link|stat|menu_item|table_row",
    "order_num": 1,
    "label": "Item label",
    "code": "<div class='...'>one repeatable piece only with single quotes</div>"
  }
]

Rules:
- Make it visually stunning and modern.
- Hardcode hex colors.
- Use {children} where repeatable content (cards, menu items, stats, etc.) should go.
- If no repeatable items, use [] and still put {children} at logical place.
- Use single quotes in all "code" fields.
- No explanations, no markdown, no extra text.

Start directly with "FULL SECTION WRAPPER:"`;
}

// ==================== ROBUST PARSER ====================
function parseProductionResponse(rawText, sectionId) {
  if (!rawText) throw new Error("Empty AI response");

  let cleaned = rawText.replace(/```[\s\S]*?```/g, "").trim();

  // Extract Wrapper
  const wrapperMatch = cleaned.match(/FULL SECTION WRAPPER:\s*([\s\S]*?)(?=ITEMS:|$)/i);
  let ai_response_code = wrapperMatch 
    ? wrapperMatch[1].trim() 
    : cleaned.split("ITEMS:")[0]?.trim() || cleaned;

  // Ensure {children}
  if (!ai_response_code.includes("{children}")) {
    ai_response_code = ai_response_code.replace(
      /<\/(section|div|main|nav|footer)>\s*$/i,
      "\n{children}\n</$1>"
    );
  }

  // Extract Items
  let items = [];
  const itemsMatch = cleaned.match(/ITEMS:\s*(\[[\s\S]*?\])/i);
  if (itemsMatch) {
    try {
      items = JSON.parse(itemsMatch[1]);
    } catch (e) {
      console.warn(`Items parse failed for ${sectionId}`);
    }
  }

  ai_response_code = ai_response_code.replace(/\bclassName=/gi, "class=");

  console.log(`✅ Parsed ${sectionId} | Items count: ${items.length}`);

  return {
    component_name: sectionId,
    ai_response_code: ai_response_code.trim(),
    items: Array.isArray(items) ? items : [],
  };
}
