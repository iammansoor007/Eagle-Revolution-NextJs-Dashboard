"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Briefcase, Send, Sparkles, CheckCircle, PenTool
} from "lucide-react";

export default function CareersEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         careers: {
           section: { badge: "Join Eagle Revolution", headline: "Expert hands with Visionary minds", description: "Build your future with a team that values precision, integrity, and craftsmanship." },
           roles: [
             { label: "Project Manager", value: "project-manager" },
             { label: "Roofing Specialist", value: "roofing-specialist" },
             { label: "Sales Consultant", value: "sales-consultant" }
           ],
           success: { title: "Application Received", description: "Thank you for your interest. Our recruitment team will review your profile and reach out shortly." },
           labels: { name: "Full Name", email: "Email Address", role: "Position Applied For", summary: "Tell us about your experience" }
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
    { id: "header", label: "Recruitment Intro", icon: Type, title: "Careers Page Introduction" },
    { id: "roles", label: "Position Catalog", icon: Briefcase, title: "Available Career Opportunities" },
    { id: "form", label: "Submission Flow", icon: Send, title: "Application Form & Feedback" },
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
           <p className="text-sm text-slate-400 mt-2 font-medium">Configure the recruitment experience and manage available roles.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }} 
            className="space-y-16 pb-20"
          >
            
            {/* HEADER SECTION */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-10">
                 <div className="space-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Badge</label>
                       <input type="text" value={data.careers?.section?.badge || ""} onChange={(e) => updateCareers("section", "badge", e.target.value)} className="w-full bg-slate-50 px-5 py-3.5 rounded-xl text-xs font-bold text-blue-600 outline-none" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline (Use "with" for split)</label>
                       <input type="text" value={data.careers?.section?.headline || ""} onChange={(e) => updateCareers("section", "headline", e.target.value)} className="w-full bg-slate-50 px-5 py-4 rounded-xl text-xl font-bold outline-none" placeholder="Expert hands with Visionary minds" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Recruitment Narrative</label>
                       <textarea value={data.careers?.section?.description || ""} onChange={(e) => updateCareers("section", "description", e.target.value)} rows={4} className="w-full bg-slate-50 px-5 py-4 rounded-2xl text-sm text-slate-500 outline-none leading-relaxed" />
                    </div>
                 </div>
              </div>
            )}

            {/* ROLES SECTION */}
            {activeTab === "roles" && (
              <div className="space-y-10">
                 <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Available Career Opportunities</label>
                 <div className="grid grid-cols-2 gap-6">
                    {(data.careers?.roles || []).map((role: any, i: number) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-primary/20 transition-all relative">
                         <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0">
                            <Briefcase className="w-5 h-5" />
                         </div>
                         <div className="flex-1 space-y-1">
                            <input type="text" value={role.label} onChange={(e) => {
                                 const newR = [...data.careers.roles];
                                 newR[i].label = e.target.value;
                                 newR[i].value = e.target.value.toLowerCase().replace(/\s+/g, '-');
                                 updateCareers("roles", null, newR);
                               }} className="w-full bg-transparent font-bold text-slate-800 outline-none text-sm" placeholder="Job Title (e.g. Senior Project Manager)" />
                            <p className="text-[9px] text-slate-300 font-mono uppercase">ID: {role.value}</p>
                         </div>
                         <button onClick={() => {
                            const newR = data.careers.roles.filter((_: any, idx: number) => idx !== i);
                            updateCareers("roles", null, newR);
                         }} className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all absolute top-2 right-2"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateCareers("roles", null, [...(data.careers?.roles || []), { label: "New Position", value: "new-position" }])} className="border-2 border-dashed border-slate-200 rounded-2xl py-10 flex flex-col items-center justify-center gap-3 text-slate-300 hover:text-primary hover:border-primary/30 transition-all">
                       <Plus className="w-8 h-8" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Post New Career Opportunity</span>
                    </button>
                 </div>
              </div>
            )}

            {/* FORM CONFIG SECTION */}
            {activeTab === "form" && (
              <div className="grid grid-cols-12 gap-12">
                 <div className="col-span-7 space-y-10">
                    <div className="space-y-6">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Submission Success State</label>
                       <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                             <CheckCircle className="w-8 h-8" />
                          </div>
                          <div className="w-full space-y-4">
                             <input type="text" value={data.careers?.success?.title || ""} onChange={(e) => updateCareers("success", "title", e.target.value)} className="w-full bg-slate-50 px-5 py-3 rounded-xl text-base font-bold text-center outline-none" placeholder="Success Headline" />
                             <textarea value={data.careers?.success?.description || ""} onChange={(e) => updateCareers("success", "description", e.target.value)} rows={3} className="w-full bg-slate-50 px-5 py-3 rounded-xl text-xs text-slate-500 text-center outline-none leading-relaxed" placeholder="Detailed success message..." />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="col-span-5 space-y-10">
                    <div className="space-y-6">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Form Input Labels</label>
                       <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                          {Object.entries(data.careers?.labels || {}).map(([key, val]: [string, any]) => (
                            <div key={key} className="space-y-2">
                               <div className="flex items-center gap-2">
                                  <PenTool className="w-3 h-3 text-slate-300" />
                                  <span className="text-[9px] font-bold uppercase text-slate-300 tracking-widest">{key} Field</span>
                               </div>
                               <input type="text" value={val} onChange={(e) => {
                                 const newLabels = { ...data.careers.labels, [key]: e.target.value };
                                 updateCareers("labels", null, newLabels);
                               }} className="w-full bg-slate-50/50 border border-slate-100 px-4 py-2 rounded-lg text-xs font-medium text-slate-700 outline-none" />
                            </div>
                          ))}
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
