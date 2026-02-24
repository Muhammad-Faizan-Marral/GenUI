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

export function uiLayout(prompt) {
  console.log("uiService......" + prompt);
  return <div className="bg-red-800 text-3xl h-screen">Hello how are you </div>;
}
