"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { getProfile } from "../services/profileService";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const {data: { user }} = await supabase.auth.getUser();
      console.log("userProfile Hoook logined user data is:"+user)
      if (!user) return;

      try {
        const profileData = await getProfile(user.id);
        console.log("userprofile hook data is " + profileData)
        setProfile(profileData);
      } catch (err) {
        console.error("Profile fetch error:", err.message);
      }
    };

    loadProfile();
  }, []);

  return { profile };
}