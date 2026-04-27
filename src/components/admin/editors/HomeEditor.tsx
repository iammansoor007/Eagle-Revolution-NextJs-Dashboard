"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, List, Heart, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function HomeEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    // Seed from global if empty
    if (data && Object.keys(data).length === 0) {
      fetch("/api/content")
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error("Failed to seed content:", err));
    }
  }, [data, setData]);

  const updateSection = (section: string, field: string, value: any) => {
    setData({
      ...data,
      [section]: {
        ...data[section],
        [field]: value,
      },
    });
  };

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-black animate-spin" /></div>;

  const tabs = [
    { id: "hero", label: "Hero Section", icon: LayoutTemplate },
    { id: "about", label: "About Section", icon: Type },
    { id: "services", label: "Services Preview", icon: List },
    { id: "portfolio", label: "Portfolio Headers", icon: ImageIcon },
    { id: "testimonials", label: "Reviews Headers", icon: Star },
    { id: "whyChooseUs", label: "Why Choose Us", icon: Heart },
    { id: "faq", label: "FAQ Headers", icon: HelpCircle },
    { id: "quote", label: "Bottom CTA", icon: Mail },
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
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-black uppercase tracking-widest">Hero Background Image URL</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={data.hero?.images?.[0] || ""} 
                        onChange={(e) => {
                          const newImages = [...(data.hero?.images || [])];
                          newImages[0] = e.target.value;
                          updateSection("hero", "images", newImages);
                        }}
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-bold focus:bg-white focus:border-black outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-black uppercase tracking-widest">Main Badge Text</label>
                      <input 
                        type="text" 
                        value={data.hero?.badge || ""} 
                        onChange={(e) => updateSection("hero", "badge", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-bold focus:bg-white focus:border-black outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-black uppercase tracking-widest">Hero Description</label>
                      <textarea 
                        rows={3}
                        value={data.hero?.description || ""} 
                        onChange={(e) => updateSection("hero", "description", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-medium focus:bg-white focus:border-black outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-black uppercase tracking-widest">Animated Headlines</h3>
                    {(data.hero?.headlines || []).map((line: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-end bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                        <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Line {idx + 1}</label>
                          <input 
                            type="text" 
                            value={line.text} 
                            onChange={(e) => {
                              const newH = [...data.hero.headlines];
                              newH[idx].text = e.target.value;
                              updateSection("hero", "headlines", newH);
                            }}
                            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-black font-bold outline-none"
                          />
                        </div>
                        <div className="flex flex-col items-center gap-2 mb-2">
                           <label className="text-[8px] font-bold text-slate-400 uppercase">Highlight</label>
                           <input 
                             type="checkbox" 
                             checked={line.highlight}
                             onChange={(e) => {
                               const newH = [...data.hero.headlines];
                               newH[idx].highlight = e.target.checked;
                               updateSection("hero", "headlines", newH);
                             }}
                             className="w-4 h-4 accent-black"
                           />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABOUT SECTION */}
              {activeTab === "about" && (
                <div className="space-y-10">
                   <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Headline Prefix</label>
                        <input type="text" value={data.about?.headline?.prefix || ""} onChange={(e) => setData({...data, about: {...data.about, headline: {...data.about.headline, prefix: e.target.value}}})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-black font-bold outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-black uppercase">Highlight Text</label>
                        <input type="text" value={data.about?.headline?.highlight || ""} onChange={(e) => setData({...data, about: {...data.about, headline: {...data.about.headline, highlight: e.target.value}}})} className="w-full bg-black text-white border border-black rounded-xl px-4 py-3 font-bold outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Headline Suffix</label>
                        <input type="text" value={data.about?.headline?.suffix || ""} onChange={(e) => setData({...data, about: {...data.about, headline: {...data.about.headline, suffix: e.target.value}}})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-black font-bold outline-none" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold text-black uppercase tracking-widest">Main About Description</label>
                      <textarea rows={5} value={data.about?.description || ""} onChange={(e) => updateSection("about", "description", e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-black font-medium focus:bg-white focus:border-black outline-none transition-all leading-relaxed" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold text-black uppercase tracking-widest">Trust Badges (Comma Separated)</label>
                      <input type="text" value={(data.about?.coreValues || []).join(", ")} onChange={(e) => updateSection("about", "coreValues", e.target.value.split(",").map((s:any)=>s.trim()))} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 text-black font-bold outline-none" />
                   </div>
                </div>
              )}

              {/* WHY CHOOSE US */}
              {activeTab === "whyChooseUs" && (
                <div className="space-y-10">
                   <div className="space-y-6">
                      <h3 className="text-xs font-bold text-black uppercase tracking-widest">Feature Cards</h3>
                      <div className="grid grid-cols-1 gap-4">
                         {(data.whyChooseUs?.features || []).map((f:any, idx:number) => (
                           <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                              <div className="flex items-center justify-between">
                                 <input type="text" value={f.title} onChange={(e) => {
                                    const newF = [...data.whyChooseUs.features];
                                    newF[idx].title = e.target.value;
                                    updateSection("whyChooseUs", "features", newF);
                                 }} className="bg-transparent border-none text-black font-extrabold text-lg outline-none" />
                                 <button onClick={() => {
                                    const newF = data.whyChooseUs.features.filter((_:any, i:number) => i !== idx);
                                    updateSection("whyChooseUs", "features", newF);
                                 }} className="text-slate-300 hover:text-black transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                              <textarea rows={2} value={f.description} onChange={(e) => {
                                    const newF = [...data.whyChooseUs.features];
                                    newF[idx].description = e.target.value;
                                    updateSection("whyChooseUs", "features", newF);
                              }} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-slate-500 font-medium outline-none text-sm" />
                           </div>
                         ))}
                      </div>
                      <button onClick={() => {
                         const newF = [...(data.whyChooseUs?.features || [])];
                         newF.push({ title: "New Feature", description: "Details...", icon: "CheckCircle2" });
                         updateSection("whyChooseUs", "features", newF);
                      }} className="w-full py-4 border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 font-bold hover:border-black hover:text-black transition-all flex items-center justify-center gap-2">
                         <Plus className="w-4 h-4" />
                         Add Feature Card
                      </button>
                   </div>
                </div>
              )}

              {/* FALLBACK FOR OTHER TABS */}
              {!["hero", "about", "whyChooseUs"].includes(activeTab) && (
                 <div className="p-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                       <LayoutTemplate className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{activeTab} section editor</p>
                    <p className="text-slate-300 font-medium text-sm mt-2 max-w-xs mx-auto">This section's specific fields are being migrated to the new dynamic layout. All global data remains safe.</p>
                 </div>
              )}

            </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
}

