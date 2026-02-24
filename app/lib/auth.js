import { createClient } from "./supabase/client";

export async function signup(email, password, username) {
  const supabase = createClient();

  // 1️⃣ Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // 2️⃣ Insert profile row
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    username,
    full_name: username,
    
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  return data;
}

export async function login(email, password) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
