"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon,
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload,
  List, Heart, HelpCircle, Check, Target, Award, Shield,
  ArrowRight, Zap, Globe, ShieldCheck, Building2, Droplets, Building,
  Home, Layout, TreePine, TrendingUp, BadgeCheck, Sparkles, Box, PenTool as Tool
} from "lucide-react";

export default function ServicesEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({
        services: {
          badge: "Our Services",
          headline: { prefix: "Comprehensive Solutions for", highlight: "Modern Living", suffix: "" },
          description: "Discover our range of premium roofing, exterior, and renovation services tailored to your needs.",
          services: []
        }
      });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateServices = (section: string | null, field: string | null, value: any) => {
    const currentData = data.services || {
      badge: "",
      headline: { prefix: "", highlight: "", suffix: "" },
      description: "",
      services: []
    };

    if (!section) {
      setData({ ...data, services: { ...currentData, [field as string]: value } });
      return;
    }

    const targetSectionData = currentData[section as keyof typeof currentData] || {};

    setData({
      ...data,
      services: {
        ...currentData,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "header", label: "Page Introduction", icon: Type, title: "Services Hero Narrative" },
    { id: "catalog", label: "Service Catalog", icon: List, title: "Individual Service Management" },
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  const iconOptions = [
    { id: "Home", icon: Home },
    { id: "Layout", icon: Layout },
    { id: "TreePine", icon: TreePine },
    { id: "Building2", icon: Building2 },
    { id: "Building", icon: Building },
    { id: "Droplets", icon: Droplets },
    { id: "Shield", icon: Shield },
    { id: "Award", icon: Award },
    { id: "BadgeCheck", icon: BadgeCheck },
    { id: "TrendingUp", icon: TrendingUp },
    { id: "Star", icon: Star },
    { id: "Box", icon: Box },
    { id: "Tool", icon: Tool }
  ];

  return (
    <div className="bg-white min-h-[700px] flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-1 p-4 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id
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

      <div className="flex-1 p-10 overflow-y-auto max-h-[850px] custom-scrollbar bg-[#F8FAFC]">
        <div className="mb-12 pb-8 border-b border-slate-200">
          <h2 className="text-3xl font-medium text-slate-900 tracking-tight">{activeTabTitle}</h2>
          <p className="text-sm text-slate-400 mt-2 font-medium">Configure the global services overview page and manage individual offerings.</p>
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
                <div className="space-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Intro Badge</label>
                    <input type="text" value={data.services?.badge || ""} onChange={(e) => updateServices(null, "badge", e.target.value)} className="w-full bg-slate-50 px-5 py-3.5 rounded-xl text-xs font-bold text-primary outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline Architect</label>
                    <div className="grid grid-cols-3 gap-4">
                      <input type="text" value={data.services?.headline?.prefix || ""} onChange={(e) => updateServices("headline", "prefix", e.target.value)} className="bg-slate-50 px-4 py-3 rounded-xl text-xs outline-none" placeholder="Prefix" />
                      <input type="text" value={data.services?.headline?.highlight || ""} onChange={(e) => updateServices("headline", "highlight", e.target.value)} className="bg-primary/5 text-primary border border-primary/20 px-4 py-3 rounded-xl text-xs font-bold outline-none" placeholder="Highlighted" />
                      <input type="text" value={data.services?.headline?.suffix || ""} onChange={(e) => updateServices("headline", "suffix", e.target.value)} className="bg-slate-50 px-4 py-3 rounded-xl text-xs outline-none" placeholder="Suffix" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Page Narrative</label>
                    <textarea value={data.services?.description || ""} onChange={(e) => updateServices(null, "description", e.target.value)} rows={4} className="w-full bg-slate-50 px-5 py-4 rounded-2xl text-sm text-slate-500 outline-none leading-relaxed" />
                  </div>
                </div>
              </div>
            )}

            {/* CATALOG SECTION */}
            {activeTab === "catalog" && (
              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  {(data.services?.services || []).map((service: any, i: number) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8 relative group">
                      <button onClick={() => {
                        const newS = data.services.services.filter((_: any, idx: number) => idx !== i);
                        updateServices(null, "services", newS);
                      }} className="absolute top-6 right-6 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>

                      <div className="flex items-start gap-6">
                        <div className="space-y-4 shrink-0">
                          <label className="text-[9px] font-bold text-slate-300 uppercase block">Icon</label>
                          <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-2xl">
                            {iconOptions.map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  const newS = [...data.services.services]; newS[i].icon = opt.id; updateServices(null, "services", newS);
                                }}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${service.icon === opt.id ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:bg-white"}`}
                              >
                                <opt.icon className="w-4 h-4" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-300 uppercase">Service Title</label>
                            <input type="text" value={service.title} onChange={(e) => {
                              const newS = [...data.services.services]; newS[i].title = e.target.value;
                              newS[i].slug = e.target.value.toLowerCase().replace(/ & /g, '-').replace(/, /g, '-').replace(/\s+/g, '-');
                              updateServices(null, "services", newS);
                            }} className="w-full bg-slate-50 px-5 py-3 rounded-xl text-base font-bold outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-300 uppercase">Service Tagline</label>
                            <input type="text" value={service.tagline} onChange={(e) => {
                              const newS = [...data.services.services]; newS[i].tagline = e.target.value; updateServices(null, "services", newS);
                            }} className="w-full bg-slate-50 px-5 py-2 rounded-xl text-xs text-slate-500 outline-none" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[9px] font-bold text-slate-300 uppercase">Top 3 Features</label>
                        <div className="flex gap-2">
                          {[0, 1, 2].map((idx) => (
                            <input
                              key={idx}
                              type="text"
                              value={typeof service.features?.[idx] === 'string' ? service.features[idx] : service.features?.[idx]?.text || ""}
                              onChange={(e) => {
                                const newS = [...data.services.services];
                                if (!newS[i].features) newS[i].features = [];
                                newS[i].features[idx] = e.target.value;
                                updateServices(null, "services", newS);
                              }}
                              className="flex-1 bg-slate-50 px-3 py-2 rounded-lg text-[10px] font-medium outline-none"
                              placeholder={`Feature ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => updateServices(null, "services", [...(data.services?.services || []), { title: "New Service", tagline: "Exceptional quality and care.", icon: "Shield", features: ["Expertise", "Quality", "Value"] }])} className="border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-primary transition-all">
                    <Plus className="w-12 h-12" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add New Service Offering</span>
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
