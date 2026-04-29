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
import SeoEditor from "@/components/admin/SeoEditor";

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
  const [seo, setSeo] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
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
        setSeo(data.seo || {});
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
          seo: seo,
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
      {/* Precision Top Bar - Now True Full Width */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-[50]">
        <div className="w-full px-10 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-1">
              <Link href="/admin/pages" className="hover:text-primary transition-colors">Pages</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-900">Dynamic Editor</span>
            </div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-4">
              {page.title || "Untitled Page"}
              <span className="text-[10px] font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-400 uppercase tracking-widest">{page.template}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <button
            onClick={handleDelete}
            className="px-6 py-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            Delete Page
          </button>

          <button
            onClick={() => window.open(`/${page.slug}`, "_blank")}
            className="px-6 py-3 text-[10px] font-medium text-slate-600 uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            Live Preview
            <ArrowUpRight className="w-3 h-3" />
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 bg-primary text-white px-8 py-3.5 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Publishing..." : "Update Page"}
          </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Vertically Stacked & True Full Width */}
      <div className="w-full px-10 py-6 space-y-6">
        
        {/* Core Configuration Grid: Above Editor */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
           <div className="grid grid-cols-12 gap-8 items-end">
              <div className="col-span-3 space-y-2">
                 <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <LayoutTemplate className="w-3 h-3" />
                   Template Layout
                 </label>
                 <select
                   value={page.template}
                   onChange={(e) => handleUpdateTemplate(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all appearance-none cursor-pointer"
                 >
                   {EDITOR_TEMPLATES.map((t) => (
                     <option key={t.id} value={t.id}>{t.label}</option>
                   ))}
                 </select>
              </div>

              <div className="col-span-3 space-y-2">
                 <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <Globe className="w-3 h-3" />
                   Public Slug
                 </label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs">/</span>
                    <input
                      type="text"
                      value={page.slug}
                      onChange={(e) => setPage({ ...page, slug: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-7 pr-4 py-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all"
                    />
                 </div>
              </div>

              <div className="col-span-6 space-y-2">
                 <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <Type className="w-3 h-3" />
                   Display Title
                 </label>
                 <input
                   type="text"
                   value={page.title}
                   onChange={(e) => setPage({ ...page, title: e.target.value })}
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all"
                   placeholder="Enter page title..."
                 />
              </div>
           </div>
        </div>

        {/* Full Width Main Editor Area */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm min-h-[800px] overflow-hidden flex flex-col">
          {/* Internal Tabs */}
          <div className="flex items-center gap-8 px-10 py-5 border-b border-slate-50 bg-slate-50/30">
            <button
              onClick={() => setActiveTab('content')}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 ${
                activeTab === 'content' ? "text-primary" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Page Content
              {activeTab === 'content' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 ${
                activeTab === 'seo' ? "text-primary" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              SEO Settings
              {activeTab === 'seo' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'content' ? (
              TemplateEditors[page.template] ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {(() => {
                    const Editor = TemplateEditors[page.template];
                    return <Editor pageId={id} data={content} setData={setContent} />;
                  })()}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-20 text-center h-[700px]">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                    <LayoutTemplate className="w-8 h-8 text-slate-200" />
                  </div>
                  <h2 className="text-xl font-medium text-slate-900 mb-2">Editor Template Ready</h2>
                  <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
                    Select a template from the configuration row above to initialize the content canvas.
                  </p>
                </div>
              )
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full">
                <SeoEditor 
                  data={seo} 
                  setData={setSeo} 
                  pageSlug={page.slug} 
                  pageTitle={page.title} 
                  pageContent={content}
                />
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
