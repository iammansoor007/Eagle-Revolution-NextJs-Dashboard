"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, Award, Target, Heart, Plus, Trash2 } from "lucide-react";

export default function AboutEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      fetch("/api/content")
        .then(res => res.json())
        .then(json => {
          const d = { ...json };
          if (!d.aboutPage) d.aboutPage = {};
          if (!d.aboutPage.hero) d.aboutPage.hero = { headline: {}, stats: [] };
          if (!d.aboutPage.story) d.aboutPage.story = { portrait: {}, founder: { bio: [], social: {} } };
          if (!d.aboutPage.stats) d.aboutPage.stats = { items: [], trustBadges: [] };
          if (!d.aboutPage.mission) d.aboutPage.mission = { principles: [], stats: [] };
          setData(d);
        })
        .catch(err => console.error("Failed to seed content:", err));
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-black animate-spin" /></div>;

  const updateAbout = (section: string, field: string | null, value: any) => {
    setData((prev: any) => ({
      ...prev,
      aboutPage: {
        ...prev.aboutPage,
        [section]: field ? {
          ...prev.aboutPage[section],
          [field]: value,
        } : value,
      },
    }));
  };

  const { aboutPage } = data;
  const tabs = [
    { id: "hero", label: "Hero Section", icon: LayoutTemplate },
    { id: "story", label: "Founder Story", icon: Type },
    { id: "stats", label: "Company Stats", icon: Award },
    { id: "mission", label: "Mission & Values", icon: Target },
    { id: "cta", label: "Awards & CTA", icon: Heart },
  ];

  return (
    <div className="bg-white min-h-[600px] flex flex-col">

      {/* Horizontal Section Navigation */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2 p-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab.id
                ? "bg-black text-white shadow-lg shadow-black/10 scale-[1.02]"
                : "text-slate-400 hover:bg-slate-50 hover:text-black"
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area (Full Width) */}
      <div className="flex-1 p-12 overflow-y-auto max-h-[900px] custom-scrollbar space-y-12">
          <AnimatePresence mode="wait">
             <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
               
               {/* HERO SECTION */}
               {activeTab === "hero" && (
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-bold text-black uppercase tracking-widest">Hero Background Image URL</label>
                       <input 
                         type="text" 
                         value={aboutPage.hero?.bgImage || ""} 
                         onChange={(e) => updateAbout("hero", "bgImage", e.target.value)}
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-bold focus:bg-white focus:border-black outline-none transition-all"
                       />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                       {["line1", "line2", "line3"].map((line) => (
                         <div key={line} className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase">Headline {line}</label>
                           <input 
                             type="text" 
                             value={aboutPage.hero?.headline?.[line] || ""} 
                             onChange={(e) => {
                                const newH = { ...aboutPage.hero?.headline, [line]: e.target.value };
                                updateAbout("hero", "headline", newH);
                             }}
                             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-black font-bold outline-none"
                           />
                         </div>
                       ))}
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-bold text-black uppercase tracking-widest">Hero Description</label>
                       <textarea 
                         rows={3} 
                         value={aboutPage.hero?.description || ""} 
                         onChange={(e) => updateAbout("hero", "description", e.target.value)}
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-medium focus:bg-white focus:border-black outline-none transition-all"
                       />
                    </div>
                 </div>
               )}

               {/* STORY SECTION */}
               {activeTab === "story" && (
                 <div className="space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-bold text-black uppercase tracking-widest">Section Badge</label>
                          <input type="text" value={aboutPage.story?.badge || ""} onChange={(e) => updateAbout("story", "badge", e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-black font-bold outline-none" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-bold text-black uppercase tracking-widest">Main Headline</label>
                          <input type="text" value={aboutPage.story?.headline || ""} onChange={(e) => updateAbout("story", "headline", e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-black font-bold outline-none" />
                       </div>
                    </div>
                    <div className="space-y-6 pt-8 border-t border-slate-100">
                       <h3 className="text-xs font-bold text-black uppercase tracking-widest">Founder Details</h3>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-bold text-slate-400 uppercase">Founder Name</label>
                             <input type="text" value={aboutPage.story?.founder?.name || ""} onChange={(e) => updateAbout("story", "founder", { ...aboutPage.story.founder, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-black font-bold outline-none" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-bold text-slate-400 uppercase">Founder Title</label>
                             <input type="text" value={aboutPage.story?.founder?.title || ""} onChange={(e) => updateAbout("story", "founder", { ...aboutPage.story.founder, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-black font-bold outline-none" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Founder Biography</label>
                          <textarea rows={6} value={(aboutPage.story?.founder?.bio || []).join("\n\n")} onChange={(e) => updateAbout("story", "founder", { ...aboutPage.story.founder, bio: e.target.value.split("\n\n").filter(Boolean) })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-medium outline-none text-sm leading-relaxed" />
                       </div>
                    </div>
                 </div>
               )}

               {/* FALLBACK */}
               {!["hero", "story"].includes(activeTab) && (
                 <div className="p-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{activeTab} section active</p>
                    <p className="text-slate-300 font-medium text-sm mt-2">Section fields are synced with your global content store.</p>
                 </div>
               )}

             </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
}
