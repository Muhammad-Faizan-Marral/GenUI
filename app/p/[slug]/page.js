"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "../../lib/supabase/client";

export default function ProjectPreview({ params }) {
  const [components, setComponents] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const iframeRef = useRef < HTMLIFrameElement > null;
  const supabase = createClient();

  const fetchComponents = async () => {
    try {
      const { data: project } = await supabase
        .from("projects")
        .select("project_name")
        .eq("project_id", params.projectId)
        .single();

      if (project) setProjectName(project.project_name);

      const { data, error } = await supabase
        .from("ComponentTable")
        .select(
          `
          comp_id,
          component_name,
          ai_response_code,
          order,
          ItemsTable!inner(editabel_id, item_code, order_num, type)
        `,
        )
        .eq("project_id", params.projectId)
        .order("order", { ascending: true });

      if (error) throw error;

      setComponents(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load project components");
    } finally {
      setLoading(false);
    }
  };

  // Render into iframe
  const renderIntoIframe = (comps) => {
    if (!iframeRef.current || comps.length === 0) return;

    let fullHTML = comps
      .map((comp) => {
        let wrapper = comp.ai_response_code || "<div></div>";

        const sortedItems = (comp.ItemsTable || []).sort(
          (a, b) => (a.order_num || 0) - (b.order_num || 0),
        );

        let childrenHTML = sortedItems
          .map((item) => item.item_code || "")
          .join("\n");

        wrapper = wrapper.replace(/\{children\}/g, childrenHTML);

        return wrapper;
      })
      .join("\n\n");

    const iframeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #09090b; color: white; }
    .preview-container { min-height: 100vh; }
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

  // Fetch + Realtime
  useEffect(() => {
    if (!params.projectId) return;

    fetchComponents();

    const channel = supabase
      .channel(`preview-${params.projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ComponentTable",
          filter: `project_id=eq.${params.projectId}`,
        },
        () => {
          console.log("New component detected → refreshing");
          fetchComponents();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ItemsTable",
        },
        () => {
          console.log("Items changed → refreshing");
          fetchComponents();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.projectId]);

  // Render iframe jab components update hon
  useEffect(() => {
    if (components.length > 0) {
      renderIntoIframe(components);
    }
  }, [components]);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-red-400 flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-semibold">
            {projectName || "Live Preview"}
          </h1>
          <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30">
            LIVE
          </span>
        </div>
        <div className="text-zinc-500 text-xs font-mono">
          {params.projectId}
        </div>
      </div>

      {/* Iframe Preview */}
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
