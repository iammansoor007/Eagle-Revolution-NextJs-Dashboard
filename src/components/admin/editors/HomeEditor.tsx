"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutTemplate, Type, Image as ImageIcon,
  Plus, Trash2, Loader2, ArrowRight, ArrowLeft,
  CheckCircle2, List, Award, MessageSquare, HelpCircle, Mail, Briefcase,
  ChevronRight, X
} from "lucide-react";
import ContentSelector from "@/components/admin/ContentSelector";
import IconSelector from "@/components/admin/IconSelector";
import ImageField from "@/components/admin/ImageField";
import { UI } from "./styles";

export default function HomeEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({
        hero: { badge: "", headlines: [{ text: "", highlight: false }], description: "", buttons: [{ text: "", href: "", primary: true }], stats: [], images: [], bgImageAlt: "" },
        about: { badge: "", headline: { prefix: "", highlight: "", suffix: "" }, description: "", image: { src: "", alt: "", badge: "" }, coreValues: [] },
        services: { badge: "", headline: { prefix: "", highlight: "", suffix: "" }, description: [], stats: [], services: [] },
        whyChooseUs: { section: { badge: "", headline: "", description: "" }, features: [], stats: [] },
        portfolio: { section: { badge: "", headline: "" }, projects: [], button: { text: "", link: "" } },
        testimonials: { section: { badge: "", headline: "", featured: "" }, stats: { subscribers: "" }, testimonials: [] },
        faq: { section: { badge: "", headline: "", description: "" }, questions: [] },
        quote: { section: { badge: "", headline: "", description: "" }, success: { title: "", message: "", buttonText: "" }, services: [], timelines: [] }
      });
    }
  }, [data, setData]);

  useEffect(() => {
    setCurrentStep(0);
  }, [activeTab]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const updateSection = (section: string, field: string | null, value: any) => {
    if (field) {
      setData({
        ...data,
        [section]: {
          ...(data[section] || {}),
          [field]: value,
        },
      });
    } else {
      setData({
        ...data,
        [section]: value,
      });
    }
  };

  const tabs = [
    { id: "hero", label: "Hero Canvas" },
    { id: "about", label: "About Narrative" },
    { id: "services", label: "Services Grid" },
    { id: "whyChooseUs", label: "Value Props" },
    { id: "portfolio", label: "Portfolio" },
    { id: "testimonials", label: "Social Proof" },
    { id: "faq", label: "Support FAQ" },
    { id: "quote", label: "Quote Engine" },
  ];

  const sectionSteps: Record<string, { title: string, description: string }[]> = {
    hero: [
      { title: "Header Lines", description: "Badge and animated headline lines." },
      { title: "Narrative Content", description: "Hero paragraph and call-to-action text." },
      { title: "Cinematic Visual", description: "Background image and SEO metadata." },
      { title: "Action Buttons", description: "Manage primary and secondary buttons." },
      { title: "Trust Metrics", description: "Add performance stats to the hero." }
    ],
    about: [
      { title: "Headline Split", description: "Badge and three-part headline." },
      { title: "Story Narrative", description: "The core brand story paragraph." },
      { title: "Featured Media", description: "Main image, alt text, and floating badge." },
      { title: "Core Keywords", description: "Value labels for the about section." }
    ],
    services: [
      { title: "Introduction", description: "Branding and intro paragraphs." },
      { title: "Impact Stats", description: "Numerical success metrics." },
      { title: "Service Selection", description: "Choose items from the catalog." }
    ],
    whyChooseUs: [
      { title: "Section Branding", description: "Badge, title, and intro." },
      { title: "Value Features", description: "Cards explaining the 'Why'." },
      { title: "Additional Stats", description: "Extra metrics for this section." }
    ],
    portfolio: [
      { title: "Header Info", description: "Badge and main headline." },
      { title: "Featured Work", description: "Select items from the gallery." },
      { title: "Global Link", description: "The 'View All' button config." }
    ],
    testimonials: [
      { title: "Branding", description: "Headline and featured seal label." },
      { title: "Review Selection", description: "Choose client testimonials." },
      { title: "User Count", description: "Subscriber or client counter." }
    ],
    faq: [
      { title: "Header", description: "Section title and badge." },
      { title: "Question Bank", description: "Select from global FAQ library." }
    ],
    quote: [
      { title: "Narrative", description: "Badge and headline for the form." },
      { title: "Success State", description: "Post-submission feedback UI." },
      { title: "Form Options", description: "Services and Timelines select list." }
    ]
  };

  const steps = sectionSteps[activeTab] || [];
  const activeStep = steps[currentStep];

  return (
    <div className="bg-white max-w-4xl mx-auto">
      {/* WP Style Tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-8 text-[13px] border-b border-[#f0f0f1] pb-1">
        {tabs.map((tab: any, idx: number) => (
          <React.Fragment key={tab.id}>
            <button 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-1 py-1 transition-colors ${activeTab === tab.id ? 'text-[#1d2327] font-bold border-b-2 border-[#2271b1]' : 'text-[#2271b1] hover:text-[#135e96]'}`}
            >
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7] px-1">|</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Progress Header */}
      <div className="mb-10 bg-[#f6f7f7] p-6 border border-[#c3c4c7]">
        <div className="flex items-center justify-between mb-4">
           <div>
              <h3 className="text-[11px] font-bold text-[#646970] uppercase tracking-widest mb-1">
                Phase {currentStep + 1} of {steps.length}
              </h3>
              <h2 className="text-[20px] font-bold text-[#1d2327]">{activeStep?.title}</h2>
           </div>
           <div className="flex gap-1">
             {steps.map((_, i) => (
               <div key={i} className={`w-8 h-1 ${i <= currentStep ? 'bg-[#2271b1]' : 'bg-[#c3c4c7]'}`} />
             ))}
           </div>
        </div>
        <p className="text-[13px] text-[#646970] leading-relaxed">{activeStep?.description}</p>
      </div>

      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="space-y-10"
          >
            {/* HERO SECTION */}
            {activeTab === "hero" && (
              <>
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Hero Badge</label>
                      <input type="text" value={data.hero?.badge || ""} onChange={(e) => updateSection("hero", "badge", e.target.value)} className={UI.input} />
                    </div>
                    <div className="space-y-4">
                      <label className={UI.label}>Main Headline Stack (Animated Lines)</label>
                      <div className="space-y-3">
                        {(data.hero?.headlines || []).map((h: any, i: number) => (
                          <div key={i} className="flex gap-2">
                            <input type="text" value={h.text} onChange={(e) => {
                              const newH = [...data.hero.headlines]; newH[i].text = e.target.value; updateSection("hero", "headlines", newH);
                            }} className={UI.input + " flex-1"} />
                            <button onClick={() => {
                              const newH = [...data.hero.headlines]; newH[i].highlight = !newH[i].highlight; updateSection("hero", "headlines", newH);
                            }} className={`px-4 text-[11px] font-bold border ${h.highlight ? 'bg-[#2271b1] text-white border-[#2271b1]' : 'bg-white text-[#646970] border-[#c3c4c7]'}`}>
                              {h.highlight ? 'Blue Highlight' : 'Plain Text'}
                            </button>
                            <button onClick={() => {
                              const newH = data.hero.headlines.filter((_: any, idx: number) => idx !== i); updateSection("hero", "headlines", newH);
                            }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <button onClick={() => updateSection("hero", "headlines", [...(data.hero?.headlines || []), { text: "", highlight: false }])} className="text-[#2271b1] text-[12px] font-bold hover:underline uppercase">+ Add New Headline Line</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-1.5">
                    <label className={UI.label}>Hero Description Paragraph</label>
                    <textarea value={data.hero?.description || ""} onChange={(e) => updateSection("hero", "description", e.target.value)} rows={10} className={UI.textarea} />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <ImageField 
                       label="Hero Background Media" 
                       value={data.hero?.images?.[0] || ""} 
                       onChange={(url) => {
                         const imgs = [...(data.hero?.images || [])]; imgs[0] = url; updateSection("hero", "images", imgs);
                       }} 
                    />
                    <div className="space-y-1.5">
                       <label className={UI.label}>Image Alt Text (SEO)</label>
                       <input type="text" value={data.hero?.bgImageAlt || ""} onChange={(e) => updateSection("hero", "bgImageAlt", e.target.value)} className={UI.input} />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <label className={UI.label}>Primary Action Buttons</label>
                    <div className="space-y-6">
                      {(data.hero?.buttons || []).map((btn: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4"}>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className={UI.label}>Button Label</label>
                              <input type="text" value={btn.text} onChange={(e) => {
                                const newB = [...data.hero.buttons]; newB[i].text = e.target.value; updateSection("hero", "buttons", newB);
                              }} className={UI.input} />
                            </div>
                            <div className="space-y-1.5">
                              <label className={UI.label}>Link Destination (URL)</label>
                              <input type="text" value={btn.href} onChange={(e) => {
                                const newB = [...data.hero.buttons]; newB[i].href = e.target.value; updateSection("hero", "buttons", newB);
                              }} className={UI.input} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between border-t border-[#f0f0f1] pt-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={btn.primary} onChange={(e) => {
                                const newB = [...data.hero.buttons]; newB[i].primary = e.target.checked; updateSection("hero", "buttons", newB);
                              }} />
                              <span className="text-[13px] text-[#1d2327]">Highlight this button (Blue Style)</span>
                            </label>
                            <button onClick={() => {
                              const newB = data.hero.buttons.filter((_: any, idx: number) => idx !== i); updateSection("hero", "buttons", newB);
                            }} className="text-[#d63638] text-[12px] font-bold hover:underline">Remove Button</button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => updateSection("hero", "buttons", [...(data.hero?.buttons || []), { text: "", href: "", primary: false }])} className={UI.buttonAdd}>+ Add New Call-to-Action Button</button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <label className={UI.label}>Quick Hero Metrics</label>
                    <div className="grid grid-cols-2 gap-4">
                      {(data.hero?.stats || []).map((s: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4 relative group"}>
                          <div className="grid grid-cols-2 gap-3">
                             <div className="space-y-1.5">
                               <label className={UI.label}>Stat Value</label>
                               <input type="text" value={s.value} onChange={(e) => {
                                 const newS = [...data.hero.stats]; newS[i].value = e.target.value; updateSection("hero", "stats", newS);
                               }} className={UI.inputLarge} placeholder="e.g. 500+" />
                             </div>
                             <div className="space-y-1.5">
                               <label className={UI.label}>Stat Label</label>
                               <input type="text" value={s.label} onChange={(e) => {
                                 const newS = [...data.hero.stats]; newS[i].label = e.target.value; updateSection("hero", "stats", newS);
                               }} className={UI.input} placeholder="Happy Clients" />
                             </div>
                          </div>
                          <IconSelector label="Representative Icon" value={s.icon} onChange={(val) => {
                             const newS = [...data.hero.stats]; newS[i].icon = val; updateSection("hero", "stats", newS);
                          }} />
                          <button onClick={() => {
                             const newS = data.hero.stats.filter((_: any, idx: number) => idx !== i); updateSection("hero", "stats", newS);
                          }} className="text-[#d63638] text-[11px] font-bold hover:underline">Remove Stat</button>
                        </div>
                      ))}
                      <button onClick={() => updateSection("hero", "stats", [...(data.hero?.stats || []), { label: "", value: "", icon: "Shield" }])} className={UI.buttonAdd}>+ Add New Trust Metric</button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ABOUT SECTION */}
            {activeTab === "about" && (
              <>
                {currentStep === 0 && (
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                         <label className={UI.label}>Section Context Badge</label>
                         <input type="text" value={data.about?.badge || ""} onChange={(e) => updateSection("about", "badge", e.target.value)} className={UI.input} />
                      </div>
                      <div className="space-y-2">
                         <label className={UI.label}>Section Headline Split (Prefix | Highlight | Suffix)</label>
                         <div className="grid grid-cols-3 gap-3">
                            <input type="text" value={data.about?.headline?.prefix} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, prefix: e.target.value })} className={UI.input} placeholder="Prefix" />
                            <input type="text" value={data.about?.headline?.highlight} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, highlight: e.target.value })} className={UI.input + " font-bold border-[#2271b1]"} placeholder="Highlight" />
                            <input type="text" value={data.about?.headline?.suffix} onChange={(e) => updateSection("about", "headline", { ...data.about.headline, suffix: e.target.value })} className={UI.input} placeholder="Suffix" />
                         </div>
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <div className="space-y-1.5">
                      <label className={UI.label}>Core Brand Narrative</label>
                      <textarea value={data.about?.description} onChange={(e) => updateSection("about", "description", e.target.value)} rows={12} className={UI.textarea} />
                   </div>
                )}
                {currentStep === 2 && (
                   <div className="space-y-6">
                      <ImageField 
                         label="About Visual Image" 
                         value={data.about?.image?.src} 
                         onChange={(url) => updateSection("about", "image", { ...data.about.image, src: url })} 
                      />
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                            <label className={UI.label}>Image Alt Text (SEO)</label>
                            <input type="text" value={data.about?.image?.alt || ""} onChange={(e) => updateSection("about", "image", { ...data.about.image, alt: e.target.value })} className={UI.input} />
                         </div>
                         <div className="space-y-1.5">
                            <label className={UI.label}>Floating Decorative Badge</label>
                            <input type="text" value={data.about?.image?.badge || ""} onChange={(e) => updateSection("about", "image", { ...data.about.image, badge: e.target.value })} className={UI.input} placeholder="e.g. EST. 2010" />
                         </div>
                      </div>
                   </div>
                )}
                {currentStep === 3 && (
                   <div className="space-y-4">
                      <label className={UI.label}>Value Proposition Keywords</label>
                      <div className="flex flex-wrap gap-2">
                         {(data.about?.coreValues || []).map((v: string, i: number) => (
                           <div key={i} className="flex items-center gap-2 bg-white border border-[#c3c4c7] px-3 py-1.5">
                              <input type="text" value={v} onChange={(e) => {
                                 const newV = [...data.about.coreValues]; newV[i] = e.target.value; updateSection("about", "coreValues", newV);
                              }} className="bg-transparent border-none text-[13px] outline-none min-w-[120px]" />
                              <button onClick={() => {
                                 const newV = data.about.coreValues.filter((_: any, idx: number) => idx !== i); updateSection("about", "coreValues", newV);
                              }} className="text-[#d63638]"><Trash2 className="w-3.5 h-3.5" /></button>
                           </div>
                         ))}
                         <button onClick={() => updateSection("about", "coreValues", [...(data.about?.coreValues || []), "New Value"])} className="text-[#2271b1] text-[12px] font-bold hover:underline uppercase">+ Add New Label</button>
                      </div>
                   </div>
                )}
              </>
            )}

            {/* SERVICES SECTION */}
            {activeTab === "services" && (
              <>
                {currentStep === 0 && (
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                         <label className={UI.label}>Section Badge</label>
                         <input type="text" value={data.services?.badge} onChange={(e) => updateSection("services", "badge", e.target.value)} className={UI.input} />
                      </div>
                      <div className="space-y-2">
                         <label className={UI.label}>Headline Split</label>
                         <div className="grid grid-cols-3 gap-2">
                            <input type="text" value={data.services?.headline?.prefix} onChange={(e) => updateSection("services", "headline", { ...data.services.headline, prefix: e.target.value })} className={UI.input} />
                            <input type="text" value={data.services?.headline?.highlight} onChange={(e) => updateSection("services", "headline", { ...data.services.headline, highlight: e.target.value })} className={UI.input + " font-bold border-[#2271b1]"} />
                            <input type="text" value={data.services?.headline?.suffix} onChange={(e) => updateSection("services", "headline", { ...data.services.headline, suffix: e.target.value })} className={UI.input} />
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className={UI.label}>Intro Narrative Paragraphs</label>
                         <div className="space-y-2">
                            {(data.services?.description || []).map((p: string, i: number) => (
                               <div key={i} className="flex gap-2">
                                  <textarea value={p} onChange={(e) => {
                                    const newD = [...data.services.description]; newD[i] = e.target.value; updateSection("services", "description", newD);
                                  }} rows={3} className={UI.textarea} />
                                  <button onClick={() => {
                                    const newD = data.services.description.filter((_: any, idx: number) => idx !== i); updateSection("services", "description", newD);
                                  }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                               </div>
                            ))}
                            <button onClick={() => updateSection("services", "description", [...(data.services?.description || []), ""])} className="text-[#2271b1] text-[12px] font-bold hover:underline uppercase">+ Add Paragraph</button>
                         </div>
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <div className="space-y-4">
                      <label className={UI.label}>Service Statistics Overlay</label>
                      <div className="grid grid-cols-3 gap-4">
                         {(data.services?.stats || []).map((s: any, i: number) => (
                            <div key={i} className={UI.card + " space-y-3"}>
                               <div className="space-y-1.5">
                                 <label className={UI.label}>Value</label>
                                 <input type="number" value={s.value} onChange={(e) => {
                                   const newS = [...data.services.stats]; newS[i].value = parseInt(e.target.value); updateSection("services", "stats", newS);
                                 }} className={UI.inputLarge} />
                               </div>
                               <div className="space-y-1.5">
                                 <label className={UI.label}>Label</label>
                                 <input type="text" value={s.label} onChange={(e) => {
                                   const newS = [...data.services.stats]; newS[i].label = e.target.value; updateSection("services", "stats", newS);
                                 }} className={UI.input} placeholder="Stat Label" />
                               </div>
                               <button onClick={() => {
                                 const newS = data.services.stats.filter((_: any, idx: number) => idx !== i); updateSection("services", "stats", newS);
                               }} className="text-[#d63638] text-[11px] font-bold hover:underline">Remove</button>
                            </div>
                         ))}
                         <button onClick={() => updateSection("services", "stats", [...(data.services?.stats || []), { value: 0, label: "", suffix: "+" }])} className={UI.buttonAdd}>+ Add Stat</button>
                      </div>
                   </div>
                )}
                {currentStep === 2 && (
                   <ContentSelector type="services" label="Showcase Specific Services" selectedItems={data.services?.services} onSelect={(items) => updateSection("services", "services", items)} />
                )}
              </>
            )}

            {/* WHY CHOOSE US */}
            {activeTab === "whyChooseUs" && (
              <>
                {currentStep === 0 && (
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                         <label className={UI.label}>Badge</label>
                         <input type="text" value={data.whyChooseUs?.section?.badge} onChange={(e) => updateSection("whyChooseUs", "section", { ...data.whyChooseUs.section, badge: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Headline</label>
                         <input type="text" value={data.whyChooseUs?.section?.headline} onChange={(e) => updateSection("whyChooseUs", "section", { ...data.whyChooseUs.section, headline: e.target.value })} className={UI.inputLarge} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Intro Narrative</label>
                         <textarea value={data.whyChooseUs?.section?.description} onChange={(e) => updateSection("whyChooseUs", "section", { ...data.whyChooseUs.section, description: e.target.value })} rows={4} className={UI.textarea} />
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <div className="space-y-4">
                      <label className={UI.label}>Core Value Features</label>
                      <div className="grid grid-cols-2 gap-4">
                         {(data.whyChooseUs?.features || []).map((f: any, i: number) => (
                            <div key={i} className={UI.card + " space-y-4"}>
                               <div className="flex justify-between">
                                  <IconSelector label="Card Icon" value={f.icon} onChange={(val) => {
                                    const newF = [...data.whyChooseUs.features]; newF[i].icon = val; updateSection("whyChooseUs", "features", newF);
                                  }} />
                                  <button onClick={() => {
                                    const newF = data.whyChooseUs.features.filter((_: any, idx: number) => idx !== i); updateSection("whyChooseUs", "features", newF);
                                  }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                               </div>
                               <input type="text" value={f.title} onChange={(e) => {
                                 const newF = [...data.whyChooseUs.features]; newF[i].title = e.target.value; updateSection("whyChooseUs", "features", newF);
                               }} className={UI.input + " font-bold"} placeholder="Feature Title" />
                               <textarea value={f.description} onChange={(e) => {
                                 const newF = [...data.whyChooseUs.features]; newF[i].description = e.target.value; updateSection("whyChooseUs", "features", newF);
                               }} rows={3} className={UI.textarea} placeholder="Description..." />
                            </div>
                         ))}
                         <button onClick={() => updateSection("whyChooseUs", "features", [...(data.whyChooseUs?.features || []), { title: "", description: "", icon: "Star" }])} className={UI.buttonAdd}>+ Add Feature Card</button>
                      </div>
                   </div>
                )}
                {currentStep === 2 && (
                   <div className="space-y-4">
                      <label className={UI.label}>Section Metrics (Side-bar Stats)</label>
                      <div className="grid grid-cols-3 gap-4">
                         {(data.whyChooseUs?.stats || []).map((s: any, i: number) => (
                            <div key={i} className={UI.card + " space-y-3"}>
                               <input type="text" value={s.value} onChange={(e) => {
                                 const newS = [...data.whyChooseUs.stats]; newS[i].value = e.target.value; updateSection("whyChooseUs", "stats", newS);
                               }} className={UI.inputLarge} />
                               <input type="text" value={s.label} onChange={(e) => {
                                 const newS = [...data.whyChooseUs.stats]; newS[i].label = e.target.value; updateSection("whyChooseUs", "stats", newS);
                               }} className={UI.input} />
                               <button onClick={() => {
                                 const newS = data.whyChooseUs.stats.filter((_: any, idx: number) => idx !== i); updateSection("whyChooseUs", "stats", newS);
                               }} className="text-[#d63638] text-[11px] hover:underline">Remove</button>
                            </div>
                         ))}
                         <button onClick={() => updateSection("whyChooseUs", "stats", [...(data.whyChooseUs?.stats || []), { value: "", label: "", icon: "Check" }])} className={UI.buttonAdd}>+ Add Stat</button>
                      </div>
                   </div>
                )}
              </>
            )}

            {/* PORTFOLIO SECTION */}
            {activeTab === "portfolio" && (
              <>
                {currentStep === 0 && (
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                         <label className={UI.label}>Gallery Badge</label>
                         <input type="text" value={data.portfolio?.section?.badge} onChange={(e) => updateSection("portfolio", "section", { ...data.portfolio.section, badge: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Section Headline</label>
                         <input type="text" value={data.portfolio?.section?.headline} onChange={(e) => updateSection("portfolio", "section", { ...data.portfolio.section, headline: e.target.value })} className={UI.inputLarge} />
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <ContentSelector type="projects" label="Featured Portfolio Projects" selectedItems={data.portfolio?.projects} onSelect={(items) => updateSection("portfolio", "projects", items)} />
                )}
                {currentStep === 2 && (
                   <div className={UI.card + " grid grid-cols-2 gap-4"}>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Main Gallery Button Text</label>
                         <input type="text" value={data.portfolio?.button?.text} onChange={(e) => updateSection("portfolio", "button", { ...data.portfolio.button, text: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Button Link</label>
                         <input type="text" value={data.portfolio?.button?.link} onChange={(e) => updateSection("portfolio", "button", { ...data.portfolio.button, link: e.target.value })} className={UI.input} />
                      </div>
                   </div>
                )}
              </>
            )}

            {/* TESTIMONIALS SECTION */}
            {activeTab === "testimonials" && (
              <>
                {currentStep === 0 && (
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                         <label className={UI.label}>Section Badge</label>
                         <input type="text" value={data.testimonials?.section?.badge} onChange={(e) => updateSection("testimonials", "section", { ...data.testimonials.section, badge: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Headline</label>
                         <input type="text" value={data.testimonials?.section?.headline} onChange={(e) => updateSection("testimonials", "section", { ...data.testimonials.section, headline: e.target.value })} className={UI.inputLarge} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Verification/Featured Seal (e.g. Verified Client Reviews)</label>
                         <input type="text" value={data.testimonials?.section?.featured} onChange={(e) => updateSection("testimonials", "section", { ...data.testimonials.section, featured: e.target.value })} className={UI.input} />
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <ContentSelector type="reviews" label="Manage Client Reviews" selectedItems={data.testimonials?.testimonials} onSelect={(items) => updateSection("testimonials", "testimonials", items)} />
                )}
                {currentStep === 2 && (
                   <div className="space-y-1.5 max-w-sm">
                      <label className={UI.label}>Global Subscriber/Happy Client Count</label>
                      <input type="text" value={data.testimonials?.stats?.subscribers} onChange={(e) => updateSection("testimonials", "stats", { ...data.testimonials.stats, subscribers: e.target.value })} className={UI.inputLarge} placeholder="e.g. 5,000+" />
                   </div>
                )}
              </>
            )}

            {/* FAQ SECTION */}
            {activeTab === "faq" && (
              <>
                {currentStep === 0 && (
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                         <label className={UI.label}>FAQ Badge</label>
                         <input type="text" value={data.faq?.section?.badge} onChange={(e) => updateSection("faq", "section", { ...data.faq.section, badge: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Main Support Headline</label>
                         <input type="text" value={data.faq?.section?.headline} onChange={(e) => updateSection("faq", "section", { ...data.faq.section, headline: e.target.value })} className={UI.inputLarge} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Section Intro Narrative</label>
                         <textarea value={data.faq?.section?.description} onChange={(e) => updateSection("faq", "section", { ...data.faq.section, description: e.target.value })} rows={4} className={UI.textarea} />
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <ContentSelector type="faq" label="Curate FAQ Question Library" selectedItems={data.faq?.questions} onSelect={(items) => updateSection("faq", "questions", items)} />
                )}
              </>
            )}

            {/* QUOTE SECTION */}
            {activeTab === "quote" && (
              <>
                {currentStep === 0 && (
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                         <label className={UI.label}>Form Branding Badge</label>
                         <input type="text" value={data.quote?.section?.badge} onChange={(e) => updateSection("quote", "section", { ...data.quote.section, badge: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Main Call-to-Action Headline</label>
                         <input type="text" value={data.quote?.section?.headline} onChange={(e) => updateSection("quote", "section", { ...data.quote.section, headline: e.target.value })} className={UI.inputLarge} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Intro Description</label>
                         <textarea value={data.quote?.section?.description} onChange={(e) => updateSection("quote", "section", { ...data.quote.section, description: e.target.value })} rows={4} className={UI.textarea} />
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <div className={UI.card + " space-y-6"}>
                      <label className={UI.sectionHeader}>Post-Submission Flow</label>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Success Title</label>
                         <input type="text" value={data.quote?.success?.title} onChange={(e) => updateSection("quote", "success", { ...data.quote.success, title: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Success Narrative Message</label>
                         <textarea value={data.quote?.success?.message} onChange={(e) => updateSection("quote", "success", { ...data.quote.success, message: e.target.value })} rows={4} className={UI.textarea} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Return Button Text</label>
                         <input type="text" value={data.quote?.success?.buttonText} onChange={(e) => updateSection("quote", "success", { ...data.quote.success, buttonText: e.target.value })} className={UI.input} />
                      </div>
                   </div>
                )}
                {currentStep === 2 && (
                   <div className="space-y-8">
                      <div className="space-y-4">
                         <label className={UI.label}>Form Project Type Options</label>
                         <div className="grid grid-cols-2 gap-3">
                            {(data.quote?.services || []).map((s: any, i: number) => (
                              <div key={i} className="flex gap-2 bg-[#f6f7f7] p-2 border border-[#c3c4c7]">
                                 <input type="text" value={s.title} onChange={(e) => {
                                   const newS = [...data.quote.services]; newS[i].title = e.target.value; updateSection("quote", "services", newS);
                                 }} className="flex-1 bg-transparent border-none outline-none text-[13px] font-bold" />
                                 <button onClick={() => {
                                   const newS = data.quote.services.filter((_: any, idx: number) => idx !== i); updateSection("quote", "services", newS);
                                 }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            ))}
                            <button onClick={() => updateSection("quote", "services", [...(data.quote?.services || []), { title: "New Service", id: Date.now() }])} className="text-[#2271b1] text-[12px] font-bold hover:underline uppercase">+ Add Option</button>
                         </div>
                      </div>
                      <div className="space-y-4 pt-6 border-t border-[#f0f0f1]">
                         <label className={UI.label}>Form Timeline Select Options</label>
                         <div className="grid grid-cols-2 gap-3">
                            {(data.quote?.timelines || []).map((t: any, i: number) => (
                              <div key={i} className="flex gap-2 bg-[#f6f7f7] p-2 border border-[#c3c4c7]">
                                 <input type="text" value={t.label} onChange={(e) => {
                                   const newT = [...data.quote.timelines]; newT[i].label = e.target.value; updateSection("quote", "timelines", newT);
                                 }} className="flex-1 bg-transparent border-none outline-none text-[13px] font-bold" />
                                 <button onClick={() => {
                                   const newT = data.quote.timelines.filter((_: any, idx: number) => idx !== i); updateSection("quote", "timelines", newT);
                                 }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            ))}
                            <button onClick={() => updateSection("quote", "timelines", [...(data.quote?.timelines || []), { label: "Immediate", value: "immediate" }])} className="text-[#2271b1] text-[12px] font-bold hover:underline uppercase">+ Add Timeline</button>
                         </div>
                      </div>
                   </div>
                )}
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="mt-12 pt-6 border-t border-[#c3c4c7] flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold transition-all ${currentStep === 0 ? 'text-slate-300 pointer-events-none' : 'text-[#2271b1] hover:text-[#135e96]'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Phase
        </button>

        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full border transition-all ${i === currentStep ? 'bg-[#2271b1] border-[#2271b1]' : 'bg-white border-[#c3c4c7]'}`} />
          ))}
        </div>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
            className="flex items-center gap-2 bg-[#2271b1] text-white px-8 py-2.5 rounded-sm text-[13px] font-bold hover:bg-[#135e96] transition-all shadow-sm"
          >
            Next Phase
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-[#646970] text-[13px] font-bold bg-[#f6f7f7] px-6 py-2.5 border border-[#c3c4c7]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Config Complete
          </div>
        )}
      </div>
    </div>
  );
}
