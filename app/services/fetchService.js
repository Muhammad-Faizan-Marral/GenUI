import { createClient } from "../lib/supabase/client";

export async function getMasterJsonLatesOnce() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order('created_at', { ascending: false }) 
    // .eq('user_id', userId) 
    
  if (error) {
    console.error("Error in Fetching project:", error);
    throw new Error("Failed to Fetch project from database");
  }

  return data; // Latest project first array me hoga
}