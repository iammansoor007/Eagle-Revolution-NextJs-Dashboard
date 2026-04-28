"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, MapPin, Clock, Facebook, Instagram, Linkedin, Send,
  User, MessageSquare, Smartphone, Hash, Sparkles
} from "lucide-react";
import IconSelector from "@/components/admin/IconSelector";
import { UI } from "./styles";

export default function ContactEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         contactPage: {
           header: { badge: "Contact Us", headline: "Expert hands with Visionary minds", description: "Get in touch with St. Louis's leading roofing and exterior specialists." },
           formFields: [
             { name: "name", label: "Full Name", type: "text", required: true, icon: "User" },
             { name: "email", label: "Email Address", type: "email", required: true, icon: "Mail" },
             { name: "phone", label: "Phone Number", type: "tel", required: false, icon: "Phone" },
             { name: "message", label: "Your Message", type: "textarea", required: true, icon: "MessageSquare" }
           ],
           info: { address: "St. Louis, MO", phone: "314-XXX-XXXX", email: "info@eaglerevolution.com", hours: "Mon-Fri: 8am-6pm" },
           social: { facebook: "#", instagram: "#", linkedin: "#" }
         }
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateContact = (section: string, field: string | null, value: any) => {
    const currentData = data.contactPage || {
      header: { badge: "", headline: "", description: "" },
      formFields: [],
      info: {},
      social: {}
    };

    const targetSectionData = currentData[section as keyof typeof currentData] || {};

    setData({
      ...data,
      contactPage: {
        ...currentData,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "header", label: "Contact Header", icon: Type, title: "Introduction & Narrative" },
    { id: "form", label: "Form Architect", icon: Send, title: "Lead Generation Form Builder" },
    { id: "info", label: "Business Vitals", icon: MapPin, title: "Contact Information & Socials" },
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  const inputTypes = ["text", "email", "tel", "textarea", "number"];

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
           <p className="text-sm text-slate-400 mt-2 font-medium">Manage how customers interact with your brand through the contact page.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }} 
            className="space-y-16 pb-20"
          >
            
            {/* HEADER SECTION */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-10">
                 <div className={UI.card + " space-y-6"}>
                    <label className={UI.sectionHeader}>Introduction Branding</label>
                    <div className="space-y-2">
                       <label className={UI.label}>Section Badge</label>
                       <input type="text" value={data.contactPage?.header?.badge || ""} onChange={(e) => updateContact("header", "badge", e.target.value)} className={UI.input} />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Main Headline</label>
                       <input type="text" value={data.contactPage?.header?.headline || ""} onChange={(e) => updateContact("header", "headline", e.target.value)} className={UI.inputLarge} />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Intro Narrative</label>
                       <textarea value={data.contactPage?.header?.description || ""} onChange={(e) => updateContact("header", "description", e.target.value)} rows={4} className={UI.textarea} />
                    </div>
                 </div>
              </div>
            )}

            {/* FORM SECTION */}
            {activeTab === "form" && (
              <div className="space-y-10">
                 <label className={UI.label}>Lead Form Architect</label>
                 <div className="grid grid-cols-1 gap-6 max-w-4xl">
                    {(data.contactPage?.formFields || []).map((field: any, i: number) => (
                      <div key={i} className={UI.card + " space-y-6 relative group"}>
                        <button onClick={() => {
                          const newF = data.contactPage.formFields.filter((_: any, idx: number) => idx !== i);
                          updateContact("formFields", null, newF);
                        }} className="absolute top-8 right-8 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        
                        <div className="grid grid-cols-12 gap-8">
                           <div className="col-span-4 space-y-4">
                              <div className="space-y-2">
                                 <label className={UI.label}>Field Label</label>
                                 <input type="text" value={field.label} onChange={(e) => {
                                   const newF = [...data.contactPage.formFields]; newF[i].label = e.target.value; updateContact("formFields", null, newF);
                                 }} className={UI.input} />
                              </div>
                              <div className="space-y-2">
                                 <label className={UI.label}>Data Name (Slug)</label>
                                 <input type="text" value={field.name} onChange={(e) => {
                                   const newF = [...data.contactPage.formFields]; newF[i].name = e.target.value; updateContact("formFields", null, newF);
                                 }} className={UI.input + " font-mono"} />
                              </div>
                           </div>
                           <div className="col-span-4 space-y-4">
                              <div className="space-y-2">
                                 <label className={UI.label}>Input Type</label>
                                 <select value={field.type} onChange={(e) => {
                                   const newF = [...data.contactPage.formFields]; newF[i].type = e.target.value; updateContact("formFields", null, newF);
                                 }} className={UI.input + " cursor-pointer"}>
                                    {inputTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                 </select>
                              </div>
                              <IconSelector 
                                label="Field Icon"
                                value={field.icon} 
                                onChange={(val) => {
                                  const newF = [...data.contactPage.formFields]; newF[i].icon = val; updateContact("formFields", null, newF);
                                }} 
                              />
                           </div>
                           <div className="col-span-4 flex items-end pb-2">
                              <label className="flex items-center gap-3 cursor-pointer group/toggle">
                                 <div className={`w-10 h-5 rounded-full transition-colors relative ${field.required ? 'bg-primary' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${field.required ? 'left-6' : 'left-1'}`} />
                                 </div>
                                 <span className="text-[10px] font-bold uppercase text-slate-400 group-hover/toggle:text-slate-600">Required Field</span>
                                 <input type="checkbox" className="hidden" checked={field.required} onChange={(e) => {
                                   const newF = [...data.contactPage.formFields]; newF[i].required = e.target.checked; updateContact("formFields", null, newF);
                                 }} />
                              </label>
                           </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateContact("formFields", null, [...(data.contactPage?.formFields || []), { name: "new_field", label: "New Field", type: "text", required: false, icon: "User" }])} className={UI.buttonAdd + " py-12"}>
                       <Plus className="w-8 h-8 mx-auto" />
                       <span>Add Form Field</span>
                    </button>
                 </div>
              </div>
            )}

            {/* INFO SECTION */}
            {activeTab === "info" && (
              <div className="grid grid-cols-12 gap-12">
                 <div className="col-span-7 space-y-10">
                    <div className="space-y-6">
                       <label className={UI.label}>Direct Contact Channels</label>
                       <div className={UI.card + " space-y-6"}>
                          {[
                            { key: 'phone', icon: Phone, label: 'Phone Number' },
                            { key: 'email', icon: Mail, label: 'Email Address' },
                            { key: 'address', icon: MapPin, label: 'Physical Address' },
                            { key: 'hours', icon: Clock, label: 'Business Hours' }
                          ].map((item) => (
                            <div key={item.key} className="space-y-2">
                               <div className="flex items-center gap-2">
                                  <item.icon className="w-3.5 h-3.5 text-primary/50" />
                                  <label className={UI.label + " mb-0"}>{item.label}</label>
                               </div>
                               <input type="text" value={data.contactPage?.info?.[item.key] || ""} onChange={(e) => updateContact("info", item.key, e.target.value)} className={UI.input} />
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="col-span-5 space-y-10">
                    <div className="space-y-6">
                       <label className={UI.label}>Social Connectivity</label>
                       <div className={UI.card + " space-y-6"}>
                          {[
                            { key: 'facebook', icon: Facebook, label: 'Facebook' },
                            { key: 'instagram', icon: Instagram, label: 'Instagram' },
                            { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' }
                          ].map((item) => (
                            <div key={item.key} className="space-y-2">
                               <div className="flex items-center gap-2">
                                  <item.icon className="w-3.5 h-3.5 text-primary/50" />
                                  <label className={UI.label + " mb-0"}>{item.label} URL</label>
                               </div>
                               <input type="text" value={data.contactPage?.social?.[item.key] || ""} onChange={(e) => updateContact("social", item.key, e.target.value)} className={UI.input} placeholder="https://..." />
                            </div>
                          ))}
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
