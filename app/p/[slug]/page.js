"use client";

import { useEffect, useState, use } from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import * as LucideIcons from "lucide-react";
import Script from "next/script";

import { getProjectBySlug } from "../../services/projectService";
import Loading from "../../components/Loading";

export default function Page({ params: paramsPromise }) {
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
  }, [slug]);

  if (!project) return <Loading />;

  // FIXED: Added "className" (and lowercased "classname") to allowed attributes
  const cleanHTML = DOMPurify.sanitize(project.html_design, {
    ADD_TAGS: ["icon"],
    ADD_ATTR: ["name", "class", "className", "classname", "id", "style"], 
  });

  const options = {
    replace(domNode) {
      if (domNode.name === "icon") {
        const name = domNode.attribs?.name;
        if (!name) return null;
        
        // Capitalize for Lucide
        const Icon = LucideIcons[name] || LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)];
        
        // FIXED: Check for both 'classname' and 'class' because parsers lowercase attributes
        const className = domNode.attribs?.classname || domNode.attribs?.class || ""; 
        
        return Icon ? <Icon className={className} size={24} /> : null;
      }
    },
  };

  return (
    <div className="min-h-screen w-full"> 
      
      {/* FIXED: Changed strategy to 'afterInteractive' (default). beforeInteractive breaks inside page.js */}
      <Script src="https://cdn.tailwindcss.com" strategy="afterInteractive" />

      <div className="w-full">
        {parse(cleanHTML, options)}
      </div>
    </div>
  );
}

