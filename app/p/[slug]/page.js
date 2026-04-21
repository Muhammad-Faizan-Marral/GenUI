"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "../../lib/supabase/client";
import { processAiEdit } from "../../services/masterService";
import { Update_Component_Code } from "../../services/dbService";

export default function ProjectPreview({ params }) {
  const resolvedParams = React.use(params);
  const projectId = resolvedParams.slug;

  const [components, setComponents] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [masterJson, setMasterJson] = useState(null);
  const [totalSections, setTotalSections] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Edit state
  const [selectedData, setSelectedData] = useState(null); // { compId, elementId }
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const iframeRef = useRef(null);
  const supabase = createClient();

  // ── Fetch All ──────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);

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

      const { data, error: compError } = await supabase
        .from("ComponentTable")
        .select("comp_id, component_name, ai_response_code, order")
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
  }, [projectId]);

  // ── Iframe Render ──────────────────────────────────────────────────────────
  const renderIntoIframe = useCallback(
    (comps) => {
      if (!iframeRef.current || comps.length === 0 || !masterJson) return;

      const colors = masterJson?.design_system?.colors || {};
      const typography = masterJson?.design_system?.typography || {};
      const fontFamily = typography.font_family || "Inter, sans-serif";
      const fontImport = masterJson?.project?.font_import
        ? `<link href="${masterJson.project.font_import}" rel="stylesheet">`
        : `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`;

      // Har section ko data-section-id se wrap karo
      const fullHTML = comps
        .map(
          (comp) => `
        <div data-section-id="${comp.comp_id}">
          ${comp.ai_response_code}
        </div>`,
        )
        .join("\n");

      const iframeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${masterJson?.project?.name || "Preview"}</title>
  ${fontImport}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; }
    html { scroll-behavior: smooth; }
    body {
      background-color: ${colors.background || "#0a0a0a"};
      color: ${colors.text_primary || "#f8fafc"};
      font-family: ${fontFamily};
      -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${colors.background || "#0a0a0a"}; }
    ::-webkit-scrollbar-thumb { background: ${colors.surface_2 || "#1f2937"}; border-radius: 3px; }

    /* Edit mode styles */
    [data-gen-id] { cursor: pointer; transition: outline 0.15s; }
    [data-gen-id]:hover { outline: 2px dashed #6366f1; outline-offset: 3px; }
    .gen-selected { outline: 2px solid #6366f1 !important; outline-offset: 3px; box-shadow: 0 0 20px rgba(99,102,241,0.4); }
  </style>
</head>
<body>
  <div id="preview-root">${fullHTML}</div>

  <script>
    let currentSelected = null;

    document.addEventListener('click', (e) => {
      // data-gen-id wala element dhundo
      const target = e.target.closest('[data-gen-id]');
      if (!target) {
        // Blank area click → deselect
        if (currentSelected) {
          currentSelected.classList.remove('gen-selected');
          currentSelected = null;
          window.parent.postMessage({ type: 'ELEMENT_DESELECTED' }, '*');
        }
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Previous selection remove karo
      if (currentSelected) currentSelected.classList.remove('gen-selected');

      // Naya select karo
      target.classList.add('gen-selected');
      currentSelected = target;

      // Parent section ka comp_id nikalo
      const sectionWrapper = target.closest('[data-section-id]');
      const compId = sectionWrapper?.getAttribute('data-section-id') || null;
      const elementId = target.getAttribute('data-gen-id');

      window.parent.postMessage({
        type: 'ELEMENT_SELECTED',
        compId,
        elementId,
        elementTag: target.tagName.toLowerCase(),
        elementText: target.textContent?.trim().slice(0, 50) || '',
      }, '*');
    });
  </script>
</body>
</html>`;

      iframeRef.current.srcdoc = "";
      requestAnimationFrame(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = iframeHTML;
        }
      });
    },
    [masterJson],
  );

  // ── postMessage Listener — SIRF EK BAAR ───────────────────────────────────
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "ELEMENT_SELECTED") {
        setSelectedData({
          compId: event.data.compId,
          elementId: event.data.elementId,
          elementTag: event.data.elementTag,
          elementText: event.data.elementText,
        });
        console.log("🎯 Selected:", event.data.elementId);
      }

      if (event.data.type === "ELEMENT_DESELECTED") {
        setSelectedData(null);
        setEditPrompt("");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage); // cleanup
  }, []); // empty array — sirf ek baar

  // ── Edit Submit ────────────────────────────────────────────────────────────
// 3. handleEditSubmit — DB ke baad LOCAL STATE bhi update karo, realtime ka wait mat karo
const handleEditSubmit = async () => {
  if (!selectedData || !editPrompt.trim()) return;

  setIsEditing(true);
  try {
    const currentSection = components.find(
      (c) => c.comp_id === selectedData.compId
    );
    if (!currentSection) throw new Error("Section not found");

    // AI call
    const newCode = await processAiEdit(
      currentSection.ai_response_code,
      selectedData.elementId,
      editPrompt
    );

    // ✅ FIX 1: Local state IMMEDIATELY update karo
    const updatedComponents = components.map((c) =>
      c.comp_id === selectedData.compId
        ? { ...c, ai_response_code: newCode }
        : c
    );
    setComponents(updatedComponents);

    // ✅ FIX 2: Iframe force refresh karo
    renderIntoIframe(updatedComponents);

    // DB update (background mein)
    await Update_Component_Code(selectedData.compId, newCode);

    setEditPrompt("");
    setSelectedData(null);
    console.log("✅ Edit applied!");
  } catch (err) {
    console.error("❌ Edit failed:", err);
  } finally {
    setIsEditing(false);
  }
}

// 4. useEffect dependency fix karo
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
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [projectId, fetchAll]); // ✅ fetchAll add kiya


  // ── Render iframe when components update ───────────────────────────────────
  useEffect(() => {
    if (components.length > 0) renderIntoIframe(components);
  }, [components, masterJson]);

  // ── UI ─────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-red-400 flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-semibold">
            {projectName || "Live Preview"}
          </h1>
          <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30">
            LIVE
          </span>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          {components.length} / {totalSections} sections
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 pt-14">
        {loading && components.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
            <div className="w-8 h-8 border-4 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
            <p>Building your website...</p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full border-0"
            style={{ height: "calc(100vh - 56px)" }}
            sandbox="allow-scripts allow-same-origin"
            title="Live Preview"
          />
        )}
      </div>

      {/* Edit Prompt Bar — sirf jab element select ho */}
      {selectedData && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[560px] max-w-[90vw]">
          <div className="bg-zinc-900 border border-violet-500/40 rounded-2xl shadow-2xl shadow-violet-500/10 p-3 flex flex-col gap-2">
            {/* Selected element info */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs text-zinc-500">Editing:</span>
              <span className="text-xs text-violet-400 font-mono bg-violet-500/10 px-2 py-0.5 rounded">
                {selectedData.elementTag} — {selectedData.elementId}
              </span>
              {selectedData.elementText && (
                <span className="text-xs text-zinc-500 truncate max-w-[160px]">
                  &quot;{selectedData.elementText}&quot;
                </span>
              )}
            </div>

            {/* Input row */}
            <div className="flex gap-2">
              <input
                autoFocus
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder='e.g. "make this button red" or "change text to Get Started"'
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isEditing && handleEditSubmit()
                }
              />
              <button
                onClick={handleEditSubmit}
                disabled={isEditing || !editPrompt.trim()}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                {isEditing ? "Applying..." : "Apply"}
              </button>
              <button
                onClick={() => {
                  setSelectedData(null);
                  setEditPrompt("");
                }}
                className="text-zinc-500 hover:text-zinc-300 px-3 rounded-xl transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
