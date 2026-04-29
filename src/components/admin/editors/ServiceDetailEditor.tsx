"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Droplets, Zap, Globe, ShieldCheck, Settings, Info, Box,
  Trophy, Wrench, HardHat, Ruler, Paintbrush, Wind, Flame, Thermometer,
  Clock, Users, Flag, Linkedin, Quote, TrendingUp, X
} from "lucide-react";
import ContentSelector from "@/components/admin/ContentSelector";
import IconSelector from "@/components/admin/IconSelector";
import ImageField from "@/components/admin/ImageField";
import { UI } from "./styles";

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

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

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
      {/* WP Style Sub-tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-6 text-[13px] border-b border-[#f0f0f1] pb-1">
        {tabs.map((tab: any, idx: number) => (
          <React.Fragment key={tab.id}>
            <button 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-1 py-1 transition-colors ${activeTab === tab.id ? 'text-[#1d2327] font-bold' : 'text-[#2271b1] hover:text-[#135e96]'}`}
            >
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7] px-1">|</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-6">
        <div className="mb-6">
           <h2 className={UI.sectionHeader}>{activeTabTitle}</h2>
           <p className="text-[12px] text-[#646970] -mt-2">Fully configure the specific details and technical overview of this service.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="space-y-8 pb-10"
          >
            
            {/* IDENTITY SECTION */}
            {activeTab === "identity" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className={UI.label}>Service Badge</label>
                          <input type="text" value={data.badge || ""} onChange={(e) => updateField("badge", e.target.value)} className={UI.input} />
                       </div>
                       <div className="space-y-1.5">
                          <label className={UI.label}>Page Title</label>
                          <input type="text" value={data.title || ""} onChange={(e) => updateField("title", e.target.value)} className={UI.input} />
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className={UI.label}>Hero Tagline</label>
                       <input type="text" value={data.tagline || ""} onChange={(e) => updateField("tagline", e.target.value)} className={UI.inputLarge} />
                    </div>

                    <div className={UI.card + " space-y-4"}>
                       <label className={UI.sectionHeader}>Detailed Overview</label>
                       <div className="space-y-1.5">
                          <label className={UI.label}>Section Title</label>
                          <input type="text" value={data.overviewTitle || ""} onChange={(e) => updateField("overviewTitle", e.target.value)} className={UI.input} />
                       </div>
                       <div className="space-y-1.5">
                          <label className={UI.label}>Long Description</label>
                          <textarea value={data.overview || ""} onChange={(e) => updateField("overview", e.target.value)} rows={6} className={UI.textarea} />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                     <ImageField label="Overview Featured Image" value={data.overviewImage || ""} onChange={(url: string) => updateField("overviewImage", url)} altValue={data.overviewImageAlt || ""} onAltChange={(alt: string) => updateField("overviewImageAlt", alt)} />
                  </div>
                </div>
              </div>
            )}

            {/* FEATURES & STATS */}
            {activeTab === "features" && (
              <div className="grid grid-cols-2 gap-12">
                 <div className="space-y-4">
                    <label className={UI.label}>Service Technical Features</label>
                    <div className="space-y-2">
                       {(data.features || []).map((f: any, i: number) => (
                         <div key={i} className={UI.card + " space-y-3 relative group"}>
                            <div className="flex items-center justify-between">
                               <input type="text" value={typeof f === 'string' ? f : f.text} onChange={(e) => {
                                 const newF = [...data.features]; 
                                 if (typeof f === 'string') newF[i] = { text: e.target.value, icon: "CheckCircle" };
                                 else newF[i].text = e.target.value;
                                 updateField("features", newF);
                               }} className={UI.input + " flex-1"} placeholder="Feature Label" />
                               <button onClick={() => {
                                 const newF = data.features.filter((_: any, idx: number) => idx !== i); updateField("features", newF);
                               }} className="text-slate-400 hover:text-[#d63638] ml-2"><Trash2 className="w-4 h-4" /></button>
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
                       ))}
                       <button onClick={() => updateField("features", [...(data.features || []), { text: "", icon: "CheckCircle" }])} className="text-[11px] font-bold text-[#2271b1] uppercase hover:underline">+ Add Feature</button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className={UI.label}>Impact & Success Metrics</label>
                    <div className="space-y-2">
                       {(data.stats || []).map((s: any, i: number) => (
                         <div key={i} className={UI.card + " space-y-3 relative"}>
                            <div className="grid grid-cols-2 gap-2">
                               <div className="space-y-1">
                                  <label className={UI.label}>Value</label>
                                  <input type="text" value={s.value} onChange={(e) => {
                                    const newS = [...data.stats]; newS[i].value = e.target.value; updateField("stats", newS);
                                  }} className={UI.inputLarge} />
                               </div>
                               <div className="space-y-1">
                                  <label className={UI.label}>Label</label>
                                  <input type="text" value={s.label} onChange={(e) => {
                                    const newS = [...data.stats]; newS[i].label = e.target.value; updateField("stats", newS);
                                  }} className={UI.input} />
                               </div>
                            </div>
                            <div className="flex items-center justify-between">
                               <IconSelector 
                                 label="Icon"
                                 value={s.icon || "Shield"} 
                                 onChange={(val) => {
                                   const newS = [...data.stats]; newS[i].icon = val; updateField("stats", newS);
                                 }} 
                               />
                               <button onClick={() => {
                                 const newS = data.stats.filter((_: any, idx: number) => idx !== i); updateField("stats", newS);
                               }} className="text-[#d63638] text-[11px] hover:underline">Remove</button>
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateField("stats", [...(data.stats || []), { value: "", label: "", icon: "Shield" }])} className="text-[11px] font-bold text-[#2271b1] uppercase hover:underline">+ Add Stat</button>
                    </div>
                 </div>
              </div>
            )}

            {/* BENEFITS SECTION */}
            {activeTab === "benefits" && (
              <div className="space-y-6">
                 <label className={UI.label}>Key Value Benefits</label>
                 <div className="grid grid-cols-2 gap-4">
                    {(data.benefits || []).map((b: any, i: number) => (
                      <div key={i} className={UI.card + " space-y-4 relative group"}>
                         <div className="flex items-start justify-between">
                            <IconSelector 
                               label="Icon"
                               value={b.icon || "Zap"} 
                               onChange={(val) => {
                                 const newB = [...data.benefits]; newB[i].icon = val; updateField("benefits", newB);
                               }} 
                            />
                            <button onClick={() => {
                              const newB = data.benefits.filter((_: any, idx: number) => idx !== i); updateField("benefits", newB);
                            }} className="text-slate-400 hover:text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                         </div>
                         <div className="space-y-1.5">
                            <label className={UI.label}>Benefit Title</label>
                            <input type="text" value={b.title} onChange={(e) => {
                               const newB = [...data.benefits]; newB[i].title = e.target.value; updateField("benefits", newB);
                            }} className={UI.inputLarge} />
                         </div>
                         <div className="space-y-1.5">
                            <label className={UI.label}>Description</label>
                            <textarea value={b.description} onChange={(e) => {
                               const newB = [...data.benefits]; newB[i].description = e.target.value; updateField("benefits", newB);
                            }} className={UI.textarea} rows={3} />
                         </div>
                      </div>
                    ))}
                    <button onClick={() => updateField("benefits", [...(data.benefits || []), { title: "", description: "", icon: "Zap" }])} className={UI.buttonAdd}>+ Add Benefit</button>
                 </div>
              </div>
            )}

            {/* WORKFLOW PROCESS */}
            {activeTab === "process" && (
              <div className="space-y-6">
                 <label className={UI.label}>Phase-based Methodology</label>
                 <div className="space-y-3 max-w-3xl">
                    {(data.process || []).map((p: any, i: number) => (
                      <div key={i} className={UI.card + " flex gap-6 relative items-start group"}>
                         <div className="w-10 h-10 bg-[#f0f6fb] border border-[#dcdcde] text-[#2271b1] font-bold flex items-center justify-center shrink-0">
                            {i+1}
                         </div>
                         <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-1.5">
                                  <label className={UI.label}>Phase Title</label>
                                  <input type="text" value={p.title} onChange={(e) => {
                                    const newP = [...data.process]; newP[i].title = e.target.value; updateField("process", newP);
                                  }} className={UI.input} />
                               </div>
                               <IconSelector 
                                  label="Icon"
                                  value={p.icon || "Settings"} 
                                  onChange={(val) => {
                                    const newP = [...data.process]; newP[i].icon = val; updateField("process", newP);
                                  }} 
                               />
                            </div>
                            <div className="space-y-1.5">
                               <label className={UI.label}>Description</label>
                               <textarea value={p.description} onChange={(e) => {
                                  const newP = [...data.process]; newP[i].description = e.target.value; updateField("process", newP);
                               }} className={UI.textarea} rows={2} />
                            </div>
                         </div>
                         <button onClick={() => {
                           const newP = data.process.filter((_: any, idx: number) => idx !== i); updateField("process", newP);
                         }} className="text-slate-400 hover:text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
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
                    label="Service FAQ Selection" 
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
              <div className={UI.card + " max-w-2xl space-y-6"}>
                 <label className={UI.sectionHeader}>Conversion Action</label>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className={UI.label}>Button Text</label>
                       <input type="text" value={data.cta?.text || ""} onChange={(e) => updateField("cta", { ...data.cta, text: e.target.value })} className={UI.input} />
                    </div>
                    <div className="space-y-1.5">
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
