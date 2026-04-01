import { createClient } from "../lib/supabase/client";

export async function getProfile(userId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();


  if (error) {
    console.log(error)
    throw new Error(error.message);
  }
  console.log("profileService : "+ data)
  return data; 
}