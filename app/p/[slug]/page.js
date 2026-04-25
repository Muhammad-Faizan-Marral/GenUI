"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "../../lib/supabase/client";
import { processAiEdit } from "../../services/masterService";
import { Update_Component_Code } from "../../services/dbService";

// ─────────────────────────────────────────────────────────────────────────────
// buildShadowContent – returns full HTML to be placed inside Shadow Root
// Includes component's own HTML/CSS + selection script (no height reporting)
// ─────────────────────────────────────────────────────────────────────────────
function buildShadowContent(comp, masterJson) {
  const colors = masterJson?.design_system?.colors || {};
  const typography = masterJson?.design_system?.typography || {};
  const fontFamily = typography.font_family || "Inter, sans-serif";

  const fontImport = masterJson?.project?.font_import
    ? `<link href="${masterJson.project.font_import}" rel="stylesheet">`
    : `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`;

  const safeId = String(comp.comp_id).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  // Component's own HTML/CSS (may contain style, script, markup)
  const componentMarkup = comp.ai_response_code || "";

  return `<!DOCTYPE html>
<html>
<head>
  ${fontImport}
  <style>
    /* Base reset + selection styles – these do NOT affect component's own animations */
    :host {
      display: block;
      width: 100%;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: ${colors.background || "#0a0a0a"};
      font-family: ${fontFamily};
    }
    [data-gen-id] { cursor: pointer; }
    [data-gen-id]:hover { outline: 2px dashed #6366f1; outline-offset: 2px; }
    .gen-selected {
      outline: 2px solid #6366f1 !important;
      outline-offset: 3px;
      box-shadow: 0 0 20px rgba(99,102,241,0.35);
    }
  </style>
</head>
<body>
  ${componentMarkup}

  <script>
    (function() {
      const COMP_ID = "${safeId}";
      let selectedElement = null;

      // Handle element selection
      function setupSelection() {
        document.body.addEventListener('click', (e) => {
          let target = e.target.closest('[data-gen-id]');
          if (!target) {
            if (selectedElement) {
              selectedElement.classList.remove('gen-selected');
              selectedElement = null;
              window.parent.postMessage({ type: 'ELEMENT_DESELECTED' }, '*');
            }
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          if (selectedElement) selectedElement.classList.remove('gen-selected');
          target.classList.add('gen-selected');
          selectedElement = target;
          window.parent.postMessage({
            type: 'ELEMENT_SELECTED',
            compId: COMP_ID,
            elementId: target.getAttribute('data-gen-id'),
            elementTag: target.tagName.toLowerCase(),
            elementText: (target.textContent || '').trim().slice(0, 60),
          }, '*');
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSelection);
      } else {
        setupSelection();
      }
    })();
  <\/script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionShadow – uses Shadow DOM + ResizeObserver (from React) for height
// ─────────────────────────────────────────────────────────────────────────────
const SectionShadow = React.memo(
  ({ comp, masterJson, onHeightChange }) => {
    const hostRef = useRef(null);
    const shadowRootRef = useRef(null);
    const prevCodeRef = useRef(comp.ai_response_code);
    const resizeObserverRef = useRef(null);

    // Build or update shadow DOM content
    const updateShadowContent = useCallback(() => {
      if (!hostRef.current) return;
      let root = shadowRootRef.current;
      if (!root) {
        root = hostRef.current.attachShadow({ mode: "open" });
        shadowRootRef.current = root;
      }
      const content = buildShadowContent(comp, masterJson);
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      root.innerHTML = "";
      // Transfer head children
      Array.from(doc.head.children).forEach(node => root.appendChild(node.cloneNode(true)));
      // Transfer body children
      Array.from(doc.body.children).forEach(node => root.appendChild(node.cloneNode(true)));

      // Re-execute scripts to ensure event listeners are attached
      root.querySelectorAll("script").forEach(script => {
        const newScript = document.createElement("script");
        newScript.textContent = script.textContent;
        script.parentNode?.replaceChild(newScript, script);
      });
    }, [comp, masterJson]);

    // Update when component code changes
    useEffect(() => {
      if (prevCodeRef.current !== comp.ai_response_code) {
        prevCodeRef.current = comp.ai_response_code;
        updateShadowContent();
      }
    }, [comp.ai_response_code, updateShadowContent]);

    // Initial mount
    useEffect(() => {
      updateShadowContent();
    }, [updateShadowContent]);

    // Observe host element's height and report to parent
    useEffect(() => {
      if (!hostRef.current) return;
      const host = hostRef.current;
      const sendHeight = () => {
        const height = host.scrollHeight;
        if (height > 0 && onHeightChange) {
          onHeightChange(comp.comp_id, height);
        }
      };
      resizeObserverRef.current = new ResizeObserver(() => sendHeight());
      resizeObserverRef.current.observe(host);
      // Initial report
      sendHeight();
      // Also report after images/fonts load
      window.addEventListener("load", sendHeight);
      return () => {
        resizeObserverRef.current?.disconnect();
        window.removeEventListener("load", sendHeight);
      };
    }, [comp.comp_id, onHeightChange]);

    return (
      <div
        ref={hostRef}
        data-comp-id={comp.comp_id}
        style={{
          display: "block",
          width: "100%",
          overflow: "visible",
        }}
      />
    );
  },
  (prev, next) =>
    prev.comp.comp_id === next.comp.comp_id &&
    prev.comp.ai_response_code === next.comp.ai_response_code &&
    prev.masterJson === next.masterJson
);
SectionShadow.displayName = "SectionShadow";

// ─────────────────────────────────────────────────────────────────────────────
// sortComponents – unchanged, uses order from DB or masterJson sections
// ─────────────────────────────────────────────────────────────────────────────
function sortComponents(compsMap, masterJson) {
  const arr = Array.from(compsMap.values());
  if (!masterJson?.sections?.length) {
    return arr.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  }
  const idxMap = new Map();
  masterJson.sections.forEach((sec, i) => {
    if (sec.id) idxMap.set(sec.id, i);
    if (sec.comp_id) idxMap.set(sec.comp_id, i);
    if (sec.name) idxMap.set(sec.name, i);
  });
  return arr.sort((a, b) => {
    const ai = idxMap.has(a.comp_id) ? idxMap.get(a.comp_id)
             : idxMap.has(a.component_name) ? idxMap.get(a.component_name)
             : (a.order ?? 9999);
    const bi = idxMap.has(b.comp_id) ? idxMap.get(b.comp_id)
             : idxMap.has(b.component_name) ? idxMap.get(b.component_name)
             : (b.order ?? 9999);
    return ai - bi;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main ProjectPreview Page
// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectPreview({ params }) {
  const resolvedParams = React.use(params);
  const projectId = resolvedParams.slug;

  const [compsMap, setCompsMap] = useState(new Map());
  const [masterJson, setMasterJson] = useState(null);
  const [totalSections, setTotalSections] = useState(0);
  const [projectLoading, setProjectLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeHeights, setIframeHeights] = useState({});

  // Edit state
  const [selectedData, setSelectedData] = useState(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState("");

  const supabase = useRef(createClient()).current;
  const masterJsonRef = useRef(null);

  const components = sortComponents(compsMap, masterJsonRef.current);
  const loadedCount = components.length;
  const allLoaded = totalSections > 0 && loadedCount >= totalSections;

  // Handle height updates from SectionShadow
  const handleHeightChange = useCallback((compId, height) => {
    setIframeHeights(prev => {
      if (prev[compId] === height) return prev;
      return { ...prev, [compId]: height };
    });
  }, []);

  // Fetch project master_json
  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("master_json")
        .eq("project_id", projectId)
        .single();
      if (error) throw error;
      masterJsonRef.current = data.master_json;
      setMasterJson(data.master_json);
      setTotalSections(data.master_json?.sections?.length || 0);
    } catch (err) {
      console.error("Project fetch error:", err);
      setError("Project load karne mein masla hua.");
    } finally {
      setProjectLoading(false);
    }
  }, [projectId, supabase]);

  // Fetch components – only existing columns
  const fetchComponents = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data, error } = await supabase
        .from("ComponentTable")
        .select("comp_id, component_name, ai_response_code, order")
        .eq("project_id", projectId)
        .order("order", { ascending: true });
      if (error) throw error;
      const map = new Map();
      (data || []).forEach((c) => map.set(c.comp_id, c));
      setCompsMap(map);
    } catch (err) {
      console.error("Components fetch error:", err);
      setError("Components load karne mein masla hua.");
    }
  }, [projectId, supabase]);

  // Initial load + realtime subscription
  useEffect(() => {
    if (!projectId) return;
    fetchProject();
    fetchComponents();

    const channel = supabase
      .channel(`preview-${projectId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "ComponentTable",
        filter: `project_id=eq.${projectId}`,
      }, ({ new: row }) => {
        setCompsMap((prev) => {
          if (prev.has(row.comp_id)) return prev;
          const next = new Map(prev);
          next.set(row.comp_id, row);
          return next;
        });
      })
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "ComponentTable",
        filter: `project_id=eq.${projectId}`,
      }, ({ new: row }) => {
        setCompsMap((prev) => {
          if (!prev.has(row.comp_id)) return prev;
          const next = new Map(prev);
          next.set(row.comp_id, { ...prev.get(row.comp_id), ...row });
          return next;
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [projectId, supabase, fetchProject, fetchComponents]);

  // Listen for messages from Shadow DOM (element selection only)
  useEffect(() => {
    const onMessage = ({ data: msg }) => {
      if (!msg?.type) return;
      if (msg.type === "ELEMENT_SELECTED") {
        setSelectedData({
          compId: msg.compId,
          elementId: msg.elementId,
          elementTag: msg.elementTag,
          elementText: msg.elementText,
        });
        setEditError("");
      }
      if (msg.type === "ELEMENT_DESELECTED") {
        setSelectedData(null);
        setEditPrompt("");
        setEditError("");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // AI Edit submission
  const handleEditSubmit = useCallback(async () => {
    if (!selectedData || !editPrompt.trim() || isEditing) return;
    setIsEditing(true);
    setEditError("");
    try {
      const current = compsMap.get(selectedData.compId);
      if (!current) throw new Error("Section not found");

      const newCode = await processAiEdit(
        current.ai_response_code,
        selectedData.elementId,
        editPrompt
      );

      // Optimistic update
      setCompsMap((prev) => {
        const next = new Map(prev);
        const existing = prev.get(selectedData.compId);
        if (existing) {
          next.set(selectedData.compId, { ...existing, ai_response_code: newCode });
        }
        return next;
      });

      // Persist to DB
      Update_Component_Code(selectedData.compId, newCode).catch(console.error);
      setEditPrompt("");
      setSelectedData(null);
    } catch (err) {
      console.error("Edit failed:", err);
      setEditError("Edit apply nahi ho saki. Dobara try karein.");
    } finally {
      setIsEditing(false);
    }
  }, [selectedData, editPrompt, isEditing, compsMap]);

  const handleCancelEdit = useCallback(() => {
    setSelectedData(null);
    setEditPrompt("");
    setEditError("");
  }, []);

  // Loading or error display
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-red-400 flex items-center justify-center gap-3">
        <span>⚠️</span><span>{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Full-page loader */}
      {projectLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-zinc-950">
          <div className="w-8 h-8 border-4 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Project load ho raha hai…</p>
        </div>
      )}

      {/* Progress indicator */}
      {!allLoaded && !projectLoading && totalSections > 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-zinc-900/90 backdrop-blur border border-zinc-700/50 rounded-full px-4 py-2 flex items-center gap-3 shadow-xl">
            <div className="w-4 h-4 border-2 border-zinc-600 border-t-violet-400 rounded-full animate-spin" />
            <span className="text-xs text-zinc-400">
              Sections: <span className="text-violet-400 font-semibold">{loadedCount}/{totalSections}</span>
            </span>
            <div className="w-24 h-1 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((loadedCount / totalSections) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Render sections */}
      {!projectLoading && masterJson && (
        <div className="w-full">
          {components.length === 0 ? (
            <div className="h-screen flex items-center justify-center text-zinc-600 text-sm">
              Sections generate ho rahe hain…
            </div>
          ) : (
            components.map((comp) => (
              <SectionShadow
                key={comp.comp_id}
                comp={comp}
                masterJson={masterJson}
                onHeightChange={handleHeightChange}
              />
            ))
          )}
        </div>
      )}

      {/* Edit bar (unchanged) */}
      {selectedData && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[580px] max-w-[92vw]">
          <div className="bg-zinc-900 border border-violet-500/40 rounded-2xl shadow-2xl shadow-violet-500/10 p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1 flex-wrap">
              <span className="text-xs text-zinc-500">Editing:</span>
              <span className="text-xs text-violet-400 font-mono bg-violet-500/10 px-2 py-0.5 rounded">
                {selectedData.elementTag} · {selectedData.elementId}
              </span>
              {selectedData.elementText && (
                <span className="text-xs text-zinc-500 truncate max-w-[180px]">
                  "{selectedData.elementText}"
                </span>
              )}
            </div>

            {editError && <p className="text-xs text-red-400 px-1">{editError}</p>}

            <div className="flex gap-2">
              <input
                autoFocus
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder='e.g. "button laal karo" ya "heading bold karo"'
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isEditing && handleEditSubmit()}
              />
              <button
                onClick={handleEditSubmit}
                disabled={isEditing || !editPrompt.trim()}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                {isEditing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Applying…
                  </span>
                ) : "Apply"}
              </button>
              <button
                onClick={handleCancelEdit}
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