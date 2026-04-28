"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, MapPin, Clock, Facebook, Instagram, Linkedin, Send
} from "lucide-react";

export default function ContactEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         contact: {
           section: { badge: "", headline: "", description: "" },
           info: { address: "", phone: "", email: "", hours: "" },
           social: { facebook: "", instagram: "", linkedin: "" },
           form: { title: "", success: "" }
         }
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateContact = (section: string, field: string | null, value: any) => {
    // Safety check: Ensure contact and target section exist
    const currentContact = data.contact || {
      section: { badge: "", headline: "", description: "" },
      info: { address: "", phone: "", email: "", hours: "" },
      social: { facebook: "", instagram: "", linkedin: "" },
      form: { title: "", success: "" }
    };
    
    const targetSectionData = currentContact[section as keyof typeof currentContact] || {};

    setData({
      ...data,
      contact: {
        ...currentContact,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "header", label: "Contact Header", icon: Type, title: "Narrative & Introduction" },
    { id: "info", label: "Business Info", icon: MapPin, title: "Physical & Digital Contact Info" },
    { id: "form", label: "Lead Form", icon: Send, title: "Form Configuration & Success State" },
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
           <p className="text-xs text-slate-400 mt-1">Manage the contact information and form settings for your visitors.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* HEADER SECTION */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Badge</label>
                    <input type="text" value={data.contact?.section?.badge || ""} onChange={(e) => updateContact("section", "badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" placeholder="Get in Touch" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline</label>
                    <input type="text" value={data.contact?.section?.headline || ""} onChange={(e) => updateContact("section", "headline", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" placeholder="Contact Our Team" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Supporting Description</label>
                    <textarea value={data.contact?.section?.description || ""} onChange={(e) => updateContact("section", "description", e.target.value)} rows={4} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:bg-white focus:border-primary/30 transition-all" />
                 </div>
              </div>
            )}

            {/* INFO SECTION */}
            {activeTab === "info" && (
              <div className="grid grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Direct Channels</label>
                    <div className="space-y-4">
                       {[
                         { key: 'phone', icon: Phone, label: 'Phone Number' },
                         { key: 'email', icon: Mail, label: 'Email Address' },
                         { key: 'address', icon: MapPin, label: 'Physical Address' },
                         { key: 'hours', icon: Clock, label: 'Business Hours' }
                       ].map((item) => (
                         <div key={item.key} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 focus-within:border-primary/30 transition-all">
                            <item.icon className="w-4 h-4 text-slate-300" />
                            <input 
                              type="text" 
                              value={data.contact?.info?.[item.key] || ""} 
                              onChange={(e) => updateContact("info", item.key, e.target.value)} 
                              className="flex-1 bg-transparent text-xs text-slate-700 outline-none" 
                              placeholder={item.label} 
                            />
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-8">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Social Media Links</label>
                    <div className="space-y-4">
                       {[
                         { key: 'facebook', icon: Facebook, label: 'Facebook URL' },
                         { key: 'instagram', icon: Instagram, label: 'Instagram URL' },
                         { key: 'linkedin', icon: Linkedin, label: 'LinkedIn URL' }
                       ].map((item) => (
                         <div key={item.key} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 focus-within:border-primary/30 transition-all">
                            <item.icon className="w-4 h-4 text-slate-300" />
                            <input 
                              type="text" 
                              value={data.contact?.social?.[item.key] || ""} 
                              onChange={(e) => updateContact("social", item.key, e.target.value)} 
                              className="flex-1 bg-transparent text-[10px] text-slate-700 outline-none" 
                              placeholder={item.label} 
                            />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {/* FORM SECTION */}
            {activeTab === "form" && (
              <div className="max-w-3xl space-y-10">
                 <div className="space-y-6">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Form Configuration</label>
                    <div className="bg-slate-50/30 p-8 rounded-3xl border border-slate-100 space-y-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Form Box Title</label>
                          <input type="text" value={data.contact?.form?.title || ""} onChange={(e) => updateContact("form", "title", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-xs outline-none focus:border-primary/30 transition-all" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Submission Success Message</label>
                          <textarea value={data.contact?.form?.success || ""} onChange={(e) => updateContact("form", "success", e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-xs text-slate-500 outline-none focus:border-primary/30" />
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
