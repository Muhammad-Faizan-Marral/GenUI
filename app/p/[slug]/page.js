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

  const colors = masterJson?.design_system?.colors || {};
  const typography = masterJson?.design_system?.typography || {};
  const fontFamily = typography.font_family || "Inter, system-ui, sans-serif";
  const fontImport = masterJson?.project?.font_import
    ? `<link href="${masterJson.project.font_import}" rel="stylesheet">`
    : `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`;

  // ── Har component ka HTML assemble karo ───────────────────────────────────
  let fullHTML = comps
    .map((comp) => {
      let wrapper = comp.ai_response_code || "<div></div>";

      const sortedItems = (comp.ItemsTable || []).sort(
        (a, b) => (a.order_num || 0) - (b.order_num || 0)
      );

      const childrenHTML = sortedItems
        .map((item) => item.item_code || "")
        .join("\n");

      wrapper = wrapper.replace(/\{children\}/gi, childrenHTML);
      wrapper = wrapper.replace(/\bclassName=/gi, "class=");

      return wrapper;
    })
    .join("\n\n");

  // ── Tailwind config — arbitrary value support ON karo ────────────────────
  const tailwindConfig = `
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary:   '${colors.primary   || "#6366f1"}',
            secondary: '${colors.secondary || "#8b5cf6"}',
            accent:    '${colors.accent    || "#f59e0b"}',
            surface:   '${colors.surface   || "#111827"}',
            surface2:  '${colors.surface_2 || "#1f2937"}',
          },
          fontFamily: {
            sans: ['${fontFamily.split(",")[0].trim()}', 'system-ui', 'sans-serif'],
          },
        },
      },
    };
  `;

  // ── CSS variables inject karo — bg-primary wagera bhi kaam karen ──────────
  // AI kabi hardcoded hex deta hai, kabi bg-primary — dono handle honge
  const cssVars = `
    :root {
      --color-primary:      ${colors.primary      || "#6366f1"};
      --color-secondary:    ${colors.secondary    || "#8b5cf6"};
      --color-accent:       ${colors.accent       || "#f59e0b"};
      --color-bg:           ${colors.background   || "#0a0a0a"};
      --color-surface:      ${colors.surface      || "#111827"};
      --color-surface2:     ${colors.surface_2    || "#1f2937"};
      --color-text-primary: ${colors.text_primary || "#f8fafc"};
      --color-text-muted:   ${colors.text_muted   || "#94a3b8"};
      --color-border:       ${colors.border       || "rgba(255,255,255,0.08)"};
    }

    /* ── Reset ─────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; }

    html { scroll-behavior: smooth; }

    body {
      background-color: var(--color-bg) !important;
      color: var(--color-text-primary);
      font-family: ${fontFamily};
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
    }

    /* ── Scrollbar ──────────────────────────────────────── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--color-bg); }
    ::-webkit-scrollbar-thumb { background: var(--color-surface2); border-radius: 3px; }

    /* ── Tailwind gap — text-text_primary wagera fix ────── */
    .text-text_primary   { color: var(--color-text-primary) !important; }
    .text-text_secondary { color: ${colors.text_secondary || "#cbd5e1"} !important; }
    .text-text_muted     { color: var(--color-text-muted) !important; }
    .bg-background       { background-color: var(--color-bg) !important; }
    .bg-surface          { background-color: var(--color-surface) !important; }
    .bg-surface_2        { background-color: var(--color-surface2) !important; }
    .border-border       { border-color: var(--color-border) !important; }

    /* ── Gradient text helper ───────────────────────────── */
    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Glow helpers ───────────────────────────────────── */
    .glow-primary {
      box-shadow: 0 0 40px color-mix(in srgb, var(--color-primary) 30%, transparent);
    }

    /* ── Section base ───────────────────────────────────── */
    section {
      position: relative;
    }

    /* ── Smooth image loading ───────────────────────────── */
    img {
      display: block;
      max-width: 100%;
    }

    /* ── Focus styles ───────────────────────────────────── */
    input:focus, textarea:focus, button:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  `;

  const iframeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${masterJson?.project?.name || "Preview"}</title>
  ${fontImport}
  <script>
    // Tailwind config MUST be set before CDN loads
    ${tailwindConfig}
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${cssVars}
  </style>
</head>
<body>
  <div id="preview-root">
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