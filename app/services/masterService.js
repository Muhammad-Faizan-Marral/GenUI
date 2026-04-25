// ==================== MASTER JSON SERVICE ====================
export async function masterService(userMessage) {
  console.log("📤 Generating Master JSON...");

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "inclusionai/ling-2.6-flash:free",
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

// ==================== FULL SECTION GENERATION ====================
export async function generateCompleteSection(masterJson, sectionId) {
  console.log(`🤖 Generating section: ${sectionId}`);

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "inclusionai/ling-2.6-flash:free",
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

  const response = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "inclusionai/ling-2.6-flash:free",
      maxTokens: 15000,
      messages: [{ role: "user", content: buildEditPrompt(sectionCode, elementId, userPrompt) }],
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

// ==================== MASTER JSON PROMPT ====================
function buildMasterPrompt(userMessage) {
  return `You are a UI architect. Analyze the user's request and return ONLY a valid JSON schema. No markdown, no backticks, no explanation. Start with { and end with }.

USER REQUEST: "${userMessage}"

Return this exact JSON structure filled with real values:
{
  "meta": {
    "version": "6.0",
    "purpose": "Master schema for Gen UI — Next.js + Tailwind CSS step-by-step website generation",
    "strict_mode": true,
    "premium_output": true
  },
  "input": {
    "prompt": "the original user prompt"
  },
  "project": {
    "name": "string — e.g. 'Alex Dev Portfolio'",
    "type": "enum: portfolio | ecommerce | landing | blog | saas | agency | restaurant | startup | medical | education | crypto | real-estate",
    "industry": "specific industry vertical e.g. 'fintech', 'food & beverage', 'developer tools'",
    "style": "Infer from project type",
    "tone": "professional | playful | luxury | friendly | bold | minimal | energetic | calm",
    "audience": "who this is for",
    "platform": "next.js",
    "font_import": "Google Fonts link URL"
  },
  "design_system": {
    "colors": {
      "primary": "Brand color hex",
      "secondary": "complementary accent",
      "accent": "bright pop color",
      "background": "page background",
      "surface": "card background",
      "surface_2": "elevated surface",
      "text_primary": "#f8fafc or #0f172a",
      "text_secondary": "rgba value",
      "text_muted": "rgba value",
      "border": "rgba value",
      "gradient_start": "hero gradient start",
      "gradient_end": "hero gradient end"
    },
    "typography": {
      "font_family": "exact font name",
      "heading_weight": "700 or 800 or 900",
      "body_weight": "400",
      "base_size": "16px",
      "letter_spacing_hero": "-0.03em",
      "line_height_body": "1.7"
    },
    "ui": {
      "border_radius": "12px",
      "shadow": "0 4px 24px rgba(0,0,0,0.2)",
      "card_style": "glassmorphism | solid | outlined | elevated",
      "button_style": "gradient | solid | outline | ghost | pill",
      "animation_style": "subtle | smooth | energetic | none"
    }
  },
  "layout_globals": {
    "navbar": {
      "height": "64px",
      "position": "fixed",
      "z_index": 50,
      "style": "glassmorphism | solid | transparent-to-solid | minimal"
    },
    "section_defaults": {
      "padding_y": "80px 0",
      "padding_x": "clamp(1rem, 5vw, 6rem)",
      "max_width": "1280px"
    },
    "hero_style": "centered | split-layout | full-bleed | magazine | asymmetric"
  },
  "sections": [
    {
      "id": "unique-id e.g. navbar",
      "name": "human readable e.g. Navigation Bar",
      "order": 1,
      "purpose": "what this section does",
      "layout": {
        "type": "full_width | contained | split | grid | centered",
        "min_height": "auto",
        "position": "static | fixed | sticky"
      },
      "components": ["list of UI components in this section"],
      "content": {
        "heading": "real copy",
        "subheading": "supporting text",
        "body": "additional context",
        "cta_label": "button text",
        "cta_href": "#",
        "items": ["repeating content items"]
      },
      "style": {
        "background": "CSS background value",
        "visual_emphasis": "what to highlight"
      },
      "special_instructions": "unique behavior"
    }
  ]
}`;
}

// ==================== SECTION GENERATION PROMPT ====================

// ── Helper: detect section type from its id ──
function detectSectionType(sectionId) {
  const id = sectionId.toLowerCase();
  if (/^nav(bar|igation)?$/.test(id) || id.includes("nav")) return "NAVBAR";
  if (/^hero|^banner|^header/.test(id)) return "HERO";
  if (/^footer/.test(id)) return "FOOTER";
  if (/^about/.test(id)) return "ABOUT";
  if (/^(features?|services?)/.test(id)) return "FEATURES";
  if (/^(testimonials?|reviews?)/.test(id)) return "TESTIMONIALS";
  if (/^pricing/.test(id)) return "PRICING";
  if (/^(stats?|numbers?|metrics?)/.test(id)) return "STATS";
  if (/^(contact|form)/.test(id)) return "CONTACT";
  if (/^(projects?|portfolio|work)/.test(id)) return "PROJECTS";
  if (/^(faq|questions?)/.test(id)) return "FAQ";
  if (/^(cta|call)/.test(id)) return "CTA";
  return "GENERIC";
}

function buildSectionPrompt(masterJson, sectionId) {
  const section = masterJson.sections?.find((s) => s.id === sectionId) || {};
  const ds = masterJson.design_system || {};
  const colors = ds.colors || {};
  const typo = ds.typography || {};
  const ui = ds.ui || {};
  const globals = masterJson.layout_globals || {};

  const sectionType = detectSectionType(sectionId);
  const isNavbar = sectionType === "NAVBAR";
  const isHero = sectionType === "HERO";
  const isFooter = sectionType === "FOOTER";

  const projectContext = JSON.stringify(
    { project: masterJson.project, design_system: ds, layout_globals: globals, section },
    null,
    2
  );

  // ── CRITICAL height instructions per section type ──
  const heightInstruction = isNavbar
    ? `EXACT HEIGHT: The navbar must be exactly 64px tall. No more. No less. Set height:64px on the <nav> element itself.`
    : isHero
    ? `HEIGHT: Hero section uses min-height:100vh to fill the screen. This is intentional.`
    : isFooter
    ? `HEIGHT: Footer is auto height — only as tall as its content. Do NOT add min-height.`
    : `HEIGHT: This section must be ONLY as tall as its content needs. 
- Do NOT add min-height:100vh or any min-height at all.
- Do NOT add extra padding-top or padding-bottom beyond what looks good (80px–120px max).
- Do NOT add unnecessary whitespace, empty divs, or spacer elements.
- The section height = content height. Nothing more.`;

  // ── No navbar/no footer in non-navbar/non-footer sections ──
  const noExtraNavInstruction =
    !isNavbar
      ? `
━━━ CRITICAL: NO NAVBAR IN THIS SECTION ━━━
This section renders inside its own iframe. The navbar is a SEPARATE section in its own iframe.
- DO NOT include any <nav>, navbar, navigation bar, or header navigation in this section.
- DO NOT add position:fixed elements that would overlap other sections.
- DO NOT include a hamburger menu or mobile menu here.
- The parent page already handles layout — just render THIS section's content only.`
      : "";

  const noExtraFooterInstruction =
    !isFooter
      ? `
━━━ CRITICAL: NO FOOTER IN THIS SECTION ━━━
- DO NOT include a <footer> element in this section.
- Footer is rendered separately in its own iframe.`
      : "";

  // ── Section-specific generation rules ──
  const sectionSpecificRules = {
    NAVBAR: `
NAVBAR RULES (STRICT):
1. <nav> element: position:fixed; top:0; left:0; right:0; z-index:9999; height:64px; exactly.
2. Glassmorphism: background:rgba(10,10,10,0.8); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border-bottom:1px solid ${colors.border || "rgba(255,255,255,0.08)"};
3. Logo on left with gradient text.
4. Nav links in center/right with ::after underline hover animation.
5. CTA button (gradient).
6. Hamburger for mobile — fully functional JS toggle.
7. Mobile dropdown menu (animated, full width).
8. JS scroll listener to change background opacity.
9. The entire output is ONLY the navbar — nothing else. No hero, no sections below it.
10. Wrap everything in a single <nav> tag.`,

    HERO: `
HERO RULES:
1. min-height:100vh; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;
2. 2–3 gradient orbs as background decoration (position:absolute, pointer-events:none).
3. Grid or dot pattern overlay (position:absolute, inset:0, z-index:0).
4. All content in a z-index:1 or higher wrapper.
5. Massive gradient h1 with clamp() font size.
6. Subheading + body text.
7. Primary + Secondary CTA buttons side by side (flex row, gap:16px).
8. A floating visual/mockup element with float animation.
9. fadeUp animation with stagger on all elements.`,

    FOOTER: `
FOOTER RULES:
1. Auto height — fits content. No min-height.
2. 4-column grid: logo+desc, links col 1, links col 2, social/contact.
3. SVG social icons inline.
4. Gradient logo text.
5. Copyright bar at bottom with border-top separator.
6. Responsive: 1 column on mobile, 4 on desktop.`,

    FEATURES: `
FEATURES/SERVICES RULES:
1. Section padding: 80px top and bottom.
2. Section heading (h2) + optional subheading centered at top.
3. CSS Grid cards: grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); gap:24px;
4. Each card: icon (gradient circle/square) + heading + description.
5. Card hover: translateY(-8px) + glow shadow.
6. Intersection Observer fadeUp stagger animation.
7. DO NOT add 100vh height.`,

    ABOUT: `
ABOUT SECTION RULES:
1. Auto height — no min-height:100vh. Section is as tall as content.
2. Section padding: 80px–120px top/bottom.
3. Split layout: visual/image on one side, text content on other. Or centered for simpler about.
4. Real content from section.content — no Lorem ipsum.
5. Skills/competencies as a grid or list if relevant.
6. CTA buttons at the bottom.`,

    TESTIMONIALS: `
TESTIMONIALS RULES:
1. Auto height. Padding 80px top/bottom.
2. Section heading at top.
3. Testimonial cards in a grid or carousel.
4. Each card: large quote SVG + star rating SVG + quote text + avatar (gradient circle with initials) + author name + role.
5. If carousel: JS prev/next controls.`,

    PRICING: `
PRICING RULES:
1. Auto height. Padding 80px top/bottom.
2. Monthly/Annual toggle at top with JS.
3. 3 pricing tiers in a grid.
4. Middle card marked "popular" with gradient border.
5. Feature list with checkmark icons.
6. CTA button per card.`,

    STATS: `
STATS/NUMBERS RULES:
1. Auto height. Padding 60px top/bottom.
2. Large gradient numbers using countUp JS animation (Intersection Observer).
3. Descriptive label under each number.
4. Horizontal layout on desktop, 2-col grid on mobile.`,

    CONTACT: `
CONTACT SECTION RULES:
1. Auto height. Padding 80px top/bottom.
2. Contact form (name, email, message) + submit button.
3. Contact info cards (email, phone, location) if in section.content.
4. Social links.
5. Form submission with JS feedback (loading state → success state).`,

    PROJECTS: `
PROJECTS/PORTFOLIO RULES:
1. Auto height. Padding 80px top/bottom.
2. Section heading at top.
3. Project cards grid: auto-fit minmax(300px,1fr), gap:24px.
4. Each card: project image/preview + title + description + tech tags + CTA.
5. Hover effects on cards.
6. "View All" button at bottom if needed.`,

    FAQ: `
FAQ RULES:
1. Auto height. Padding 80px top/bottom.
2. Accordion style: click to expand/collapse.
3. Smooth height transition on expand.
4. Plus/minus icon toggle.`,

    CTA: `
CTA SECTION RULES:
1. Auto height. Padding 60px–80px top/bottom.
2. Bold heading + subheading.
3. 1–2 CTA buttons.
4. Optional gradient or subtle background.
5. Compact — not a full page section.`,

    GENERIC: `
GENERIC SECTION RULES:
1. Auto height — only as tall as content.
2. Padding 80px top/bottom.
3. Use section.components and section.content to determine layout.
4. No min-height:100vh unless the section explicitly needs it.`,
  };

  const specificRules = sectionSpecificRules[sectionType] || sectionSpecificRules.GENERIC;

  return `You are the world's best UI engineer. Every pixel is intentional. Premium agency-quality output.

━━━ RENDERING ENVIRONMENT ━━━
- This HTML renders inside an ISOLATED iframe — each section has its own iframe.
- NO Tailwind CSS — pure CSS only.
- NO React/JSX — pure HTML + CSS + vanilla JS.
- Google Fonts IS available (already loaded via link tag).
- The iframe auto-expands to fit the section content height.

━━━ ${heightInstruction} ━━━
${noExtraNavInstruction}
${noExtraFooterInstruction}

━━━ PROJECT CONTEXT ━━━
${projectContext}

━━━ DESIGN TOKENS ━━━
Primary        : ${colors.primary || "#6d28d9"}
Secondary      : ${colors.secondary || "#4f46e5"}
Accent         : ${colors.accent || "#06b6d4"}
Background     : ${colors.background || "#0a0a0a"}
Surface        : ${colors.surface || "#111111"}
Surface 2      : ${colors.surface_2 || "#1a1a1a"}
Text Primary   : ${colors.text_primary || "#f8fafc"}
Text Secondary : ${colors.text_secondary || "rgba(248,250,252,0.7)"}
Text Muted     : ${colors.text_muted || "rgba(248,250,252,0.4)"}
Border         : ${colors.border || "rgba(255,255,255,0.08)"}
Gradient Start : ${colors.gradient_start || colors.primary || "#6d28d9"}
Gradient End   : ${colors.gradient_end || colors.accent || "#06b6d4"}
Font Family    : ${typo.font_family || "Inter, sans-serif"}
Heading Weight : ${typo.heading_weight || "800"}
Letter Spacing : ${typo.letter_spacing_hero || "-0.03em"}
Line Height    : ${typo.line_height_body || "1.7"}
Border Radius  : ${ui.border_radius || "12px"}
Card Style     : ${ui.card_style || "glassmorphism"}
Button Style   : ${ui.button_style || "gradient"}
Animation      : ${ui.animation_style || "smooth"}
Section PaddingY: ${globals.section_defaults?.padding_y || "80px 0"}
Max Width      : ${globals.section_defaults?.max_width || "1280px"}

━━━ TASK ━━━
Generate the "${sectionId}" section (type: ${sectionType}).

━━━ SECTION-SPECIFIC RULES ━━━
${specificRules}

━━━ MANDATORY CSS BASE (include in every section's <style>) ━━━
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; overflow: hidden; background: ${colors.background || "#0a0a0a"}; }
body { font-family: '${typo.font_family || "Inter"}', sans-serif; color: ${colors.text_primary || "#f8fafc"}; -webkit-font-smoothing: antialiased; }

h1 { font-size: clamp(2.8rem, 7vw, 6.5rem); font-weight: ${typo.heading_weight || "800"}; letter-spacing: ${typo.letter_spacing_hero || "-0.03em"}; line-height: 1.05; }
h2 { font-size: clamp(2rem, 4.5vw, 3.8rem); font-weight: ${typo.heading_weight || "800"}; letter-spacing: -0.02em; }
h3 { font-size: clamp(1.2rem, 2.5vw, 1.6rem); font-weight: 600; }
p  { font-size: clamp(0.95rem, 1.5vw, 1.125rem); line-height: ${typo.line_height_body || "1.7"}; }

/* Glassmorphism card */
.glass { background:rgba(255,255,255,0.04); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid ${colors.border || "rgba(255,255,255,0.08)"}; border-radius:${ui.border_radius || "12px"}; }

/* Gradient text */
.gradient-text { background:linear-gradient(135deg,${colors.gradient_start || colors.primary},${colors.gradient_end || colors.accent}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

/* Buttons */
.btn-primary { background:linear-gradient(135deg,${colors.primary},${colors.secondary}); box-shadow:0 0 40px ${colors.primary}60,0 8px 32px rgba(0,0,0,0.4); border:none; border-radius:${ui.border_radius || "12px"}; padding:14px 32px; font-weight:600; cursor:pointer; color:#fff; transition:transform 0.2s,box-shadow 0.2s; font-family:inherit; font-size:1rem; }
.btn-primary:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 0 60px ${colors.primary}80,0 12px 40px rgba(0,0,0,0.5); }
.btn-ghost { background:transparent; border:1px solid ${colors.border || "rgba(255,255,255,0.15)"}; color:${colors.text_primary}; padding:14px 32px; border-radius:${ui.border_radius || "12px"}; cursor:pointer; transition:all 0.2s; font-family:inherit; font-size:1rem; }
.btn-ghost:hover { background:rgba(255,255,255,0.06); border-color:${colors.primary}; }

/* Animations */
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes glowPulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }
@keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
@keyframes spin { to{transform:rotate(360deg)} }

/* Responsive */
@media (max-width:767px) { .btn-primary,.btn-ghost { width:100%; } }

━━━ data-gen-id (REQUIRED ON ALL INTERACTIVE/TEXT ELEMENTS) ━━━
Format: data-gen-id="${sectionId}_[type]_[number]"
Types: heading, subheading, body-text, cta-button, secondary-button, nav-link, nav-logo, card, card-heading, card-body, card-icon, stat-number, stat-label, testimonial-quote, testimonial-author, price-amount, price-label, price-cta, footer-link, social-link, faq-question, faq-answer, form-input, form-submit, badge, image, list-item

━━━ OUTPUT RULES ━━━
1. Return ONLY raw HTML — no markdown, no backticks, no explanation.
2. First character must be the opening tag: <section, <nav, <footer, <header, <div.
3. Use class= not className=.
4. ALL CSS inside one <style> block inside the element.
5. ALL JS inside one <script> block at the very bottom.
6. Use real content from section.content — never Lorem ipsum.
7. Use ONLY the design tokens above.
8. No external dependencies except Google Fonts.`;
}

// ==================== EDIT PROMPT ====================
function buildEditPrompt(sectionCode, elementId, userPrompt) {
  return `You are a surgical code editor. You make ONE precise change and return the complete section.

━━━ SECTION CODE ━━━
${sectionCode}
━━━ END CODE ━━━

━━━ TARGET ELEMENT ━━━
data-gen-id="${elementId}"

━━━ REQUESTED CHANGE ━━━
"${userPrompt}"

━━━ STRICT RULES ━━━
1. Find the element with data-gen-id="${elementId}"
2. Apply ONLY the requested change to that element
3. Keep EVERY other element exactly as-is
4. Preserve ALL data-gen-id attributes
5. Preserve ALL CSS — only add new rules if needed
6. Preserve ALL JS — only add if needed
7. Return the COMPLETE updated section
8. First character must be the opening HTML tag — no preamble, no markdown`;
}

// ==================== HELPERS ====================
function cleanSectionCode(rawText) {
  if (!rawText) return "";
  return rawText
    .replace(/^```(?:html?|jsx?|tsx?|xml)?\s*/gi, "")
    .replace(/```\s*$/g, "")
    .replace(/\bclassName=/gi, "class=")
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

  if (start === -1 || end === -1) throw new Error("No JSON object found in response");

  try {
    return JSON.parse(stripped.slice(start, end + 1));
  } catch (err) {
    throw new Error(`JSON parse failed: ${err.message}`);
  }
}