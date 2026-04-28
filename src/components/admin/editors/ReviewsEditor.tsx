"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Type, Quote
} from "lucide-react";
import ContentSelector from "@/components/admin/ContentSelector";
import { UI } from "./styles";

export default function ReviewsEditor({ data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         testimonials: {
           section: { badge: "Social Proof", headline: "What Our Customers Say", description: "Discover why homeowners across St. Louis trust Eagle Revolution." },
           testimonials: [],
           stats: { rating: 5.0, count: 500, label: "Google Reviews" }
         }
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateTestimonials = (section: string, field: string | null, value: any) => {
    const currentData = data.testimonials || {
      section: { badge: "", headline: "", description: "" },
      testimonials: [],
      stats: {}
    };

    const targetSectionData = currentData[section as keyof typeof currentData] || {};

    setData({
      ...data,
      testimonials: {
        ...currentData,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "header", label: "Review Header", icon: Type, title: "Social Proof Introduction" },
    { id: "items", label: "Testimonials", icon: Quote, title: "Individual Review Management" },
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

      <div className="flex-1 p-10 overflow-y-auto max-h-[850px] custom-scrollbar bg-[#F8FAFC]">
        <div className="mb-12 pb-8 border-b border-slate-200">
           <h2 className="text-3xl font-medium text-slate-900 tracking-tight">{activeTabTitle}</h2>
           <p className="text-sm text-slate-400 mt-2 font-medium">Manage testimonials and global social proof metrics.</p>
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
                       <label className={UI.label}>Section Badge</label>
                       <input type="text" value={data.testimonials?.section?.badge || ""} onChange={(e) => updateTestimonials("section", "badge", e.target.value)} className={UI.inputPrimary} />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Main Headline</label>
                       <input type="text" value={data.testimonials?.section?.headline || ""} onChange={(e) => updateTestimonials("section", "headline", e.target.value)} className={UI.inputLarge} />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Intro Narrative</label>
                       <textarea value={data.testimonials?.section?.description || ""} onChange={(e) => updateTestimonials("section", "description", e.target.value)} rows={4} className={UI.textarea} />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className={UI.label}>Review Summary Stats</label>
                    <div className="grid grid-cols-3 gap-6">
                       <div className={UI.card + " p-6 rounded-2xl space-y-2"}>
                          <label className={UI.label}>Avg Rating</label>
                          <input type="text" value={data.testimonials?.stats?.rating || ""} onChange={(e) => updateTestimonials("stats", "rating", e.target.value)} className={UI.inputLarge} />
                       </div>
                       <div className={UI.card + " p-6 rounded-2xl space-y-2"}>
                          <label className={UI.label}>Total Count</label>
                          <input type="text" value={data.testimonials?.stats?.count || ""} onChange={(e) => updateTestimonials("stats", "count", e.target.value)} className={UI.inputLarge} />
                       </div>
                       <div className={UI.card + " p-6 rounded-2xl space-y-2"}>
                          <label className={UI.label}>Source Label</label>
                          <input type="text" value={data.testimonials?.stats?.label || ""} onChange={(e) => updateTestimonials("stats", "label", e.target.value)} className={UI.input} />
                       </div>
                    </div>
                 </div>
              </div>
            )}

             {/* TESTIMONIALS SECTION */}
            {activeTab === "items" && (
              <div className="space-y-10">
                 <ContentSelector 
                    type="reviews" 
                    label="Review Repository (Select from Managed Inventory)" 
                    selectedItems={data.testimonials?.testimonials || []} 
                    onSelect={(items) => updateTestimonials("testimonials", null, items)} 
                 />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
