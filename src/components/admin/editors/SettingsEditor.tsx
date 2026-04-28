"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Globe, Share2, Facebook, Instagram, Linkedin,
  Navigation, PanelBottom as FooterIcon, Clock, MapPin, Sparkles,
  Zap, Calendar, Settings as SettingsIcon, MousePointer2, X
} from "lucide-react";
import { UI } from "./styles";
import IconSelector from "@/components/admin/IconSelector";

// Shared Reusable Image Upload Component
const ImageUpload = ({ label, value, onChange }: any) => {
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
                  Update
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

export default function SettingsEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("branding");
  const [publishedPages, setPublishedPages] = useState<any[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch("/api/admin/pages");
        const pages = await res.json();
        setPublishedPages(pages.filter((p: any) => p.status === "published"));
      } catch (err) {
        console.error("Failed to fetch pages:", err);
      }
    };
    fetchPages();
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         settings: { siteTitle: "Eagle Revolution", siteTemplate: "%s | Eagle Revolution", favicon: "" },
         navbar: { logo: "", siteTitle: "Eagle Revolution", ctaText: "Book Now", ctaLink: "/contact", companyLinks: [] },
         footer: { 
           company: { name: "Eagle Revolution", tagline: "Heritage. Integrity. Precision.", description: "", logo: "" },
           newsletter: { placeholder: "Enter your email", buttonText: "Subscribe" },
           services: { title: "Our Expertise", materials: { title: "Premium Materials", items: [] } },
           contact: { title: "Contact Us", email: "", phone: "", address: "", emergency: "", areas: "" },
           certifications: [],
           social: [],
           marquee: { speed: 30, repeats: 8, texts: ["Heritage", "Precision", "Integrity"] },
           bottom: { copyright: "© 2024 Eagle Revolution", rights: "All Rights Reserved", tagline: "Crafted with Precision", links: [] }
         },
         hours: { monday: "8am - 6pm", saturday: "9am - 3pm", sunday: "Closed" }
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateNested = (path: string[], value: any) => {
    const newData = { ...data };
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setData(newData);
  };

  const tabs = [
    { id: "branding", label: "Branding", icon: Sparkles, title: "Site Identity & Branding" },
    { id: "navigation", label: "Navigation", icon: Navigation, title: "Header & Menu Structure" },
    { id: "footer", label: "Footer", icon: FooterIcon, title: "Footer Content & Socials" },
    { id: "vitals", label: "Business Vitals", icon: Clock, title: "Operating Hours & Areas" },
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
           <p className="text-sm text-slate-400 mt-2 font-medium">Manage global configuration, navigation, and brand consistency across the entire site.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-16 pb-20">
            
            {/* BRANDING TAB */}
            {activeTab === "branding" && (
              <div className="max-w-4xl grid grid-cols-12 gap-12">
                 <div className="col-span-7 space-y-10">
                    <div className={UI.card + " space-y-8"}>
                       <label className={UI.sectionHeader}>Brand Identity</label>
                       <div className="space-y-2">
                          <label className={UI.label}>Global Site Title</label>
                          <input type="text" value={data.settings?.siteTitle || ""} onChange={(e) => updateNested(["settings", "siteTitle"], e.target.value)} className={UI.inputLarge} />
                       </div>
                       <div className="space-y-2">
                          <label className={UI.label}>Metadata Template (e.g. %s | Brand)</label>
                          <input type="text" value={data.settings?.siteTemplate || ""} onChange={(e) => updateNested(["settings", "siteTemplate"], e.target.value)} className={UI.input + " font-mono"} />
                       </div>
                    </div>
                 </div>
                 <div className="col-span-5 space-y-10">
                    <ImageUpload label="Global Favicon / Icon" value={data.settings?.favicon} onChange={(url: string) => updateNested(["settings", "favicon"], url)} />
                    <ImageUpload label="Primary Header Logo" value={data.navbar?.logo} onChange={(url: string) => updateNested(["navbar", "logo"], url)} />
                 </div>
              </div>
            )}

            {/* NAVIGATION TAB */}
            {activeTab === "navigation" && (
              <div className="space-y-12">
                 <div className="max-w-3xl bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <label className={UI.sectionHeader}>Header Action</label>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className={UI.label}>Navbar CTA Text</label>
                          <input type="text" value={data.navbar?.ctaText || ""} onChange={(e) => updateNested(["navbar", "ctaText"], e.target.value)} className={UI.inputPrimary} />
                       </div>
                       <div className="space-y-2">
                          <label className={UI.label}>Navbar CTA Link (Published Only)</label>
                          <div className="relative">
                             <select 
                               value={data.navbar?.ctaLink || ""} 
                               onChange={(e) => updateNested(["navbar", "ctaLink"], e.target.value)} 
                               className={UI.input + " appearance-none cursor-pointer font-medium"}
                             >
                                <option value="/contact">Contact Portal (Default)</option>
                                <option value="/gallery">Gallery Portfolio</option>
                                {publishedPages.map(p => (
                                  <option key={p._id} value={`/${p.slug}`}>{p.title}</option>
                                ))}
                             </select>
                             <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90 pointer-events-none" />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className={UI.label}>Main Menu Links</label>
                    <div className="grid grid-cols-1 gap-4 max-w-4xl">
                       {(data.navbar?.companyLinks || []).map((link: any, i: number) => (
                         <div key={i} className={UI.card + " space-y-6 group relative p-6 rounded-3xl"}>
                            <div className="flex items-center gap-6">
                               <div className="flex-1 grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                     <label className={UI.label}>Link Label</label>
                                     <input type="text" value={link.label} onChange={(e) => {
                                       const newL = [...data.navbar.companyLinks]; newL[i].label = e.target.value; updateNested(["navbar", "companyLinks"], newL);
                                     }} className={UI.input + " font-bold"} placeholder="Link Label" />
                                  </div>
                                  <div className="space-y-2">
                                     <label className={UI.label}>URL Path (Published Only)</label>
                                     <div className="relative">
                                        <select 
                                          value={link.href} 
                                          onChange={(e) => {
                                            const newL = [...data.navbar.companyLinks]; 
                                            newL[i].href = e.target.value; 
                                            updateNested(["navbar", "companyLinks"], newL);
                                          }} 
                                          className={UI.input + " appearance-none cursor-pointer font-medium"}
                                        >
                                           <option value="/">Home Page</option>
                                           <option value="/services">Services</option>
                                           <option value="/gallery">Gallery</option>
                                           <option value="/contact">Contact</option>
                                           <optgroup label="Custom Published Pages">
                                              {publishedPages.map(p => (
                                                <option key={p._id} value={`/${p.slug}`}>{p.title}</option>
                                              ))}
                                           </optgroup>
                                        </select>
                                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90 pointer-events-none" />
                                     </div>
                                  </div>
                               </div>
                               <button onClick={() => {
                                 const newL = data.navbar.companyLinks.filter((_: any, idx: number) => idx !== i); updateNested(["navbar", "companyLinks"], newL);
                               }} className="text-slate-200 hover:text-red-500 absolute top-6 right-6 transition-colors"><Trash2 className="w-5 h-5" /></button>
                            </div>
                            
                            <div className="pl-10 border-l-2 border-slate-100 space-y-4">
                               {(link.subLinks || []).map((sub: any, j: number) => (
                                 <div key={j} className="flex items-center gap-4">
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                       <input type="text" value={sub.label} onChange={(e) => {
                                         const newL = [...data.navbar.companyLinks]; newL[i].subLinks[j].label = e.target.value; updateNested(["navbar", "companyLinks"], newL);
                                       }} className={UI.input + " py-2 text-xs"} placeholder="Sub-link Label" />
                                       <div className="relative">
                                          <select 
                                            value={sub.href} 
                                            onChange={(e) => {
                                              const newL = [...data.navbar.companyLinks]; 
                                              newL[i].subLinks[j].href = e.target.value; 
                                              updateNested(["navbar", "companyLinks"], newL);
                                            }} 
                                            className={UI.input + " py-2 text-xs appearance-none cursor-pointer"}
                                          >
                                             <option value="/">Home</option>
                                             {publishedPages.map(p => (
                                               <option key={p._id} value={`/${p.slug}`}>{p.title}</option>
                                             ))}
                                          </select>
                                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300 rotate-90 pointer-events-none" />
                                       </div>
                                    </div>
                                    <button onClick={() => {
                                      const newL = [...data.navbar.companyLinks]; newL[i].subLinks = link.subLinks.filter((_: any, idx: number) => idx !== j); updateNested(["navbar", "companyLinks"], newL);
                                    }} className="text-slate-200 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                                 </div>
                               ))}
                               <button onClick={() => {
                                 const newL = [...data.navbar.companyLinks]; if (!newL[i].subLinks) newL[i].subLinks = [];
                                 newL[i].subLinks.push({ label: "New Sub-link", href: "/" }); updateNested(["navbar", "companyLinks"], newL);
                               }} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-all">+ Add Sub-Menu Link</button>
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateNested(["navbar", "companyLinks"], [...(data.navbar?.companyLinks || []), { label: "New Page", href: "/", icon: "Globe", subLinks: [] }])} className={UI.buttonAdd + " py-10"}>
                          <Plus className="w-8 h-8 mx-auto" />
                          <span>Insert Header Menu Item</span>
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {/* FOOTER TAB */}
            {activeTab === "footer" && (
              <div className="grid grid-cols-12 gap-12">
                 <div className="col-span-6 space-y-12">
                    <div className="space-y-6">
                       <label className={UI.label}>Footer Identity</label>
                       <div className={UI.card + " space-y-6"}>
                          <div className="space-y-2">
                             <label className={UI.label}>Footer Narrative</label>
                             <textarea value={data.footer?.company?.description || ""} onChange={(e) => updateNested(["footer", "company", "description"], e.target.value)} rows={3} className={UI.textarea} />
                          </div>
                          <ImageUpload label="Footer Specific Logo" value={data.footer?.company?.logo} onChange={(url: string) => updateNested(["footer", "company", "logo"], url)} />
                       </div>
                    </div>

                    <div className="space-y-6">
                       <label className={UI.label}>Marquee Text Bar</label>
                       <div className={UI.card + " space-y-4"}>
                          {(data.footer?.marquee?.texts || []).map((text: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                               <input type="text" value={text} onChange={(e) => {
                                  const newT = [...data.footer.marquee.texts]; newT[idx] = e.target.value; updateNested(["footer", "marquee", "texts"], newT);
                               }} className={UI.input + " font-bold uppercase tracking-widest"} />
                               <button onClick={() => {
                                 const newT = data.footer.marquee.texts.filter((_: any, i: number) => i !== idx); updateNested(["footer", "marquee", "texts"], newT);
                               }} className="text-slate-200 hover:text-red-500 transition-colors px-2"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          ))}
                          <button onClick={() => updateNested(["footer", "marquee", "texts"], [...(data.footer?.marquee?.texts || []), "NEW VALUE"])} className={UI.buttonAdd + " py-4"}>+ Add Word</button>
                       </div>
                    </div>
                 </div>

                 <div className="col-span-6 space-y-12">
                    <div className="space-y-6">
                       <label className={UI.label}>Bottom Bar & Links</label>
                       <div className={UI.card + " space-y-6"}>
                          <div className="space-y-2">
                             <label className={UI.label}>Copyright Text</label>
                             <input type="text" value={data.footer?.bottom?.copyright || ""} onChange={(e) => updateNested(["footer", "bottom", "copyright"], e.target.value)} className={UI.input} />
                          </div>
                          <div className="space-y-2">
                             <label className={UI.label}>Secondary Bar Links</label>
                             <div className="grid grid-cols-1 gap-3">
                                {(data.footer?.bottom?.links || []).map((link: any, idx: number) => (
                                   <div key={idx} className="flex gap-2 group">
                                      <input type="text" value={link.label} onChange={(e) => {
                                         const newL = [...data.footer.bottom.links]; newL[idx].label = e.target.value; updateNested(["footer", "bottom", "links"], newL);
                                      }} className={UI.input + " py-2 text-xs"} placeholder="Label" />
                                      <div className="relative flex-1">
                                         <select 
                                           value={link.href} 
                                           onChange={(e) => {
                                              const newL = [...data.footer.bottom.links]; newL[idx].href = e.target.value; updateNested(["footer", "bottom", "links"], newL);
                                           }} 
                                           className={UI.input + " py-2 text-xs appearance-none cursor-pointer font-medium"}
                                         >
                                            <option value="/">Home</option>
                                            <option value="/privacy">Privacy Policy</option>
                                            <option value="/terms">Terms of Service</option>
                                            <optgroup label="Published Content">
                                              {publishedPages.map(p => (
                                                <option key={p._id} value={`/${p.slug}`}>{p.title}</option>
                                              ))}
                                            </optgroup>
                                         </select>
                                         <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300 rotate-90 pointer-events-none" />
                                      </div>
                                      <button onClick={() => {
                                         const newL = data.footer.bottom.links.filter((_: any, i: number) => i !== idx); updateNested(["footer", "bottom", "links"], newL);
                                      }} className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                                   </div>
                                 ))}
                                <button onClick={() => updateNested(["footer", "bottom", "links"], [...(data.footer?.bottom?.links || []), { label: "Legal", href: "/legal" }])} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-all">+ Add Legal Link</button>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <label className={UI.label}>Newsletter Config</label>
                       <div className={UI.card + " grid grid-cols-2 gap-4"}>
                          <div className="space-y-2">
                             <label className={UI.label}>Placeholder</label>
                             <input type="text" value={data.footer?.newsletter?.placeholder || ""} onChange={(e) => updateNested(["footer", "newsletter", "placeholder"], e.target.value)} className={UI.input} />
                          </div>
                          <div className="space-y-2">
                             <label className={UI.label}>Btn Text</label>
                             <input type="text" value={data.footer?.newsletter?.buttonText || ""} onChange={(e) => updateNested(["footer", "newsletter", "buttonText"], e.target.value)} className={UI.inputPrimary} />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* VITALS TAB */}
            {activeTab === "vitals" && (
              <div className="grid grid-cols-12 gap-12">
                 <div className="col-span-6 space-y-12">
                    <div className="space-y-6">
                       <label className={UI.label}>Opening Hours</label>
                       <div className={UI.card + " space-y-4"}>
                          {Object.entries(data.hours || {}).map(([day, val]: [string, any]) => (
                            <div key={day} className="flex items-center justify-between group">
                               <label className={UI.label + " mb-0"}>{day}</label>
                               <input type="text" value={val} onChange={(e) => updateNested(["hours", day], e.target.value)} className={UI.input + " w-48 text-right font-bold"} />
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="col-span-6 space-y-12">
                    <div className="space-y-6">
                       <label className={UI.label}>Service Areas Coverage</label>
                       <div className={UI.card}>
                          <textarea value={data.footer?.contact?.areas || ""} onChange={(e) => updateNested(["footer", "contact", "areas"], e.target.value)} rows={6} className={UI.textarea} placeholder="St. Louis, MO and surrounding areas..." />
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
