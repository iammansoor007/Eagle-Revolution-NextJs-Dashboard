"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, MapPin, Calendar, Layers, Sparkles
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

export default function GalleryEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         galleryPage: {
           header: { badge: "Our Work", title: "Project Gallery", description: "Browse our completed projects across St. Louis." }
         },
         portfolio: {
           projects: []
         }
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateHeader = (field: string, value: any) => {
    setData({
      ...data,
      galleryPage: {
        ...(data.galleryPage || {}),
        header: {
          ...(data.galleryPage?.header || {}),
          [field]: value
        }
      }
    });
  };

  const updateProjects = (value: any) => {
    setData({
      ...data,
      portfolio: {
        ...(data.portfolio || {}),
        projects: value
      }
    });
  };

  const tabs = [
    { id: "header", label: "Gallery Header", icon: Type, title: "Portfolio Introduction" },
    { id: "projects", label: "Project Showcases", icon: ImageIcon, title: "Individual Project Management" },
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
           <p className="text-sm text-slate-400 mt-2 font-medium">Configure the project gallery and its introductory narrative.</p>
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
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Gallery Badge</label>
                       <input type="text" value={data.galleryPage?.header?.badge || ""} onChange={(e) => updateHeader("badge", e.target.value)} className="w-full bg-slate-50 px-5 py-3.5 rounded-xl text-xs font-bold text-primary outline-none" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline</label>
                       <input type="text" value={data.galleryPage?.header?.title || ""} onChange={(e) => updateHeader("title", e.target.value)} className="w-full bg-slate-50 px-5 py-4 rounded-xl text-xl font-bold outline-none" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Intro Description</label>
                       <textarea value={data.galleryPage?.header?.description || ""} onChange={(e) => updateHeader("description", e.target.value)} rows={4} className="w-full bg-slate-50 px-5 py-4 rounded-2xl text-sm text-slate-500 outline-none leading-relaxed" />
                    </div>
                 </div>
              </div>
            )}

             {/* PROJECTS SECTION */}
            {activeTab === "projects" && (
              <div className="space-y-8">
                 <ContentSelector 
                    type="projects" 
                    label="Showcase Portfolio (Select from Inventory)" 
                    selectedItems={data.portfolio?.projects || []} 
                    onSelect={(items) => updateProjects(items)} 
                 />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
