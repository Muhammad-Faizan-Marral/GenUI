"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase/client";
import { useProfile } from "../../hooks/useProfile";
import { useRouter } from "next/navigation";
import { getUserId } from "../../services/uiService";
import {Sparkles,LogOut,ExternalLink,LayoutGrid,User,ChevronRight,Layers,FolderOpen,Copy,Check,Trash2,} from "lucide-react";
import Link from "next/link";


// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ project, onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Modal Box */}
      <div className="relative rounded-2xl border border-white/[0.08] bg-[#0e0e10] shadow-2xl shadow-black/60 p-6 w-full max-w-sm">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 mb-4 mx-auto">
          <Trash2 size={18} className="text-red-400" />
        </div>
        <h3 className="text-sm font-semibold text-white text-center mb-1">
          Delete Project?
        </h3>
        <p className="text-xs text-zinc-500 text-center mb-5 leading-relaxed">
          <span className="text-zinc-300">
            &quot;{project.project_title}&quot;
          </span>{" "}
          permanently delete ho jayega. Yeh action undo nahi ho sakta.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 text-xs text-zinc-400 border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] px-4 py-2.5 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 text-xs text-white font-medium bg-red-600/80 hover:bg-red-600 border border-red-500/30 px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  const previewUrl = `${currentOrigin}/p/${project.slug}`;

  const handlePreview = () => {
    window.open(previewUrl, "_blank");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await onDelete(project.id);
    setDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          project={project}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          deleting={deleting}
        />
      )}

      <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
        {/* Card preview area */}
        <div className="h-24 bg-gradient-to-br from-violet-950/40 via-indigo-950/30 to-black/40 border-b border-white/[0.05] relative overflow-hidden flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4338ca 0%, transparent 40%)",
            }}
          />
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
            <Layers size={16} className="text-violet-400" />
          </div>

          {/* Action buttons — visible on hover */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
            {/* Copy URL */}
            <button
              onClick={handleCopy}
              title="Copy preview link"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/50 border border-white/[0.1] text-zinc-400 hover:text-violet-300 backdrop-blur-sm transition-colors"
            >
              {copied ? (
                <Check size={11} className="text-emerald-400" />
              ) : (
                <Copy size={11} />
              )}
            </button>

            {/* Delete */}
            <button
              onClick={() => setShowDeleteModal(true)}
              title="Delete project"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/50 border border-white/[0.1] text-zinc-400 hover:text-red-400 backdrop-blur-sm transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>

        {/* Card body — title + preview button */}
        <div className="p-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white leading-tight truncate flex-1">
            {project.project_title}
          </h3>

          <button
            onClick={handlePreview}
            className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-violet-300 bg-violet-600/10 hover:bg-violet-600/25 border border-violet-500/20 hover:border-violet-400/40 px-3 py-1.5 rounded-lg transition-all"
          >
            <ExternalLink size={11} />
            Preview
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = createClient();
  const { profile } = useProfile();
  console.log("Page of profile data is :" + profile)
  useEffect(() => {
    async function fetchProjects() {
      try {
        const userId = await getUserId();
        
        const { data, error } = await supabase
          .from("projects")
          .select("id, project_title, slug, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        setProjects(data || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Delete handler — called from ProjectCard
  const handleDelete = async (projectId) => {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Delete failed:", error.message);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[#080809] text-white antialiased">
      {/* ── Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-700/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-indigo-800/6 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <header className="relative border-b border-white/[0.05] h-14 flex items-center justify-between px-6 bg-[#080809]/70 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-900/50">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">
            gen<span className="text-violet-400">UI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/generate"
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-violet-900/40"
          >
            <Sparkles size={11} />
            New UI
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 border border-white/[0.07] bg-white/[0.03] px-3 py-2 rounded-xl transition-all"
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>
      </header>

      <div className="relative max-w-3xl mx-auto px-5 py-10">
        {/* ── Profile Card ── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-5 mb-5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-700/8 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40 shrink-0">
              <User size={20} className="text-white/80" />
            </div>

            <div className="flex-1 min-w-0">
              {profile ? (
                <h1 className="text-lg font-bold text-white tracking-tight truncate">
                  @{profile.username}
                </h1>
              ) : (
                <div className="h-5 w-32 bg-white/[0.06] rounded-md animate-pulse" />
              )}
            </div>

            <Link
              href="/settings"
              className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-violet-400 border border-white/[0.06] hover:border-violet-500/20 bg-white/[0.02] hover:bg-violet-950/20 px-3.5 py-2 rounded-xl transition-all"
            >
              Edit profile
              <ChevronRight size={11} />
            </Link>
          </div>
        </div>

        {/* ── Projects section ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid size={14} className="text-zinc-600" />
            <h2 className="text-sm font-semibold text-white">My Projects</h2>
            <span className="text-[11px] text-zinc-600 bg-white/[0.04] border border-white/[0.06] rounded-full px-2 py-0.5">
              {projects.length}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-pulse"
                >
                  <div className="h-24 bg-white/[0.03]" />
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="h-4 w-32 bg-white/[0.06] rounded-md" />
                    <div className="h-7 w-20 bg-white/[0.06] rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                <FolderOpen size={18} className="text-zinc-700" />
              </div>
              <p className="text-sm text-zinc-600">No projects yet</p>
              <p className="text-xs text-zinc-700 mt-1">
                Create your first UI to get started
              </p>
              <Link
                href="/generate"
                className="mt-4 flex items-center gap-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-medium border border-violet-500/20 px-4 py-2 rounded-xl transition-all"
              >
                <Sparkles size={11} />
                Generate UI
              </Link>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.04]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <LogOut size={12} />
            Sign out
          </button>
          <button className="text-xs text-red-500/40 hover:text-red-400/70 transition-colors">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
