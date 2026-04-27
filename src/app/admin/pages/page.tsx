"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Home, Info, HelpCircle, Phone, ArrowRight, 
  ChevronRight, Layout, Star, Folder, Briefcase, 
  Loader2, Globe, Search, Trash2, X, LayoutTemplate
} from "lucide-react";

export default function PagesDashboard() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  
  // New Page Form
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    template: "about"
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      setPages(data);
    } catch (err) {
      console.error("Failed to fetch pages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    if (!newPage.title || !newPage.slug) return alert("Title and Slug are required.");
    
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPage)
      });
      if (res.ok) {
        const created = await res.json();
        window.location.href = `/admin/pages/${created._id}`;
      }
    } catch (err) {
      alert("Failed to create page.");
    }
  };

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-black" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-black uppercase tracking-widest mb-2">
            <Link href="/admin" className="hover:opacity-70 transition-opacity">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Content CMS</span>
          </div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight">Website Pages</h1>
          <p className="text-slate-500 font-medium italic">Manage every page, layout, and route on your site.</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Page
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium focus:border-black outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Pages Table/List */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {filteredPages.length > 0 ? filteredPages.map((page, i) => (
            <Link key={page._id} href={`/admin/pages/${page._id}`} className="group block">
              <div className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <LayoutTemplate className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black group-hover:text-black transition-colors">{page.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-400 text-xs font-medium uppercase tracking-widest flex items-center gap-1.5">
                        <Globe className="w-3 h-3" />
                        /{page.slug}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className="bg-slate-100 text-black/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200/50">
                        {page.template}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-black transition-colors">Edit Content</span>
                  <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          )) : (
            <div className="p-20 text-center">
               <p className="text-slate-400 font-medium">No pages found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Page Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-black transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-extrabold text-black tracking-tight mb-2">Create New Page</h2>
              <p className="text-slate-500 font-medium mb-8 text-sm">Define your new page's identity and layout.</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black uppercase tracking-widest">Page Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Our History"
                    value={newPage.title}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
                      setNewPage({ ...newPage, title: e.target.value, slug });
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-bold focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black uppercase tracking-widest">URL Slug</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">/</span>
                    <input 
                      type="text" 
                      value={newPage.slug}
                      onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-6 py-4 text-black font-bold focus:bg-white focus:border-black outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black uppercase tracking-widest">Template Layout</label>
                  <select 
                    value={newPage.template}
                    onChange={(e) => setNewPage({ ...newPage, template: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-bold focus:bg-white focus:border-black outline-none transition-all appearance-none"
                  >
                    <option value="about">About Us</option>
                    <option value="services">Services List</option>
                    <option value="gallery">Gallery</option>
                    <option value="team">Team Directory</option>
                    <option value="faq">FAQ Page</option>
                    <option value="contact">Contact Page</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>

                <button 
                  onClick={handleCreatePage}
                  className="w-full bg-black text-white py-5 rounded-[1.5rem] font-bold shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                >
                  Confirm & Create Page
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
