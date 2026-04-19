"use client";
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "../../lib/supabase/client";

export default function ProjectPreview({ params }) {
  // 1. Params ko unwrap karein (Next.js 15 requirement)
  const resolvedParams = React.use(params);
  const projectId = resolvedParams.slug;

  const [components, setComponents] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [masterJson, setMasterJson] = useState(null);
  const [totalSections, setTotalSections] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  // Fix: Corrected useRef syntax
  const iframeRef = useRef(null);
  const supabase = createClient();

  // Fetch project + components
  const fetchAll = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      // Project details + master_json
      const { data: project, error: projError } = await supabase
        .from("projects")
        .select("project_name, master_json")
        .eq("project_id", projectId)
        .single();

      if (projError) throw projError;

      if (project) {
        setProjectName(project.project_name);
        setMasterJson(project.master_json);
        setTotalSections(project.master_json?.sections?.length || 0);
      }

      // Components + Items join
      const { data, error: compError } = await supabase
        .from("ComponentTable")
        .select(`
          comp_id,
          component_name,
          ai_response_code,
          order,
          ItemsTable!comp_id (
            editabel_id,
            item_code,
            order_num,
            type
          )
        `)
        .eq("project_id", projectId)
        .order("order", { ascending: true });

      if (compError) throw compError;

      setComponents(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load preview");
    } finally {
      setLoading(false);
    }
  };

const renderIntoIframe = (comps) => {
  if (!iframeRef.current || comps.length === 0) return;

  let fullHTML = comps
    .map((comp) => {
      let wrapper = comp.ai_response_code || "<div></div>";

      const sortedItems = (comp.ItemsTable || []).sort(
        (a, b) => (a.order_num || 0) - (b.order_num || 0)
      );

      const childrenHTML = sortedItems.map((item) => item.item_code || "").join("\n");

      // {children} replace (robust)
      wrapper = wrapper.replace(/\{children\}/gi, childrenHTML);

      // className → class (iframe mein safe)
      wrapper = wrapper.replace(/\bclassName=/gi, 'class=');

      return wrapper;
    })
    .join("\n\n");

  const fontImport = masterJson?.project?.font_import
    ? `<link href="${masterJson.project.font_import}" rel="stylesheet">`
    : "";

  const iframeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${fontImport}
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    // Tailwind config initialize karo – design_system se colors + font use karo
    tailwind.config = {
      content: ["**/*"],
      theme: {
        extend: {
          colors: ${JSON.stringify(masterJson?.design_system?.colors || {})},
          fontFamily: {
            sans: ['${masterJson?.design_system?.typography?.font_family?.split(',')[0] || "Inter"}', 'system-ui', 'sans-serif']
          }
        }
      }
    }
  </script>
  <style>
    * { box-sizing: border-box; }
    body { 
      margin: 0; 
      padding: 0; 
      background: ${masterJson?.design_system?.colors?.background || "#09090b"}; 
      color: ${masterJson?.design_system?.colors?.text_primary || "white"}; 
      font-family: ${masterJson?.design_system?.typography?.font_family || "system-ui, sans-serif"}; 
    }
    .preview-container { min-height: 100vh; }
    /* Extra safe scrollbar + smooth */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="preview-container">
    ${fullHTML}
  </div>
</body>
</html>`;

  iframeRef.current.srcdoc = iframeHTML;
};

  // Realtime setup
  useEffect(() => {
    if (!projectId) return;

    fetchAll();

    const channel = supabase
      .channel(`preview-${projectId}`)
      .on("postgres_changes", {
          event: "*",
          schema: "public",
          table: "ComponentTable",
          filter: `project_id=eq.${projectId}`,
        }, () => fetchAll())
      .on("postgres_changes", { 
          event: "*", 
          schema: "public", 
          table: "ItemsTable" 
        }, () => fetchAll())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  // Render iframe when data changes
  useEffect(() => {
    if (components.length > 0) renderIntoIframe(components);
  }, [components, masterJson]);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-red-400 flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-semibold">{projectName || "Live Preview"}</h1>
          <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30">LIVE</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span>Sections:</span>
          <span className="bg-zinc-800 px-2 py-0.5 rounded">{components.length} / {totalSections}</span>
        </div>
      </div>

      <div className="flex-1 pt-16">
        {loading && components.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400">
            <div className="w-8 h-8 border-4 border-zinc-700 border-t-violet-500 rounded-full animate-spin mb-4" />
            <p>Building your website live...</p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            style={{ minHeight: "calc(100vh - 64px)" }}
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>
  );
}