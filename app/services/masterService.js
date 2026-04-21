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

// ==================== FULL SECTION GENERATION (Single Call) ====================
export async function generateCompleteSection(masterJson, sectionId) {
  console.log(`🤖 Generating section: ${sectionId}`);

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openrouter/elephant-alpha",
      maxTokens: 15000,
      messages: [
        {
          role: "user",
          content: buildSectionPrompt(masterJson, sectionId),
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(`Section API Error: ${response.status}`);

  const data = await response.json();
  const rawText =
    typeof data.content === "string"
      ? data.content
      : (data.content?.[0]?.text ?? "");

  return cleanSectionCode(rawText);
}

// ==================== EDIT SERVICE ====================
export async function processAiEdit(sectionCode, elementId, userPrompt) {
  console.log(`✏️ Editing element: ${elementId}`);

  const prompt = buildEditPrompt(sectionCode, elementId, userPrompt);

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openrouter/elephant-alpha",
      maxTokens: 15000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Edit API Error: ${response.status}`);

  const data = await response.json();
  const rawText =
    typeof data.content === "string"
      ? data.content
      : (data.content?.[0]?.text ?? "");

  return cleanSectionCode(rawText);
}

// ==================== PROMPTS ====================

function buildMasterPrompt(userMessage) {
  return `You are a UI architect. Analyze the user's request and return ONLY a valid JSON schema. No markdown, no backticks, no explanation. Start with { and end with }.

USER REQUEST: "${userMessage}"

Return this exact JSON structure filled with real values:
{
  "meta": {
    "version": "6.0",
    "purpose": "Master schema for Gen UI",
    "strict_mode": true
  },
  "input": {
    "prompt": "the original user prompt"
  },
  "project": {
    "name": "string — e.g. 'Alex Dev Portfolio'",
    "type": "enum: portfolio | ecommerce | landing | blog | saas | agency | restaurant",
    "style": "string — e.g. 'dark glassmorphism', 'minimal clean', 'bold editorial'",
    "tone": "string — e.g. 'professional', 'playful', 'luxury'",
    "platform": "next.js",
    "font_import": "string — Google Fonts link URL"
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
      "border": "rgba(...)"
    },
    "typography": {
      "font_family": "string",
      "heading_weight": "700",
      "body_weight": "400",
      "base_size": "16px"
    },
    "ui": {
      "border_radius": "12px",
      "shadow": "0 4px 24px rgba(0,0,0,0.2)"
    }
  },
  "layout_globals": {
    "navbar": {
      "height": "64px",
      "position": "fixed",
      "z_index": 50
    },
    "section_defaults": {
      "padding_y": "py-20 md:py-28",
      "padding_x": "px-4 md:px-8 lg:px-16",
      "max_width": "max-w-7xl mx-auto"
    }
  },
  "sections": [
    {
      "id": "unique-id e.g. navbar",
      "name": "human readable e.g. Navigation Bar",
      "order": 1,
      "layout": {
        "type": "full_width | contained | split | grid | centered",
        "min_height": "100vh for hero, auto for rest",
        "position": "static | fixed | sticky"
      },
      "components": ["list of UI components needed"],
      "content": {
        "heading": "string or null",
        "subheading": "string or null",
        "body": "string or null",
        "cta_label": "string or null",
        "cta_href": "string or null"
      },
      "style": {
        "background": "string"
      }
    }
  ]
}`;
}

function buildSectionPrompt(masterJson, sectionId) {
  // FIX: masterJson ko properly stringify karo
  const projectContext = JSON.stringify(
    {
      project: masterJson.project,
      design_system: masterJson.design_system,
      layout_globals: masterJson.layout_globals,
      section: masterJson.sections?.find((s) => s.id === sectionId) || {},
    },
    null,
    2
  );

  return `You are a world-class Senior Frontend Engineer building premium, luxury websites.

━━━ PROJECT CONTEXT ━━━
${projectContext}

━━━ YOUR TASK ━━━
Create the complete "${sectionId}" section for this website.

━━━ STRICT RULES ━━━
1. Return ONLY the HTML/JSX code — no explanation, no markdown backticks
2. Start directly with the opening tag: <section ...> or <nav ...> or <footer ...>
3. Use class= (not className=) — this renders in an iframe
4. EVERY interactive or text element MUST have a unique data-gen-id attribute
   Format: data-gen-id="${sectionId}_[element_type]_[number]"
   Examples:
   - <h1 data-gen-id="${sectionId}_heading_1" class="...">Title</h1>
   - <p data-gen-id="${sectionId}_para_1" class="...">Text</p>
   - <button data-gen-id="${sectionId}_btn_1" class="...">Click</button>
   - <a data-gen-id="${sectionId}_link_1" href="#" class="...">Link</a>
   - <img data-gen-id="${sectionId}_img_1" src="..." class="...">
5. NEVER use Tailwind semantic tokens like bg-primary — use hardcoded hex values from design_system
   Example: bg-[#6366f1] not bg-primary
6. Use real dummy content — no placeholders, no Lorem ipsum
7. Fully responsive — mobile-first
8. Make it PREMIUM and BEAUTIFUL — this is a production website
9. Navbar: add position fixed, z-50, backdrop-blur
   Hero: add padding-top equal to navbar height so content is not hidden`;
}

function buildEditPrompt(sectionCode, elementId, userPrompt) {
  return `You are a precise code editor. You will receive a complete HTML section and make ONE targeted change.

━━━ SECTION CODE ━━━
${sectionCode}
━━━ END CODE ━━━

━━━ YOUR TASK ━━━
Find the element with data-gen-id="${elementId}" and apply this change: "${userPrompt}"

━━━ CRITICAL RULES ━━━
1. ONLY modify the target element with data-gen-id="${elementId}"
2. Keep EVERY other element, class, and data-gen-id EXACTLY the same
3. Do not add or remove any data-gen-id attributes
4. For style changes: use Tailwind CSS utility classes
5. For text changes: only change the text content
6. Return ONLY the complete updated section code — same structure, no explanations
7. Start directly with the opening tag — no markdown backticks`;
}

// ==================== HELPERS ====================

function cleanSectionCode(rawText) {
  if (!rawText) return "";

  return rawText
    .replace(/```(?:jsx?|tsx?|html?)?/gi, "")
    .replace(/```/g, "")
    .replace(/\bclassName=/gi, "class=") // iframe ke liye
    .trim();
}

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