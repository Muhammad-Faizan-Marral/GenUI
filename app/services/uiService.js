import { createClient } from "../lib/supabase/client";

/**
 * Get currently logged-in user's ID
 * @returns {string} userId
 */

export async function getUserId() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("User not authenticated");
  }

  if (!user) {
    throw new Error("No active session found");
  }

  return user.id;
}

export async function generateUI(UserPrompt) {
  const systemPrompt = `You are a world-class Senior UI/UX Designer and SaaS Product Designer.
Your job is to generate a PREMIUM, MODERN, HIGH-END website UI using Tailwind CSS.

CRITICAL RULES (MUST FOLLOW OR THE SYSTEM WILL CRASH):
1. Output ONLY a raw string of code. NO Markdown formatting (do not wrap in \`\`\`html or \`\`\`).
2. Use \`className="..."\` instead of \`class="..."\` (This is for a Next.js environment).
3. NO HTML comments () and NO JavaScript comments.
4. EVERY tag must be strictly and properly closed. Self-closing tags must end with "/>" (e.g., <img />, <input />).
5. Wrap EVERYTHING inside a SINGLE root <div>.
6. Do NOT include <html>, <head>, or <body>.
7. Do NOT include JavaScript, functionality, logic, forms handling, or scripts.
8. Do NOT include imports or React components.
9. Do NOT write explanations.
10. Self-closing tags MUST be valid (e.g., <img />).
11. Must use className instead of class because we use Next.js
12. Use lucid-react-icons not used images 

DESIGN QUALITY:
Act as a World-Class UI/UX Designer and Senior Frontend Developer. 
Your goal: Create a high-end, premium portfolio design in a single HTML block.

CORE DESIGN RULES:
- VISUAL STYLE: Premium SaaS/Dark-mode aesthetic. Use deep blacks (#0a0a0a) and rich accents.
- MODERN EFFECTS: Massive use of Glassmorphism (backdrop-blur), soft layered shadows (shadow-2xl), and glowing borders (ring-1 ring-white/10).
- GRADIENTS: Use vibrant, trendy gradients like 'from-indigo-500 via-purple-500 to-pink-500' for text and buttons.
- SPACING: Use generous whitespace (paddings/margins) for a breathable, luxury feel. Perfect visual hierarchy.

TECHNICAL SPECIFICATIONS FOR MY REACT COMPONENT:
1. USE CUSTOM ICON TAGS: Instead of SVGs, use <icon name="IconName" class="your-tailwind-classes" /> for ALL icons. (Example: <icon name="Github" class="text-white" />). This is mandatory for my parser.
2. LAYOUT: 
   - Sticky Navbar with blurred glass effect.
   - Hero Section: Big bold typography, glowing background blobs (absolute positioning), and a premium 'Call to Action'.
   - Projects: 3D-hover effect cards with sleek tags and glass-morphism backgrounds.
   - Experience: Minimalist timeline or grid with micro-interactions.
   - Contact: A clean, centered card with modern input fields (focus:ring-2).
3. RESPONSIVENESS: Mobile-first approach. Ensure columns stack beautifully on small screens.
4. VARIETY: Every time you run this, change the layout structure (e.g., Grid vs. Bento Box style) but keep the quality "Top Notch".

OUTPUT FORMAT:
- Provide ONLY the raw HTML content inside the body. 
- Do NOT include <html> or <body> tags. 
- Ensure all Tailwind classes are standard (utility-first).
- Start the response directly with the HTML.


ICON SYSTEM (VERY IMPORTANT):
Use lucide-react icons ONLY in this EXACT custom element format:
<icon name="IconName" className="..."></icon>

DO NOT use: <IconName /> or <Github></Github>
ONLY allowed format: <icon name="Github" className="text-white w-6 h-6"></icon>
Icon names MUST be valid lucide-react icon names and case-sensitive.

Remember: YOU ARE GENERATING DESIGN ONLY. Just beautiful, structured, responsive Tailwind JSX/HTML.`;

  const apis = [callGroq, callPuter];

  for (const apiFn of apis) {
    try {
      const result = await apiFn(UserPrompt, systemPrompt);
      if (result) {
        // Remove markdown formatting just in case the AI still disobeys
        return result.replace(/^```(html|jsx)?\n|\n```$/g, "").trim();
      }
    } catch (err) {
      console.error(`API failed, trying next...`, err);
    }
  }

  throw new Error("All APIs failed.");
}

async function callGroq(userPrompt, systemPrompt) {
  const res = await fetch("/api/chat", {
    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ message: userPrompt, system: systemPrompt }),
  });

  // Exact error dekho

  if (!res.ok) {
    const errorBody = await res.text();

    console.error("Groq API HTTP Error:", res.status, errorBody);

    throw new Error(`Groq API failed: ${res.status} - ${errorBody}`);
  }

  const data = await res.json();

  console.log("Groq Raw Reply:", data.reply); // Response dekho

  const parsed = parseResponse(data.reply);

  if (!parsed) throw new Error("Groq response parse nahi hua");

  return parsed;
}

async function callPuter(userPrompt, systemPrompt) {
  if (typeof window === "undefined" || !window.puter) {
    throw new Error("Puter not available");
  }

  const res = await window.puter.ai.chat(
    `${systemPrompt}\n\nUser Prompt: ${userPrompt}`,

    { model: "gpt-4o-mini" },
  );

  const text = res?.toString();

  if (!text) throw new Error("Puter returned empty response");

  return parseResponse(text);
}

function parseResponse(rawText) {
  if (!rawText) return null;

  // Agar AI ne ```html ... ``` ke andar code diya hai, to use extract karein

  let cleanCode = rawText;

  const markdownMatch = rawText.match(/```(?:html|xml)?([\s\S]*?)```/);

  if (markdownMatch) {
    cleanCode = markdownMatch[1].trim();
  } else {
    cleanCode = rawText.trim();
  }

  // Check karein ke kam az kam <div> se start ho raha hai

  if (cleanCode.includes("<div")) {
    return cleanCode;
  }

  return null;
}

function isValidStructure(parsed) {
  return (
    Array.isArray(parsed) && parsed[0]?.projectTitle && parsed[0]?.html_design
  );
}
