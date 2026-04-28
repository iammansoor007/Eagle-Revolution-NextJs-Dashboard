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
import IconSelector from "@/components/admin/IconSelector";
import { UI } from "./styles";

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
      <label className={UI.label}>{label}</label>
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
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-1 p-4 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${
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

      <div className="p-10 bg-[#F8FAFC]">
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
                          <label className={UI.label}>Service Badge</label>
                          <input type="text" value={data.badge || ""} onChange={(e) => updateField("badge", e.target.value)} className={UI.input} />
                       </div>
                       <div className="space-y-3">
                          <label className={UI.label}>Page Title</label>
                          <input type="text" value={data.title || ""} onChange={(e) => updateField("title", e.target.value)} className={UI.input} />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className={UI.label}>Hero Tagline</label>
                       <input type="text" value={data.tagline || ""} onChange={(e) => updateField("tagline", e.target.value)} className={UI.inputPrimary} />
                    </div>

                    <div className="space-y-4">
                       <label className={UI.label}>Overview Narrative</label>
                       <div className={UI.card + " space-y-6"}>
                          <div className="space-y-2">
                             <label className={UI.label}>Overview Section Title</label>
                             <input type="text" value={data.overviewTitle || ""} onChange={(e) => updateField("overviewTitle", e.target.value)} className={UI.inputLarge} placeholder="Overview Section Title" />
                          </div>
                          <div className="space-y-2">
                             <label className={UI.label}>Detailed Description</label>
                             <textarea value={data.overview || ""} onChange={(e) => updateField("overview", e.target.value)} rows={6} className={UI.textarea} placeholder="Detailed service description..." />
                          </div>
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
                    <label className={UI.label}>Service Technical Features</label>
                    <div className="space-y-4">
                       {(data.features || []).map((f: any, i: number) => (
                         <div key={i} className={UI.card + " space-y-6 relative group"}>
                            <button onClick={() => {
                              const newF = data.features.filter((_: any, idx: number) => idx !== i); updateField("features", newF);
                            }} className="absolute top-8 right-8 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            <div className="grid grid-cols-1 gap-4">
                               <div className="space-y-2">
                                  <label className={UI.label}>Feature Label</label>
                                  <input type="text" value={typeof f === 'string' ? f : f.text} onChange={(e) => {
                                    const newF = [...data.features]; 
                                    if (typeof f === 'string') newF[i] = { text: e.target.value, icon: "CheckCircle" };
                                    else newF[i].text = e.target.value;
                                    updateField("features", newF);
                                  }} className={UI.input} placeholder="Feature Label" />
                               </div>
                               <IconSelector 
                                 label="Feature Icon"
                                 value={f.icon || "CheckCircle"} 
                                 onChange={(val) => {
                                   const newF = [...data.features]; 
                                   if (typeof f === 'string') newF[i] = { text: f, icon: val };
                                   else newF[i].icon = val;
                                   updateField("features", newF);
                                 }} 
                               />
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateField("features", [...(data.features || []), { text: "", icon: "CheckCircle" }])} className={UI.buttonAdd}>+ Add Feature</button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className={UI.label}>Impact & Success Metrics</label>
                    <div className="space-y-4">
                       {(data.stats || []).map((s: any, i: number) => (
                         <div key={i} className={UI.card + " space-y-6 relative"}>
                            <button onClick={() => {
                              const newS = data.stats.filter((_: any, idx: number) => idx !== i); updateField("stats", newS);
                            }} className="absolute top-8 right-8 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <label className={UI.label}>Stat Value</label>
                                  <input type="text" value={s.value} onChange={(e) => {
                                    const newS = [...data.stats]; newS[i].value = e.target.value; updateField("stats", newS);
                                  }} className={UI.inputLarge} placeholder="100%" />
                               </div>
                               <div className="space-y-2">
                                  <label className={UI.label}>Stat Label</label>
                                  <input type="text" value={s.label} onChange={(e) => {
                                    const newS = [...data.stats]; newS[i].label = e.target.value; updateField("stats", newS);
                                  }} className={UI.input} placeholder="Label" />
                               </div>
                            </div>
                            <IconSelector 
                              label="Stat Icon"
                              value={s.icon || "Shield"} 
                              onChange={(val) => {
                                const newS = [...data.stats]; newS[i].icon = val; updateField("stats", newS);
                              }} 
                            />
                         </div>
                       ))}
                       <button onClick={() => updateField("stats", [...(data.stats || []), { value: "", label: "", icon: "Shield" }])} className={UI.buttonAdd}>+ Add Stat</button>
                    </div>
                 </div>
              </div>
            )}

            {/* BENEFITS SECTION */}
            {activeTab === "benefits" && (
              <div className="space-y-6">
                 <label className={UI.label}>Key Value Benefits (Grid)</label>
                 <div className="grid grid-cols-2 gap-8">
                    {(data.benefits || []).map((b: any, i: number) => (
                      <div key={i} className={UI.card + " space-y-6 relative group"}>
                         <button onClick={() => {
                           const newB = data.benefits.filter((_: any, idx: number) => idx !== i); updateField("benefits", newB);
                         }} className="absolute top-8 right-8 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                         <div className="grid grid-cols-2 gap-4">
                            <IconSelector 
                               label="Benefit Icon"
                               value={b.icon || "Zap"} 
                               onChange={(val) => {
                                 const newB = [...data.benefits]; newB[i].icon = val; updateField("benefits", newB);
                               }} 
                            />
                            <div className="space-y-2">
                               <label className={UI.label}>Benefit Title</label>
                               <input type="text" value={b.title} onChange={(e) => {
                                  const newB = [...data.benefits]; newB[i].title = e.target.value; updateField("benefits", newB);
                               }} className={UI.inputLarge} placeholder="Benefit Title" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className={UI.label}>Benefit Narrative</label>
                            <textarea value={b.description} onChange={(e) => {
                               const newB = [...data.benefits]; newB[i].description = e.target.value; updateField("benefits", newB);
                            }} className={UI.textarea} rows={3} placeholder="Detailed benefit description..." />
                         </div>
                      </div>
                    ))}
                    <button onClick={() => updateField("benefits", [...(data.benefits || []), { title: "", description: "", icon: "Zap" }])} className={UI.buttonAdd + " h-full flex flex-col justify-center gap-4 py-20"}>
                       <Plus className="w-10 h-10 mx-auto" />
                       <span>Add New Benefit Card</span>
                    </button>
                 </div>
              </div>
            )}

            {/* WORKFLOW PROCESS */}
            {activeTab === "process" && (
              <div className="space-y-6">
                 <label className={UI.label}>Phase-based Methodology</label>
                 <div className="grid grid-cols-1 gap-6 max-w-4xl">
                    {(data.process || []).map((p: any, i: number) => (
                      <div key={i} className={UI.card + " flex gap-8 relative items-start group"}>
                         <div className="w-16 h-16 bg-primary text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                            <span className="text-[10px] font-bold uppercase opacity-60">Phase</span>
                            <span className="text-2xl font-black">{i+1}</span>
                         </div>
                         <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <label className={UI.label}>Phase Title</label>
                                  <input type="text" value={p.title} onChange={(e) => {
                                    const newP = [...data.process]; newP[i].title = e.target.value; updateField("process", newP);
                                  }} className={UI.inputLarge} placeholder="Step Title" />
                               </div>
                               <IconSelector 
                                  label="Phase Icon"
                                  value={p.icon || "Settings"} 
                                  onChange={(val) => {
                                    const newP = [...data.process]; newP[i].icon = val; updateField("process", newP);
                                  }} 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className={UI.label}>Phase Description</label>
                               <textarea value={p.description} onChange={(e) => {
                                  const newP = [...data.process]; newP[i].description = e.target.value; updateField("process", newP);
                               }} className={UI.textarea} rows={2} placeholder="Process description..." />
                            </div>
                         </div>
                         <button onClick={() => {
                           const newP = data.process.filter((_: any, idx: number) => idx !== i); updateField("process", newP);
                         }} className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateField("process", [...(data.process || []), { title: "", description: "", icon: "Settings" }])} className={UI.buttonAdd}>+ Add Process Phase</button>
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
              <div className={UI.card + " max-w-3xl space-y-8"}>
                 <label className={UI.sectionHeader}>Bottom Call to Action</label>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className={UI.label}>Button Label</label>
                       <input type="text" value={data.cta?.text || ""} onChange={(e) => updateField("cta", { ...data.cta, text: e.target.value })} className={UI.inputPrimary} />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Target Link</label>
                       <input type="text" value={data.cta?.link || ""} onChange={(e) => updateField("cta", { ...data.cta, link: e.target.value })} className={UI.input} />
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
