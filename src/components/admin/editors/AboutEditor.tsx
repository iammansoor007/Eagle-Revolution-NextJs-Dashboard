"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Users, Zap
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

export default function AboutEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({
        aboutPage: {
          hero: { badge: "", headline: "", description: [], images: { main: "" } },
          story: { title: "", content: [] },
          mission: { badge: "", title: "", items: [] }
        }
      });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateAbout = (section: string, field: string | null, value: any) => {
    const currentAbout = data.aboutPage || {
      hero: { badge: "", headline: "", description: [], images: { main: "" } },
      story: { title: "", content: [] },
      mission: { badge: "", title: "", items: [] }
    };

    const targetSectionData = currentAbout[section as keyof typeof currentAbout] || {};

    setData({
      ...data,
      aboutPage: {
        ...currentAbout,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "hero", label: "Hero Canvas", icon: LayoutTemplate, title: "About Hero Identity" },
    { id: "story", label: "Founder Story", icon: Users, title: "The Narrative & History" },
    { id: "mission", label: "Mission & Values", icon: Target, title: "Principles & Commitments" },
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
           <p className="text-xs text-slate-400 mt-1">Configure the visual and textual content for the About page.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* HERO SECTION */}
            {activeTab === "hero" && (
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-7 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Badge</label>
                    <input type="text" value={data.aboutPage?.hero?.badge || ""} onChange={(e) => updateAbout("hero", "badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline</label>
                    <input type="text" value={data.aboutPage?.hero?.headline || ""} onChange={(e) => updateAbout("hero", "headline", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                  </div>
                </div>
                <div className="col-span-5">
                   <ImageUpload label="Hero Main Image" value={data.aboutPage?.hero?.images?.main} onChange={(url: string) => updateAbout("hero", "images", { ...data.aboutPage.hero.images, main: url })} />
                </div>
                <div className="col-span-12 space-y-4">
                   <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Hero Narrative Paragraphs</label>
                   {(data.aboutPage?.hero?.description || []).map((p: string, i: number) => (
                     <div key={i} className="flex gap-4">
                       <textarea value={p} onChange={(e) => {
                         const newD = [...data.aboutPage.hero.description];
                         newD[i] = e.target.value;
                         updateAbout("hero", "description", newD);
                       }} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:border-primary/30" rows={3} />
                       <button onClick={() => {
                         const newD = data.aboutPage.hero.description.filter((_: any, idx: number) => idx !== i);
                         updateAbout("hero", "description", newD);
                       }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   ))}
                   <button onClick={() => updateAbout("hero", "description", [...(data.aboutPage?.hero?.description || []), ""])} className="text-[10px] font-medium text-primary uppercase tracking-widest">+ Add Paragraph</button>
                </div>
              </div>
            )}

            {/* STORY SECTION */}
            {activeTab === "story" && (
              <div className="max-w-4xl space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Founder Title</label>
                  <input type="text" value={data.aboutPage?.story?.title || ""} onChange={(e) => updateAbout("story", "title", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Story Content</label>
                  {(data.aboutPage?.story?.content || []).map((p: string, i: number) => (
                    <div key={i} className="flex gap-4">
                      <textarea value={p} onChange={(e) => {
                        const newC = [...data.aboutPage.story.content];
                        newC[i] = e.target.value;
                        updateAbout("story", "content", newC);
                      }} className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:border-primary/30" rows={4} />
                      <button onClick={() => {
                        const newC = data.aboutPage.story.content.filter((_: any, idx: number) => idx !== i);
                        updateAbout("story", "content", newC);
                      }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => updateAbout("story", "content", [...(data.aboutPage?.story?.content || []), ""])} className="text-[10px] font-medium text-primary uppercase tracking-widest">+ Add Story Segment</button>
                </div>
              </div>
            )}

            {/* MISSION SECTION */}
            {activeTab === "mission" && (
              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Mission Badge</label>
                    <input type="text" value={data.aboutPage?.mission?.badge || ""} onChange={(e) => updateAbout("mission", "badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Mission Title</label>
                    <input type="text" value={data.aboutPage?.mission?.title || ""} onChange={(e) => updateAbout("mission", "title", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   {(data.aboutPage?.mission?.items || []).map((item: any, i: number) => (
                     <div key={i} className="flex gap-6 p-6 bg-slate-50/30 rounded-2xl border border-slate-100 items-start">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                           <Shield className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                           <input type="text" value={item.title} onChange={(e) => {
                             const newI = [...data.aboutPage.mission.items];
                             newI[i].title = e.target.value;
                             updateAbout("mission", "items", newI);
                           }} className="w-full bg-transparent text-sm text-slate-800 font-medium outline-none" />
                           <textarea value={item.description} onChange={(e) => {
                             const newI = [...data.aboutPage.mission.items];
                             newI[i].description = e.target.value;
                             updateAbout("mission", "items", newI);
                           }} className="w-full bg-transparent text-xs text-slate-500 outline-none" rows={2} />
                        </div>
                        <button onClick={() => {
                           const newI = data.aboutPage.mission.items.filter((_: any, idx: number) => idx !== i);
                           updateAbout("mission", "items", newI);
                        }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
