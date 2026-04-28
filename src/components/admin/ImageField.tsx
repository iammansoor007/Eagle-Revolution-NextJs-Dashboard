"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Upload, Search, X, Edit3, Link as LinkIcon, RefreshCw, Plus } from "lucide-react";
import MediaSelector from "./MediaSelector";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  description?: string;
}

export default function ImageField({
  label,
  value,
  onChange,
  altValue,
  onAltChange,
  description
}: ImageFieldProps) {
  const [showSelector, setShowSelector] = useState(false);

  const handleSelect = (item: any) => {
    onChange(item.url);
    if (onAltChange && item.alt) {
      onAltChange(item.alt);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5" />
          {label}
        </label>
        {value && (
          <button
            onClick={() => onChange("")}
            className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            Clear Image
          </button>
        )}
      </div>

      <div className="relative group">
        {value ? (
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm group">
            <img src={value} alt={altValue} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <button
                  onClick={() => setShowSelector(true)}
                  className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:bg-white transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace
                </button>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center justify-between">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                  {value.split('/').pop()}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">Active Asset</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowSelector(true)}
            className="w-full aspect-video rounded-[3rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-4 transition-all hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 group"
          >
            <div className="w-16 h-16 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all duration-500 shadow-sm">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900 tracking-tight">Select or Upload Media</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Open central library</p>
            </div>
          </button>
        )}
      </div>

      {description && <p className="text-[10px] text-slate-400 font-medium ml-1 leading-relaxed">{description}</p>}

      <AnimatePresence>
        {showSelector && (
          <MediaSelector
            title={`Select ${label}`}
            onSelect={handleSelect}
            onClose={() => setShowSelector(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
