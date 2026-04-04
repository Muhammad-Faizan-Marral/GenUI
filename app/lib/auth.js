import { createClient } from "./supabase/client";

export async function signup(email, password, username) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username } // trigger ke liye
    }
  });

  if (error) throw new Error(error.message);

  // ✅ Email confirmation enabled ho toh data.user null hoga
  // Trigger automatically profile banayega, hume manually insert nahi karna
  // Sirf tab insert karo jab user confirm ho (session ho)
  if (data.user && data.session) {
    // Immediately confirmed (email confirmation off hai)
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        username,
        email,
      }, { onConflict: "id" });

    if (profileError) throw new Error(profileError.message);
  }

  // ✅ Agar data.user hai but session nahi — email confirmation pending
  // Trigger ne profile bana di hogi, ya confirm hone par bana dega

  return data;
}

export async function login(email, password) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  // ✅ Login ke baad profile check karo — agar nahi hai toh banao
  if (data.user) {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (!existingProfile) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username: data.user.email.split("@")[0],
        email: data.user.email,
      }, { onConflict: "id" });
    }
  }

  return true;
}