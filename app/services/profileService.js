import { createClient } from "../lib/supabase/client";

export async function getProfile(userId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  
  return data; 
}