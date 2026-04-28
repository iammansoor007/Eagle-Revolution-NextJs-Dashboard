"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Droplets, Zap, Globe, ShieldCheck, Settings, Info, Box,
  Trophy, Wrench, HardHat, Ruler, Paintbrush, Wind, Flame, Thermometer,
  Clock, Users, Flag, Linkedin, Quote, TrendingUp
} from "lucide-react";
import ContentSelector from "@/components/admin/ContentSelector";

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
         overviewTitle: "",
         overview: "",
         overviewImage: "",
         badge: "Service Offering",
         features: [{ text: "", icon: "CheckCircle" }],
         stats: [{ label: "", value: "", icon: "Shield" }],
         benefits: [{ title: "", description: "", icon: "Zap" }],
         process: [{ title: "", description: "", icon: "Settings" }],
         faq: [{ question: "", answer: "" }],
         cta: { text: "Start Your Project", link: "/contact" }
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
    { id: "identity", label: "Identity & Vision", icon: Type, title: "Service Core Identity" },
    { id: "features", label: "Technical Specs", icon: List, title: "Features & Impact Metrics" },
    { id: "benefits", label: "Value Benefits", icon: Heart, title: "Consumer Advantages" },
    { id: "process", label: "Workflow Phase", icon: Settings, title: "Phase-based Methodology" },
    { id: "faq", label: "Service FAQ", icon: HelpCircle, title: "Detail Specific Support" },
    { id: "cta", label: "Conversion", icon: Mail, title: "Call to Action Management" },
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  return (
    <div className="bg-white min-h-[700px] flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-1 p-4 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all shrink-0 ${
                activeTab === tab.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-10 overflow-y-auto max-h-[850px] custom-scrollbar bg-[#F8FAFC]">
        <div className="mb-12 pb-8 border-b border-slate-200">
           <h2 className="text-3xl font-medium text-slate-900 tracking-tight">{activeTabTitle}</h2>
           <p className="text-sm text-slate-400 mt-2 font-medium">Fully configure this individual service detail page.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }} 
            className="space-y-16 pb-20"
          >
            
            {/* IDENTITY SECTION */}
            {activeTab === "identity" && (
              <div className="space-y-12">
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-8 space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Service Badge</label>
                          <input type="text" value={data.badge || ""} onChange={(e) => updateField("badge", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Page Title</label>
                          <input type="text" value={data.title || ""} onChange={(e) => updateField("title", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none" />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Hero Tagline</label>
                       <input type="text" value={data.tagline || ""} onChange={(e) => updateField("tagline", e.target.value)} className="w-full bg-primary/5 text-primary border border-primary/20 rounded-xl px-5 py-4 text-sm font-bold outline-none" />
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Overview Narrative</label>
                       <div className="space-y-4">
                          <input type="text" value={data.overviewTitle || ""} onChange={(e) => updateField("overviewTitle", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-lg font-medium outline-none" placeholder="Overview Section Title" />
                          <textarea value={data.overview || ""} onChange={(e) => updateField("overview", e.target.value)} rows={6} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-600 outline-none leading-relaxed" placeholder="Detailed service description..." />
                       </div>
                    </div>
                  </div>

                  <div className="col-span-4 space-y-10">
                    <ImageUpload label="Overview Featured Image" value={data.overviewImage} onChange={(url: string) => updateField("overviewImage", url)} />
                  </div>
                </div>
              </div>
            )}

            {/* FEATURES & STATS */}
            {activeTab === "features" && (
              <div className="grid grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Service Technical Features</label>
                    <div className="space-y-4">
                       {(data.features || []).map((f: any, i: number) => (
                         <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative group">
                            <button onClick={() => {
                              const newF = data.features.filter((_: any, idx: number) => idx !== i); updateField("features", newF);
                            }} className="absolute top-2 right-2 text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            <div className="grid grid-cols-1 gap-3">
                               <input type="text" value={typeof f === 'string' ? f : f.text} onChange={(e) => {
                                 const newF = [...data.features]; 
                                 if (typeof f === 'string') newF[i] = { text: e.target.value, icon: "CheckCircle" };
                                 else newF[i].text = e.target.value;
                                 updateField("features", newF);
                               }} className="w-full bg-slate-50 px-4 py-2 rounded-lg text-xs font-medium outline-none" placeholder="Feature Label" />
                               <input type="text" value={f.icon || "CheckCircle"} onChange={(e) => {
                                 const newF = [...data.features]; 
                                 if (typeof f === 'string') newF[i] = { text: f, icon: e.target.value };
                                 else newF[i].icon = e.target.value;
                                 updateField("features", newF);
                               }} className="w-full bg-transparent px-4 py-1 rounded-lg text-[9px] text-slate-400 outline-none" placeholder="Icon Name" />
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateField("features", [...(data.features || []), { text: "", icon: "CheckCircle" }])} className="w-full border-2 border-dashed border-slate-200 py-4 rounded-2xl text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-primary transition-all">+ Add Feature</button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Impact & Success Metrics</label>
                    <div className="space-y-4">
                       {(data.stats || []).map((s: any, i: number) => (
                         <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative">
                            <button onClick={() => {
                              const newS = data.stats.filter((_: any, idx: number) => idx !== i); updateField("stats", newS);
                            }} className="absolute top-2 right-2 text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            <div className="flex gap-4">
                               <div className="flex-1 space-y-3">
                                  <input type="text" value={s.value} onChange={(e) => {
                                    const newS = [...data.stats]; newS[i].value = e.target.value; updateField("stats", newS);
                                  }} className="w-full bg-slate-50 px-4 py-2 rounded-lg text-lg font-bold outline-none" placeholder="Value (e.g. 100%)" />
                                  <input type="text" value={s.label} onChange={(e) => {
                                    const newS = [...data.stats]; newS[i].label = e.target.value; updateField("stats", newS);
                                  }} className="w-full bg-transparent px-4 py-1 rounded-lg text-[10px] font-medium text-slate-400 uppercase tracking-widest outline-none" placeholder="Label" />
                               </div>
                               <input type="text" value={s.icon || "Shield"} onChange={(e) => {
                                 const newS = [...data.stats]; newS[i].icon = e.target.value; updateField("stats", newS);
                               }} className="w-20 bg-primary/5 text-primary px-3 py-1 rounded-lg text-[9px] font-bold outline-none h-fit" placeholder="Icon" />
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateField("stats", [...(data.stats || []), { value: "", label: "", icon: "Shield" }])} className="w-full border-2 border-dashed border-slate-200 py-4 rounded-2xl text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-primary transition-all">+ Add Stat</button>
                    </div>
                 </div>
              </div>
            )}

            {/* BENEFITS SECTION */}
            {activeTab === "benefits" && (
              <div className="space-y-6">
                 <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Key Value Benefits (Grid)</label>
                 <div className="grid grid-cols-2 gap-8">
                    {(data.benefits || []).map((b: any, i: number) => (
                      <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative group">
                         <button onClick={() => {
                           const newB = data.benefits.filter((_: any, idx: number) => idx !== i); updateField("benefits", newB);
                         }} className="absolute top-6 right-6 text-slate-200 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                         <div className="flex items-center gap-4">
                            <input type="text" value={b.icon || "Zap"} onChange={(e) => {
                               const newB = [...data.benefits]; newB[i].icon = e.target.value; updateField("benefits", newB);
                            }} className="w-24 bg-slate-50 px-3 py-1.5 rounded-lg text-[10px] font-bold text-primary outline-none" placeholder="Icon" />
                            <input type="text" value={b.title} onChange={(e) => {
                               const newB = [...data.benefits]; newB[i].title = e.target.value; updateField("benefits", newB);
                            }} className="flex-1 bg-transparent text-xl font-bold text-slate-900 outline-none" placeholder="Benefit Title" />
                         </div>
                         <textarea value={b.description} onChange={(e) => {
                            const newB = [...data.benefits]; newB[i].description = e.target.value; updateField("benefits", newB);
                         }} className="w-full bg-transparent text-sm text-slate-500 leading-relaxed outline-none" rows={3} placeholder="Detailed benefit description..." />
                      </div>
                    ))}
                    <button onClick={() => updateField("benefits", [...(data.benefits || []), { title: "", description: "", icon: "Zap" }])} className="border-2 border-dashed border-slate-200 rounded-3xl py-20 flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-primary transition-all">
                       <Plus className="w-10 h-10" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Add New Benefit Card</span>
                    </button>
                 </div>
              </div>
            )}

            {/* WORKFLOW PROCESS */}
            {activeTab === "process" && (
              <div className="space-y-6">
                 <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Phase-based Methodology</label>
                 <div className="grid grid-cols-1 gap-6 max-w-4xl">
                    {(data.process || []).map((p: any, i: number) => (
                      <div key={i} className="flex gap-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative items-start group">
                         <div className="w-16 h-16 bg-primary text-white rounded-2xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold uppercase opacity-60">Phase</span>
                            <span className="text-2xl font-black">{i+1}</span>
                         </div>
                         <div className="flex-1 space-y-4">
                            <div className="flex gap-4">
                               <input type="text" value={p.title} onChange={(e) => {
                                 const newP = [...data.process]; newP[i].title = e.target.value; updateField("process", newP);
                               }} className="flex-1 bg-transparent text-xl font-bold text-slate-900 outline-none" placeholder="Step Title" />
                               <input type="text" value={p.icon || "Settings"} onChange={(e) => {
                                 const newP = [...data.process]; newP[i].icon = e.target.value; updateField("process", newP);
                               }} className="w-24 bg-slate-50 px-3 py-1.5 rounded-lg text-[10px] font-medium outline-none" placeholder="Icon" />
                            </div>
                            <textarea value={p.description} onChange={(e) => {
                               const newP = [...data.process]; newP[i].description = e.target.value; updateField("process", newP);
                            }} className="w-full bg-transparent text-sm text-slate-500 leading-relaxed outline-none" rows={2} placeholder="Process description..." />
                         </div>
                         <button onClick={() => {
                           const newP = data.process.filter((_: any, idx: number) => idx !== i); updateField("process", newP);
                         }} className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateField("process", [...(data.process || []), { title: "", description: "", icon: "Settings" }])} className="w-full border-2 border-dashed border-slate-200 rounded-3xl py-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-all">+ Add Process Phase</button>
                 </div>
              </div>
            )}

             {/* FAQ SECTION */}
            {activeTab === "faq" && (
              <div className="space-y-6 max-w-4xl">
                 <ContentSelector 
                    type="faq" 
                    label="Service FAQ Selection (Select from Global Library)" 
                    selectedItems={(() => {
                      if (Array.isArray(data.faq)) return data.faq;
                      if (Array.isArray(data.faq?.questions)) return data.faq.questions;
                      return [];
                    })()} 
                    onSelect={(items) => updateField("faq", items)} 
                 />
              </div>
            )}

            {/* CTA SECTION */}
            {activeTab === "cta" && (
              <div className="max-w-3xl space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                 <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Bottom Call to Action</label>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <span className="text-[9px] font-bold text-slate-300 uppercase">Button Label</span>
                       <input type="text" value={data.cta?.text || ""} onChange={(e) => updateField("cta", { ...data.cta, text: e.target.value })} className="w-full bg-slate-50 px-4 py-3 rounded-xl text-sm font-bold text-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                       <span className="text-[9px] font-bold text-slate-300 uppercase">Target Link</span>
                       <input type="text" value={data.cta?.link || ""} onChange={(e) => updateField("cta", { ...data.cta, link: e.target.value })} className="w-full bg-slate-50 px-4 py-3 rounded-xl text-sm outline-none" />
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
