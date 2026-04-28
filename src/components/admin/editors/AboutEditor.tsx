"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Users, Zap, Globe, TrendingUp, Flag, Linkedin, Quote
} from "lucide-react";

import ContentSelector from "@/components/admin/ContentSelector";
import IconSelector from "@/components/admin/IconSelector";

import { UI } from "./styles";

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
      <label className={UI.label}>{label}</label>
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
          hero: { 
            headline: { line1: "", line2: "", line3: "" }, 
            description: "", 
            cta: "", 
            ctaLink: "", 
            bgImage: "", 
            trustLabel: "", 
            stats: [{ label: "", val: "", icon: "ShieldCheck" }], 
            phone: "", 
            phoneLabel: "" 
          },
          story: { 
            badge: "", 
            headline: "", 
            highlight: "", 
            description: "", 
            portrait: { image: "", badgeLeft: "", badgeRight: "" }, 
            founder: { name: "", title: "", bio: [], quote: "", secondaryQuote: "", footer: "", linkedin: "", email: "" } 
          },
          mission: { 
            badge: "",
            headline: "", 
            description: "",
            stats: [{ value: "", label: "" }], 
            principles: [{ title: "", desc: "", icon: "Scale", val: "" }] 
          },
          recognition: [],
          stats: { 
            badge: "", 
            headline: "", 
            description: "", 
            items: [{ value: 0, label: "", suffix: "", icon: "Shield", description: "" }], 
            trustBadges: [{ icon: "Award", text: "" }] 
          },
          values: { 
            headline: "", 
            highlight: "", 
            description: "", 
            items: [{ title: "", description: "", icon: "BadgeCheck", statLabel: "", stat: "" }] 
          },
          services: [],
          capabilities: { badge: "", headline: "", description: "" },
          ctaBanner: { 
            badge: "", 
            headline: "", 
            highlight: "", 
            description: "", 
            features: [], 
            primaryCta: "", 
            primaryLink: "", 
            secondaryCta: "", 
            secondaryLink: "" 
          }
        }
      });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateAbout = (section: string, field: string | null, value: any) => {
    setData({
      ...data,
      aboutPage: {
        ...(data.aboutPage || {}),
        [section]: field ? {
          ...(data.aboutPage?.[section] || {}),
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "hero", label: "Hero Identity", icon: LayoutTemplate, title: "About Hero Canvas" },
    { id: "story", label: "The Story", icon: Users, title: "Founder narrative & History" },
    { id: "mission", label: "Mission", icon: Target, title: "Core Purpose & Principles" },
    { id: "stats", label: "Impact", icon: TrendingUp, title: "Statistical Impact & Trust" },
    { id: "values", label: "Values", icon: Heart, title: "Our Core Philosophies" },
    { id: "services", label: "Services", icon: List, title: "Featured Capabilities" },
    { id: "cta", label: "Conversion", icon: Mail, title: "CTA Banners & Links" },
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
           <p className="text-sm text-slate-400 mt-2 font-medium">Fully customize every single field used in the About template.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }} 
            className="space-y-16 pb-20"
          >
            
            {/* HERO SECTION */}
            {activeTab === "hero" && (
              <div className="space-y-12">
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-8 space-y-10">
                    <div className="space-y-4">
                      <label className={UI.label}>Headline Split (3 Lines)</label>
                      <div className="grid grid-cols-1 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <input type="text" value={data.aboutPage?.hero?.headline?.line1 || ""} onChange={(e) => updateAbout("hero", "headline", { ...data.aboutPage.hero.headline, line1: e.target.value })} className={UI.inputLarge} placeholder="Line 1" />
                        <input type="text" value={data.aboutPage?.hero?.headline?.line2 || ""} onChange={(e) => updateAbout("hero", "headline", { ...data.aboutPage.hero.headline, line2: e.target.value })} className={UI.inputPrimary} placeholder="Line 2 (Gradient Text)" />
                        <input type="text" value={data.aboutPage?.hero?.headline?.line3 || ""} onChange={(e) => updateAbout("hero", "headline", { ...data.aboutPage.hero.headline, line3: e.target.value })} className={UI.inputLarge} placeholder="Line 3" />
                      </div>
                    </div>

                    <div className="space-y-4">
                       <label className={UI.label}>Narrative Description</label>
                       <textarea value={data.aboutPage?.hero?.description || ""} onChange={(e) => updateAbout("hero", "description", e.target.value)} rows={4} className={UI.textarea} />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className={UI.label}>CTA Button Label</label>
                          <input type="text" value={data.aboutPage?.hero?.cta || ""} onChange={(e) => updateAbout("hero", "cta", e.target.value)} className={UI.input} />
                       </div>
                       <div className="space-y-3">
                          <label className={UI.label}>CTA Button Link</label>
                          <input type="text" value={data.aboutPage?.hero?.ctaLink || ""} onChange={(e) => updateAbout("hero", "ctaLink", e.target.value)} className={UI.input} />
                       </div>
                    </div>
                  </div>

                  <div className="col-span-4 space-y-10">
                    <ImageUpload label="Hero Background Cinematic" value={data.aboutPage?.hero?.bgImage} onChange={(url: string) => updateAbout("hero", "bgImage", url)} />
                    <div className="space-y-3">
                       <label className={UI.label}>Trust Label</label>
                       <input type="text" value={data.aboutPage?.hero?.trustLabel || ""} onChange={(e) => updateAbout("hero", "trustLabel", e.target.value)} className={UI.input} placeholder="Highly Rated on Google" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <label className={UI.label}>Hero Side Stats</label>
                      <div className="space-y-4">
                        {(data.aboutPage?.hero?.stats || []).map((s: any, i: number) => (
                          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Stat {i+1}</span>
                                <button onClick={() => {
                                  const newS = data.aboutPage.hero.stats.filter((_: any, idx: number) => idx !== i);
                                  updateAbout("hero", "stats", newS);
                                }} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                 <label className={UI.label}>Value</label>
                                 <input type="text" value={s.val} onChange={(e) => {
                                   const newS = [...data.aboutPage.hero.stats]; newS[i].val = e.target.value; updateAbout("hero", "stats", newS);
                                 }} className={UI.input} placeholder="25+" />
                               </div>
                               <div className="space-y-2">
                                 <label className={UI.label}>Label</label>
                                 <input type="text" value={s.label} onChange={(e) => {
                                   const newS = [...data.aboutPage.hero.stats]; newS[i].label = e.target.value; updateAbout("hero", "stats", newS);
                                 }} className={UI.input} placeholder="Label" />
                               </div>
                             </div>
                             <IconSelector 
                                label="Stat Icon"
                                value={s.icon} 
                                onChange={(val) => {
                                  const newS = [...data.aboutPage.hero.stats]; newS[i].icon = val; updateAbout("hero", "stats", newS);
                                }} 
                             />
                          </div>
                        ))}
                        <button onClick={() => updateAbout("hero", "stats", [...(data.aboutPage?.hero?.stats || []), { label: "", val: "", icon: "Shield" }])} className={UI.buttonAdd}>+ Add Stat</button>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <label className={UI.label}>Contact Quicklink</label>
                      <div className={UI.card}>
                         <div className="space-y-6">
                            <div className="space-y-2">
                              <label className={UI.label}>Phone Number</label>
                              <input type="text" value={data.aboutPage?.hero?.phone || ""} onChange={(e) => updateAbout("hero", "phone", e.target.value)} className={UI.inputLarge} />
                            </div>
                            <div className="space-y-2">
                              <label className={UI.label}>Phone Label</label>
                              <input type="text" value={data.aboutPage?.hero?.phoneLabel || ""} onChange={(e) => updateAbout("hero", "phoneLabel", e.target.value)} className={UI.input} placeholder="Call for a free consultation" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* STORY SECTION */}
            {activeTab === "story" && (
              <div className="space-y-16">
                 <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-7 space-y-10">
                       <div className="space-y-4">
                          <label className={UI.label}>Story Intro</label>
                          <div className={UI.card + " space-y-6"}>
                             <div className="space-y-2">
                                <label className={UI.label}>Badge</label>
                                <input type="text" value={data.aboutPage?.story?.badge || ""} onChange={(e) => updateAbout("story", "badge", e.target.value)} className={UI.input} placeholder="Badge" />
                             </div>
                             <div className="space-y-2">
                                <label className={UI.label}>Main Headline</label>
                                <input type="text" value={data.aboutPage?.story?.headline || ""} onChange={(e) => updateAbout("story", "headline", e.target.value)} className={UI.inputLarge} placeholder="Main Headline" />
                             </div>
                             <div className="space-y-2">
                                <label className={UI.label}>Highlight Text</label>
                                <input type="text" value={data.aboutPage?.story?.highlight || ""} onChange={(e) => updateAbout("story", "highlight", e.target.value)} className={UI.inputPrimary} placeholder="Highlight text for gradient" />
                             </div>
                             <div className="space-y-2">
                                <label className={UI.label}>Intro Narrative</label>
                                <textarea value={data.aboutPage?.story?.description || ""} onChange={(e) => updateAbout("story", "description", e.target.value)} className={UI.textarea} rows={3} placeholder="Intro narrative..." />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className={UI.label}>Founder Bio Paragraphs</label>
                          <div className="space-y-4">
                             {(data.aboutPage?.story?.founder?.bio || []).map((p: string, i: number) => (
                               <div key={i} className="flex gap-4">
                                 <textarea value={p} onChange={(e) => {
                                   const newB = [...data.aboutPage.story.founder.bio]; newB[i] = e.target.value; updateAbout("story", "founder", { ...data.aboutPage.story.founder, bio: newB });
                                 }} className={UI.textarea} rows={4} />
                                 <button onClick={() => {
                                   const newB = data.aboutPage.story.founder.bio.filter((_: any, idx: number) => idx !== i); updateAbout("story", "founder", { ...data.aboutPage.story.founder, bio: newB });
                                 }} className="text-slate-200 hover:text-red-500 transition-colors self-start mt-4"><Trash2 className="w-4 h-4" /></button>
                               </div>
                             ))}
                             <button onClick={() => updateAbout("story", "founder", { ...data.aboutPage.story.founder, bio: [...(data.aboutPage.story.founder.bio || []), ""] })} className={UI.buttonAdd}>+ Add Bio Segment</button>
                          </div>
                       </div>
                    </div>

                    <div className="col-span-5 space-y-10">
                       <div className="space-y-6">
                          <ImageUpload label="Founder Portrait" value={data.aboutPage?.story?.portrait?.image} onChange={(url: string) => updateAbout("story", "portrait", { ...data.aboutPage.story.portrait, image: url })} />
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                               <label className={UI.label}>Badge Left</label>
                               <input type="text" value={data.aboutPage?.story?.portrait?.badgeLeft || ""} onChange={(e) => updateAbout("story", "portrait", { ...data.aboutPage.story.portrait, badgeLeft: e.target.value })} className={UI.input} placeholder="Badge Left" />
                             </div>
                             <div className="space-y-2">
                               <label className={UI.label}>Badge Right</label>
                               <input type="text" value={data.aboutPage?.story?.portrait?.badgeRight || ""} onChange={(e) => updateAbout("story", "portrait", { ...data.aboutPage.story.portrait, badgeRight: e.target.value })} className={UI.input} placeholder="Badge Right" />
                             </div>
                          </div>
                       </div>

                       <div className={UI.card + " space-y-6"}>
                          <label className={UI.sectionHeader}>Founder Details</label>
                          <div className="space-y-2">
                            <label className={UI.label}>Full Name</label>
                            <input type="text" value={data.aboutPage?.story?.founder?.name || ""} onChange={(e) => updateAbout("story", "founder", { ...data.aboutPage.story.founder, name: e.target.value })} className={UI.input} placeholder="Full Name" />
                          </div>
                          <div className="space-y-2">
                            <label className={UI.label}>Title/Role</label>
                            <input type="text" value={data.aboutPage?.story?.founder?.title || ""} onChange={(e) => updateAbout("story", "founder", { ...data.aboutPage.story.founder, title: e.target.value })} className={UI.input} placeholder="Title/Role" />
                          </div>
                          <div className="space-y-2">
                            <label className={UI.label}>Primary Quote</label>
                            <textarea value={data.aboutPage?.story?.founder?.quote || ""} onChange={(e) => updateAbout("story", "founder", { ...data.aboutPage.story.founder, quote: e.target.value })} className={UI.textarea} rows={3} placeholder="Primary Quote..." />
                          </div>
                          <div className="space-y-4">
                             <div className="space-y-2">
                               <label className={UI.label}>LinkedIn URL</label>
                               <input type="text" value={data.aboutPage?.story?.founder?.linkedin || ""} onChange={(e) => updateAbout("story", "founder", { ...data.aboutPage.story.founder, linkedin: e.target.value })} className={UI.input} placeholder="LinkedIn URL" />
                             </div>
                             <div className="space-y-2">
                               <label className={UI.label}>Direct Email</label>
                               <input type="text" value={data.aboutPage?.story?.founder?.email || ""} onChange={(e) => updateAbout("story", "founder", { ...data.aboutPage.story.founder, email: e.target.value })} className={UI.input} placeholder="Direct Email" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* MISSION SECTION */}
            {activeTab === "mission" && (
              <div className="space-y-16">
                 <div className="grid grid-cols-2 gap-10">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                       <label className={UI.sectionHeader}>Mission Context</label>
                       <div className="space-y-2">
                          <label className={UI.label}>Badge</label>
                          <input type="text" value={data.aboutPage?.mission?.badge || ""} onChange={(e) => updateAbout("mission", "badge", e.target.value)} className={UI.input} />
                       </div>
                       <div className="space-y-2">
                          <label className={UI.label}>Headline</label>
                          <input type="text" value={data.aboutPage?.mission?.headline || ""} onChange={(e) => updateAbout("mission", "headline", e.target.value)} className={UI.inputLarge} />
                       </div>
                       <div className="space-y-2">
                          <label className={UI.label}>Description</label>
                          <textarea value={data.aboutPage?.mission?.description || ""} onChange={(e) => updateAbout("mission", "description", e.target.value)} className={UI.textarea} rows={4} />
                       </div>
                    </div>

                    <div className="space-y-6">
                       <label className={UI.label}>Impact Stats (Side Grid)</label>
                       <div className="grid grid-cols-2 gap-4">
                          {(data.aboutPage?.mission?.stats || []).map((s: any, i: number) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative space-y-4">
                               <button onClick={() => {
                                 const newS = data.aboutPage.mission.stats.filter((_: any, idx: number) => idx !== i); updateAbout("mission", "stats", newS);
                               }} className="absolute top-4 right-4 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                               <div className="space-y-2">
                                  <label className={UI.label}>Value</label>
                                  <input type="text" value={s.value} onChange={(e) => {
                                    const newS = [...data.aboutPage.mission.stats]; newS[i].value = e.target.value; updateAbout("mission", "stats", newS);
                                  }} className={UI.inputLarge} placeholder="25+" />
                               </div>
                               <div className="space-y-2">
                                  <label className={UI.label}>Label</label>
                                  <input type="text" value={s.label} onChange={(e) => {
                                    const newS = [...data.aboutPage.mission.stats]; newS[i].label = e.target.value; updateAbout("mission", "stats", newS);
                                  }} className={UI.input} placeholder="Label" />
                               </div>
                            </div>
                          ))}
                          <button onClick={() => updateAbout("mission", "stats", [...(data.aboutPage?.mission?.stats || []), { value: "", label: "" }])} className={UI.buttonAdd}>+ Add Stat</button>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className={UI.label}>Guiding Principles (Cards)</label>
                    <div className="grid grid-cols-2 gap-8">
                       {(data.aboutPage?.mission?.principles || []).map((p: any, i: number) => (
                         <div key={i} className={UI.card + " space-y-6 relative group"}>
                            <button onClick={() => {
                              const newP = data.aboutPage.mission.principles.filter((_: any, idx: number) => idx !== i); updateAbout("mission", "principles", newP);
                            }} className="absolute top-8 right-8 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                            <div className="grid grid-cols-2 gap-4">
                               <IconSelector 
                                  label="Principle Icon"
                                  value={p.icon} 
                                  onChange={(val) => {
                                    const newP = [...data.aboutPage.mission.principles]; newP[i].icon = val; updateAbout("mission", "principles", newP);
                                  }} 
                               />
                               <div className="space-y-2">
                                  <label className={UI.label}>Value Marker</label>
                                  <input type="text" value={p.val} onChange={(e) => {
                                    const newP = [...data.aboutPage.mission.principles]; newP[i].val = e.target.value; updateAbout("mission", "principles", newP);
                                  }} className={UI.input} placeholder="e.g. 100%" />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className={UI.label}>Title</label>
                               <input type="text" value={p.title} onChange={(e) => {
                                  const newP = [...data.aboutPage.mission.principles]; newP[i].title = e.target.value; updateAbout("mission", "principles", newP);
                               }} className={UI.inputLarge} placeholder="Principle Title" />
                            </div>
                            <div className="space-y-2">
                               <label className={UI.label}>Description</label>
                               <textarea value={p.desc} onChange={(e) => {
                                  const newP = [...data.aboutPage.mission.principles]; newP[i].desc = e.target.value; updateAbout("mission", "principles", newP);
                               }} className={UI.textarea} rows={3} placeholder="Detailed principle narrative..." />
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateAbout("mission", "principles", [...(data.aboutPage?.mission?.principles || []), { title: "", desc: "", icon: "Zap", val: "" }])} className={UI.buttonAdd + " h-full flex flex-col justify-center gap-4 py-20"}>
                          <Plus className="w-10 h-10 mx-auto" />
                          <span>Add New Principle</span>
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {/* STATS SECTION */}
            {activeTab === "stats" && (
              <div className="space-y-16">
                 <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 max-w-3xl">
                    <label className={UI.sectionHeader}>Trust Metrics Intro</label>
                    <div className="space-y-2">
                       <label className={UI.label}>Badge</label>
                       <input type="text" value={data.aboutPage?.stats?.badge || ""} onChange={(e) => updateAbout("stats", "badge", e.target.value)} className={UI.input} placeholder="Badge" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Headline</label>
                       <input type="text" value={data.aboutPage?.stats?.headline || ""} onChange={(e) => updateAbout("stats", "headline", e.target.value)} className={UI.inputLarge} placeholder="Headline" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Summary Narrative</label>
                       <textarea value={data.aboutPage?.stats?.description || ""} onChange={(e) => updateAbout("stats", "description", e.target.value)} className={UI.textarea} rows={3} placeholder="Summary narrative..." />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className={UI.label}>Impact Metric Counters</label>
                    <div className="grid grid-cols-4 gap-6">
                       {(data.aboutPage?.stats?.items || []).map((s: any, i: number) => (
                         <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative">
                            <button onClick={() => {
                              const newI = data.aboutPage.stats.items.filter((_: any, idx: number) => idx !== i); updateAbout("stats", "items", newI);
                            }} className="absolute top-4 right-4 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            
                            <IconSelector 
                               label="Stat Icon"
                               value={s.icon} 
                               onChange={(val) => {
                                 const newI = [...data.aboutPage.stats.items]; newI[i].icon = val; updateAbout("stats", "items", newI);
                               }} 
                            />

                            <div className="grid grid-cols-2 gap-2">
                               <div className="space-y-1">
                                  <label className={UI.label}>Value</label>
                                  <input type="number" value={s.value} onChange={(e) => {
                                    const newI = [...data.aboutPage.stats.items]; newI[i].value = parseInt(e.target.value); updateAbout("stats", "items", newI);
                                  }} className={UI.input} />
                               </div>
                               <div className="space-y-1">
                                  <label className={UI.label}>Suffix</label>
                                  <input type="text" value={s.suffix} onChange={(e) => {
                                    const newI = [...data.aboutPage.stats.items]; newI[i].suffix = e.target.value; updateAbout("stats", "items", newI);
                                  }} className={UI.inputPrimary} placeholder="+" />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className={UI.label}>Label</label>
                               <input type="text" value={s.label} onChange={(e) => {
                                  const newI = [...data.aboutPage.stats.items]; newI[i].label = e.target.value; updateAbout("stats", "items", newI);
                               }} className={UI.input} placeholder="Label" />
                            </div>
                            <div className="space-y-2">
                               <label className={UI.label}>Brief Description</label>
                               <textarea value={s.description} onChange={(e) => {
                                  const newI = [...data.aboutPage.stats.items]; newI[i].description = e.target.value; updateAbout("stats", "items", newI);
                               }} className={UI.textarea} rows={2} placeholder="Brief desc..." />
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateAbout("stats", "items", [...(data.aboutPage?.stats?.items || []), { value: 0, label: "", suffix: "+", icon: "Shield", description: "" }])} className={UI.buttonAdd + " h-full flex flex-col justify-center gap-2"}>
                          <Plus className="w-8 h-8 mx-auto" />
                          <span>Add Stat</span>
                       </button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className={UI.label}>Industry Marquee (Scrolling Labels)</label>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap gap-4">
                       {(data.aboutPage?.recognition || []).map((r: string, i: number) => (
                         <div key={i} className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <input type="text" value={r} onChange={(e) => {
                              const newR = [...data.aboutPage.recognition]; newR[i] = e.target.value; updateAbout("recognition", null, newR);
                            }} className="bg-transparent text-xs font-bold text-slate-600 outline-none" />
                            <button onClick={() => {
                              const newR = data.aboutPage.recognition.filter((_: any, idx: number) => idx !== i); updateAbout("recognition", null, newR);
                            }} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                         </div>
                       ))}
                       <button onClick={() => updateAbout("recognition", null, [...(data.aboutPage?.recognition || []), "NEW LABEL"])} className="px-6 py-2 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 hover:text-primary hover:border-primary/30 transition-all">+ Add Entry</button>
                    </div>
                 </div>
              </div>
            )}

            {/* VALUES SECTION */}
            {activeTab === "values" && (
              <div className="space-y-16">
                 <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 max-w-3xl">
                    <label className={UI.sectionHeader}>Values Headline & Branding</label>
                    <div className="space-y-2">
                       <label className={UI.label}>Full Headline</label>
                       <input type="text" value={data.aboutPage?.values?.headline || ""} onChange={(e) => updateAbout("values", "headline", e.target.value)} className={UI.inputLarge} placeholder="Full Headline" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Highlight Text</label>
                       <input type="text" value={data.aboutPage?.values?.highlight || ""} onChange={(e) => updateAbout("values", "highlight", e.target.value)} className={UI.inputPrimary} placeholder="Text to highlight" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Context Description</label>
                       <textarea value={data.aboutPage?.values?.description || ""} onChange={(e) => updateAbout("values", "description", e.target.value)} className={UI.textarea} rows={3} placeholder="Context description..." />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className={UI.label}>Core Philosophies (Cards)</label>
                    <div className="grid grid-cols-3 gap-8">
                       {(data.aboutPage?.values?.items || []).map((v: any, i: number) => (
                         <div key={i} className={UI.card + " space-y-6 relative group"}>
                            <button onClick={() => {
                               const newI = data.aboutPage.values.items.filter((_: any, idx: number) => idx !== i); updateAbout("values", "items", newI);
                            }} className="absolute top-8 right-8 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                            
                            <IconSelector 
                               label="Philosophy Icon"
                               value={v.icon} 
                               onChange={(val) => {
                                 const newI = [...data.aboutPage.values.items]; newI[i].icon = val; updateAbout("values", "items", newI);
                               }} 
                            />

                            <div className="space-y-2">
                               <label className={UI.label}>Value Title</label>
                               <input type="text" value={v.title} onChange={(e) => {
                                  const newI = [...data.aboutPage.values.items]; newI[i].title = e.target.value; updateAbout("values", "items", newI);
                               }} className={UI.inputLarge} placeholder="Value Title" />
                            </div>
                            <div className="space-y-2">
                               <label className={UI.label}>Description</label>
                               <textarea value={v.description} onChange={(e) => {
                                  const newI = [...data.aboutPage.values.items]; newI[i].description = e.target.value; updateAbout("values", "items", newI);
                               }} className={UI.textarea} rows={3} placeholder="Description..." />
                            </div>
                            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                               <div className="space-y-1">
                                  <label className={UI.label}>Stat Label</label>
                                  <input type="text" value={v.statLabel} onChange={(e) => {
                                    const newI = [...data.aboutPage.values.items]; newI[i].statLabel = e.target.value; updateAbout("values", "items", newI);
                                  }} className={UI.input} placeholder="Stat Label" />
                               </div>
                               <div className="space-y-1">
                                  <label className={UI.label}>Stat Value</label>
                                  <input type="text" value={v.stat} onChange={(e) => {
                                    const newI = [...data.aboutPage.values.items]; newI[i].stat = e.target.value; updateAbout("values", "items", newI);
                                  }} className={UI.inputPrimary} placeholder="Stat Value" />
                               </div>
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateAbout("values", "items", [...(data.aboutPage?.values?.items || []), { title: "", description: "", icon: "BadgeCheck", statLabel: "", stat: "" }])} className={UI.buttonAdd + " h-full flex flex-col justify-center gap-4 py-20"}>
                          <Plus className="w-10 h-10 mx-auto" />
                          <span>Add New Value</span>
                       </button>
                    </div>
                 </div>
              </div>
            )}

             {/* SERVICES SECTION */}
            {activeTab === "services" && (
              <div className="space-y-12">
                 <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <label className={UI.sectionHeader}>Capabilities Branding</label>
                    <div className="space-y-2">
                       <label className={UI.label}>Badge</label>
                       <input type="text" value={data.aboutPage?.capabilities?.badge || ""} onChange={(e) => updateAbout("capabilities", "badge", e.target.value)} className={UI.input} placeholder="Badge (e.g. Services)" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Headline</label>
                       <input type="text" value={data.aboutPage?.capabilities?.headline || ""} onChange={(e) => updateAbout("capabilities", "headline", e.target.value)} className={UI.inputLarge} placeholder="Headline (e.g. Our Capabilities)" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Intro Narrative</label>
                       <textarea value={data.aboutPage?.capabilities?.description || ""} onChange={(e) => updateAbout("capabilities", "description", e.target.value)} className={UI.textarea} rows={3} placeholder="Intro narrative..." />
                    </div>
                 </div>

                 <ContentSelector 
                    type="services" 
                    label="Featured Capabilities (Select from Management)" 
                    selectedItems={data.aboutPage?.services || []} 
                    onSelect={(items) => updateAbout("services", null, items)} 
                 />
              </div>
            )}

            {/* CTA SECTION */}
            {activeTab === "cta" && (
              <div className="space-y-16">
                 <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-8 space-y-10">
                       <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                          <label className={UI.sectionHeader}>Global CTA Banner Management</label>
                          <div className="space-y-2">
                             <label className={UI.label}>Badge</label>
                             <input type="text" value={data.aboutPage?.ctaBanner?.badge || ""} onChange={(e) => updateAbout("ctaBanner", "badge", e.target.value)} className={UI.input} placeholder="Badge" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className={UI.label}>Main Headline</label>
                                <input type="text" value={data.aboutPage?.ctaBanner?.headline || ""} onChange={(e) => updateAbout("ctaBanner", "headline", e.target.value)} className={UI.inputLarge} placeholder="Main Headline" />
                             </div>
                             <div className="space-y-2">
                                <label className={UI.label}>Highlight Text</label>
                                <input type="text" value={data.aboutPage?.ctaBanner?.highlight || ""} onChange={(e) => updateAbout("ctaBanner", "highlight", e.target.value)} className={UI.inputPrimary} placeholder="Highlight Text" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className={UI.label}>Conversion Narrative</label>
                             <textarea value={data.aboutPage?.ctaBanner?.description || ""} onChange={(e) => updateAbout("ctaBanner", "description", e.target.value)} className={UI.textarea} rows={4} placeholder="Conversion narrative..." />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <label className={UI.label}>Primary Action</label>
                                <div className="grid grid-cols-1 gap-3">
                                   <input type="text" value={data.aboutPage?.ctaBanner?.primaryCta || ""} onChange={(e) => updateAbout("ctaBanner", "primaryCta", e.target.value)} className={UI.input} placeholder="Label" />
                                   <input type="text" value={data.aboutPage?.ctaBanner?.primaryLink || ""} onChange={(e) => updateAbout("ctaBanner", "primaryLink", e.target.value)} className={UI.input} placeholder="Link" />
                                </div>
                             </div>
                             <div className="space-y-4">
                                <label className={UI.label}>Secondary Action</label>
                                <div className="grid grid-cols-1 gap-3">
                                   <input type="text" value={data.aboutPage?.ctaBanner?.secondaryCta || ""} onChange={(e) => updateAbout("ctaBanner", "secondaryCta", e.target.value)} className={UI.input} placeholder="Label" />
                                   <input type="text" value={data.aboutPage?.ctaBanner?.secondaryLink || ""} onChange={(e) => updateAbout("ctaBanner", "secondaryLink", e.target.value)} className={UI.input} placeholder="Link" />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="col-span-4 space-y-6">
                       <label className={UI.label}>Trust Indicators (Features)</label>
                       <div className="space-y-3">
                          {(data.aboutPage?.ctaBanner?.features || []).map((f: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                               <input type="text" value={f} onChange={(e) => {
                                 const newF = [...data.aboutPage.ctaBanner.features]; newF[i] = e.target.value; updateAbout("ctaBanner", "features", newF);
                               }} className="flex-1 bg-transparent border-none text-xs font-medium text-slate-600 outline-none" />
                               <button onClick={() => {
                                 const newF = data.aboutPage.ctaBanner.features.filter((_: any, idx: number) => idx !== i); updateAbout("ctaBanner", "features", newF);
                               }} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          ))}
                          <button onClick={() => updateAbout("ctaBanner", "features", [...(data.aboutPage?.ctaBanner?.features || []), "Feature Descriptor"])} className={UI.buttonAdd}>+ Add Feature</button>
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
