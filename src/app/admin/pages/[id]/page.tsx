"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Loader2, LayoutTemplate, ChevronRight,
  Settings, Type, Image as ImageIcon, Briefcase,
  Star, HelpCircle, Phone, Users, Globe, ArrowUpRight, Trash2, ArrowLeft, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TemplateEditors } from "@/components/admin/editors";

const EDITOR_TEMPLATES = [
  { id: 'home', label: 'Home Page', icon: LayoutTemplate },
  { id: 'about', label: 'About Us', icon: Type },
  { id: 'services', label: 'Services Index', icon: Briefcase },
  { id: 'gallery', label: 'Project Gallery', icon: ImageIcon },
  { id: 'team', label: 'Team Directory', icon: Users },
  { id: 'careers', label: 'Career Board', icon: Briefcase },
  { id: 'reviews', label: 'Client Reviews', icon: Star },
  { id: 'faq', label: 'Support FAQ', icon: HelpCircle },
  { id: 'contact', label: 'Contact Center', icon: Phone },
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
        setMessage("Changes saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Permanently delete this page?")) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin/pages");
    } catch (err) {
      alert("Delete failed.");
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Precision Top Bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-[50]">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/pages" className="p-2 hover:bg-slate-50 rounded-xl transition-all">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div className="h-6 w-[1px] bg-slate-100" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-medium text-primary uppercase tracking-widest">{page.template} Template</span>
                <span className="text-slate-200 text-[10px]">•</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{page.slug === "/" ? "Home" : `/${page.slug}`}</span>
              </div>
              <h1 className="text-lg font-medium text-slate-900 tracking-tight">{page.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button
               onClick={() => window.open(`/${page.slug}`, "_blank")}
               className="p-3 text-slate-400 hover:text-slate-600 transition-all rounded-xl hover:bg-slate-50"
               title="Preview Live Page"
             >
               <ExternalLink className="w-5 h-5" />
             </button>
             <button
               onClick={handleDelete}
               className="p-3 text-slate-400 hover:text-red-500 transition-all rounded-xl hover:bg-red-50"
               title="Delete Page"
             >
               <Trash2 className="w-5 h-5" />
             </button>
             <div className="w-[1px] h-6 bg-slate-100 mx-2" />
             <button
               onClick={handleSave}
               disabled={saving}
               className="flex items-center gap-2.5 bg-primary text-white px-8 py-3 rounded-xl text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
             >
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               {saving ? "Saving Changes..." : "Publish Content"}
             </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-[1600px] mx-auto p-6 flex gap-6">
        
        {/* Sidebar: Page Settings */}
        <div className="w-80 shrink-0 space-y-6">
           <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Settings className="w-3.5 h-3.5" />
                   Core Configuration
                 </label>
                 
                 <div className="space-y-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-medium text-slate-500 uppercase ml-1">Template Layout</label>
                       <select
                         value={page.template}
                         onChange={(e) => handleUpdateTemplate(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all appearance-none"
                       >
                         {EDITOR_TEMPLATES.map((t) => (
                           <option key={t.id} value={t.id}>{t.label}</option>
                         ))}
                       </select>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[9px] font-medium text-slate-500 uppercase ml-1">Public Slug</label>
                       <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs">/</span>
                          <input
                            type="text"
                            value={page.slug}
                            onChange={(e) => setPage({ ...page, slug: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-7 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all"
                          />
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[9px] font-medium text-slate-500 uppercase ml-1">Display Title</label>
                       <input
                         type="text"
                         value={page.title}
                         onChange={(e) => setPage({ ...page, title: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all"
                       />
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-2 text-primary">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">Visibility: Public</span>
                 </div>
              </div>
           </div>

           <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
              <h4 className="text-[10px] font-medium text-primary uppercase tracking-widest mb-2">Editor Intelligence</h4>
              <p className="text-[11px] text-primary/60 leading-relaxed">
                You are currently editing the content for {page.title}. Changes will be reflected across all linked components automatically.
              </p>
           </div>
        </div>

        {/* Full Width Main Editor Area */}
        <div className="flex-1">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm min-h-[800px] overflow-hidden">
            {TemplateEditors[page.template] ? (
              <div className="animate-in fade-in duration-500">
                {(() => {
                  const Editor = TemplateEditors[page.template];
                  return <Editor pageId={id} data={content} setData={setContent} />;
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-20 text-center h-[800px]">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  <LayoutTemplate className="w-8 h-8 text-slate-200" />
                </div>
                <h2 className="text-xl font-medium text-slate-900 mb-2">Editor Template Ready</h2>
                <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
                  Select a template from the configuration sidebar to initialize the content canvas.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-10 right-10 z-[100] px-6 py-3 rounded-2xl font-medium text-xs shadow-2xl ${
              message.includes("Error") ? "bg-red-500 text-white" : "bg-primary text-white"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
