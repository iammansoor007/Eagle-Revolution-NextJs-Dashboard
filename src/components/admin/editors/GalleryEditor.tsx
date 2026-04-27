"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, MapPin, Calendar, Layers
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

export default function GalleryEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      fetch("/api/content")
        .then(res => res.json())
        .then(json => {
           if (!json.portfolio) {
             json.portfolio = {
               section: { badge: "", headline: "", description: "" },
               projects: []
             };
           }
           setData(json);
        })
        .catch(err => console.error("Failed to seed content:", err));
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updatePortfolio = (section: string, field: string | null, value: any) => {
    const currentPortfolio = data.portfolio || {
      section: { badge: "", headline: "", description: "" },
      projects: []
    };

    const targetSectionData = currentPortfolio[section as keyof typeof currentPortfolio] || {};

    setData({
      ...data,
      portfolio: {
        ...currentPortfolio,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "header", label: "Gallery Header", icon: Type, title: "Portfolio Introduction" },
    { id: "projects", label: "Project Showcases", icon: ImageIcon, title: "Individual Project Management" },
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

      {/* Editor Content */}
      <div className="flex-1 p-10 overflow-y-auto max-h-[800px] custom-scrollbar">
        {/* Tab Title Marker */}
        <div className="mb-10 pb-6 border-b border-slate-50">
           <h2 className="text-2xl font-normal text-slate-900 tracking-tight">{activeTabTitle}</h2>
           <p className="text-xs text-slate-400 mt-1">Configure the project gallery and its introductory narrative.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* HEADER SECTION */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Gallery Badge</label>
                    <input type="text" value={data.portfolio?.section?.badge || ""} onChange={(e) => updatePortfolio("section", "badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" placeholder="Our Recent Work" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline</label>
                    <input type="text" value={data.portfolio?.section?.headline || ""} onChange={(e) => updatePortfolio("section", "headline", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" placeholder="Precision & Craftsmanship" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Intro Paragraph</label>
                    <textarea value={data.portfolio?.section?.description || ""} onChange={(e) => updatePortfolio("section", "description", e.target.value)} rows={4} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:bg-white focus:border-primary/30 transition-all" placeholder="Tell the story behind your portfolio..." />
                 </div>
              </div>
            )}

            {/* PROJECTS SECTION */}
            {activeTab === "projects" && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 gap-8">
                    {(data.portfolio?.projects || []).map((project: any, i: number) => (
                      <div key={i} className="bg-slate-50/30 rounded-3xl p-8 border border-slate-100 space-y-8">
                        <div className="flex justify-between items-center text-[9px] font-medium text-slate-300 uppercase tracking-widest">
                           <span>Project Showcase #{i+1}</span>
                           <button onClick={() => {
                              const newP = data.portfolio.projects.filter((_: any, idx: number) => idx !== i);
                              updatePortfolio("projects", null, newP);
                           }} className="hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-10">
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Project Title</label>
                                 <input type="text" value={project.title} onChange={(e) => {
                                   const newP = [...data.portfolio.projects];
                                   newP[i].title = e.target.value;
                                   updatePortfolio("projects", null, newP);
                                 }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/30" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Category</label>
                                    <input type="text" value={project.category} onChange={(e) => {
                                      const newP = [...data.portfolio.projects];
                                      newP[i].category = e.target.value;
                                      updatePortfolio("projects", null, newP);
                                    }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] outline-none" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Location</label>
                                    <input type="text" value={project.location} onChange={(e) => {
                                      const newP = [...data.portfolio.projects];
                                      newP[i].location = e.target.value;
                                      updatePortfolio("projects", null, newP);
                                    }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] outline-none" />
                                 </div>
                              </div>
                           </div>
                           <div>
                              <ImageUpload 
                                label="Featured Image" 
                                value={project.image} 
                                onChange={(url: string) => {
                                  const newP = [...data.portfolio.projects];
                                  newP[i].image = url;
                                  updatePortfolio("projects", null, newP);
                                }} 
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Project Description</label>
                           <textarea 
                             value={project.desc} 
                             onChange={(e) => {
                               const newP = [...data.portfolio.projects];
                               newP[i].desc = e.target.value;
                               updatePortfolio("projects", null, newP);
                             }}
                             rows={3}
                             className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-xs text-slate-500 outline-none focus:border-primary/30"
                             placeholder="Describe the scope of work..."
                           />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => updatePortfolio("projects", null, [...(data.portfolio?.projects || []), { title: "New Project", category: "Remodeling", location: "O'Fallon, MO", year: "2024", scope: "Full Exterior", desc: "", image: "" }])}
                      className="w-full border border-dashed border-slate-200 rounded-3xl py-10 text-[10px] font-medium text-slate-300 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest"
                    >
                      + Add New Gallery Showcase
                    </button>
                 </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
