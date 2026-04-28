"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, MessageSquare, Filter, BookOpen, Sparkles
} from "lucide-react";
import ContentSelector from "@/components/admin/ContentSelector";
import { UI } from "./styles";

export default function FAQEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         faq: {
           section: { headline: "Frequently Asked Questions", description: "Find answers to common questions about our services and process." },
           categories: [
             { id: "all", label: "All Questions" },
             { id: "roofing", label: "Roofing" },
             { id: "decks", label: "Decks" },
             { id: "windows", label: "Windows" }
           ],
           items: []
         }
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateFAQ = (section: string, field: string | null, value: any) => {
    const currentFAQ = data.faq || {
      section: { headline: "", description: "" },
      categories: [],
      items: []
    };

    const targetSectionData = currentFAQ[section as keyof typeof currentFAQ] || {};

    setData({
      ...data,
      faq: {
        ...currentFAQ,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "header", label: "Support Header", icon: Type, title: "Support Knowledge Base Introduction" },
    { id: "categories", label: "Filter Taxonomy", icon: Filter, title: "Filtering Categories" },
    { id: "items", label: "Q&A Database", icon: HelpCircle, title: "Comprehensive Q&A Database" },
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
           <p className="text-sm text-slate-400 mt-2 font-medium">Configure the knowledge base to help customers find answers quickly.</p>
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
                    <label className={UI.sectionHeader}>Section Branding</label>
                    <div className="space-y-2">
                       <label className={UI.label}>Main Headline</label>
                       <input type="text" value={data.faq?.section?.headline || ""} onChange={(e) => updateFAQ("section", "headline", e.target.value)} className={UI.inputLarge} />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Knowledge Intro Narrative</label>
                       <textarea value={data.faq?.section?.description || ""} onChange={(e) => updateFAQ("section", "description", e.target.value)} rows={4} className={UI.textarea} />
                    </div>
                 </div>
              </div>
            )}

            {/* CATEGORIES SECTION */}
            {activeTab === "categories" && (
              <div className="space-y-10">
                 <label className={UI.label}>Filtering Taxonomy</label>
                 <div className="grid grid-cols-3 gap-6">
                    {(data.faq?.categories || []).map((cat: any, i: number) => (
                      <div key={i} className={UI.card + " space-y-6 relative group p-6 rounded-3xl"}>
                         <div className="flex justify-between items-center mb-2">
                            <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center border border-primary/10">
                               <Filter className="w-4 h-4" />
                            </div>
                            <button onClick={() => {
                               const newC = data.faq.categories.filter((_: any, idx: number) => idx !== i);
                               updateFAQ("categories", null, newC);
                            }} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                         </div>
                         <div className="space-y-2">
                            <label className={UI.label + " mb-0"}>Category Label</label>
                            <input type="text" value={cat.label} onChange={(e) => {
                                 const newC = [...data.faq.categories];
                                 newC[i].label = e.target.value;
                                 newC[i].id = e.target.value.toLowerCase().replace(/\s+/g, '-');
                                 updateFAQ("categories", null, newC);
                               }} className={UI.input + " font-bold"} placeholder="Category Label" />
                            <p className="text-[9px] text-slate-300 font-mono uppercase tracking-tighter px-1">ID: {cat.id}</p>
                         </div>
                      </div>
                    ))}
                    <button onClick={() => updateFAQ("categories", null, [...(data.faq?.categories || []), { id: "new", label: "New Category" }])} className={UI.buttonAdd + " py-12"}>
                       <Plus className="w-8 h-8 mx-auto" />
                       <span>Add Category</span>
                    </button>
                 </div>
              </div>
            )}

             {/* ITEMS SECTION */}
            {activeTab === "items" && (
              <div className="space-y-8">
                 <ContentSelector 
                    type="faq" 
                    label="Knowledge Inventory (Select from Global Library)" 
                    selectedItems={data.faq?.items || []} 
                    onSelect={(items) => updateFAQ("items", null, items)} 
                 />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
