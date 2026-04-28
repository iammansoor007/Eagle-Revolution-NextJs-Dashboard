"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Search, Upload, Check, Loader2, 
  Image as ImageIcon, Grid, List, Plus, 
  ExternalLink, ChevronRight, Info
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-6xl h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col"
      >
        {/* Header */}
        <div className="bg-slate-50/80 px-12 py-8 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
             <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <ImageIcon className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   {['library', 'upload'].map((tab) => (
                     <button 
                       key={tab}
                       onClick={() => setActiveTab(tab as any)}
                       className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-all px-3 py-1 rounded-full ${
                         activeTab === tab ? "bg-primary text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
                       }`}
                     >
                       {tab === 'library' ? 'Media Library' : 'Direct Upload'}
                     </button>
                   ))}
                </div>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
           {activeTab === 'library' ? (
             <>
               {/* Search Bar */}
               <div className="px-12 py-6 bg-white border-b border-slate-50 flex items-center gap-6 shrink-0">
                  <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search existing media assets..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-[11px] font-medium outline-none focus:bg-white focus:border-primary/20 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                     <span className="text-slate-900">{filteredMedia.length}</span> Assets Available
                  </div>
               </div>

               {/* Grid */}
               <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                       <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Connecting to Vault</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                       {filteredMedia.map((item) => (
                         <motion.div 
                           key={item._id}
                           whileHover={{ y: -6, scale: 1.02 }}
                           onClick={() => onSelect(item)}
                           onDoubleClick={() => {
                             onSelect(item);
                             onClose();
                           }}
                           className="group relative aspect-square rounded-[1.5rem] overflow-hidden bg-white border border-slate-100 cursor-pointer hover:shadow-xl hover:shadow-slate-200 hover:border-primary/40 transition-all"
                         >
                            <div className="absolute inset-0 p-1.5">
                              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                <img src={item.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                              </div>
                            </div>
                            
                            {/* Modern Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center p-3 backdrop-blur-[1px]">
                               <div className="bg-white w-full py-2 rounded-xl text-[8px] font-black uppercase tracking-widest text-primary shadow-xl text-center flex items-center justify-center gap-2">
                                  <Check className="w-3 h-3" />
                                  Select Asset
                               </div>
                            </div>

                            {/* Info Tag */}
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                               <p className="text-[7px] font-black text-slate-900 truncate max-w-[80px] uppercase tracking-widest">{item.name}</p>
                            </div>

                            {/* SEO Checkmark */}
                            {item.alt && (
                              <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Check className="w-2 h-2" />
                              </div>
                            )}
                         </motion.div>
                       ))}
                       {filteredMedia.length === 0 && (
                         <div className="col-span-full py-20 text-center">
                            <ImageIcon className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No matching assets found</p>
                         </div>
                       )}
                    </div>
                  )}
               </div>
             </>
           ) : (
             <div className="flex-1 flex items-center justify-center p-12">
                <div 
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`w-full max-w-2xl aspect-[16/9] rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-8 transition-all hover:border-primary/20 hover:bg-slate-50/50 cursor-pointer group ${uploading ? 'pointer-events-none' : ''}`}
                >
                   <input 
                     type="file" 
                     accept="image/*" 
                     className="hidden" 
                     ref={fileInputRef} 
                     onChange={handleDirectUpload}
                   />
                   
                   {uploading ? (
                     <div className="flex flex-col items-center gap-6">
                        <Loader2 className="w-16 h-16 animate-spin text-primary" />
                        <div className="text-center">
                           <p className="text-lg font-bold text-slate-900 tracking-tight">Uploading to Library</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Processing file & generating SEO records</p>
                        </div>
                     </div>
                   ) : (
                     <>
                        <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-white group-hover:text-primary transition-all duration-500 shadow-sm">
                           <Plus className="w-10 h-10" />
                        </div>
                        <div className="text-center">
                           <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Drop your image here</h3>
                           <p className="text-sm font-medium text-slate-400">Click to browse your system files for direct upload</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="px-5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">PNG</div>
                           <div className="px-5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG</div>
                           <div className="px-5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">WEBP</div>
                        </div>
                     </>
                   )}
                </div>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-12 py-6 border-t border-slate-100 flex justify-between items-center shrink-0">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <Info className="w-3.5 h-3.5" />
              Centralized Media system active • All images optimized for SEO
           </p>
           <button 
             onClick={onClose}
             className="text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:text-primary transition-colors"
           >
              Cancel Selection
           </button>
        </div>
      </motion.div>
    </div>
  );
}
