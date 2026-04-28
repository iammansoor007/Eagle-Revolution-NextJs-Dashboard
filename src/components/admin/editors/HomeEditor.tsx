"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Users, Video, Briefcase, MapPin, Calendar,
  MessageSquare, Sparkles, ExternalLink
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

export default function HomeEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({
        hero: { 
          badge: "", 
          headlines: [{ text: "", highlight: false }], 
          description: "", 
          buttons: [{ text: "", href: "", primary: true, icon: "ArrowRight" }],
          stats: [{ label: "", value: "", icon: "Shield" }],
          images: [] 
        },
        about: { 
          badge: "", 
          headline: { prefix: "", highlight: "", suffix: "" }, 
          description: "", 
          image: { src: "", alt: "", badge: "" },
          stats: [{ value: 0, suffix: "", label: "" }],
          buttons: [{ text: "", href: "", primary: true }],
          coreValues: []
        },
        services: {
          badge: "",
          headline: { prefix: "", highlight: "", suffix: "" },
          description: [],
          stats: [{ value: 0, suffix: "", label: "" }],
          image: { src: "", badge: "" },
          services: [{ title: "", description: "", slug: "", icon: "", tag: "", features: [] }],
          cta: { title: "", description: "", buttonText: "", buttonLink: "" }
        },
        whyChooseUs: {
          section: { badge: "", headline: "", description: "" },
          features: [{ title: "", description: "", icon: "" }],
          stats: [{ value: "", label: "", suffix: "" }],
          cta: { badge: "", title: "", description: "", trustBadges: [], buttons: [] }
        },
        portfolio: {
          section: { badge: "", headline: "" },
          projects: [{ number: "", title: "", category: "", location: "", year: "", desc: "", image: "" }],
          button: { text: "", link: "" }
        },
        testimonials: {
          section: { badge: "", headline: "", description: "", featured: "" },
          testimonials: [{ text: "", name: "", avatar: "", position: "", company: "", rating: 5, videoId: "" }],
          videos: [{ videoId: "", name: "", title: "", duration: "", views: 0 }],
          stats: { subscribers: "", totalVideos: 0 }
        },
        faq: {
          section: { badge: "", headline: "", description: "" },
          questions: [{ question: "", answer: "" }]
        },
        quote: {
          section: { badge: "", headline: "", description: "" },
          services: [{ id: 0, title: "", desc: "", icon: "" }],
          timelines: [{ value: "", label: "" }],
          success: { title: "", message: "", response: "", buttonText: "" }
        }
      });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateSection = (section: string, field: string, value: any) => {
    setData({
      ...data,
      [section]: {
        ...(data[section] || {}),
        [field]: value,
      },
    });
  };

  const tabs = [
    { id: "hero", label: "Hero Canvas", icon: LayoutTemplate, title: "Hero Section Management" },
    { id: "about", label: "About Narrative", icon: Briefcase, title: "Mission & About Section" },
    { id: "services", label: "Services Grid", icon: List, title: "Services Inventory" },
    { id: "whyChooseUs", label: "Value Props", icon: Award, title: "Why Choose Eagle Revolution" },
    { id: "portfolio", label: "Portfolio", icon: ImageIcon, title: "Featured Projects" },
    { id: "testimonials", label: "Social Proof", icon: MessageSquare, title: "Testimonials & Reviews" },
    { id: "faq", label: "Support FAQ", icon: HelpCircle, title: "Frequently Asked Questions" },
    { id: "quote", label: "Quick Quote", icon: Mail, title: "Contact & Quote Engine" },
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

      {/* Editor Content */}
      <div className="flex-1 p-10 overflow-y-auto max-h-[850px] custom-scrollbar bg-[#F8FAFC]">
        {/* Tab Header */}
        <div className="mb-12 pb-8 border-b border-slate-200">
           <h2 className="text-3xl font-medium text-slate-900 tracking-tight">{activeTabTitle}</h2>
           <p className="text-sm text-slate-400 mt-2 font-medium">Fully customize every single field, icon, and visual element for this section.</p>
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
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Badge</label>
                         <input 
                           type="text" 
                           value={data.hero?.badge || ""} 
                           onChange={(e) => updateSection("hero", "badge", e.target.value)}
                           className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-primary/40 transition-all shadow-sm"
                           placeholder="Veteran Owned"
                         />
                       </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Dynamic Headlines (Animated Lines)</label>
                      <div className="space-y-4">
                        {(data.hero?.headlines || []).map((h: any, i: number) => (
                          <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <input 
                              type="text" 
                              value={h.text} 
                              onChange={(e) => {
                                const newH = [...data.hero.headlines];
                                newH[i].text = e.target.value;
                                updateSection("hero", "headlines", newH);
                              }}
                              className="flex-1 bg-slate-50 border-none px-4 py-2.5 rounded-lg text-sm outline-none"
                              placeholder="Headline line..."
                            />
                            <button 
                              onClick={() => {
                                const newH = [...data.hero.headlines];
                                newH[i].highlight = !newH[i].highlight;
                                updateSection("hero", "headlines", newH);
                              }}
                              className={`px-4 py-2 rounded-lg text-[10px] font-medium uppercase tracking-widest transition-all ${h.highlight ? "bg-primary text-white" : "bg-slate-100 text-slate-400 hover:text-slate-600"}`}
                            >
                              {h.highlight ? "Highlight On" : "Highlight Off"}
                            </button>
                            <button onClick={() => {
                              const newH = data.hero.headlines.filter((_: any, idx: number) => idx !== i);
                              updateSection("hero", "headlines", newH);
                            }} className="p-2 text-slate-200 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => updateSection("hero", "headlines", [...(data.hero?.headlines || []), { text: "", highlight: false }])}
                          className="flex items-center gap-2 text-[10px] font-medium text-primary uppercase tracking-widest px-4 py-2 hover:bg-primary/5 rounded-lg transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Line
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <ImageUpload 
                      label="Cinematic Background" 
                      value={data.hero?.images?.[0]} 
                      onChange={(url: string) => {
                        const imgs = [...(data.hero.images || [])];
                        imgs[0] = url;
                        updateSection("hero", "images", imgs);
                      }} 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Hero Narrative (Paragraph)</label>
                  <textarea 
                    value={data.hero?.description || ""} 
                    onChange={(e) => updateSection("hero", "description", e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-600 leading-relaxed outline-none focus:border-primary/40 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-10">
                   {/* Hero Buttons */}
                   <div className="space-y-6">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Action Buttons</label>
                      <div className="space-y-4">
                        {(data.hero?.buttons || []).map((btn: any, i: number) => (
                          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                             <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Button {i+1}</span>
                                <button onClick={() => {
                                  const newB = data.hero.buttons.filter((_: any, idx: number) => idx !== i);
                                  updateSection("hero", "buttons", newB);
                                }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <input type="text" value={btn.text} onChange={(e) => {
                                 const newB = [...data.hero.buttons]; newB[i].text = e.target.value; updateSection("hero", "buttons", newB);
                               }} className="bg-slate-50 px-4 py-2 rounded-lg text-xs outline-none" placeholder="Label" />
                               <input type="text" value={btn.href} onChange={(e) => {
                                 const newB = [...data.hero.buttons]; newB[i].href = e.target.value; updateSection("hero", "buttons", newB);
                               }} className="bg-slate-50 px-4 py-2 rounded-lg text-xs outline-none" placeholder="Link (/contact)" />
                             </div>
                             <div className="flex gap-4">
                                <button 
                                  onClick={() => {
                                    const newB = [...data.hero.buttons]; newB[i].primary = !newB[i].primary; updateSection("hero", "buttons", newB);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-[9px] uppercase font-bold tracking-widest ${btn.primary ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}
                                >
                                  {btn.primary ? "Primary Style" : "Secondary Style"}
                                </button>
                             </div>
                          </div>
                        ))}
                        <button onClick={() => updateSection("hero", "buttons", [...(data.hero?.buttons || []), { text: "", href: "", primary: false }])} className="w-full border-2 border-dashed border-slate-200 py-4 rounded-2xl text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-all">+ Add Button</button>
                      </div>
                   </div>

                   {/* Hero Stats */}
                   <div className="space-y-6">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Performance Metrics</label>
                      <div className="space-y-4">
                        {(data.hero?.stats || []).map((stat: any, i: number) => (
                          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                             <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Stat {i+1}</span>
                                <button onClick={() => {
                                  const newS = data.hero.stats.filter((_: any, idx: number) => idx !== i);
                                  updateSection("hero", "stats", newS);
                                }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <input type="text" value={stat.value} onChange={(e) => {
                                 const newS = [...data.hero.stats]; newS[i].value = e.target.value; updateSection("hero", "stats", newS);
                               }} className="bg-slate-50 px-4 py-2 rounded-lg text-xs outline-none font-bold" placeholder="Value (25+)" />
                               <input type="text" value={stat.label} onChange={(e) => {
                                 const newS = [...data.hero.stats]; newS[i].label = e.target.value; updateSection("hero", "stats", newS);
                               }} className="bg-slate-50 px-4 py-2 rounded-lg text-xs outline-none" placeholder="Label (Experience)" />
                             </div>
                             <input type="text" value={stat.icon} onChange={(e) => {
                               const newS = [...data.hero.stats]; newS[i].icon = e.target.value; updateSection("hero", "stats", newS);
                             }} className="w-full bg-slate-50 px-4 py-2 rounded-lg text-[10px] outline-none" placeholder="Icon Name (Shield, Star, etc)" />
                          </div>
                        ))}
                        <button onClick={() => updateSection("hero", "stats", [...(data.hero?.stats || []), { label: "", value: "", icon: "Check" }])} className="w-full border-2 border-dashed border-slate-200 py-4 rounded-2xl text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-all">+ Add Stat</button>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* ABOUT SECTION */}
            {activeTab === "about" && (
              <div className="space-y-12">
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-8 space-y-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Narrative Badge</label>
                      <input type="text" value={data.about?.badge || ""} onChange={(e) => updateSection("about", "badge", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none shadow-sm" />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Headline Split (Prefix · Highlight · Suffix)</label>
                      <div className="flex gap-4">
                        <input type="text" value={data.about?.headline?.prefix || ""} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, prefix: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="We are" />
                        <input type="text" value={data.about?.headline?.highlight || ""} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, highlight: e.target.value })} className="flex-1 bg-primary/5 text-primary border border-primary/20 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Roofing" />
                        <input type="text" value={data.about?.headline?.suffix || ""} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, suffix: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Experts" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Longform Story (HTML Supported)</label>
                      <textarea value={data.about?.description || ""} onChange={(e) => updateSection("about", "description", e.target.value)} rows={6} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-600 leading-relaxed outline-none" />
                    </div>
                  </div>

                  <div className="col-span-4 space-y-8">
                    <ImageUpload label="Main Story Image" value={data.about?.image?.src} onChange={(url: string) => updateSection("about", "image", { ...data.about.image, src: url })} />
                    <input type="text" value={data.about?.image?.badge || ""} onChange={(e) => updateSection("about", "image", { ...data.about.image, badge: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none" placeholder="Image Badge (e.g. Since 1998)" />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Core Value Keywords</label>
                  <div className="flex flex-wrap gap-3">
                    {(data.about?.coreValues || []).map((val: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                        <input type="text" value={val} onChange={(e) => {
                          const newV = [...data.about.coreValues]; newV[i] = e.target.value; updateSection("about", "coreValues", newV);
                        }} className="bg-transparent border-none text-[10px] font-bold text-slate-600 outline-none w-24" />
                        <button onClick={() => {
                          const newV = data.about.coreValues.filter((_: any, idx: number) => idx !== i);
                          updateSection("about", "coreValues", newV);
                        }} className="text-slate-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateSection("about", "coreValues", [...(data.about?.coreValues || []), "New Value"])} className="px-4 py-2 rounded-full border border-dashed border-slate-200 text-[10px] font-bold text-slate-400 hover:text-primary transition-all">+ Add Keyword</button>
                  </div>
                </div>
              </div>
            )}

            {/* SERVICES SECTION */}
            {activeTab === "services" && (
              <div className="space-y-12">
                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Intro</label>
                       <div className="space-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                         <input type="text" value={data.services?.badge || ""} onChange={(e) => updateSection("services", "badge", e.target.value)} className="w-full bg-slate-50 px-4 py-2.5 rounded-xl text-xs outline-none font-bold text-primary" placeholder="Badge" />
                         <div className="flex gap-2">
                           <input type="text" value={data.services?.headline?.prefix || ""} onChange={(e) => updateSection("services", "headline", { ...data.services.headline, prefix: e.target.value })} className="flex-1 bg-slate-50 px-4 py-2.5 rounded-xl text-xs outline-none" placeholder="Prefix" />
                           <input type="text" value={data.services?.headline?.highlight || ""} onChange={(e) => updateSection("services", "headline", { ...data.services.headline, highlight: e.target.value })} className="flex-1 bg-primary/5 text-primary px-4 py-2.5 rounded-xl text-xs font-bold outline-none" placeholder="Highlight" />
                           <input type="text" value={data.services?.headline?.suffix || ""} onChange={(e) => updateSection("services", "headline", { ...data.services.headline, suffix: e.target.value })} className="flex-1 bg-slate-50 px-4 py-2.5 rounded-xl text-xs outline-none" placeholder="Suffix" />
                         </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Services Stats (Featured Row)</label>
                       <div className="space-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                          {(data.services?.stats || []).map((s: any, i: number) => (
                            <div key={i} className="flex gap-4 items-center">
                              <input type="number" value={s.value} onChange={(e) => {
                                const newS = [...data.services.stats]; newS[i].value = parseInt(e.target.value); updateSection("services", "stats", newS);
                              }} className="w-20 bg-slate-50 px-3 py-2 rounded-lg text-xs font-bold" />
                              <input type="text" value={s.suffix} onChange={(e) => {
                                const newS = [...data.services.stats]; newS[i].suffix = e.target.value; updateSection("services", "stats", newS);
                              }} className="w-16 bg-slate-50 px-3 py-2 rounded-lg text-xs" placeholder="+" />
                              <input type="text" value={s.label} onChange={(e) => {
                                const newS = [...data.services.stats]; newS[i].label = e.target.value; updateSection("services", "stats", newS);
                              }} className="flex-1 bg-slate-50 px-3 py-2 rounded-lg text-xs" placeholder="Label" />
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>                 <div className="space-y-6">
                    <ContentSelector 
                      type="services" 
                      label="Services Catalog (Select from Inventory)" 
                      selectedItems={data.services?.services || []} 
                      onSelect={(items) => updateSection("services", "services", items)} 
                    />
                 </div>
>
              </div>
            )}

            {/* WHY CHOOSE US (VALUE PROPS) */}
            {activeTab === "whyChooseUs" && (
              <div className="space-y-16">
                 <div className="max-w-3xl space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Header</label>
                       <input type="text" value={data.whyChooseUs?.section?.badge || ""} onChange={(e) => updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), badge: e.target.value })} className="w-full bg-slate-50 px-5 py-3 rounded-xl text-xs font-bold text-primary outline-none" placeholder="Badge" />
                       <input type="text" value={data.whyChooseUs?.section?.headline || ""} onChange={(e) => updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), headline: e.target.value })} className="w-full bg-slate-50 px-5 py-4 rounded-xl text-sm font-medium outline-none" placeholder="Headline (HTML allowed)" />
                       <textarea value={data.whyChooseUs?.section?.description || ""} onChange={(e) => updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), description: e.target.value })} className="w-full bg-slate-50 px-5 py-4 rounded-xl text-xs text-slate-500 outline-none" rows={3} placeholder="Sub-description..." />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Key Value Features</label>
                    <div className="grid grid-cols-3 gap-8">
                       {(data.whyChooseUs?.features || []).map((f: any, i: number) => (
                         <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-start">
                               <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                                  <input type="text" value={f.icon} onChange={(e) => {
                                    const newF = [...data.whyChooseUs.features]; newF[i].icon = e.target.value; updateSection("whyChooseUs", "features", newF);
                                  }} className="w-full text-center bg-transparent text-[10px] font-bold text-primary outline-none" placeholder="Icon" />
                               </div>
                               <button onClick={() => {
                                 const newF = data.whyChooseUs.features.filter((_: any, idx: number) => idx !== i);
                                 updateSection("whyChooseUs", "features", newF);
                               }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <input type="text" value={f.title} onChange={(e) => {
                              const newF = [...data.whyChooseUs.features]; newF[i].title = e.target.value; updateSection("whyChooseUs", "features", newF);
                            }} className="w-full bg-transparent text-base font-bold text-slate-900 outline-none" placeholder="Feature Title" />
                            <textarea value={f.description} onChange={(e) => {
                              const newF = [...data.whyChooseUs.features]; newF[i].description = e.target.value; updateSection("whyChooseUs", "features", newF);
                            }} className="w-full bg-transparent text-xs text-slate-400 leading-relaxed outline-none resize-none" rows={3} placeholder="Describe this value..." />
                         </div>
                       ))}
                       <button onClick={() => updateSection("whyChooseUs", "features", [...(data.whyChooseUs?.features || []), { title: "", description: "", icon: "Star" }])} className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/30 transition-all text-slate-300 hover:text-primary">
                          <Plus className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Add Feature</span>
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {/* PORTFOLIO SECTION */}
            {activeTab === "portfolio" && (
              <div className="space-y-12">
                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Header & Call to Action</label>
                       <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                          <input type="text" value={data.portfolio?.section?.badge || ""} onChange={(e) => updateSection("portfolio", "section", { ...(data.portfolio?.section || {}), badge: e.target.value })} className="w-full bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold text-primary outline-none" placeholder="Badge" />
                          <input type="text" value={data.portfolio?.section?.headline || ""} onChange={(e) => updateSection("portfolio", "section", { ...(data.portfolio?.section || {}), headline: e.target.value })} className="w-full bg-slate-50 px-4 py-3 rounded-lg text-sm font-medium outline-none" placeholder="Headline" />
                          <div className="flex gap-4 pt-4 border-t border-slate-50">
                             <input type="text" value={data.portfolio?.button?.text || ""} onChange={(e) => updateSection("portfolio", "button", { ...(data.portfolio?.button || {}), text: e.target.value })} className="flex-1 bg-slate-50 px-4 py-2 rounded-lg text-[10px] outline-none" placeholder="Button Label" />
                             <input type="text" value={data.portfolio?.button?.link || ""} onChange={(e) => updateSection("portfolio", "button", { ...(data.portfolio?.button || {}), link: e.target.value })} className="flex-1 bg-slate-50 px-4 py-2 rounded-lg text-[10px] outline-none" placeholder="Button Link" />
                          </div>
                       </div>
                    </div>
                 </div>                 <div className="space-y-6">
                    <ContentSelector 
                      type="projects" 
                      label="Showcase Projects (Select from Portfolio)" 
                      selectedItems={data.portfolio?.projects || []} 
                      onSelect={(items) => updateSection("portfolio", "projects", items)} 
                    />
                 </div>
>
              </div>
            )}

            {/* TESTIMONIALS SECTION */}
            {activeTab === "testimonials" && (
              <div className="space-y-16">
                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Branding</label>
                       <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                          <input type="text" value={data.testimonials?.section?.badge || ""} onChange={(e) => updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), badge: e.target.value })} className="w-full bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold text-primary outline-none" placeholder="Badge" />
                          <input type="text" value={data.testimonials?.section?.headline || ""} onChange={(e) => updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), headline: e.target.value })} className="w-full bg-slate-50 px-4 py-3 rounded-lg text-sm font-medium outline-none" placeholder="Headline" />
                          <input type="text" value={data.testimonials?.section?.featured || ""} onChange={(e) => updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), featured: e.target.value })} className="w-full bg-slate-50 px-4 py-2.5 rounded-lg text-[10px] outline-none" placeholder="Featured Label (e.g. Google Verified)" />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Engagement Stats</label>
                       <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                          <div className="flex gap-4">
                             <div className="flex-1 space-y-2">
                                <span className="text-[9px] font-bold text-slate-300 uppercase">Subscribers/Users</span>
                                <input type="text" value={data.testimonials?.stats?.subscribers || ""} onChange={(e) => updateSection("testimonials", "stats", { ...(data.testimonials?.stats || {}), subscribers: e.target.value })} className="w-full bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold" placeholder="500+" />
                             </div>
                             <div className="flex-1 space-y-2">
                                <span className="text-[9px] font-bold text-slate-300 uppercase">Total Video Stories</span>
                                <input type="number" value={data.testimonials?.stats?.totalVideos || 0} onChange={(e) => updateSection("testimonials", "stats", { ...(data.testimonials?.stats || {}), totalVideos: parseInt(e.target.value) })} className="w-full bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>                 <div className="space-y-6">
                    <ContentSelector 
                      type="reviews" 
                      label="Client Reviews (Select from Management)" 
                      selectedItems={data.testimonials?.testimonials || []} 
                      onSelect={(items) => updateSection("testimonials", "testimonials", items)} 
                    />
                 </div>
>
              </div>
            )}

            {/* FAQ SECTION */}
            {activeTab === "faq" && (
              <div className="space-y-12">
                 <div className="max-w-3xl space-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="space-y-4">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Support Branding</label>
                       <input type="text" value={data.faq?.section?.badge || ""} onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), badge: e.target.value })} className="w-full bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-bold text-primary outline-none" placeholder="Badge" />
                       <input type="text" value={data.faq?.section?.headline || ""} onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), headline: e.target.value })} className="w-full bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium outline-none" placeholder="Headline" />
                       <textarea value={data.faq?.section?.description || ""} onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), description: e.target.value })} className="w-full bg-slate-50 px-4 py-3 rounded-xl text-xs text-slate-500 outline-none" rows={2} placeholder="Description..." />
                    </div>
                 </div>

                 <div className="max-w-3xl space-y-4">
                    <ContentSelector 
                      type="faq" 
                      label="Question Repository (Select from Inventory)" 
                      selectedItems={data.faq?.questions || []} 
                      onSelect={(items) => updateSection("faq", "questions", items)} 
                    />
                 </div>
              </div>
            )}

            {/* QUOTE SECTION */}
            {activeTab === "quote" && (
              <div className="space-y-16">
                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Quote Intro Text</label>
                       <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                          <input type="text" value={data.quote?.section?.badge || ""} onChange={(e) => updateSection("quote", "section", { ...data.quote.section, badge: e.target.value })} className="w-full bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-bold text-primary outline-none" placeholder="Badge" />
                          <input type="text" value={data.quote?.section?.headline || ""} onChange={(e) => updateSection("quote", "section", { ...data.quote.section, headline: e.target.value })} className="w-full bg-slate-50 px-4 py-4 rounded-xl text-sm font-medium outline-none" placeholder="Headline (HTML allowed)" />
                          <textarea value={data.quote?.section?.description || ""} onChange={(e) => updateSection("quote", "section", { ...data.quote.section, description: e.target.value })} className="w-full bg-slate-50 px-4 py-4 rounded-xl text-xs text-slate-500 outline-none leading-relaxed" rows={3} placeholder="Sub-description narrative..." />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Success/Confirmation View</label>
                       <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                          <input type="text" value={data.quote?.success?.title || ""} onChange={(e) => updateSection("quote", "success", { ...data.quote.success, title: e.target.value })} className="w-full bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-bold outline-none" placeholder="Success Title" />
                          <textarea value={data.quote?.success?.message || ""} onChange={(e) => updateSection("quote", "success", { ...data.quote.success, message: e.target.value })} className="w-full bg-slate-50 px-4 py-3 rounded-xl text-xs text-slate-400 outline-none" rows={3} placeholder="Thank you message..." />
                          <input type="text" value={data.quote?.success?.buttonText || ""} onChange={(e) => updateSection("quote", "success", { ...data.quote.success, buttonText: e.target.value })} className="w-full bg-primary/5 text-primary px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase outline-none" placeholder="Close Button Label" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Form Logic: Services & Options</label>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-2">Project Type Selection</span>
                          <div className="grid grid-cols-2 gap-3">
                             {(data.quote?.services || []).map((s: any, i: number) => (
                               <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                  <input type="text" value={s.title} onChange={(e) => {
                                    const newS = [...data.quote.services]; newS[i].title = e.target.value; updateSection("quote", "services", newS);
                                  }} className="flex-1 bg-transparent border-none text-[10px] font-medium text-slate-800 outline-none" />
                                  <button onClick={() => {
                                    const newS = data.quote.services.filter((_: any, idx: number) => idx !== i);
                                    updateSection("quote", "services", newS);
                                  }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                               </div>
                             ))}
                             <button onClick={() => updateSection("quote", "services", [...(data.quote?.services || []), { title: "New Service", id: Date.now() }])} className="p-3 border border-dashed border-slate-200 rounded-xl text-[9px] font-bold text-slate-400 hover:text-primary">+ Add Option</button>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-2">Project Timelines</span>
                          <div className="grid grid-cols-2 gap-3">
                             {(data.quote?.timelines || []).map((t: any, i: number) => (
                               <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                  <input type="text" value={t.label} onChange={(e) => {
                                    const newT = [...data.quote.timelines]; newT[i].label = e.target.value; updateSection("quote", "timelines", newT);
                                  }} className="flex-1 bg-transparent border-none text-[10px] font-medium text-slate-800 outline-none" />
                                  <button onClick={() => {
                                    const newT = data.quote.timelines.filter((_: any, idx: number) => idx !== i);
                                    updateSection("quote", "timelines", newT);
                                  }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                               </div>
                             ))}
                             <button onClick={() => updateSection("quote", "timelines", [...(data.quote?.timelines || []), { label: "Immediate", value: "immediate" }])} className="p-3 border border-dashed border-slate-200 rounded-xl text-[9px] font-bold text-slate-400 hover:text-primary">+ Add Timeline</button>
                          </div>
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
