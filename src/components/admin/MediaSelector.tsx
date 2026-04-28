"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Search, Upload, Check, Loader2, 
  Image as ImageIcon, Plus, Info
} from "lucide-react";

interface MediaSelectorProps {
  onSelect: (item: any) => void;
  onClose: () => void;
  title?: string;
}

export default function MediaSelector({ onSelect, onClose, title = "Select Asset" }: MediaSelectorProps) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
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

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const newItem = await res.json();
        onSelect(newItem);
        onClose();
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const filteredMedia = media.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.alt?.toLowerCase().includes(search.toLowerCase()) ||
    m.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
      />

      {/* Modal */}
      <motion.div 
        initial={{ scale: 0.96, opacity: 0, y: 16 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.96, opacity: 0, y: 16 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative w-full max-w-5xl h-[82vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* ── Compact Toolbar ── */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/60 shrink-0">
          {/* Icon + Title + Tabs */}
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900 tracking-tight shrink-0">{title}</span>

          {/* Tab Pills */}
          <div className="flex items-center gap-1 shrink-0">
            {(['library', 'upload'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab === 'library' ? 'Library' : 'Upload New'}
              </button>
            ))}
          </div>

          {/* Search — grows to fill available space */}
          {activeTab === 'library' && (
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search assets…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-[11px] font-medium outline-none focus:border-primary/40 transition-all"
              />
            </div>
          )}
          {activeTab !== 'library' && <div className="flex-1" />}

          {/* Asset count badge */}
          {activeTab === 'library' && (
            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap shrink-0">
              {filteredMedia.length} assets
            </span>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'library' ? (
            <div className="h-full overflow-y-auto p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/30" />
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Loading Assets…</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <ImageIcon className="w-10 h-10 text-slate-100" />
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No matching assets</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-1 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                  >
                    Upload New →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredMedia.map((item) => (
                    <motion.div
                      key={item._id}
                      whileHover={{ y: -3, scale: 1.02 }}
                      onClick={() => { onSelect(item); onClose(); }}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all"
                    >
                      <img
                        src={item.url}
                        alt={item.alt || item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Hover tint — whole card is clickable */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 ring-0 group-hover:ring-2 ring-primary rounded-xl transition-all duration-150" />

                      {/* Filename */}
                      <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity max-w-[80%]">
                        <p className="text-[7px] font-black text-slate-900 truncate uppercase tracking-wider">{item.name}</p>
                      </div>

                      {/* SEO badge */}
                      {item.alt && (
                        <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white p-0.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                          <Check className="w-2 h-2" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── Upload Tab ── */
            <div className="flex-1 flex items-center justify-center p-8 h-full">
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`w-full max-w-xl aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-5 transition-all hover:border-primary/30 hover:bg-slate-50 cursor-pointer group ${uploading ? 'pointer-events-none' : ''}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleDirectUpload}
                />

                {uploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900">Uploading to Library…</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Processing & generating SEO records</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">Drop or click to upload</h3>
                      <p className="text-xs text-slate-400 font-medium mt-1">Image will be saved to your Media Library automatically</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {['PNG', 'JPG', 'WEBP', 'GIF'].map(fmt => (
                        <span key={fmt} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-400 uppercase">{fmt}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/60 flex justify-between items-center shrink-0">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-3 h-3" />
            All uploads are registered in the central Media Library
          </p>
          <button
            onClick={onClose}
            className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
