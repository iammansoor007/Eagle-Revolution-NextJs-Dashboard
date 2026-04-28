"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Briefcase, Send
} from "lucide-react";

export default function CareersEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         careers: {
           section: { badge: "", headline: "", description: "" },
           roles: [],
           success: { title: "", description: "" },
           labels: {}
         }
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateCareers = (section: string, field: string | null, value: any) => {
    const currentCareers = data.careers || {
      section: { badge: "", headline: "", description: "" },
      roles: [],
      success: { title: "", description: "" },
      labels: {}
    };

    const targetSectionData = currentCareers[section as keyof typeof currentCareers] || {};

    setData({
      ...data,
      careers: {
        ...currentCareers,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "header", label: "Careers Header", icon: Type, title: "Careers Introduction" },
    { id: "roles", label: "Open Positions", icon: Briefcase, title: "Job Roster Management" },
    { id: "form", label: "Form Configuration", icon: Send, title: "Application Form Settings" },
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
           <p className="text-xs text-slate-400 mt-1">Configure the recruitment page and open roles within Eagle Revolution.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* HEADER SECTION */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Badge</label>
                    <input type="text" value={data.careers?.section?.badge || ""} onChange={(e) => updateCareers("section", "badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline</label>
                    <input type="text" value={data.careers?.section?.headline || ""} onChange={(e) => updateCareers("section", "headline", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Recruitment Narrative</label>
                    <textarea value={data.careers?.section?.description || ""} onChange={(e) => updateCareers("section", "description", e.target.value)} rows={4} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:bg-white focus:border-primary/30 transition-all" />
                 </div>
              </div>
            )}

            {/* ROLES SECTION */}
            {activeTab === "roles" && (
              <div className="space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    {(data.careers?.roles || []).map((role: any, i: number) => (
                      <div key={i} className="bg-slate-50/30 p-4 rounded-xl border border-slate-100 flex gap-4 items-center group transition-all hover:border-primary/20">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                           <Briefcase className="w-4 h-4 text-primary" />
                        </div>
                        <input type="text" value={role.label} onChange={(e) => {
                             const newR = [...data.careers.roles];
                             newR[i].label = e.target.value;
                             newR[i].value = e.target.value;
                             updateCareers("roles", null, newR);
                           }} className="flex-1 bg-transparent font-medium text-xs text-slate-800 outline-none" placeholder="Job Title" />
                        <button onClick={() => {
                           const newR = data.careers.roles.filter((_: any, idx: number) => idx !== i);
                           updateCareers("roles", null, newR);
                        }} className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateCareers("roles", null, [...(data.careers?.roles || []), { label: "New Position", value: "New Position" }])} className="border border-dashed border-slate-200 rounded-xl py-4 text-[10px] font-medium text-slate-300 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest">
                      + Add Position
                    </button>
                 </div>
              </div>
            )}

            {/* FORM CONFIG SECTION */}
            {activeTab === "form" && (
              <div className="grid grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Success State</label>
                    <div className="bg-slate-50/30 p-6 rounded-2xl border border-slate-100 space-y-4">
                       <input type="text" value={data.careers?.success?.title || ""} onChange={(e) => updateCareers("success", "title", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none" placeholder="Success Title" />
                       <textarea value={data.careers?.success?.description || ""} onChange={(e) => updateCareers("success", "description", e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-400 outline-none" placeholder="Success message..." />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Input Labels Mapping</label>
                    <div className="grid grid-cols-1 gap-2">
                       {Object.entries(data.careers?.labels || {}).map(([key, val]: [string, any]) => (
                         <div key={key} className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                            <span className="w-20 text-[8px] font-medium uppercase text-slate-300">{key}</span>
                            <input type="text" value={val} onChange={(e) => updateCareers("labels", key, e.target.value)} className="flex-1 bg-transparent text-[10px] font-medium text-slate-700 outline-none" />
                         </div>
                       ))}
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
