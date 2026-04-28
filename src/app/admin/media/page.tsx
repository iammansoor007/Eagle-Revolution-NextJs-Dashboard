"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Search, Trash2, X, ChevronRight, Loader2,
  Image as ImageIcon, Grid, List, Check, Edit3,
  Download, ExternalLink, Info, FileText, Calendar, HardDrive, Plus, RefreshCw
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

        {/* Media Content Grid/List */}
        <div className="flex-1 min-h-0">
          {filteredMedia.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-1">
                  <AnimatePresence mode="popLayout">
                    {filteredMedia.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -4 }}
                        className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                          selectedIds.includes(item._id)
                            ? "ring-4 ring-primary ring-offset-2 shadow-2xl"
                            : "bg-white border border-slate-100 hover:border-primary/40 shadow-sm"
                        }`}
                        onClick={() => setEditingItem(item)}
                      >
                        <img
                          src={item.url}
                          alt={item.alt}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        
                        {/* Status Overlays */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                          <div className={`transition-all duration-300 ${selectedIds.includes(item._id) ? "scale-100" : "scale-0 group-hover:scale-100"}`}>
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIds(prev => prev.includes(item._id) ? prev.filter(id => id !== item._id) : [...prev, item._id]);
                              }}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                selectedIds.includes(item._id) ? "bg-primary text-white" : "bg-white/80 backdrop-blur-md text-slate-400 hover:text-primary"
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          
                          {item.alt && (
                            <div className="bg-emerald-500 text-white px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest shadow-lg translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                              SEO
                            </div>
                          )}
                        </div>

                        {/* Hover Metadata Bar */}
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/90 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-[9px] font-bold text-white truncate uppercase tracking-widest mb-1">{item.name.split('_').pop()}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[7px] font-bold text-slate-300 uppercase">{formatSize(item.size)}</span>
                            <span className="w-1 h-1 bg-slate-500 rounded-full" />
                            <span className="text-[7px] font-bold text-primary-foreground/90 bg-primary/40 px-1.5 py-0.5 rounded uppercase">{item.type.split('/')[1]}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="p-5 w-14">
                          <div 
                            onClick={() => setSelectedIds(selectedIds.length === filteredMedia.length ? [] : filteredMedia.map(m => m._id))}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                              selectedIds.length === filteredMedia.length ? "bg-primary border-primary text-white" : "bg-white border-slate-200"
                            }`}
                          >
                            {selectedIds.length > 0 && <Check className="w-3 h-3" />}
                          </div>
                        </th>
                        <th className="p-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                        <th className="p-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                        <th className="p-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Technical</th>
                        <th className="p-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">SEO Status</th>
                        <th className="p-5 w-20"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredMedia.map((item) => (
                        <tr key={item._id} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => setEditingItem(item)}>
                          <td className="p-5" onClick={(e) => e.stopPropagation()}>
                            <div 
                              onClick={() => setSelectedIds(prev => prev.includes(item._id) ? prev.filter(id => id !== item._id) : [...prev, item._id])}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                selectedIds.includes(item._id) ? "bg-primary border-primary text-white" : "bg-white border-slate-200"
                              }`}
                            >
                              {selectedIds.includes(item._id) && <Check className="w-3 h-3" />}
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                              <img src={item.url} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-5">
                            <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{item.name}</p>
                            <p className="text-[9px] text-slate-400 font-medium mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded">{formatSize(item.size)}</span>
                              <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded uppercase tracking-tighter">{item.type.split('/')[1]}</span>
                            </div>
                          </td>
                          <td className="p-5">
                            {item.alt ? (
                              <div className="flex items-center gap-1.5 text-emerald-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Optimized</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-amber-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Missing Alt</span>
                              </div>
                            )}
                          </td>
                          <td className="p-5">
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                <ImageIcon className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">No assets found</h3>
              <p className="text-xs text-slate-400 max-w-xs text-center mt-2">Adjust your filters or upload new media to start building your library.</p>
            </div>
          )}
        </div>
      </div>

      {/* Premium Edit Item Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col lg:flex-row"
            >
              {/* Left Column: Interactive Preview */}
              <div className="lg:w-1/2 bg-slate-50/50 p-5 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col gap-6">
                <div className="flex justify-between items-center lg:hidden">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Preview</h2>
                  <button onClick={() => setEditingItem(null)} className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative flex-1 min-h-[200px] lg:min-h-0 rounded-[2rem] overflow-hidden bg-white shadow-inner border border-slate-100 group">
                  <img 
                    src={editingItem.url} 
                    className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 shadow-lg flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[7px] font-black text-slate-900 uppercase tracking-widest">Live</span>
                    </div>
                    <a
                      href={editingItem.url}
                      target="_blank"
                      className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-white/20 flex items-center justify-center text-slate-900 hover:bg-primary hover:text-white transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-100 grid grid-cols-2 gap-4 shadow-sm">
                  <div className="space-y-0.5">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Dimensions</p>
                    <p className="text-[10px] font-bold text-slate-900">{editingItem.width && editingItem.height ? `${editingItem.width} × ${editingItem.height}` : 'Auto'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Size</p>
                    <p className="text-[10px] font-bold text-slate-900">{formatSize(editingItem.size)}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                    <p className="text-[10px] font-bold text-slate-900 uppercase">{editingItem.type.split('/')[1]}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                    <p className="text-[10px] font-bold text-slate-900">{new Date(editingItem.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Metadata & Actions */}
              <div className="lg:w-1/2 flex flex-col h-full overflow-hidden bg-white">
                {/* Header */}
                <div className="p-5 lg:p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                  <div className="space-y-0.5">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Asset Settings</h2>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Metadata Control</p>
                  </div>
                  <button onClick={() => setEditingItem(null)} className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-5 custom-scrollbar">
                  <div className="space-y-5">
                    {/* SEO Title */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        <ImageIcon className="w-3 h-3 text-primary" />
                        Image Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Roofing Team"
                        value={editingItem.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm"
                      />
                    </div>

                    {/* Alt Text */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        <Info className="w-3 h-3 text-emerald-500" />
                        Alt Text
                      </label>
                      <input
                        type="text"
                        placeholder="Accessibility description..."
                        value={editingItem.alt || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, alt: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-emerald-500/30 transition-all shadow-sm"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        <FileText className="w-3 h-3 text-amber-500" />
                        Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Internal notes..."
                        value={editingItem.description || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium text-slate-600 outline-none focus:bg-white focus:border-amber-500/30 transition-all shadow-sm resize-none leading-normal"
                      />
                    </div>
                  </div>
                </div>

                {/* Fixed Footer: Unified Actions */}
                <div className="p-5 lg:p-6 bg-slate-50 border-t border-slate-100 space-y-4 shrink-0">
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateMetadata}
                      className="flex-1 bg-primary text-white py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => handleDelete([editingItem._id])}
                      className="p-3.5 rounded-xl bg-white border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="replace-file-input"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !editingItem) return;

                        setUploading(true);
                        const formData = new FormData();
                        formData.append('file', file);

                        try {
                          const res = await fetch(`/api/admin/media/replace/${editingItem._id}`, {
                            method: 'POST',
                            body: formData
                          });

                          if (res.ok) {
                            const updated = await res.json();
                            setMedia(prev => prev.map(m => m._id === updated._id ? updated : m));
                            setEditingItem(updated);
                          } else {
                            alert('Replacement failed');
                          }
                        } catch (err) {
                          alert('Error replacing file');
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                    <label
                      htmlFor="replace-file-input"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-slate-200 text-[8px] font-black text-slate-400 uppercase tracking-widest hover:border-primary hover:text-primary cursor-pointer transition-all group"
                    >
                      <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-700" />
                      Replace Current File
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
