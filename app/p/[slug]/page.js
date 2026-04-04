"use client";

import { useEffect, useState, use } from "react";
import * as LucideIcons from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { getProjectBySlug } from "../../services/projectService";
import Loading from "../../components/Loading";

// ── Lucide icons ko real SVG string mein convert karo ──
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
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          animation: {
            'fade-in': 'fadeIn 0.5s ease-in-out',
          },
          keyframes: {
            fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } }
          }
        }
      }
    }
  </script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    
    // /* ✅ Tailwind bg-clip-text fix for CDN */
    .bg-clip-text { -webkit-background-clip: text !important; background-clip: text !important; }
    .text-transparent { -webkit-text-fill-color: transparent !important; color: transparent !important; }
    
    /* ✅ Backdrop blur fix */
    .backdrop-blur-xl { backdrop-filter: blur(24px) !important; }
    .backdrop-blur-md { backdrop-filter: blur(12px) !important; }
    .backdrop-blur-sm { backdrop-filter: blur(4px) !important; }
    
    /* ✅ Smooth hover transitions */
    * { transition-property: color, background-color, border-color, transform, box-shadow, opacity; transition-duration: 200ms; }
    
    /* ✅ Scrollbar styling */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0a0a0f; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  </style>
</head>
<body>
${htmlWithIcons}
</body>
</html>`;

  return (
    <iframe
      srcDoc={fullHTML}
      title={project.project_title || "Preview"}
      className="w-full border-0 block"
      style={{ height: "100vh", minHeight: "100vh" }}
      sandbox="allow-scripts allow-same-origin allow-forms"
      onLoad={(e) => {
        try {
          const doc = e.target.contentDocument;
          if (doc?.body) {
            const h = doc.body.scrollHeight;
            if (h > window.innerHeight) {
              e.target.style.height = h + "px";
            }
          }
        } catch {}
      }}
    />
  );
}