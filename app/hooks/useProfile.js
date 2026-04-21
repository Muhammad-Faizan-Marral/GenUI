"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { getProfile } from "../services/profileService";
import { getUserId } from "../services/uiService";

export function useProfile() {
  const [profile, setProfile] = useState();
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const userId = await getUserId();
      console.log("hook profile id", userId);
      if (!userId) return;

      async function fetchProjects() {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", userId);
          if (error) throw new Error(error.message);
          let ans =  data[0].username;
          setProfile(ans);
          console.log("setprofoile",profile)
        } catch (err) {
          console.error("Failed to fetch Profile:", err.message);
        }
      }

      fetchProjects();
    };

    loadProfile();
  }, []);

  return { profile };
}
