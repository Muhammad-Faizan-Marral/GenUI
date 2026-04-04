"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Profile fetch karo
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // Agar profile nahi mili toh create karo
      if (error || !data) {
        const username = user.user_metadata?.username || 
                         user.email.split("@")[0];
        
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([{ 
            id: user.id, 
            username: username,
            email: user.email 
          }])
          .select()
          .single();

        if (!insertError) {
          setProfile(newProfile);
        } else {
          console.error("Profile create failed:", insertError.message);
        }
        return;
      }

      setProfile(data);
    };

    loadProfile();
  }, []);

  return { profile };
}