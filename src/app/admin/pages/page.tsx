"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, ChevronRight, Loader2, Search, Trash2, X, ExternalLink, Edit3, Check, Copy, MoreHorizontal,
  Info, Briefcase, HelpCircle, Mail, UserCheck, ArrowRight, Eye, EyeOff, Image as GalleryIcon
} from "lucide-react";

export default function PagesDashboard() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // New Page Form
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    template: "about",
    status: "draft"
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

  const handleBulkDelete = async () => {
    if (!confirm(`Permanently delete ${selectedIds.length} pages?`)) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds })
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchPages();
      }
    } catch (err) {
      alert("Bulk delete failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDuplicate = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'duplicate', ids: selectedIds })
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchPages();
      }
    } catch (err) {
      alert("Duplication failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleIndividualAction = async (e: React.MouseEvent, action: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (action === 'delete') {
      if (!confirm("Permanently delete this page?")) return;
      try {
        const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
        if (res.ok) fetchPages();
      } catch (err) { alert("Delete failed."); }
    }

    if (action === 'duplicate') {
      try {
        const res = await fetch("/api/admin/pages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: 'duplicate', ids: [id] })
        });
        if (res.ok) fetchPages();
      } catch (err) { alert("Duplication failed."); }
    }

    if (action === 'status') {
      const currentStatus = pages.find(p => p._id === id)?.status || 'draft';
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      try {
        const res = await fetch(`/api/admin/pages/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) fetchPages();
      } catch (err) { alert("Status update failed."); }
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="w-full px-12 py-12 min-h-screen bg-[#F8FAFC]">
      {/* Header Area */}
      <div className="flex flex-wrap items-center justify-between gap-10 mb-16 px-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-600 uppercase tracking-[0.2em]">
            <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">System Inventory</span>
          </div>
          <h1 className="text-2xl font-medium text-slate-900 tracking-tight">Website Pages</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              placeholder="Search by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-[11px] font-medium outline-none focus:border-primary/30 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl text-xs font-medium hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Page
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-white border border-slate-900/5 rounded-3xl p-5 flex items-center justify-between px-10 shadow-2xl shadow-slate-200"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full">
                <span className="text-[10px] font-medium text-primary uppercase tracking-widest">{selectedIds.length}</span>
                <span className="text-[10px] font-medium text-slate-800 uppercase tracking-widest">Selected</span>
              </div>
              <button
                onClick={() => setSelectedIds([])}
                className="text-[10px] font-medium text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkDuplicate}
                disabled={actionLoading}
                className="flex items-center gap-2 text-slate-600 px-6 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-100"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
                Duplicate
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading}
                className="flex items-center gap-2 bg-red-50 text-red-500 px-6 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pages Container */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {filteredPages.length > 0 ? filteredPages.map((page) => (
            <div key={page._id} className="group relative px-12 py-10 hover:bg-slate-50/30 transition-all flex items-center gap-12">

              {/* Checkbox */}
              <button
                onClick={() => toggleSelect(page._id)}
                className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${selectedIds.includes(page._id)
                    ? "bg-primary border-primary text-white"
                    : "border-slate-100 bg-white group-hover:border-slate-200"
                  }`}
              >
                {selectedIds.includes(page._id) && <Check className="w-4 h-4" />}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-medium text-slate-900 tracking-tight group-hover:text-primary transition-colors">{page.title}</h3>
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] bg-slate-50/50 px-3 py-1 rounded-full border border-slate-100">
                    /{page.slug}
                  </span>
                  <button
                    onClick={(e) => handleIndividualAction(e, 'status', page._id)}
                    className={`text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all flex items-center gap-2 ${page.status === 'published'
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                  >
                    {page.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {page.status || 'draft'}
                  </button>
                </div>

                {/* Refined Actions Row */}
                <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.15em]">
                  <Link href={`/admin/pages/${page._id}`} className="text-primary/70 hover:text-primary transition-all text-[9px]">
                    Edit
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link href={`/${page.slug}`} target="_blank" className="text-slate-600 hover:text-slate-900 transition-all text-[9px]">
                    Preview
                  </Link>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={(e) => handleIndividualAction(e, 'duplicate', page._id)}
                    className="text-slate-600 hover:text-slate-900 transition-all text-[9px]"
                  >
                    Duplicate
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={(e) => handleIndividualAction(e, 'delete', page._id)}
                    className="text-slate-600 hover:text-red-500 transition-all text-[9px]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[9px] font-bold text-slate-700 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100">
                  {page.template}
                </div>
              </div>
            </div>
          )) : (
            <div className="p-40 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-50">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h2 className="text-lg font-medium text-slate-900 mb-2">No matching pages found</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try refining your search keywords or create a new page to expand your inventory.</p>
            </div>
          )}
        </div>
      </div>

      {/* High-End Initialize Page Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
            >
              {/* Modal Header */}
              <div className="bg-slate-50/50 px-12 py-10 border-b border-slate-100 flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Initialize New Page</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Route configuration & template assignment</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-primary/20 transition-all shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 space-y-7">

                {/* Section 1: Identity */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Page Identity</label>
                    <input
                      type="text"
                      placeholder="e.g. Project Portfolio"
                      value={newPage.title}
                      onChange={(e) => {
                        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
                        setNewPage({ ...newPage, title: e.target.value, slug });
                      }}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-3.5 text-sm font-medium text-slate-900 outline-none focus:bg-white focus:border-primary/40 transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">URL Endpoint</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                        <span className="text-slate-300 font-bold text-sm">/</span>
                      </div>
                      <input
                        type="text"
                        value={newPage.slug}
                        onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-6 py-3.5 text-sm font-bold text-primary outline-none focus:bg-white focus:border-primary/40 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Architecture */}
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <Edit3 className="w-3 h-3" />
                    Layout Architecture
                  </label>
                  <div className="relative group">
                    <select 
                      value={newPage.template}
                      onChange={(e) => setNewPage({ ...newPage, template: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-8 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-primary/40 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="home">Home Page Template</option>
                      <option value="about">About Us Template</option>
                      <option value="services">Services Index Template</option>
                      <option value="gallery">Gallery Showcase Template</option>
                      <option value="reviews">Reviews & Testimonials Template</option>
                      <option value="team">Team Leadership Template</option>
                      <option value="faq">Knowledge Base Template</option>
                      <option value="contact">Inquiry Portal Template</option>
                      <option value="careers">Careers Hub Template</option>
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-primary transition-colors">
                       <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Visibility */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">Initial Visibility</p>
                    <p className="text-[9px] text-slate-400 font-medium">Draft pages are hidden from navigation.</p>
                  </div>
                  <div className="bg-slate-50 p-1 rounded-xl flex gap-1 border border-slate-100">
                    {['draft', 'published'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewPage({ ...newPage, status: s })}
                        className={`px-8 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${newPage.status === s
                            ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                            : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={handleCreatePage}
                  className="w-full bg-primary text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                  Initialize Route
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
