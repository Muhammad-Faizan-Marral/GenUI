"use client";

import { useEffect, useState, use } from "react";
import * as LucideIcons from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { getProjectBySlug } from "../../services/projectService";
import Loading from "../../components/Loading";

function convertIconsToSVG(html) {
  return html.replace(
    /<icon\s+name="([^"]+)"\s+class="([^"]*)"[^/]*\/?>(?:<\/icon>)?/gi,
    (match, name, className) => {
      const iconName = name.charAt(0).toUpperCase() + name.slice(1);
      const Icon = LucideIcons[iconName];
      if (!Icon) return "";
      try {
        const svgString = renderToStaticMarkup(
          <Icon className={className} />
        );
        return svgString;
      } catch {
        return "";
      }
    }
  );
}

export default function Page({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params.slug;

  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const loadProject = async () => {
      try {
        const data = await getProjectBySlug(slug);
        if (!data?.html_design) { setNotFound(true); return; }
        setProject(data);
      } catch (err) {
        console.error("Project fetch error:", err);
        setNotFound(true);
      }
    };
    loadProject();
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-400">
        <p className="text-sm">Project not found</p>
      </div>
    );
  }

  if (!project) return <Loading />;

  // Icons ko SVG mein convert karo
  const htmlWithIcons = convertIconsToSVG(project.html_design);

  // Complete HTML document
const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.project_title || "Preview"}</title>
  
  <!-- ←←← YE LINE ADD KAR DO -->
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>
    tailwind.config = { ... }
  <\/script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #09090b; }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
    
    /* Extra safe fonts fallback */
    .font-\\[\\'Playfair_Display\\',serif\\] { font-family: 'Playfair Display', serif; }
    .font-\\[\\'Lato\\',sans-serif\\] { font-family: 'Lato', sans-serif; }
  </style>
</head>
<body class="bg-zinc-950 text-white">
${htmlWithIcons}
</body>
</html>`;

  return (
    <iframe
      srcDoc={fullHTML}
      title={project.project_title || "Preview"}
      className="w-full h-screen block border-0"
      sandbox="allow-scripts allow-same-origin allow-forms"
      // onLoad={(e) => {
      //   try {
      //     const doc = e.target.contentDocument;
      //     if (doc?.body) {
      //       const h = doc.body.scrollHeight;
      //       if (h > window.innerHeight) {
      //         e.target.style.height = h + "px";
      //       }
      //     }
      //   } catch {}
      // }}
    />
  );
}