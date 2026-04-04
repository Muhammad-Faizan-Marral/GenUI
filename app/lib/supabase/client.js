import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let supabaseInstance = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_v1;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_v1;

  if (supabaseInstance) return supabaseInstance;

  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey);

  return supabaseInstance;
}
