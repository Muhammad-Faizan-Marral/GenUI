import { createClient } from "../lib/supabase/client";

// ── Projects Table ────────────────────────────────────────────────────────────
export async function Insert_Project_Tabel_Data(userId, masterJson) {
  const supabase = createClient();
  console.log("💾 Inserting project | user_id:", userId);

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        user_id: userId,
        project_name: masterJson.project?.name || "Untitled Project",
        project_type: masterJson.project?.type || "landing",
        master_json: masterJson,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ Project Insert Error:", error);
    throw new Error(`Project save failed: ${error.message}`);
  }

  console.log("✅ Project saved | project_id:", data.project_id);
  return data;
}

// ── Component Table ───────────────────────────────────────────────────────────
// Full section code save hota hai — no ItemsTable needed anymore
export async function Insert_Component_Tabel_Data(
  projectId,
  componentName,
  aiResponseCode,
  order = 0
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ComponentTable")
    .insert([
      {
        project_id: projectId,
        component_name: componentName,
        ai_response_code: aiResponseCode,
        order: order,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ Component Insert Error:", error);
    throw error;
  }

  return data;
}

// ── Update Component (Edit ke liye) ──────────────────────────────────────────
export async function Update_Component_Code(compId, newCode) {
  const supabase = createClient();

  const { error } = await supabase
    .from("ComponentTable")
    .update({ ai_response_code: newCode })
    .eq("comp_id", compId);

  if (error) {
    console.error("❌ Component Update Error:", error);
    throw error;
  }

  console.log("✅ Component updated | comp_id:", compId);
}