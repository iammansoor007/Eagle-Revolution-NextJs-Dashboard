"use client";

import React, { useState, useEffect } from "react";
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

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

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
    <div className="bg-white">
      {/* WP Style Sub-tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-6 text-[13px] border-b border-[#f0f0f1] pb-1">
        {tabs.map((tab: any, idx: number) => (
          <React.Fragment key={tab.id}>
            <button 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-1 py-1 transition-colors ${activeTab === tab.id ? 'text-[#1d2327] font-bold' : 'text-[#2271b1] hover:text-[#135e96]'}`}
            >
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7] px-1">|</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-6">
        <div className="mb-6">
           <h2 className={UI.sectionHeader}>{activeTabTitle}</h2>
           <p className="text-[12px] text-[#646970] -mt-2">Configure the global services overview page and manage individual offerings.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 pb-10"
          >

            {/* HEADER SECTION */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-6">
                <div className={UI.card + " space-y-5"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Intro Badge</label>
                    <input type="text" value={data.services?.badge || ""} onChange={(e) => updateServices(null, "badge", e.target.value)} className={UI.input} />
                  </div>
                  <div className="space-y-4">
                    <label className={UI.label}>Main Headline Architect</label>
                    <div className="space-y-2">
                      <input type="text" value={data.services?.headline?.prefix || ""} onChange={(e) => updateServices("headline", "prefix", e.target.value)} className={UI.input} placeholder="Prefix Text" />
                      <input type="text" value={data.services?.headline?.highlight || ""} onChange={(e) => updateServices("headline", "highlight", e.target.value)} className={UI.input + " font-bold border-[#2271b1]"} placeholder="Highlighted Text" />
                      <input type="text" value={data.services?.headline?.suffix || ""} onChange={(e) => updateServices("headline", "suffix", e.target.value)} className={UI.input} placeholder="Suffix Text" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Page Narrative</label>
                    <textarea value={data.services?.description || ""} onChange={(e) => updateServices(null, "description", e.target.value)} rows={4} className={UI.textarea} />
                  </div>
                </div>
              </div>
            )}

             {/* CATALOG SECTION */}
            {activeTab === "catalog" && (
              <div className="space-y-6">
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
