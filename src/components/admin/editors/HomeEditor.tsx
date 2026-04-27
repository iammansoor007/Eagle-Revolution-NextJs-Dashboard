"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, ArrowRight 
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

export default function HomeEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      fetch("/api/content")
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error("Failed to seed content:", err));
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateSection = (section: string, field: string, value: any) => {
    const sectionData = data[section] || {};
    setData({
      ...data,
      [section]: {
        ...sectionData,
        [field]: value,
      },
    });
  };

  const tabs = [
    { id: "hero", label: "Hero Canvas", icon: LayoutTemplate, title: "Hero Section Management" },
    { id: "about", label: "About Narrative", icon: Type, title: "Homepage Narrative Story" },
    { id: "services", label: "Services Preview", icon: List, title: "Services Grid Preview" },
    { id: "whyChooseUs", label: "Value Props", icon: Heart, title: "Why Choose Us Section" },
    { id: "faq", label: "Support FAQ", icon: HelpCircle, title: "Frequently Asked Questions" },
    { id: "quote", label: "CTA Banner", icon: Mail, title: "Call to Action Banner" },
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
           <p className="text-xs text-slate-400 mt-1">Configure the visual and textual content for this specific page area.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* HERO SECTION */}
            {activeTab === "hero" && (
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-7 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Badge (e.g. Intro Text)</label>
                    <input 
                      type="text" 
                      value={data.hero?.badge || ""} 
                      onChange={(e) => updateSection("hero", "badge", e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs text-slate-700 focus:bg-white focus:border-primary/30 outline-none transition-all"
                      placeholder="Veteran Owned & Operated"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Headline Lines</label>
                    <div className="space-y-3">
                      {(data.hero?.headlines || []).map((h: any, i: number) => (
                        <div key={i} className="flex gap-3">
                          <input 
                            type="text" 
                            value={h.text} 
                            onChange={(e) => {
                              const newH = [...data.hero.headlines];
                              newH[i].text = e.target.value;
                              updateSection("hero", "headlines", newH);
                            }}
                            className="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs text-slate-700 outline-none focus:bg-white focus:border-primary/30 transition-all"
                          />
                          <button 
                            onClick={() => {
                              const newH = [...data.hero.headlines];
                              newH[i].highlight = !newH[i].highlight;
                              updateSection("hero", "headlines", newH);
                            }}
                            className={`px-4 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all ${h.highlight ? "bg-primary text-white" : "bg-slate-100 text-slate-400 hover:text-slate-600"}`}
                          >
                            {h.highlight ? "Highlighted" : "Plain"}
                          </button>
                          <button onClick={() => {
                            const newH = data.hero.headlines.filter((_: any, idx: number) => idx !== i);
                            updateSection("hero", "headlines", newH);
                          }} className="p-3 text-slate-200 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => updateSection("hero", "headlines", [...(data.hero?.headlines || []), { text: "", highlight: false }])}
                        className="flex items-center gap-2 text-[10px] font-medium text-primary uppercase tracking-widest p-2 hover:translate-x-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add New Headline
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-span-5">
                  <ImageUpload 
                    label="Hero Background Media" 
                    value={data.hero?.images?.background} 
                    onChange={(url: string) => updateSection("hero", "images", { ...data.hero.images, background: url })} 
                  />
                </div>

                <div className="col-span-12 space-y-2">
                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Secondary Narrative Description</label>
                  <textarea 
                    value={data.hero?.description || ""} 
                    onChange={(e) => updateSection("hero", "description", e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 leading-relaxed focus:bg-white focus:border-primary/30 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* ABOUT SECTION */}
            {activeTab === "about" && (
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-7 space-y-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Intro Badge</label>
                     <input type="text" value={data.about?.badge || ""} onChange={(e) => updateSection("about", "badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                   </div>
                   <div className="space-y-4">
                     <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Dynamic Headline</label>
                     <div className="flex gap-3">
                       <input type="text" value={data.about?.headline?.prefix || ""} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, prefix: e.target.value })} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none" placeholder="Prefix" />
                       <input type="text" value={data.about?.headline?.highlight || ""} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, highlight: e.target.value })} className="flex-1 bg-primary/10 text-primary border border-primary/20 rounded-xl px-4 py-3 text-xs font-medium outline-none" placeholder="Highlight" />
                       <input type="text" value={data.about?.headline?.suffix || ""} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, suffix: e.target.value })} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none" placeholder="Suffix" />
                     </div>
                   </div>
                </div>
                <div className="col-span-5">
                   <ImageUpload 
                     label="Team or Portrait Image" 
                     value={data.about?.image?.src} 
                     onChange={(url: string) => updateSection("about", "image", { ...data.about.image, src: url })} 
                   />
                </div>
                <div className="col-span-12 space-y-2">
                   <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">About Section Description</label>
                   <textarea 
                     value={data.about?.description || ""} 
                     onChange={(e) => updateSection("about", "description", e.target.value)}
                     rows={5}
                     className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:bg-white focus:border-primary/30"
                   />
                </div>
              </div>
            )}

            {/* OTHER SECTIONS (FOLLOWING SAME STYLE) */}
            {activeTab === "whyChooseUs" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Badge</label>
                     <input type="text" value={data.whyChooseUs?.badge || ""} onChange={(e) => updateSection("whyChooseUs", "badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Title</label>
                     <input type="text" value={data.whyChooseUs?.title || ""} onChange={(e) => updateSection("whyChooseUs", "title", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none" />
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   {(data.whyChooseUs?.reasons || []).map((reason: any, i: number) => (
                     <div key={i} className="flex gap-6 p-6 bg-slate-50/30 rounded-2xl border border-slate-100 items-start">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                           <Check className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-3">
                           <input type="text" value={reason.title} onChange={(e) => {
                             const newR = [...data.whyChooseUs.reasons];
                             newR[i].title = e.target.value;
                             updateSection("whyChooseUs", "reasons", newR);
                           }} className="w-full bg-transparent text-sm text-slate-900 outline-none font-medium" />
                           <textarea value={reason.description} onChange={(e) => {
                             const newR = [...data.whyChooseUs.reasons];
                             newR[i].description = e.target.value;
                             updateSection("whyChooseUs", "reasons", newR);
                           }} className="w-full bg-transparent text-xs text-slate-500 outline-none resize-none" rows={2} />
                        </div>
                        <button onClick={() => {
                           const newR = data.whyChooseUs.reasons.filter((_: any, idx: number) => idx !== i);
                           updateSection("whyChooseUs", "reasons", newR);
                        }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* FAQ SECTION */}
            {activeTab === "faq" && (
              <div className="max-w-3xl space-y-6">
                 {(data.faq?.questions || []).map((q: any, i: number) => (
                   <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center text-[9px] font-medium text-slate-300 uppercase tracking-widest">
                         <span>Question {i+1}</span>
                         <button onClick={() => {
                            const newQ = data.faq.questions.filter((_: any, idx: number) => idx !== i);
                            updateSection("faq", "questions", newQ);
                         }} className="hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <input type="text" value={q.question} onChange={(e) => {
                        const newQ = [...data.faq.questions];
                        newQ[i].question = e.target.value;
                        updateSection("faq", "questions", newQ);
                      }} className="w-full text-xs font-medium text-slate-800 outline-none" placeholder="Question Title" />
                      <textarea value={q.answer} onChange={(e) => {
                        const newQ = [...data.faq.questions];
                        newQ[i].answer = e.target.value;
                        updateSection("faq", "questions", newQ);
                      }} className="w-full text-xs text-slate-400 outline-none leading-relaxed" rows={3} placeholder="Answer description..." />
                   </div>
                 ))}
                 <button onClick={() => updateSection("faq", "questions", [...(data.faq?.questions || []), { question: "", answer: "" }])} className="w-full border border-dashed border-slate-200 rounded-2xl py-6 text-[10px] font-medium text-slate-300 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest">
                   + Add Question
                 </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
