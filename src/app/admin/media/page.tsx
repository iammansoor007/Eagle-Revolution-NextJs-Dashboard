"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Search, Trash2, X, ChevronRight, Loader2,
  Image as ImageIcon, Grid, List, Check, Edit3,
  Download, ExternalLink, Info, FileText, Calendar, HardDrive, Plus
} from "lucide-react";

export default function MediaDashboard() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setMedia(data);
    } catch (err) {
      console.error("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    // We'll upload files one by one for better control and record creation
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);

      try {
        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          const newItem = await res.json();
          setMedia(prev => [newItem, ...prev]);
        }
      } catch (err) {
        console.error("Upload failed for", files[i].name);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateMetadata = async () => {
    if (!editingItem) return;

    try {
      const res = await fetch(`/api/admin/media/${editingItem._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alt: editingItem.alt,
          title: editingItem.title,
          description: editingItem.description
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setMedia(prev => prev.map(m => m._id === updated._id ? updated : m));
        setEditingItem(null);
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (!confirm(`Permanently delete ${ids.length} items?`)) return;

    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
      });

      if (res.ok) {
        setMedia(prev => prev.filter(m => !ids.includes(m._id)));
        setSelectedIds([]);
        if (editingItem && ids.includes(editingItem._id)) setEditingItem(null);
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredMedia = media.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.alt?.toLowerCase().includes(search.toLowerCase()) ||
    m.title?.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="w-full px-12 py-12 min-h-screen bg-[#F8FAFC]">
      {/* Header Area */}
      <div className="flex flex-wrap items-center justify-between gap-10 mb-16 px-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-600 uppercase tracking-[0.2em]">
            <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Media Library</span>
          </div>
          <h1 className="text-2xl font-medium text-slate-900 tracking-tight">Assets & Media</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manage, optimize, and reuse your website images</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              placeholder="Search assets by name or SEO tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-[11px] font-medium outline-none focus:border-primary/30 transition-all shadow-sm"
            />
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl text-xs font-medium hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload Assets
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden p-8">

        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50 px-4">
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 p-1.5 rounded-xl flex gap-1 border border-slate-100">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
                <div className="w-px h-6 bg-slate-200 mx-2" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedIds.length} Selected</span>
                <button
                  onClick={() => handleDelete(selectedIds)}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Bulk Delete
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Quick Stats</p>
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-3">
              <ImageIcon className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-slate-900">{media.length} Total Items</span>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 p-2">
            {filteredMedia.map((item) => (
              <motion.div 
                layout
                key={item._id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className={`group relative aspect-square rounded-[2rem] overflow-hidden border transition-all duration-300 cursor-pointer ${selectedIds.includes(item._id)
                    ? "border-primary shadow-2xl shadow-primary/30 ring-4 ring-primary/10"
                    : "border-slate-100 bg-white hover:border-primary/40 hover:shadow-2xl hover:shadow-slate-200"
                  }`}
                onClick={() => setEditingItem(item)}
              >
                {/* Image Container */}
                <div className="absolute inset-0 w-full h-full p-1.5">
                  <div className="w-full h-full rounded-[1.7rem] overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Subtle Overlay for better contrast */}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300" />
                  </div>
                </div>

                {/* Modern Hover Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent backdrop-blur-[1px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 scale-90 group-hover:scale-100 transition-transform duration-300">
                    <div className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl flex items-center justify-center text-slate-900 hover:bg-primary hover:text-white transition-all">
                      <Edit3 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Quick Metadata Bar */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-[9px] font-bold text-white truncate uppercase tracking-[0.1em]">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[8px] font-bold text-slate-300 uppercase">{formatSize(item.size)}</span>
                      <span className="w-1 h-1 bg-slate-500 rounded-full" />
                      <span className="text-[8px] font-bold text-primary-foreground/90 bg-primary/30 px-2 py-0.5 rounded-md uppercase">{item.type.split('/')[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Selection UI */}
                <div
                  className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${selectedIds.includes(item._id)
                      ? "bg-primary border-primary text-white shadow-lg scale-100"
                      : "bg-white/60 border-white/80 text-slate-900 opacity-0 group-hover:opacity-100 backdrop-blur-md hover:bg-white hover:text-primary scale-90 group-hover:scale-100"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIds(prev => prev.includes(item._id) ? prev.filter(id => id !== item._id) : [...prev, item._id]);
                  }}
                >
                  {selectedIds.includes(item._id) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>

                {/* SEO Badge - Visual confirmation that it has an ALT tag */}
                {item.alt && (
                  <div className="absolute top-4 left-4 z-20 px-2 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-[7px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                    SEO Ready
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="divide-y divide-slate-50 px-4">
            {filteredMedia.map((item) => (
              <div key={item._id} className="group flex items-center gap-8 py-6 hover:bg-slate-50/50 transition-all px-4 rounded-2xl">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${selectedIds.includes(item._id)
                      ? "bg-primary border-primary text-white"
                      : "border-slate-100 bg-white"
                    }`}
                  onClick={() => setSelectedIds(prev => prev.includes(item._id) ? prev.filter(id => id !== item._id) : [...prev, item._id])}
                >
                  {selectedIds.includes(item._id) && <Check className="w-3 h-3" />}
                </div>

                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                  <img src={item.url} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate mb-1">{item.name}</h3>
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><HardDrive className="w-3 h-3" /> {formatSize(item.size)}</span>
                    <span className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> {item.type.split('/')[1]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">Alt Text</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{item.alt || 'None'}</p>
                  </div>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-3 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all"
                  >
                    <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                  </button>
                  <button
                    onClick={() => handleDelete([item._id])}
                    className="p-3 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-red-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredMedia.length === 0 && (
          <div className="p-40 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-50">
              <ImageIcon className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-lg font-medium text-slate-900 mb-2">No assets found</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Upload images to populate your centralized Media Library and use them across your site.</p>
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
            />
            <motion.div
              initial={{ x: 500, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 500, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-xl h-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-slate-50/50 px-12 py-10 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Asset Details</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Optimize SEO & accessibility metadata</p>
                </div>
                <button onClick={() => setEditingItem(null)} className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                {/* Image Preview */}
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group">
                  <img src={editingItem.url} className="w-full h-full object-contain p-4" />
                  <a
                    href={editingItem.url}
                    target="_blank"
                    className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 text-slate-900 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                {/* Metadata Fields */}
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Image Title (SEO)
                    </label>
                    <input
                      type="text"
                      placeholder="Short descriptive title..."
                      value={editingItem.title || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-primary/40 transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                      <Info className="w-3.5 h-3.5" />
                      Alt Text (Accessibility)
                    </label>
                    <input
                      type="text"
                      placeholder="Describe the image content..."
                      value={editingItem.alt || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, alt: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-primary/40 transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      Full Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Extended information or context..."
                      value={editingItem.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-primary/40 transition-all shadow-sm resize-none"
                    />
                  </div>
                </div>

                {/* Technical Info */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">File Name</span>
                    <span className="text-slate-900">{editingItem.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">File Type</span>
                    <span className="text-slate-900">{editingItem.type}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">Dimensions</span>
                    <span className="text-slate-900">{editingItem.width && editingItem.height ? `${editingItem.width} × ${editingItem.height}` : 'Calculating...'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">File Size</span>
                    <span className="text-slate-900">{formatSize(editingItem.size)}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-12 bg-slate-50/50 border-t border-slate-100 flex items-center gap-6 shrink-0">
                <button
                  onClick={handleUpdateMetadata}
                  className="flex-1 bg-primary text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  Update Metadata
                </button>
                <button
                  onClick={() => handleDelete([editingItem._id])}
                  className="p-5 rounded-2xl bg-white border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
