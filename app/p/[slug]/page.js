"use client";

import { useEffect, useState, use } from "react"; // 1. Import use
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import * as LucideIcons from "lucide-react";

import { getProjectBySlug } from "../../services/projectService";

export default function Page({ params: paramsPromise }) { // 2. Rename for clarity
  // 3. Unwrap the params promise
  const params = use(paramsPromise); 
  const slug = params.slug;

  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await getProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (slug) loadProject();
  }, [slug]); // 4. Use the unwrapped slug as dependency

  if (!project) return <div>Loading...</div>;

  const cleanHTML = DOMPurify.sanitize(project.html_design);

  const options = {
    replace(domNode) {
      if (domNode.name === "icon") {
        const name = domNode.attribs?.name;
        const Icon = LucideIcons[name];
        return Icon ? <Icon size={24} /> : null;
      }
    },
  };

  return (
    <div>
      <h1>{project.project_title}</h1>
      <div>{parse(cleanHTML, options)}</div>
    </div>
  );
}