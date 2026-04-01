import { createClient } from "../lib/supabase/client";

const supabase = createClient();

// ─── Main Service Function ─────────────────────────────────────────────────────
export async function designService(projectId, masterJson) {
  console.log("🚀 designService started for project:", projectId);
  console.log("Master JSON received:", JSON.stringify(masterJson, null, 2));

  if (!masterJson?.sections || masterJson.sections.length === 0) {
    throw new Error("No sections found in master_json");
  }

  const sections = masterJson.sections;
  const designSystem = masterJson.design_system || {};
  const layoutGlobals = masterJson.layout_globals || {};

  for (const section of sections) {
    console.log(`\n📌 Processing section: ${section.name} (id: ${section.id})`);

    try {
      // 1. Grok API call for this section
      const grokResponse = await callGrokForSection(
        section,
        designSystem,
        layoutGlobals,
      );
      console.log(`✅ Grok raw response for ${section.name}:`, grokResponse);

      // 2. Parse response into clean format
      const parsedData = parseSectionResponse(grokResponse, section.id);
      console.log(`Parsed data for ${section.name}:`, parsedData);

      // 3. Save to ComponentTable (parent)
      const component = await saveComponent(
        projectId,
        section,
        parsedData.parentCode,
      );
      console.log(`Component saved with comp_id: ${component.comp_id}`);

      // 4. Save Items (children) to ItemsTable
      const savedItems = await saveItems(component.comp_id, parsedData.items);
      console.log(
        `✅ ${savedItems.length} items saved for component ${component.comp_id}`,
      );
    } catch (error) {
      console.error(`❌ Error processing section ${section.name}:`, error);
    }
  }

  console.log("🎉 designService completed for all sections");
  return { success: true, projectId };
}

// ─── Grok API Call for Single Section ───────────────────────────────────────
async function callGrokForSection(section, designSystem, layoutGlobals) {
  const systemPrompt = `You are an expert Tailwind + Next.js UI developer.

Strict rules you MUST follow:
- Use ONLY the provided design_system colors, typography and ui rules. Never invent new colors.
- Return clean, production-ready Tailwind JSX code.
- First give the main wrapper component, then all inner items separately if needed.
- Do NOT use {CHILDREN} placeholder.
- Use ---SEPARATOR--- between main component and inner reusable items.
- Start directly with the MAIN_COMPONENT code. No explanations before or after.

Design System:
${JSON.stringify(designSystem, null, 2)}

Layout Globals:
${JSON.stringify(layoutGlobals, null, 2)}

Section Info:
${JSON.stringify(section, null, 2)}

Now generate the complete UI code for this section.`;

  try {
    const response = await fetch("/api/grok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "x-ai/grok-4.1-fast",
        maxTokens: 8000, // Changed to maxTokens (consistent with your API)
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Generate high-quality Tailwind JSX code for the "${section.name}" section now.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Grok API Error for section "${section.name}":`, errorText);
      throw new Error(`Grok API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Safe content extraction (jo tumhara masterService mein bhi use ho raha hai)
    const rawText =
      typeof data.content === "string"
        ? data.content
        : (data.content?.[0]?.text ?? "");

    if (!rawText) {
      throw new Error("Empty response received from Grok");
    }

    return rawText.trim();
  } catch (error) {
    console.error(
      `❌ Error processing section "${section.name}":`,
      error.message,
    );
    throw error; // upper level pe error propagate karne ke liye
  }
}
// ─── Parse Grok Response (---SEPARATOR--- wala logic) ───────────────────────
function parseSectionResponse(rawText, sectionId) {
  const parts = rawText.split("---SEPARATOR---").map((p) => p.trim());

  let parentCode = "";
  const items = [];

  parts.forEach((part, index) => {
    if (part.startsWith("MAIN_COMPONENT") || index === 0) {
      parentCode = part.replace(/^MAIN_COMPONENT\s*/i, "").trim();
    } else if (part.length > 10) {
      // meaningful code
      // Optional: agar AI ne "LOGO|1" jaisa format diya toh parse kar sakte ho
      items.push({
        type: `item_${index}`,
        code: part,
        order: index,
      });
    }
  });

  if (!parentCode)
    parentCode = `<section className="...">${items.map((i) => i.code).join("")}</section>`;

  return {
    parentCode,
    items,
  };
}

// ─── Save Component to ComponentTable ───────────────────────────────────────
async function saveComponent(projectId, section, parentCode) {
  const { data, error } = await supabase
    .from("ComponentTable")
    .insert({
      project_id: projectId,
      component_name: section.name.toLowerCase().replace(/\s+/g, "_"),
      ai_response_code: parentCode,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Save Items to ItemsTable ───────────────────────────────────────────────
async function saveItems(compId, items) {
  if (!items || items.length === 0) return [];

  const itemsToInsert = items.map((item, idx) => ({
    comp_id: compId,
    item_code: item.code,
    order_num: item.order || idx + 1,
  }));

  const { data, error } = await supabase
    .from("ItemsTable")
    .insert(itemsToInsert)
    .select();

  if (error) throw error;
  return data;
}

export default designService;
