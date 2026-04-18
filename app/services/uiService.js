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

export async function getProfilId(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error("Profile Id not found");
  }

  if (!data) {
    throw new Error("No Profile created");
  }
  console.log("Profile service file --> Profile_Id :" + data.id);

  return data.id;
}

export async function getProjectId(id) {
  const supabase = createClient();
console.log("ProfilID recived howyi ha :" +id)
  const { data, error } = await supabase
    .from("projects")
    .select("project_id")
    .eq("user_id", id);

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error("Project Id not found");
  }

  if (!data) {
    throw new Error("No Project created");
  }
  console.log("Project service file --> Project_Id :" + data.project_id);

  return data.project_id;
}

export async function getComponentTabelId(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ComponentTable")
    .select("comp_id")
    .eq("project_id", id);

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error("ComponentTabel Id not found");
  }

  if (!data) {
    throw new Error("No ComponentTabel created");
  }
  console.log(
    "ComponentTabel service file --> ComponentTabel_Id :" + data.comp_id,
  );

  return data.comp_id;
}

export async function getItemsTabelId(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ItemsTable")
    .select("item_id")
    .eq("comp_id", id);

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error("ItemTabel Id not found");
  }

  if (!data) {
    throw new Error("No ItemTabel created");
  }
  console.log("ItemTabel service file --> ItemTabel_Id :" + data.item_id);

  return data.item_id;
}
