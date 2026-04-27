"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Droplets, Zap, Globe, ShieldCheck, Settings, Info, Box
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

export default function ServiceDetailEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("identity");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         title: "New Service",
         tagline: "",
         overview: "",
         badge: "Service Offering",
         features: [],
         stats: [],
         benefits: [],
         process: [],
         faq: []
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateField = (field: string, value: any) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const tabs = [
    { id: "identity", label: "Identity", icon: Type, title: "Service Core Identity" },
    { id: "features", label: "Features & Stats", icon: List, title: "Technical Specs & Metrics" },
    { id: "benefits", label: "Value Benefits", icon: Heart, title: "Consumer Advantages" },
    { id: "process", label: "Work Process", icon: Settings, title: "Phase-based Workflow" },
    { id: "faq", label: "Service FAQ", icon: HelpCircle, title: "Detail Specific Support" },
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
           <p className="text-xs text-slate-400 mt-1">Configure the detailed page content for this specific service offering.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* IDENTITY SECTION */}
            {activeTab === "identity" && (
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-7 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Service Badge</label>
                    <input type="text" value={data.badge || ""} onChange={(e) => updateField("badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Title</label>
                    <input type="text" value={data.title || ""} onChange={(e) => updateField("title", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Technical Tagline</label>
                    <input type="text" value={data.tagline || ""} onChange={(e) => updateField("tagline", e.target.value)} className="w-full bg-primary/5 text-primary border border-primary/10 rounded-xl px-5 py-3 text-[10px] font-medium uppercase tracking-widest outline-none" />
                  </div>
                </div>
                <div className="col-span-12 space-y-2">
                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Service Overview Narrative</label>
                  <textarea 
                    value={data.overview || ""} 
                    onChange={(e) => updateField("overview", e.target.value)}
                    rows={6}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:bg-white focus:border-primary/30"
                  />
                </div>
              </div>
            )}

            {/* FEATURES & STATS */}
            {activeTab === "features" && (
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-6">
                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Key Feature Highlights</label>
                  <div className="space-y-3">
                    {(data.features || []).map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <Check className="w-3.5 h-3.5 text-primary" />
                        <input type="text" value={f} onChange={(e) => {
                          const newF = [...data.features];
                          newF[i] = e.target.value;
                          updateField("features", newF);
                        }} className="flex-1 bg-transparent text-xs text-slate-700 outline-none" />
                        <button onClick={() => {
                          const newF = data.features.filter((_: any, idx: number) => idx !== i);
                          updateField("features", newF);
                        }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateField("features", [...(data.features || []), ""])} className="text-[10px] font-medium text-primary uppercase tracking-widest">+ Add Feature</button>
                  </div>
                </div>
                <div className="space-y-6">
                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Success Metrics</label>
                  <div className="grid grid-cols-1 gap-3">
                    {(data.stats || []).map((s: any, i: number) => (
                      <div key={i} className="bg-slate-50/30 p-5 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center text-[8px] font-medium text-slate-300 uppercase">
                           <span>Stat {i+1}</span>
                           <button onClick={() => {
                             const newS = data.stats.filter((_: any, idx: number) => idx !== i);
                             updateField("stats", newS);
                           }} className="hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                        </div>
                        <input type="text" value={s.value} onChange={(e) => {
                             const newS = [...data.stats];
                             newS[i].value = e.target.value;
                             updateField("stats", newS);
                           }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-lg font-medium outline-none" />
                        <input type="text" value={s.label} onChange={(e) => {
                             const newS = [...data.stats];
                             newS[i].label = e.target.value;
                             updateField("stats", newS);
                           }} className="w-full bg-transparent text-[10px] font-medium text-slate-400 uppercase tracking-widest outline-none" />
                      </div>
                    ))}
                    <button onClick={() => updateField("stats", [...(data.stats || []), { value: "0", label: "Metric Label" }])} className="border border-dashed border-slate-200 rounded-xl py-3 text-[10px] font-medium text-slate-300 hover:text-primary transition-all uppercase tracking-widest">+ Add Stat</button>
                  </div>
                </div>
              </div>
            )}

            {/* PROCESS SECTION */}
            {activeTab === "process" && (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 gap-4">
                    {(data.process || []).map((step: any, i: number) => (
                      <div key={i} className="flex gap-6 bg-slate-50/30 p-6 rounded-2xl border border-slate-100 items-start">
                         <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-medium shrink-0">
                            {i + 1}
                         </div>
                         <div className="flex-1 space-y-2">
                            <input type="text" value={step.title} onChange={(e) => {
                               const newP = [...data.process];
                               newP[i].title = e.target.value;
                               updateField("process", newP);
                            }} className="w-full bg-transparent text-sm text-slate-800 font-medium outline-none" placeholder="Step Title" />
                            <textarea 
                              value={step.description} 
                              onChange={(e) => {
                                const newP = [...data.process];
                                newP[i].description = e.target.value;
                                updateField("process", newP);
                              }}
                              rows={2}
                              className="w-full bg-transparent text-xs text-slate-500 outline-none"
                              placeholder="Step description..."
                            />
                         </div>
                         <button onClick={() => {
                            const newP = data.process.filter((_: any, idx: number) => idx !== i);
                            updateField("process", newP);
                         }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateField("process", [...(data.process || []), { title: "New Step", description: "" }])} className="w-full border border-dashed border-slate-200 rounded-2xl py-6 text-[10px] font-medium text-slate-300 hover:text-primary transition-all uppercase tracking-widest">+ Add Process Step</button>
                 </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
