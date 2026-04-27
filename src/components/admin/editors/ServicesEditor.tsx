"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Briefcase, Layout, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ServicesEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      fetch("/api/content")
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error("Failed to seed content:", err));
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-black animate-spin" /></div>;

  const updateSection = (field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      services: {
        ...prev.services,
        [field]: value
      }
    }));
  };

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-black animate-spin" /></div>;

  return (
    <div className="bg-white min-h-[600px] flex flex-col">

      <div className="p-10 space-y-12 overflow-y-auto max-h-[800px] custom-scrollbar">
        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-black uppercase tracking-widest">Section Badge</label>
              <input 
                type="text" 
                value={data.services?.badge || ""} 
                onChange={(e) => updateSection("badge", e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-bold outline-none focus:bg-white focus:border-black transition-all"
              />
           </div>

           <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Prefix</label>
                <input type="text" value={data.services?.headline?.prefix || ""} onChange={(e) => setData({...data, services: {...data.services, headline: {...data.services.headline, prefix: e.target.value}}})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-black font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-black uppercase">Highlight</label>
                <input type="text" value={data.services?.headline?.highlight || ""} onChange={(e) => setData({...data, services: {...data.services, headline: {...data.services.headline, highlight: e.target.value}}})} className="w-full bg-black text-white border border-black rounded-xl px-4 py-3 font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Suffix</label>
                <input type="text" value={data.services?.headline?.suffix || ""} onChange={(e) => setData({...data, services: {...data.services, headline: {...data.services.headline, suffix: e.target.value}}})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-black font-bold outline-none" />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold text-black uppercase tracking-widest">Intro Description (Paragraph 1)</label>
              <textarea 
                rows={4} 
                value={data.services?.description?.[0] || ""} 
                onChange={(e) => {
                  const newDesc = [...(data.services?.description || [])];
                  newDesc[0] = e.target.value;
                  updateSection("description", newDesc);
                }}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-medium outline-none focus:bg-white focus:border-black transition-all leading-relaxed"
              />
           </div>
        </div>

        <div className="pt-10 border-t border-slate-100">
           <div className="bg-slate-50 p-8 rounded-[2.5rem] flex items-start gap-6 border border-slate-100">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shrink-0">
                 <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                 <p className="text-black font-extrabold text-lg mb-1">Individual Services Management</p>
                 <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                    This template only manages the top header and introductory text for your services list. To edit specific services (like Roofing, Windows, or Doors), please use the dedicated management tool.
                 </p>
                 <Link 
                   href="/admin/services" 
                   className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all"
                 >
                    Go to Services Manager
                    <ChevronRight className="w-4 h-4" />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
