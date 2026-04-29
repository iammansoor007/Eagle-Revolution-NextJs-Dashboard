"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutTemplate, Type, Image as ImageIcon, 
  Plus, Trash2, Loader2, ArrowRight, ArrowLeft,
  CheckCircle2, Target, Shield, Mail, X
} from "lucide-react";
import IconSelector from "@/components/admin/IconSelector";
import ImageField from "@/components/admin/ImageField";
import { UI } from "./styles";

export default function AboutEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         aboutPage: {
           hero: { badge: "", headline: { line1: "", line2: "", line3: "" }, description: "", cta: "", ctaLink: "", bgImage: "", bgImageAlt: "", trustLabel: "", stats: [], phone: "", phoneLabel: "" },
           story: { badge: "", headline: "", highlight: "", description: "", portrait: { image: "", imageAlt: "", badgeLeft: "", badgeRight: "" }, founder: { name: "", title: "", quote: "", bio: [], linkedin: "", email: "" } },
           mission: { badge: "", headline: "", description: "", stats: [], principles: [] },
           stats: { badge: "", headline: "", description: "", items: [] },
           recognition: [],
           cta: { badge: "", headline: "", highlight: "", description: "", buttonText: "", buttonLink: "", phone: "", phoneLabel: "", bgImage: "" }
         }
       });
    }
  }, [data, setData]);

  useEffect(() => {
    setCurrentStep(0);
  }, [activeTab]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const updateAbout = (section: string, field: string | null, value: any) => {
    const currentData = data.aboutPage || {};
    const targetSectionData = currentData[section as keyof typeof currentData] || {};

    setData({
      ...data,
      aboutPage: {
        ...currentData,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "hero", label: "Hero Canvas" },
    { id: "story", label: "Brand Story" },
    { id: "mission", label: "Mission & Values" },
    { id: "stats", label: "Impact Stats" },
    { id: "cta", label: "Final CTA" },
  ];

  const sectionSteps: Record<string, { title: string, description: string }[]> = {
    hero: [
      { title: "Branding Badge", description: "Badge that appears at the top of the page." },
      { title: "Headline Stack", description: "3-line headline for the hero section." },
      { title: "Narrative", description: "Primary introductory description." },
      { title: "Action Button", description: "Main CTA button and link." },
      { title: "Visual & SEO", description: "Background image and metadata." },
      { title: "Metrics & Trust", description: "Achievements and trust label." },
      { title: "Contact Vitals", description: "Phone number and direct label." }
    ],
    story: [
      { title: "Story Branding", description: "Badge and main title for history section." },
      { title: "Introduction", description: "Highlight text and story narrative." },
      { title: "Portrait & SEO", description: "Founder image and alt text." },
      { title: "Founder Badges", description: "Decorative badges on portrait sides." },
      { title: "Bio & Quote", description: "Founder history and featured quote." },
      { title: "Contact Vitals", description: "Personal details and social links." }
    ],
    mission: [
      { title: "Core Branding", description: "Badge, title, and intro description." },
      { title: "Impact Metrics", description: "Success numbers for this section." },
      { title: "Guiding Principles", description: "Value cards explaining your methodology." }
    ],
    stats: [
      { title: "Section Header", description: "Branding and intro narrative." },
      { title: "Numerical Counters", description: "Trust metrics and impact counters." },
      { title: "Industry Recognition", description: "Award labels and recognition." }
    ],
    cta: [
      { title: "Exit Narrative", description: "Badge, title, and closing story." },
      { title: "Actions & Visual", description: "Final button and background media." },
      { title: "Direct Contact", description: "Phone and label for the footer." }
    ]
  };

  const steps = sectionSteps[activeTab] || [];
  const activeStep = steps[currentStep];

  return (
    <div className="bg-white max-w-4xl mx-auto">
      {/* WP Tabs */}
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
                   <div className="space-y-1.5">
                      <label className={UI.label}>Section Context Badge</label>
                      <input type="text" value={data.aboutPage?.hero?.badge || ""} onChange={(e) => updateAbout("hero", "badge", e.target.value)} className={UI.input} />
                   </div>
                )}
                {currentStep === 1 && (
                   <div className="space-y-4">
                      <label className={UI.label}>Headline Triple-Stack</label>
                      <div className="space-y-3">
                        <div className="space-y-1">
                           <label className="text-[11px] text-[#646970] font-bold">Line 1 (Intro)</label>
                           <input type="text" value={data.aboutPage?.hero?.headline?.line1} onChange={(e) => updateAbout("hero", "headline", { ...data.aboutPage.hero.headline, line1: e.target.value })} className={UI.input} />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] text-[#646970] font-bold">Line 2 (Featured Large)</label>
                           <input type="text" value={data.aboutPage?.hero?.headline?.line2} onChange={(e) => updateAbout("hero", "headline", { ...data.aboutPage.hero.headline, line2: e.target.value })} className={UI.input + " font-bold border-[#2271b1]"} />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] text-[#646970] font-bold">Line 3 (Suffix)</label>
                           <input type="text" value={data.aboutPage?.hero?.headline?.line3} onChange={(e) => updateAbout("hero", "headline", { ...data.aboutPage.hero.headline, line3: e.target.value })} className={UI.input} />
                        </div>
                      </div>
                   </div>
                )}
                {currentStep === 2 && (
                   <div className="space-y-1.5">
                      <label className={UI.label}>Intro Narrative Paragraph</label>
                      <textarea value={data.aboutPage?.hero?.description} onChange={(e) => updateAbout("hero", "description", e.target.value)} rows={10} className={UI.textarea} />
                   </div>
                )}
                {currentStep === 3 && (
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className={UI.label}>CTA Button Label</label>
                        <input type="text" value={data.aboutPage?.hero?.cta} onChange={(e) => updateAbout("hero", "cta", e.target.value)} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Link Destination (URL)</label>
                        <input type="text" value={data.aboutPage?.hero?.ctaLink} onChange={(e) => updateAbout("hero", "ctaLink", e.target.value)} className={UI.input} />
                      </div>
                   </div>
                )}
                {currentStep === 4 && (
                   <div className="space-y-6">
                      <ImageField label="Cinematic Background Media" value={data.aboutPage?.hero?.bgImage} onChange={(url) => updateAbout("hero", "bgImage", url)} />
                      <div className="space-y-1.5">
                         <label className={UI.label}>Image Alt Text (SEO)</label>
                         <input type="text" value={data.aboutPage?.hero?.bgImageAlt || ""} onChange={(e) => updateAbout("hero", "bgImageAlt", e.target.value)} className={UI.input} />
                      </div>
                   </div>
                )}
                {currentStep === 5 && (
                   <div className="space-y-8">
                      <div className="space-y-1.5 max-w-sm">
                         <label className={UI.label}>Section Trust Badge Label</label>
                         <input type="text" value={data.aboutPage?.hero?.trustLabel} onChange={(e) => updateAbout("hero", "trustLabel", e.target.value)} className={UI.input} placeholder="e.g. 5.0 Rating on Google" />
                      </div>
                      <div className="space-y-4">
                         <label className={UI.label}>Performance Metrics</label>
                         <div className="grid grid-cols-2 gap-4">
                            {(data.aboutPage?.hero?.stats || []).map((s: any, i: number) => (
                              <div key={i} className={UI.card + " space-y-4"}>
                                 <div className="grid grid-cols-2 gap-2">
                                   <input type="text" value={s.val} onChange={(e) => {
                                     const newS = [...data.aboutPage.hero.stats]; newS[i].val = e.target.value; updateAbout("hero", "stats", newS);
                                   }} className={UI.inputLarge} />
                                   <input type="text" value={s.label} onChange={(e) => {
                                     const newS = [...data.aboutPage.hero.stats]; newS[i].label = e.target.value; updateAbout("hero", "stats", newS);
                                   }} className={UI.input} />
                                 </div>
                                 <IconSelector label="Icon" value={s.icon} onChange={(val) => {
                                    const newS = [...data.aboutPage.hero.stats]; newS[i].icon = val; updateAbout("hero", "stats", newS);
                                 }} />
                                 <button onClick={() => {
                                   const newS = data.aboutPage.hero.stats.filter((_: any, idx: number) => idx !== i); updateAbout("hero", "stats", newS);
                                 }} className="text-[#d63638] text-[11px] font-bold hover:underline">Remove Stat</button>
                              </div>
                            ))}
                            <button onClick={() => updateAbout("hero", "stats", [...(data.aboutPage?.hero?.stats || []), { label: "", val: "", icon: "Shield" }])} className={UI.buttonAdd}>+ Add New Metric</button>
                         </div>
                      </div>
                   </div>
                )}
                {currentStep === 6 && (
                   <div className={UI.card + " grid grid-cols-2 gap-4"}>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Contact Phone Number</label>
                        <input type="text" value={data.aboutPage?.hero?.phone} onChange={(e) => updateAbout("hero", "phone", e.target.value)} className={UI.inputLarge} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Phone Link Label</label>
                        <input type="text" value={data.aboutPage?.hero?.phoneLabel} onChange={(e) => updateAbout("hero", "phoneLabel", e.target.value)} className={UI.input} />
                      </div>
                   </div>
                )}
              </>
            )}

            {/* STORY SECTION */}
            {activeTab === "story" && (
              <>
                {currentStep === 0 && (
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className={UI.label}>Story Badge</label>
                         <input type="text" value={data.aboutPage?.story?.badge} onChange={(e) => updateAbout("story", "badge", e.target.value)} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Story Headline</label>
                         <input type="text" value={data.aboutPage?.story?.headline} onChange={(e) => updateAbout("story", "headline", e.target.value)} className={UI.inputLarge} />
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                         <label className={UI.label}>Narrative Highlight Label</label>
                         <input type="text" value={data.aboutPage?.story?.highlight} onChange={(e) => updateAbout("story", "highlight", e.target.value)} className={UI.input + " font-bold border-[#2271b1]"} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Story Introduction Paragraph</label>
                         <textarea value={data.aboutPage?.story?.description} onChange={(e) => updateAbout("story", "description", e.target.value)} rows={6} className={UI.textarea} />
                      </div>
                   </div>
                )}
                {currentStep === 2 && (
                   <div className="space-y-6">
                      <ImageField label="Founder Portrait" value={data.aboutPage?.story?.portrait?.image} onChange={(url) => updateAbout("story", "portrait", { ...data.aboutPage.story.portrait, image: url })} />
                      <div className="space-y-1.5">
                         <label className={UI.label}>Portrait Alt Text (SEO)</label>
                         <input type="text" value={data.aboutPage?.story?.portrait?.imageAlt || ""} onChange={(e) => updateAbout("story", "portrait", { ...data.aboutPage.story.portrait, imageAlt: e.target.value })} className={UI.input} />
                      </div>
                   </div>
                )}
                {currentStep === 3 && (
                   <div className={UI.card + " grid grid-cols-2 gap-4"}>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Left Floating Badge</label>
                         <input type="text" value={data.aboutPage?.story?.portrait?.badgeLeft} onChange={(e) => updateAbout("story", "portrait", { ...data.aboutPage.story.portrait, badgeLeft: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Right Floating Badge</label>
                         <input type="text" value={data.aboutPage?.story?.portrait?.badgeRight} onChange={(e) => updateAbout("story", "portrait", { ...data.aboutPage.story.portrait, badgeRight: e.target.value })} className={UI.input} />
                      </div>
                   </div>
                )}
                {currentStep === 4 && (
                   <div className="space-y-6">
                      <div className="space-y-4">
                         <label className={UI.label}>Founder Full Biography (Segmented)</label>
                         <div className="space-y-3">
                            {(data.aboutPage?.story?.founder?.bio || []).map((p: string, i: number) => (
                               <div key={i} className="flex gap-2">
                                  <textarea value={p} onChange={(e) => {
                                    const newB = [...data.aboutPage.story.founder.bio]; newB[i] = e.target.value; updateAbout("story", "founder", { ...data.aboutPage.story.founder, bio: newB });
                                  }} className={UI.textarea} rows={4} />
                                  <button onClick={() => {
                                    const newB = data.aboutPage.story.founder.bio.filter((_: any, idx: number) => idx !== i); updateAbout("story", "founder", { ...data.aboutPage.story.founder, bio: newB });
                                  }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                               </div>
                            ))}
                            <button onClick={() => updateAbout("story", "founder", { ...data.aboutPage.story.founder, bio: [...(data.aboutPage.story.founder.bio || []), ""] })} className={UI.buttonAdd}>+ Add Bio Segment</button>
                         </div>
                      </div>
                      <div className="space-y-1.5 pt-6 border-t border-[#f0f0f1]">
                         <label className={UI.label}>Featured Founder Quote</label>
                         <textarea value={data.aboutPage?.story?.founder?.quote} onChange={(e) => updateAbout("story", "founder", { ...data.aboutPage.story.founder, quote: e.target.value })} rows={3} className={UI.textarea} />
                      </div>
                   </div>
                )}
                {currentStep === 5 && (
                   <div className={UI.card + " grid grid-cols-2 gap-6"}>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Founder Name</label>
                         <input type="text" value={data.aboutPage?.story?.founder?.name} onChange={(e) => updateAbout("story", "founder", { ...data.aboutPage.story.founder, name: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Professional Title</label>
                         <input type="text" value={data.aboutPage?.story?.founder?.title} onChange={(e) => updateAbout("story", "founder", { ...data.aboutPage.story.founder, title: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>LinkedIn Profile URL</label>
                         <input type="text" value={data.aboutPage?.story?.founder?.linkedin} onChange={(e) => updateAbout("story", "founder", { ...data.aboutPage.story.founder, linkedin: e.target.value })} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Contact Email</label>
                         <input type="text" value={data.aboutPage?.story?.founder?.email} onChange={(e) => updateAbout("story", "founder", { ...data.aboutPage.story.founder, email: e.target.value })} className={UI.input} />
                      </div>
                   </div>
                )}
              </>
            )}

            {/* MISSION SECTION */}
            {activeTab === "mission" && (
              <>
                {currentStep === 0 && (
                   <div className={UI.card + " space-y-6"}>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Mission Badge</label>
                         <input type="text" value={data.aboutPage?.mission?.badge} onChange={(e) => updateAbout("mission", "badge", e.target.value)} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Mission Headline</label>
                         <input type="text" value={data.aboutPage?.mission?.headline} onChange={(e) => updateAbout("mission", "headline", e.target.value)} className={UI.inputLarge} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Mission Description Narrative</label>
                         <textarea value={data.aboutPage?.mission?.description} onChange={(e) => updateAbout("mission", "description", e.target.value)} rows={6} className={UI.textarea} />
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <div className="space-y-4">
                      <label className={UI.label}>Impact Metrics</label>
                      <div className="grid grid-cols-3 gap-4">
                         {(data.aboutPage?.mission?.stats || []).map((s: any, i: number) => (
                            <div key={i} className={UI.card + " space-y-3"}>
                               <input type="text" value={s.value} onChange={(e) => {
                                 const newS = [...data.aboutPage.mission.stats]; newS[i].value = e.target.value; updateAbout("mission", "stats", newS);
                               }} className={UI.inputLarge} />
                               <input type="text" value={s.label} onChange={(e) => {
                                 const newS = [...data.aboutPage.mission.stats]; newS[i].label = e.target.value; updateAbout("mission", "stats", newS);
                               }} className={UI.input} />
                               <button onClick={() => {
                                 const newS = data.aboutPage.mission.stats.filter((_: any, idx: number) => idx !== i); updateAbout("mission", "stats", newS);
                               }} className="text-[#d63638] text-[11px] font-bold hover:underline">Remove</button>
                            </div>
                         ))}
                         <button onClick={() => updateAbout("mission", "stats", [...(data.aboutPage?.mission?.stats || []), { value: "", label: "" }])} className={UI.buttonAdd}>+ Add Stat</button>
                      </div>
                   </div>
                )}
                {currentStep === 2 && (
                   <div className="space-y-4">
                      <label className={UI.label}>Core Guiding Principles (Cards)</label>
                      <div className="grid grid-cols-2 gap-4">
                         {(data.aboutPage?.mission?.principles || []).map((p: any, i: number) => (
                           <div key={i} className={UI.card + " space-y-4 relative group"}>
                              <div className="flex justify-between">
                                 <IconSelector label="Icon" value={p.icon} onChange={(val) => {
                                    const newP = [...data.aboutPage.mission.principles]; newP[i].icon = val; updateAbout("mission", "principles", newP);
                                 }} />
                                 <button onClick={() => {
                                    const newP = data.aboutPage.mission.principles.filter((_: any, idx: number) => idx !== i); updateAbout("mission", "principles", newP);
                                 }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                 <input type="text" value={p.title} onChange={(e) => {
                                    const newP = [...data.aboutPage.mission.principles]; newP[i].title = e.target.value; updateAbout("mission", "principles", newP);
                                 }} className={UI.input + " font-bold"} placeholder="Principle Title" />
                                 <textarea value={p.desc} onChange={(e) => {
                                    const newP = [...data.aboutPage.mission.principles]; newP[i].desc = e.target.value; updateAbout("mission", "principles", newP);
                                 }} rows={3} className={UI.textarea} placeholder="Description..." />
                              </div>
                           </div>
                         ))}
                         <button onClick={() => updateAbout("mission", "principles", [...(data.aboutPage?.mission?.principles || []), { title: "", desc: "", icon: "Zap", val: "" }])} className={UI.buttonAdd}>+ Add Principle Card</button>
                      </div>
                   </div>
                )}
              </>
            )}

            {/* STATS SECTION */}
            {activeTab === "stats" && (
              <>
                {currentStep === 0 && (
                   <div className={UI.card + " space-y-6"}>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Stats Badge</label>
                         <input type="text" value={data.aboutPage?.stats?.badge} onChange={(e) => updateAbout("stats", "badge", e.target.value)} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Stats Main Headline</label>
                         <input type="text" value={data.aboutPage?.stats?.headline} onChange={(e) => updateAbout("stats", "headline", e.target.value)} className={UI.inputLarge} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Intro Narrative</label>
                         <textarea value={data.aboutPage?.stats?.description} onChange={(e) => updateAbout("stats", "description", e.target.value)} rows={6} className={UI.textarea} />
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <div className="grid grid-cols-2 gap-4">
                      {(data.aboutPage?.stats?.items || []).map((s: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-3"}>
                           <div className="flex justify-between">
                              <IconSelector label="Icon" value={s.icon} onChange={(val) => {
                                 const newI = [...data.aboutPage.stats.items]; newI[i].icon = val; updateAbout("stats", "items", newI);
                              }} />
                              <button onClick={() => {
                                 const newI = data.aboutPage.stats.items.filter((_: any, idx: number) => idx !== i); updateAbout("stats", "items", newI);
                              }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                              <input type="number" value={s.value} onChange={(e) => {
                                const newI = [...data.aboutPage.stats.items]; newI[i].value = parseInt(e.target.value); updateAbout("stats", "items", newI);
                              }} className={UI.inputLarge} />
                              <input type="text" value={s.suffix} onChange={(e) => {
                                const newI = [...data.aboutPage.stats.items]; newI[i].suffix = e.target.value; updateAbout("stats", "items", newI);
                              }} className={UI.input} placeholder="Suffix (+)" />
                           </div>
                           <input type="text" value={s.label} onChange={(e) => {
                              const newI = [...data.aboutPage.stats.items]; newI[i].label = e.target.value; updateAbout("stats", "items", newI);
                           }} className={UI.input} />
                        </div>
                      ))}
                      <button onClick={() => updateAbout("stats", "items", [...(data.aboutPage?.stats?.items || []), { value: 0, label: "", suffix: "+", icon: "Shield", description: "" }])} className={UI.buttonAdd}>+ Add Counter</button>
                   </div>
                )}
                {currentStep === 2 && (
                   <div className="space-y-4">
                      <label className={UI.label}>Industry Recognition Library</label>
                      <div className="flex flex-wrap gap-2">
                        {(data.aboutPage?.recognition || []).map((r: string, i: number) => (
                           <div key={i} className="flex items-center gap-2 bg-white border border-[#c3c4c7] px-3 py-1.5">
                              <input type="text" value={r} onChange={(e) => {
                                 const newR = [...data.aboutPage.recognition]; newR[i] = e.target.value; updateAbout("recognition", null, newR);
                              }} className="bg-transparent border-none text-[13px] outline-none min-w-[150px]" />
                              <button onClick={() => {
                                 const newR = data.aboutPage.recognition.filter((_: any, idx: number) => idx !== i); updateAbout("recognition", null, newR);
                              }} className="text-[#d63638]"><Trash2 className="w-3.5 h-3.5" /></button>
                           </div>
                        ))}
                        <button onClick={() => updateAbout("recognition", null, [...(data.aboutPage?.recognition || []), "New Recognition"])} className="text-[#2271b1] text-[12px] font-bold hover:underline uppercase">+ Add Recognition Label</button>
                      </div>
                   </div>
                )}
              </>
            )}

            {/* CTA SECTION */}
            {activeTab === "cta" && (
              <>
                {currentStep === 0 && (
                   <div className={UI.card + " space-y-6"}>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Final Exit Badge</label>
                         <input type="text" value={data.aboutPage?.cta?.badge} onChange={(e) => updateAbout("cta", "badge", e.target.value)} className={UI.input} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Main Exit Headline</label>
                         <input type="text" value={data.aboutPage?.cta?.headline} onChange={(e) => updateAbout("cta", "headline", e.target.value)} className={UI.inputLarge} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Exit Highlight Text</label>
                         <input type="text" value={data.aboutPage?.cta?.highlight} onChange={(e) => updateAbout("cta", "highlight", e.target.value)} className={UI.input + " font-bold border-[#2271b1]"} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Final Description Narrative</label>
                         <textarea value={data.aboutPage?.cta?.description} onChange={(e) => updateAbout("cta", "description", e.target.value)} rows={6} className={UI.textarea} />
                      </div>
                   </div>
                )}
                {currentStep === 1 && (
                   <div className="space-y-10">
                      <div className="space-y-6">
                         <ImageField label="CTA Background Media" value={data.aboutPage?.cta?.bgImage} onChange={(url) => updateAbout("cta", "bgImage", url)} />
                      </div>
                      <div className={UI.card + " grid grid-cols-2 gap-4"}>
                         <div className="space-y-1.5">
                            <label className={UI.label}>Final Button Label</label>
                            <input type="text" value={data.aboutPage?.cta?.buttonText} onChange={(e) => updateAbout("cta", "buttonText", e.target.value)} className={UI.input} />
                         </div>
                         <div className="space-y-1.5">
                            <label className={UI.label}>Link Destination (URL)</label>
                            <input type="text" value={data.aboutPage?.cta?.buttonLink} onChange={(e) => updateAbout("cta", "buttonLink", e.target.value)} className={UI.input} />
                         </div>
                      </div>
                   </div>
                )}
                {currentStep === 2 && (
                   <div className={UI.card + " grid grid-cols-2 gap-4"}>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Contact Phone Number</label>
                         <input type="text" value={data.aboutPage?.cta?.phone} onChange={(e) => updateAbout("cta", "phone", e.target.value)} className={UI.inputLarge} />
                      </div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Contact Action Label</label>
                         <input type="text" value={data.aboutPage?.cta?.phoneLabel} onChange={(e) => updateAbout("cta", "phoneLabel", e.target.value)} className={UI.input} />
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
