"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Zap, Globe, ShieldCheck, Building2, Droplets, Building
} from "lucide-react";

// Shared Reusable Image Upload Component
const ImageUpload = ({ label, value, onChange, description }: any) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        onChange(url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="group relative">
        <div className="aspect-video w-full bg-slate-50/50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center transition-all group-hover:border-primary/30">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <label className="cursor-pointer bg-primary text-white px-5 py-2 rounded-lg text-[10px] font-medium uppercase tracking-widest hover:scale-105 transition-all">
                  Update Photo
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
                <button onClick={() => onChange("")} className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-lg text-[10px] font-medium uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
                  Remove
                </button>
              </div>
            </>
          ) : (
            <label className="flex flex-col items-center gap-3 cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Upload className="w-5 h-5 text-slate-300" />}
              </div>
              <div className="text-center">
                <p className="text-[10px] font-medium text-slate-400">Click to upload media</p>
              </div>
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ServicesEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      fetch("/api/content")
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error("Failed to seed content:", err));
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateServices = (section: string, field: string | null, value: any) => {
    const currentServices = data.services || {
      hero: { headline: { prefix: "", highlight: "", suffix: "" }, description: [] },
      badge: "",
      headline: { prefix: "", highlight: "" },
      description: [],
      statsSection: { badge: "", headline: "", description: "" },
      stats: [],
      gridSection: { badge: "", headline: "", description: "" },
      cta: { title: "", description: "", buttonText: "", buttonLink: "" }
    };

    const targetSectionData = currentServices[section as keyof typeof currentServices] || {};

    setData({
      ...data,
      services: {
        ...currentServices,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "hero", label: "Hero Banner", icon: LayoutTemplate, title: "Services Hero Section" },
    { id: "intro", label: "Service Intro", icon: Type, title: "Narrative Introduction" },
    { id: "stats", label: "Impact Stats", icon: Award, title: "Key Performance Metrics" },
    { id: "grid", label: "Capabilities", icon: List, title: "Service Grid Context" },
    { id: "cta", label: "Bottom CTA", icon: Mail, title: "Bottom Call to Action" },
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  return (
    <div className="bg-white min-h-[600px] flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-1 p-4 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all ${
                activeTab === tab.id
                ? "bg-primary/5 text-primary"
                : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-10 overflow-y-auto max-h-[800px] custom-scrollbar">
        <div className="mb-10 pb-6 border-b border-slate-50">
           <h2 className="text-2xl font-normal text-slate-900 tracking-tight">{activeTabTitle}</h2>
           <p className="text-xs text-slate-400 mt-1">Configure the visual and textual content for the Services page.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* HERO SECTION */}
            {activeTab === "hero" && (
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12 space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Service Hero Identity</label>
                    <div className="flex gap-3">
                      <input type="text" value={data.services?.hero?.headline?.prefix || ""} onChange={(e) => updateServices("hero", "headline", { ...data.services.hero.headline, prefix: e.target.value })} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" placeholder="Prefix" />
                      <input type="text" value={data.services?.hero?.headline?.highlight || ""} onChange={(e) => updateServices("hero", "headline", { ...data.services.hero.headline, highlight: e.target.value })} className="flex-1 bg-primary/10 text-primary border border-primary/20 rounded-xl px-4 py-3 text-xs font-medium outline-none" placeholder="Highlight" />
                      <input type="text" value={data.services?.hero?.headline?.suffix || ""} onChange={(e) => updateServices("hero", "headline", { ...data.services.hero.headline, suffix: e.target.value })} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" placeholder="Suffix" />
                    </div>
                  </div>
                </div>
                <div className="col-span-12 space-y-4">
                   <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Hero Description Paragraphs</label>
                   {(data.services?.hero?.description || []).map((p: string, i: number) => (
                     <div key={i} className="flex gap-4">
                       <textarea value={p} onChange={(e) => {
                         const newD = [...data.services.hero.description];
                         newD[i] = e.target.value;
                         updateServices("hero", "description", newD);
                       }} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:border-primary/30" rows={3} />
                       <button onClick={() => {
                         const newD = data.services.hero.description.filter((_: any, idx: number) => idx !== i);
                         updateServices("hero", "description", newD);
                       }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   ))}
                   <button onClick={() => updateServices("hero", "description", [...(data.services?.hero?.description || []), ""])} className="text-[10px] font-medium text-primary uppercase tracking-widest">+ Add Paragraph</button>
                </div>
              </div>
            )}

            {/* INTRO SECTION */}
            {activeTab === "intro" && (
              <div className="max-w-3xl space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Intro Badge</label>
                    <input type="text" value={data.services?.badge || ""} onChange={(e) => updateServices("badge", null, e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Intro Narrative</label>
                    {(data.services?.description || []).map((desc: string, i: number) => (
                      <div key={i} className="flex gap-4">
                        <textarea value={desc} onChange={(e) => {
                          const newD = [...data.services.description];
                          newD[i] = e.target.value;
                          updateServices("description", null, newD);
                        }} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:border-primary/30" rows={4} />
                        <button onClick={() => {
                          const newD = data.services.description.filter((_: any, idx: number) => idx !== i);
                          updateServices("description", null, newD);
                        }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateServices("description", null, [...(data.services?.description || []), ""])} className="text-[10px] font-medium text-primary uppercase tracking-widest">+ Add Intro Segment</button>
                 </div>
              </div>
            )}

            {/* IMPACT STATS */}
            {activeTab === "stats" && (
              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Stats Badge</label>
                    <input type="text" value={data.services?.statsSection?.badge || ""} onChange={(e) => updateServices("statsSection", "badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Headline Title</label>
                    <input type="text" value={data.services?.statsSection?.headline || ""} onChange={(e) => updateServices("statsSection", "headline", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   {(data.services?.stats || []).map((s: any, i: number) => (
                     <div key={i} className="bg-slate-50/30 p-6 rounded-2xl border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center text-[9px] font-medium text-slate-300">
                           <span>Stat {i+1}</span>
                           <button onClick={() => {
                              const newS = data.services.stats.filter((_: any, idx: number) => idx !== i);
                              updateServices("stats", null, newS);
                           }} className="hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="flex gap-3">
                           <input type="text" value={s.value} onChange={(e) => {
                             const newS = [...data.services.stats];
                             newS[i].value = e.target.value;
                             updateServices("stats", null, newS);
                           }} className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xl font-medium outline-none focus:border-primary/30" />
                           <input type="text" value={s.suffix} onChange={(e) => {
                             const newS = [...data.services.stats];
                             newS[i].suffix = e.target.value;
                             updateServices("stats", null, newS);
                           }} className="w-12 bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-400 outline-none focus:border-primary/30" placeholder="Suffix" />
                        </div>
                        <input type="text" value={s.label} onChange={(e) => {
                          const newS = [...data.services.stats];
                          newS[i].label = e.target.value;
                          updateServices("stats", null, newS);
                        }} className="w-full bg-transparent text-[10px] font-medium uppercase tracking-widest outline-none" />
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* CTA SECTION */}
            {activeTab === "cta" && (
              <div className="max-w-3xl space-y-10">
                 <div className="bg-primary/5 p-10 rounded-3xl border border-primary/10 space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-medium text-primary uppercase tracking-widest">Main CTA Headline</label>
                       <input type="text" value={data.services?.cta?.title || ""} onChange={(e) => updateServices("cta", "title", e.target.value)} className="w-full bg-white border border-primary/20 rounded-xl px-5 py-4 text-xl font-medium outline-none focus:border-primary/40" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Supporting Message</label>
                       <textarea value={data.services?.cta?.description || ""} onChange={(e) => updateServices("cta", "description", e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-xs text-slate-500 outline-none focus:border-primary/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Action Button Label</label>
                          <input type="text" value={data.services?.cta?.buttonText || ""} onChange={(e) => updateServices("cta", "buttonText", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-primary/30" />
                       </div>
                    </div>
                 </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
