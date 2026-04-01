import { createClient } from "../lib/supabase/client";

export async function createProject(userId, masterJson) {
  const supabase = createClient();

  console.log("Saving for User UUID:", userId);

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        user_id: userId,  
        project_name: masterJson.project.name,
        project_type: masterJson.project.type,
        master_json: masterJson
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error saving project:", error);
    throw new Error("Failed to save project to database");
  }

  return data;
}

