import { createClient } from "../lib/supabase/client";

export async function Insert_Project_Tabel_Data(userId, masterJson) {
  const supabase = createClient();

  console.log("💾 Inserting into projects table | user_id:", userId);

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

  console.log(
    "✅ Project inserted successfully | project_id:",
    data.project_id,
  );
  return data;
}

// ComponentTable - sirf main wrapper code
export async function Insert_Component_Tabel_Data(
  projectId,
  componentName,
  aiResponseCode,
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ComponentTable")
    .insert([
      {
        project_id: projectId,
        component_name: componentName,
        ai_response_code: aiResponseCode,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ItemsTable - small parts with order
export async function Insert_Item_Tabel_Data(compId, itemsArray = []) {
  if (itemsArray.length === 0) return [];

  const supabase = createClient();

  const itemsToInsert = itemsArray.map((item, index) => ({
    comp_id: compId,
    editabel_id: item.id ? String(item.id) : `item-${Date.now()}-${index}`,
    item_code: item.code,
    order_num: item.order_num || index + 1,
    type: item.type,
  }));

  const { data, error } = await supabase
    .from("ItemsTable")
    .insert(itemsToInsert)
    .select();

  if (error) throw error;
  return data;
}
