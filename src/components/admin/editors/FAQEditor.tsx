"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, MessageSquare, Filter
} from "lucide-react";

export default function FAQEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         faq: {
           section: { badge: "", headline: "", description: "" },
           categories: [],
           items: []
         }
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateFAQ = (section: string, field: string | null, value: any) => {
    const currentFAQ = data.faq || {
      section: { badge: "", headline: "", description: "" },
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
    { id: "header", label: "FAQ Header", icon: Type, title: "Support Knowledge Base Introduction" },
    { id: "categories", label: "Knowledge Categories", icon: Filter, title: "Filtering Taxonomy" },
    { id: "items", label: "Questions & Answers", icon: HelpCircle, title: "Comprehensive Q&A Database" },
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
           <p className="text-xs text-slate-400 mt-1">Configure the knowledge base to help customers find answers quickly.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* HEADER SECTION */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Badge</label>
                    <input type="text" value={data.faq?.section?.badge || ""} onChange={(e) => updateFAQ("section", "badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline</label>
                    <input type="text" value={data.faq?.section?.headline || ""} onChange={(e) => updateFAQ("section", "headline", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Knowledge Intro Paragraph</label>
                    <textarea value={data.faq?.section?.description || ""} onChange={(e) => updateFAQ("section", "description", e.target.value)} rows={4} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:bg-white focus:border-primary/30 transition-all" />
                 </div>
              </div>
            )}

            {/* CATEGORIES SECTION */}
            {activeTab === "categories" && (
              <div className="space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    {(data.faq?.categories || []).map((cat: any, i: number) => (
                      <div key={i} className="bg-slate-50/30 p-4 rounded-xl border border-slate-100 flex gap-4 items-center group transition-all hover:border-primary/20">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                           <Filter className="w-4 h-4 text-primary" />
                        </div>
                        <input type="text" value={cat.label} onChange={(e) => {
                             const newC = [...data.faq.categories];
                             newC[i].label = e.target.value;
                             newC[i].id = e.target.value.toLowerCase().replace(/\s+/g, '-');
                             updateFAQ("categories", null, newC);
                           }} className="flex-1 bg-transparent font-medium text-xs text-slate-800 outline-none" placeholder="Category Name" />
                        <button onClick={() => {
                           const newC = data.faq.categories.filter((_: any, idx: number) => idx !== i);
                           updateFAQ("categories", null, newC);
                        }} className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateFAQ("categories", null, [...(data.faq?.categories || []), { id: "new", label: "New Category", icon: "Home" }])} className="border border-dashed border-slate-200 rounded-xl py-4 text-[10px] font-medium text-slate-300 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest">
                      + Add Knowledge Category
                    </button>
                 </div>
              </div>
            )}

            {/* ITEMS SECTION */}
            {activeTab === "items" && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 gap-6">
                    {(data.faq?.items || []).map((item: any, i: number) => (
                      <div key={i} className="bg-slate-50/30 rounded-3xl p-8 border border-slate-100 space-y-6">
                        <div className="flex justify-between items-center text-[9px] font-medium text-slate-300 uppercase tracking-widest">
                           <div className="flex gap-4">
                              <span>Question #{i+1}</span>
                              <select 
                                value={item.category} 
                                onChange={(e) => {
                                  const newI = [...data.faq.items];
                                  newI[i].category = e.target.value;
                                  updateFAQ("items", null, newI);
                                }}
                                className="bg-primary/10 text-primary px-3 py-1 rounded-lg outline-none"
                              >
                                {(data.faq?.categories || []).map((c: any) => (
                                  <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                              </select>
                           </div>
                           <button onClick={() => {
                              const newI = data.faq.items.filter((_: any, idx: number) => idx !== i);
                              updateFAQ("items", null, newI);
                           }} className="hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-4">
                           <input type="text" value={item.question} onChange={(e) => {
                               const newI = [...data.faq.items];
                               newI[i].question = e.target.value;
                               updateFAQ("items", null, newI);
                             }} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-xs font-medium text-slate-800 outline-none focus:border-primary/30" placeholder="The Question..." />
                           <textarea value={item.answer} onChange={(e) => {
                               const newI = [...data.faq.items];
                               newI[i].answer = e.target.value;
                               updateFAQ("items", null, newI);
                             }} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-xs text-slate-500 outline-none focus:border-primary/30" placeholder="The Deep Answer..." />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateFAQ("items", null, [...(data.faq?.items || []), { id: Date.now(), category: "general", question: "", answer: "" }])} className="w-full border border-dashed border-slate-200 rounded-3xl py-10 text-[10px] font-medium text-slate-300 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest">
                      + Add FAQ Response
                    </button>
                 </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
