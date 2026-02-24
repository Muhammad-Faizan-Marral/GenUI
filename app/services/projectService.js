import { createClient } from "../lib/supabase/client";
import { nanoid } from "nanoid";

export async function createProject(userId, username, projectData) {
  const supabase = createClient();

  const slug = generateSlug(username, projectData.projectTitle);

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        user_id: userId,
        project_title: projectData.projectTitle,
        html_design: projectData.html_design,
        slug: slug,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function getProjectBySlug(slug) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("project_title, html_design")
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function slugValue(slug) {
  console.log("Project Service Sluge",slug)
  return slug;
}

function generateSlug(username, title) {
  const cleanTitle = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `${username}-${cleanTitle}-${nanoid(6)}`;
}