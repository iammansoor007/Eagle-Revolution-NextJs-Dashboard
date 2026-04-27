"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Loader2, LayoutTemplate, ChevronRight,
  Settings, Type, Image as ImageIcon, Briefcase,
  Star, HelpCircle, Phone, Users, Globe, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TemplateEditors } from "@/components/admin/editors";

// Placeholder Editor Components (We will move the real logic here soon)
const EDITOR_TEMPLATES = [
  { id: 'home', label: 'Homepage Template', icon: LayoutTemplate },
  { id: 'about', label: 'About Us Template', icon: Type },
  { id: 'services', label: 'Services Template', icon: Briefcase },
  { id: 'gallery', label: 'Gallery Template', icon: ImageIcon },
  { id: 'team', label: 'Team Template', icon: Users },
  { id: 'careers', label: 'Careers Template', icon: Briefcase },
  { id: 'reviews', label: 'Reviews Template', icon: Star },
  { id: 'faq', label: 'FAQ Template', icon: HelpCircle },
  { id: 'contact', label: 'Contact Template', icon: Phone },
  { id: 'service-detail', label: 'Service Detail', icon: Settings },
];

export default function DynamicPageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [page, setPage] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/admin/pages/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPage(data);
        setContent(data.content || {});
      } else {
        router.push('/admin/pages');
      }
    } catch (err) {
      console.error("Failed to fetch page:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (newTemplate: string) => {
    if (!confirm(`Switching to "${newTemplate}" will change the editor fields. Continue?`)) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: newTemplate }),
      });
      if (res.ok) {
        setPage({ ...page, template: newTemplate });
        setMessage("Template switched successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Failed to update template:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          metadata: page.metadata,
          content: content
        }),
      });
      if (res.ok) {
        setMessage("Page and content updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this page? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/pages");
      }
    } catch (err) {
      alert("Failed to delete page.");
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      {/* Top Header: Identity & Primary Actions */}
      <div className="flex flex-wrap items-end justify-between gap-8 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-2">
            <Link href="/admin/pages" className="hover:text-black transition-colors">Pages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black">Dynamic Editor</span>
          </div>
          <h1 className="text-4xl font-black text-black tracking-tighter flex items-center gap-4">
            {page.title || "Untitled Page"}
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-400 uppercase tracking-widest">{page.template}</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Secondary Actions */}
          <button
            onClick={handleDelete}
            className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            Delete Page
          </button>

          <button
            onClick={() => window.open(`/${page.slug}`, "_blank")}
            className="px-6 py-3 text-[10px] font-bold text-black uppercase tracking-widest border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            Live Preview
            <ArrowUpRight className="w-3 h-3" />
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Publishing..." : "Update Page"}
          </button>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-full font-bold text-sm shadow-2xl ${message.includes("success") ? "bg-black text-white" : "bg-red-500 text-white"
            }`}
        >
          {message}
        </motion.div>
      )}

      {/* Top Configuration Bar */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 mb-10 shadow-sm">
        <div className="flex flex-wrap items-center gap-10">
          {/* Template Selector */}
          <div className="flex-1 min-w-[200px] space-y-3">
            <label className="text-[10px] font-extrabold text-black uppercase tracking-[0.2em] flex items-center gap-2">
              <LayoutTemplate className="w-3 h-3" />
              Layout Template
            </label>
            <div className="relative group">
              <select
                value={page.template}
                onChange={(e) => handleUpdateTemplate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-xs font-bold text-black focus:bg-white focus:border-black outline-none transition-all appearance-none cursor-pointer"
              >
                {EDITOR_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          {/* Page Title */}
          <div className="flex-[1.5] min-w-[250px] space-y-3">
            <label className="text-[10px] font-extrabold text-black uppercase tracking-[0.2em]">Page Identity (Title)</label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-xs font-bold text-black focus:bg-white focus:border-black outline-none transition-all"
              placeholder="e.g. My Awesome Page"
            />
          </div>

          {/* Slug */}
          <div className="flex-1 min-w-[200px] space-y-3">
            <label className="text-[10px] font-extrabold text-black uppercase tracking-[0.2em]">Live URL Path (Slug)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">/</span>
              <input
                type="text"
                value={page.slug}
                onChange={(e) => setPage({ ...page, slug: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3.5 text-xs font-bold text-black focus:bg-white focus:border-black outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Main Editor Area */}
      <div className="w-full">
        <div className="bg-white border border-slate-200 rounded-[3rem] shadow-xl shadow-slate-200/50 min-h-[700px] overflow-hidden">
          {TemplateEditors[page.template] ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {(() => {
                const Editor = TemplateEditors[page.template];
                return <Editor pageId={id} data={content} setData={setContent} />;
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-center h-full min-h-[700px]">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8">
                <LayoutTemplate className="w-12 h-12 text-slate-200" />
              </div>
              <h2 className="text-3xl font-black text-black mb-4">
                {EDITOR_TEMPLATES.find(t => t.id === page.template)?.label || "Ready to Design"}
              </h2>
              <p className="text-slate-400 max-w-md font-medium text-sm leading-relaxed mb-10">
                The intelligent editor for this layout is ready. You can start building your sections immediately.
              </p>

              <div className="inline-flex items-center gap-4 px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em]">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Secure Canvas Loaded
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
