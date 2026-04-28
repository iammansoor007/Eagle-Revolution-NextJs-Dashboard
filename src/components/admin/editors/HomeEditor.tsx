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
import IconSelector from "@/components/admin/IconSelector";
import ImageField from "@/components/admin/ImageField";

// Standardized UI Classes
const UI = {
  label: "text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2",
  sectionHeader: "text-lg font-bold text-slate-900 tracking-tight mb-6",
  card: "bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm",
  input: "w-full bg-slate-50 border border-transparent focus:bg-white focus:border-primary/30 px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none shadow-sm",
  inputLarge: "w-full bg-slate-50 border border-transparent focus:bg-white focus:border-primary/30 px-5 py-4 rounded-xl text-xl font-bold transition-all outline-none shadow-sm",
  inputPrimary: "w-full bg-primary/5 text-primary border border-transparent focus:bg-white focus:border-primary/30 px-5 py-4 rounded-xl text-xl font-bold transition-all outline-none shadow-sm",
  textarea: "w-full bg-slate-50 border border-transparent focus:bg-white focus:border-primary/30 px-5 py-4 rounded-2xl text-sm font-medium leading-relaxed transition-all outline-none shadow-sm",
  buttonAdd: "w-full border-2 border-dashed border-slate-200 py-4 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary hover:border-primary/30 transition-all bg-white/50",
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
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-1 p-4 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id
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
      <div className="p-10 bg-[#F8FAFC]">
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
                    <div className="space-y-3">
                      <label className={UI.label}>Section Badge</label>
                      <input
                        type="text"
                        value={data.hero?.badge || ""}
                        onChange={(e) => updateSection("hero", "badge", e.target.value)}
                        className={UI.input}
                        placeholder="Veteran Owned"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className={UI.label}>Dynamic Headlines (Animated Lines)</label>
                      <div className="space-y-4">
                        {(data.hero?.headlines || []).map((h: any, i: number) => (
                          <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative group">
                            <input
                              type="text"
                              value={h.text}
                              onChange={(e) => {
                                const newH = [...data.hero.headlines];
                                newH[i].text = e.target.value;
                                updateSection("hero", "headlines", newH);
                              }}
                              className="flex-1 bg-slate-50 border-none px-4 py-3 rounded-xl text-sm outline-none"
                              placeholder="Headline line..."
                            />
                            <button
                              onClick={() => {
                                const newH = [...data.hero.headlines];
                                newH[i].highlight = !newH[i].highlight;
                                updateSection("hero", "headlines", newH);
                              }}
                              className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${h.highlight ? "bg-primary text-white" : "bg-slate-100 text-slate-400 hover:text-slate-600"}`}
                            >
                              {h.highlight ? "Highlighted" : "Normal"}
                            </button>
                            <button onClick={() => {
                              const newH = data.hero.headlines.filter((_: any, idx: number) => idx !== i);
                              updateSection("hero", "headlines", newH);
                            }} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => updateSection("hero", "headlines", [...(data.hero?.headlines || []), { text: "", highlight: false }])}
                          className={UI.buttonAdd}
                        >
                          + Add Headline Line
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <ImageField
                      label="Cinematic Background"
                      value={data.hero?.images?.[0] || ""}
                      onChange={(url: string) => {
                        const currentImgs = Array.isArray(data.hero?.images) ? data.hero.images : [];
                        const imgs = [...currentImgs];
                        imgs[0] = url;
                        updateSection("hero", "images", imgs);
                      }}
                      altValue={data.hero?.bgImageAlt || ""}
                      onAltChange={(alt) => updateSection("hero", "bgImageAlt", alt)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className={UI.label}>Hero Narrative (Paragraph)</label>
                  <textarea
                    value={data.hero?.description || ""}
                    onChange={(e) => updateSection("hero", "description", e.target.value)}
                    rows={4}
                    className={UI.textarea}
                  />
                </div>

                <div className="grid grid-cols-2 gap-10">
                  {/* Hero Buttons */}
                  <div className="space-y-6">
                    <label className={UI.label}>Action Buttons</label>
                    <div className="space-y-4">
                      {(data.hero?.buttons || []).map((btn: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4 relative"}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Button {i + 1}</span>
                            <button onClick={() => {
                              const newB = data.hero.buttons.filter((_: any, idx: number) => idx !== i);
                              updateSection("hero", "buttons", newB);
                            }} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className={UI.label}>Label</label>
                              <input type="text" value={btn.text} onChange={(e) => {
                                const newB = [...data.hero.buttons]; newB[i].text = e.target.value; updateSection("hero", "buttons", newB);
                              }} className={UI.input} placeholder="Label" />
                            </div>
                            <div className="space-y-2">
                              <label className={UI.label}>Link</label>
                              <input type="text" value={btn.href} onChange={(e) => {
                                const newB = [...data.hero.buttons]; newB[i].href = e.target.value; updateSection("hero", "buttons", newB);
                              }} className={UI.input} placeholder="Link (/contact)" />
                            </div>
                          </div>
                          <div className="pt-2">
                            <button
                                onClick={() => {
                                  const newB = [...data.hero.buttons]; newB[i].primary = !newB[i].primary; updateSection("hero", "buttons", newB);
                                }}
                                className={`px-4 py-2 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${btn.primary ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}
                              >
                                {btn.primary ? "Primary Style" : "Secondary Style"}
                              </button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => updateSection("hero", "buttons", [...(data.hero?.buttons || []), { text: "", href: "", primary: false }])} className={UI.buttonAdd}>+ Add Button</button>
                    </div>
                  </div>

                  {/* Hero Stats */}
                  <div className="space-y-6">
                    <label className={UI.label}>Performance Metrics</label>
                    <div className="space-y-4">
                      {(data.hero?.stats || []).map((stat: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4 relative"}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Stat {i + 1}</span>
                            <button onClick={() => {
                              const newS = data.hero.stats.filter((_: any, idx: number) => idx !== i);
                              updateSection("hero", "stats", newS);
                            }} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className={UI.label}>Value</label>
                              <input type="text" value={stat.value} onChange={(e) => {
                                const newS = [...data.hero.stats]; newS[i].value = e.target.value; updateSection("hero", "stats", newS);
                              }} className={UI.inputLarge} placeholder="25+" />
                            </div>
                            <div className="space-y-2">
                              <label className={UI.label}>Label</label>
                              <input type="text" value={stat.label} onChange={(e) => {
                                const newS = [...data.hero.stats]; newS[i].label = e.target.value; updateSection("hero", "stats", newS);
                              }} className={UI.input} placeholder="Label" />
                            </div>
                          </div>
                          <IconSelector 
                            label="Stat Icon"
                            value={stat.icon} 
                            onChange={(val) => {
                              const newS = [...data.hero.stats]; newS[i].icon = val; updateSection("hero", "stats", newS);
                            }} 
                          />
                        </div>
                      ))}
                      <button onClick={() => updateSection("hero", "stats", [...(data.hero?.stats || []), { label: "", value: "", icon: "Check" }])} className={UI.buttonAdd}>+ Add Stat</button>
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
                      <label className={UI.label}>Narrative Badge</label>
                      <input type="text" value={data.about?.badge || ""} onChange={(e) => updateSection("about", "badge", e.target.value)} className={UI.input} placeholder="Veteran Owned" />
                    </div>

                    <div className="space-y-4">
                      <label className={UI.label}>Headline Split (Prefix · Highlight · Suffix)</label>
                      <div className="flex gap-4">
                        <input type="text" value={data.about?.headline?.prefix || ""} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, prefix: e.target.value })} className={UI.input} placeholder="We are" />
                        <input type="text" value={data.about?.headline?.highlight || ""} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, highlight: e.target.value })} className={UI.inputPrimary} placeholder="Roofing" />
                        <input type="text" value={data.about?.headline?.suffix || ""} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, suffix: e.target.value })} className={UI.input} placeholder="Experts" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className={UI.label}>Longform Story (HTML Supported)</label>
                      <textarea value={data.about?.description || ""} onChange={(e) => updateSection("about", "description", e.target.value)} rows={6} className={UI.textarea} />
                    </div>
                  </div>

                  <div className="col-span-4 space-y-8">
                    <ImageField 
                      label="Main Story Image" 
                      value={data.about?.image?.src || ""} 
                      onChange={(url: string) => updateSection("about", "image", { ...(data.about?.image || {}), src: url })} 
                      altValue={data.about?.image?.alt || ""}
                      onAltChange={(alt) => updateSection("about", "image", { ...(data.about?.image || {}), alt: alt })}
                    />
                    <div className="space-y-2">
                       <label className={UI.label}>Image Badge</label>
                       <input type="text" value={data.about?.image?.badge || ""} onChange={(e) => updateSection("about", "image", { ...(data.about?.image || {}), badge: e.target.value })} className={UI.input} placeholder="Since 1998" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className={UI.label}>Core Value Keywords</label>
                  <div className="flex flex-wrap gap-3">
                    {(data.about?.coreValues || []).map((val: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-primary/30">
                        <input type="text" value={val} onChange={(e) => {
                          const newV = [...data.about.coreValues]; newV[i] = e.target.value; updateSection("about", "coreValues", newV);
                        }} className="bg-transparent border-none text-[10px] font-bold text-slate-600 outline-none w-24" />
                        <button onClick={() => {
                          const newV = data.about.coreValues.filter((_: any, idx: number) => idx !== i);
                          updateSection("about", "coreValues", newV);
                        }} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateSection("about", "coreValues", [...(data.about?.coreValues || []), "New Value"])} className="px-6 py-2 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-bold text-slate-400 hover:text-primary hover:border-primary/30 transition-all">+ Add Keyword</button>
                  </div>
                </div>
              </div>
            )}

            {/* SERVICES SECTION */}
            {activeTab === "services" && (
              <div className="space-y-12">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className={UI.label}>Section Intro</label>
                     <div className={UI.card + " space-y-6"}>
                       <div className="space-y-2">
                          <label className={UI.label}>Badge</label>
                          <input type="text" value={data.services?.badge || ""} onChange={(e) => updateSection("services", "badge", e.target.value)} className={UI.input} placeholder="Badge" />
                       </div>
                       <div className="space-y-2">
                          <label className={UI.label}>Headline Split</label>
                          <div className="flex gap-2">
                            <input type="text" value={data.services?.headline?.prefix || ""} onChange={(e) => updateSection("services", "headline", { ...data.services.headline, prefix: e.target.value })} className={UI.input} placeholder="Prefix" />
                            <input type="text" value={data.services?.headline?.highlight || ""} onChange={(e) => updateSection("services", "headline", { ...data.services.headline, highlight: e.target.value })} className={UI.inputPrimary} placeholder="Highlight" />
                            <input type="text" value={data.services?.headline?.suffix || ""} onChange={(e) => updateSection("services", "headline", { ...data.services.headline, suffix: e.target.value })} className={UI.input} placeholder="Suffix" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className={UI.label}>Description (Multi-line)</label>
                          <textarea 
                            value={Array.isArray(data.services?.description) ? data.services.description.join('\n') : data.services?.description || ""} 
                            onChange={(e) => updateSection("services", "description", e.target.value.split('\n'))} 
                            placeholder="Section description (one paragraph per line)"
                            rows={3}
                            className={UI.textarea}
                          />
                       </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                    <label className={UI.label}>Services Stats (Featured Row)</label>
                    <div className={UI.card + " space-y-6"}>
                      {(data.services?.stats || []).map((s: any, i: number) => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="space-y-1 flex-1">
                             <label className={UI.label}>Value</label>
                             <input type="number" value={s.value} onChange={(e) => {
                               const newS = [...data.services.stats]; newS[i].value = parseInt(e.target.value); updateSection("services", "stats", newS);
                             }} className={UI.inputLarge} />
                          </div>
                          <div className="space-y-1 w-16">
                             <label className={UI.label}>Suffix</label>
                             <input type="text" value={s.suffix} onChange={(e) => {
                               const newS = [...data.services.stats]; newS[i].suffix = e.target.value; updateSection("services", "stats", newS);
                             }} className={UI.inputPrimary} placeholder="+" />
                          </div>
                          <div className="space-y-1 flex-[2]">
                             <label className={UI.label}>Label</label>
                             <input type="text" value={s.label} onChange={(e) => {
                               const newS = [...data.services.stats]; newS[i].label = e.target.value; updateSection("services", "stats", newS);
                             }} className={UI.input} placeholder="Label" />
                          </div>
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
              </div>
            )}

            {/* WHY CHOOSE US (VALUE PROPS) */}
            {activeTab === "whyChooseUs" && (
              <div className="space-y-16">
                <div className="max-w-3xl space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <label className={UI.sectionHeader}>Section Branding</label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className={UI.label}>Badge</label>
                       <input type="text" value={data.whyChooseUs?.section?.badge || ""} onChange={(e) => updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), badge: e.target.value })} className={UI.input} placeholder="Badge" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Headline</label>
                       <input type="text" value={data.whyChooseUs?.section?.headline || ""} onChange={(e) => updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), headline: e.target.value })} className={UI.inputLarge} placeholder="Headline" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Narrative Description</label>
                       <textarea value={data.whyChooseUs?.section?.description || ""} onChange={(e) => updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), description: e.target.value })} className={UI.textarea} rows={3} placeholder="Sub-description..." />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className={UI.label}>Key Value Features</label>
                  <div className="grid grid-cols-3 gap-8">
                    {(data.whyChooseUs?.features || []).map((f: any, i: number) => (
                      <div key={i} className={UI.card + " space-y-6 relative group"}>
                        <div className="flex justify-between items-start mb-2">
                           <IconSelector 
                            label="Feature Icon"
                            value={f.icon} 
                            onChange={(val) => {
                              const newF = [...data.whyChooseUs.features]; newF[i].icon = val; updateSection("whyChooseUs", "features", newF);
                            }} 
                           />
                          <button onClick={() => {
                            const newF = data.whyChooseUs.features.filter((_: any, idx: number) => idx !== i);
                            updateSection("whyChooseUs", "features", newF);
                          }} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-2">
                           <label className={UI.label}>Feature Title</label>
                           <input type="text" value={f.title} onChange={(e) => {
                             const newF = [...data.whyChooseUs.features]; newF[i].title = e.target.value; updateSection("whyChooseUs", "features", newF);
                           }} className={UI.input} placeholder="Feature Title" />
                        </div>
                        <div className="space-y-2">
                           <label className={UI.label}>Feature Narrative</label>
                           <textarea value={f.description} onChange={(e) => {
                             const newF = [...data.whyChooseUs.features]; newF[i].description = e.target.value; updateSection("whyChooseUs", "features", newF);
                           }} className={UI.textarea} rows={3} placeholder="Describe this value..." />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateSection("whyChooseUs", "features", [...(data.whyChooseUs?.features || []), { title: "", description: "", icon: "Star" }])} className={UI.buttonAdd + " h-full flex flex-col justify-center gap-4 py-16"}>
                      <Plus className="w-8 h-8 mx-auto" />
                      <span>Add Value Feature</span>
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
                    <label className={UI.label}>Header & Call to Action</label>
                    <div className={UI.card + " space-y-6"}>
                      <div className="space-y-2">
                         <label className={UI.label}>Badge</label>
                         <input type="text" value={data.portfolio?.section?.badge || ""} onChange={(e) => updateSection("portfolio", "section", { ...(data.portfolio?.section || {}), badge: e.target.value })} className={UI.input} placeholder="Portfolio" />
                      </div>
                      <div className="space-y-2">
                         <label className={UI.label}>Headline</label>
                         <input type="text" value={data.portfolio?.section?.headline || ""} onChange={(e) => updateSection("portfolio", "section", { ...(data.portfolio?.section || {}), headline: e.target.value })} className={UI.inputLarge} placeholder="Latest Projects" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div className="space-y-2">
                           <label className={UI.label}>Button Label</label>
                           <input type="text" value={data.portfolio?.button?.text || ""} onChange={(e) => updateSection("portfolio", "button", { ...(data.portfolio?.button || {}), text: e.target.value })} className={UI.input} placeholder="View All" />
                        </div>
                        <div className="space-y-2">
                           <label className={UI.label}>Button Link</label>
                           <input type="text" value={data.portfolio?.button?.link || ""} onChange={(e) => updateSection("portfolio", "button", { ...(data.portfolio?.button || {}), link: e.target.value })} className={UI.input} placeholder="/gallery" />
                        </div>
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

              </div>
            )}

            {/* TESTIMONIALS SECTION */}
            {activeTab === "testimonials" && (
              <div className="space-y-16">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <label className={UI.label}>Section Branding</label>
                    <div className={UI.card + " space-y-6"}>
                      <div className="space-y-2">
                         <label className={UI.label}>Badge</label>
                         <input type="text" value={data.testimonials?.section?.badge || ""} onChange={(e) => updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), badge: e.target.value })} className={UI.input} placeholder="Testimonials" />
                      </div>
                      <div className="space-y-2">
                         <label className={UI.label}>Headline</label>
                         <input type="text" value={data.testimonials?.section?.headline || ""} onChange={(e) => updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), headline: e.target.value })} className={UI.inputLarge} placeholder="Client Feedback" />
                      </div>
                      <div className="space-y-2">
                         <label className={UI.label}>Trust Badge</label>
                         <input type="text" value={data.testimonials?.section?.featured || ""} onChange={(e) => updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), featured: e.target.value })} className={UI.input} placeholder="Google Verified" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className={UI.label}>Engagement Stats</label>
                    <div className={UI.card + " space-y-6"}>
                      <div className="space-y-2">
                         <label className={UI.label}>Subscribers Count</label>
                         <input type="text" value={data.testimonials?.stats?.subscribers || ""} onChange={(e) => updateSection("testimonials", "stats", { ...(data.testimonials?.stats || {}), subscribers: e.target.value })} className={UI.inputLarge} placeholder="500+" />
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

              </div>
            )}

            {/* FAQ SECTION */}
            {activeTab === "faq" && (
              <div className="space-y-12">
                <div className="max-w-3xl space-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <label className={UI.sectionHeader}>Support Branding</label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className={UI.label}>Badge</label>
                       <input type="text" value={data.faq?.section?.badge || ""} onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), badge: e.target.value })} className={UI.input} placeholder="FAQ" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Headline</label>
                       <input type="text" value={data.faq?.section?.headline || ""} onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), headline: e.target.value })} className={UI.inputLarge} placeholder="Common Questions" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Intro Narrative</label>
                       <textarea value={data.faq?.section?.description || ""} onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), description: e.target.value })} className={UI.textarea} rows={2} placeholder="Description..." />
                    </div>
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
                    <label className={UI.label}>Quote Intro Text</label>
                    <div className={UI.card + " space-y-6"}>
                      <div className="space-y-2">
                         <label className={UI.label}>Badge</label>
                         <input type="text" value={data.quote?.section?.badge || ""} onChange={(e) => updateSection("quote", "section", { ...data.quote.section, badge: e.target.value })} className={UI.input} placeholder="Quote" />
                      </div>
                      <div className="space-y-2">
                         <label className={UI.label}>Headline</label>
                         <input type="text" value={data.quote?.section?.headline || ""} onChange={(e) => updateSection("quote", "section", { ...data.quote.section, headline: e.target.value })} className={UI.inputLarge} placeholder="Get an Estimate" />
                      </div>
                      <div className="space-y-2">
                         <label className={UI.label}>Narrative Narrative</label>
                         <textarea value={data.quote?.section?.description || ""} onChange={(e) => updateSection("quote", "section", { ...data.quote.section, description: e.target.value })} className={UI.textarea} rows={3} placeholder="Sub-description narrative..." />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className={UI.label}>Success Confirmation View</label>
                    <div className={UI.card + " space-y-6"}>
                      <div className="space-y-2">
                         <label className={UI.label}>Success Title</label>
                         <input type="text" value={data.quote?.success?.title || ""} onChange={(e) => updateSection("quote", "success", { ...data.quote.success, title: e.target.value })} className={UI.inputLarge} placeholder="Success Title" />
                      </div>
                      <div className="space-y-2">
                         <label className={UI.label}>Confirmation Message</label>
                         <textarea value={data.quote?.success?.message || ""} onChange={(e) => updateSection("quote", "success", { ...data.quote.success, message: e.target.value })} className={UI.textarea} rows={3} placeholder="Thank you message..." />
                      </div>
                      <div className="space-y-2">
                         <label className={UI.label}>Close Button</label>
                         <input type="text" value={data.quote?.success?.buttonText || ""} onChange={(e) => updateSection("quote", "success", { ...data.quote.success, buttonText: e.target.value })} className={UI.inputPrimary} placeholder="Close" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <label className={UI.label}>Form Logic: Services & Options</label>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <span className={UI.label}>Project Type Selection</span>
                      <div className="grid grid-cols-2 gap-3">
                        {(data.quote?.services || []).map((s: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all hover:border-primary/30">
                            <input type="text" value={s.title} onChange={(e) => {
                              const newS = [...data.quote.services]; newS[i].title = e.target.value; updateSection("quote", "services", newS);
                            }} className="flex-1 bg-transparent border-none text-[10px] font-bold text-slate-800 outline-none" />
                            <button onClick={() => {
                              const newS = data.quote.services.filter((_: any, idx: number) => idx !== i);
                              updateSection("quote", "services", newS);
                            }} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <button onClick={() => updateSection("quote", "services", [...(data.quote?.services || []), { title: "New Service", id: Date.now() }])} className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-[9px] font-bold text-slate-400 hover:text-primary transition-all">+ Add Option</button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className={UI.label}>Project Timelines</span>
                      <div className="grid grid-cols-2 gap-3">
                        {(data.quote?.timelines || []).map((t: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all hover:border-primary/30">
                            <input type="text" value={t.label} onChange={(e) => {
                              const newT = [...data.quote.timelines]; newT[i].label = e.target.value; updateSection("quote", "timelines", newT);
                            }} className="flex-1 bg-transparent border-none text-[10px] font-bold text-slate-800 outline-none" />
                            <button onClick={() => {
                              const newT = data.quote.timelines.filter((_: any, idx: number) => idx !== i);
                              updateSection("quote", "timelines", newT);
                            }} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <button onClick={() => updateSection("quote", "timelines", [...(data.quote?.timelines || []), { label: "Immediate", value: "immediate" }])} className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-[9px] font-bold text-slate-400 hover:text-primary transition-all">+ Add Timeline</button>
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
