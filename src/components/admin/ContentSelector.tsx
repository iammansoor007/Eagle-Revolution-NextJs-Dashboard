"use client";

import { useState, useEffect } from "react";
import { Search, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ContentSelectorProps {
  type: "services" | "projects" | "reviews" | "faq";
  selectedItems: any[];
  onSelect: (items: any[]) => void;
  label: string;
}

export default function ContentSelector({ type, selectedItems, onSelect, label }: ContentSelectorProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMasterList = async () => {
      try {
        const res = await fetch("/api/content");
        const data = await res.json();
        
        let masterList: any[] = [];
        if (type === "services") masterList = data.services?.services || [];
        if (type === "projects") masterList = data.portfolio?.projects || [];
        if (type === "reviews") masterList = data.testimonials?.testimonials || [];
        if (type === "faq") masterList = data.faq?.questions || [];
        
        setItems(masterList);
      } catch (err) {
        console.error("Failed to fetch master list for selector:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterList();
  }, [type]);

  const isSelected = (item: any) => {
    // For services/projects we usually match by slug or title
    const idField = item.slug ? "slug" : "title";
    if (!item[idField]) return false;
    return selectedItems.some((s) => s[idField] === item[idField]);
  };

  const toggleSelection = (item: any) => {
    const idField = item.slug ? "slug" : "title";
    if (isSelected(item)) {
      onSelect(selectedItems.filter((s) => s[idField] !== item[idField]));
    } else {
      onSelect([...selectedItems, item]);
    }
  };

  const filteredItems = items.filter(item => {
    const title = item.title || item.question || item.name || "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return <div className="flex items-center gap-2 text-xs text-slate-400 p-4"><Loader2 className="w-4 h-4 animate-spin" /> Loading available {type}...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{label}</label>
        <div className="text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase">
          {selectedItems.length} Selected
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={`Search available ${type}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-primary/40 transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredItems.length > 0 ? filteredItems.map((item, idx) => {
          const selected = isSelected(item);
          const title = item.title || item.question || item.name || "Untitled Item";
          const subtitle = item.category || item.tag || item.position || (item.answer ? "FAQ Entry" : "");
          const image = item.image || item.avatar || item.overviewImage || null;

          return (
            <button
              key={idx}
              onClick={() => toggleSelection(item)}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                selected 
                ? "bg-primary/5 border-primary shadow-sm" 
                : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center ${selected ? "border-primary/20" : ""}`}>
                {image ? (
                  <img src={image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-slate-300" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${selected ? "text-primary" : "text-slate-700"}`}>
                  {title}
                </p>
                <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider mt-0.5">
                  {subtitle}
                </p>
              </div>

              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                selected ? "bg-primary text-white" : "bg-slate-50 text-transparent group-hover:bg-slate-100"
              }`}>
                <Check className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        }) : (
          <div className="col-span-2 py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-400 font-medium">No items found matching your search.</p>
          </div>
        )}
      </div>
      
      {selectedItems.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-4">Display Order (Drag-and-drop coming soon)</p>
           <div className="flex flex-wrap gap-2">
              {selectedItems.map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                  {s.title || s.question || s.name}
                  <button onClick={() => toggleSelection(s)} className="text-white/50 hover:text-white transition-colors">
                    <Check className="w-3 h-3 rotate-45" />
                  </button>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
