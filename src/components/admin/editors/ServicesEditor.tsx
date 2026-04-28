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
import ContentSelector from "@/components/admin/ContentSelector";
import { UI } from "./styles";

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

  return (
    <div className="bg-white min-h-[700px] flex flex-col">
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
                <div className={UI.card + " space-y-6"}>
                  <label className={UI.sectionHeader}>Section Branding</label>
                  <div className="space-y-2">
                    <label className={UI.label}>Intro Badge</label>
                    <input type="text" value={data.services?.badge || ""} onChange={(e) => updateServices(null, "badge", e.target.value)} className={UI.inputPrimary} />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Main Headline Architect</label>
                    <div className="grid grid-cols-3 gap-4">
                      <input type="text" value={data.services?.headline?.prefix || ""} onChange={(e) => updateServices("headline", "prefix", e.target.value)} className={UI.input} placeholder="Prefix" />
                      <input type="text" value={data.services?.headline?.highlight || ""} onChange={(e) => updateServices("headline", "highlight", e.target.value)} className={UI.inputPrimary} placeholder="Highlighted" />
                      <input type="text" value={data.services?.headline?.suffix || ""} onChange={(e) => updateServices("headline", "suffix", e.target.value)} className={UI.input} placeholder="Suffix" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Page Narrative</label>
                    <textarea value={data.services?.description || ""} onChange={(e) => updateServices(null, "description", e.target.value)} rows={4} className={UI.textarea} />
                  </div>
                </div>
              </div>
            )}

             {/* CATALOG SECTION */}
            {activeTab === "catalog" && (
              <div className="space-y-10">
                 <ContentSelector 
                    type="services" 
                    label="Service Catalog (Select from Managed Inventory)" 
                    selectedItems={data.services?.services || []} 
                    onSelect={(items) => updateServices(null, "services", items)} 
                 />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
