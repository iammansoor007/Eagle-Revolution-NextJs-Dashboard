"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutTemplate, Type, Image as ImageIcon, 
  Plus, Trash2, Loader2,
  MapPin, Calendar, Layers, Sparkles
} from "lucide-react";
import ContentSelector from "@/components/admin/ContentSelector";
import { UI } from "./styles";


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
                 <div className={UI.card + " space-y-6"}>
                    <label className={UI.sectionHeader}>Section Branding</label>
                    <div className="space-y-2">
                       <label className={UI.label}>Gallery Badge</label>
                       <input type="text" value={data.galleryPage?.header?.badge || ""} onChange={(e) => updateHeader("badge", e.target.value)} className={UI.inputPrimary} />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Main Headline</label>
                       <input type="text" value={data.galleryPage?.header?.title || ""} onChange={(e) => updateHeader("title", e.target.value)} className={UI.inputLarge} />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Intro Description</label>
                       <textarea value={data.galleryPage?.header?.description || ""} onChange={(e) => updateHeader("description", e.target.value)} rows={4} className={UI.textarea} />
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
