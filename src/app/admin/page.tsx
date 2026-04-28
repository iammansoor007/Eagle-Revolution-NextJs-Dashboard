"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, Briefcase, Star, HelpCircle,
  ImageIcon, Phone, ArrowUpRight, Activity,
  ChevronRight, LayoutDashboard, Settings, Plus, ExternalLink,
  Home, Info, Mail, UserCheck, Layers, Image as GalleryIcon
} from "lucide-react";
import { useContent } from "@/hooks/useContent";

// ---- Compact Stat ----
const StatItem = ({ label, value, icon: Icon, href, delay }: any) => {
  if (value === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link href={href} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all group">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">{value}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        </div>
        <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-200 group-hover:text-primary transition-all" />
      </Link>
    </motion.div>
  );
};

// ---- compact management card ----
const ManageCard = ({ label, href, icon: Icon, delay, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Link href={href} className="group block">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
         <div className="flex items-center gap-4 mb-4">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{label}</h3>
            <ArrowUpRight className="w-3 h-3 ml-auto text-slate-200 group-hover:text-primary transition-all" />
         </div>
         <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Customize and manage the {label.toLowerCase()} module.</p>
      </div>
    </Link>
  </motion.div>
);

export default function AdminDashboard() {
  const { services: servicesRaw, testimonials, faq } = useContent();
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Morning");
    else if (hour < 18) setGreeting("Afternoon");
    else setGreeting("Evening");
  }, []);

  const servicesData = (servicesRaw as any).services || [];
  const testimonialsData = (testimonials as any).testimonials || [];
  const faqItems = (faq as any).items || [];

  const stats = [
    { label: "Services", value: servicesData.length, icon: Briefcase, href: "/admin/services", delay: 0.1 },
    { label: "Reviews", value: testimonialsData.length, icon: Star, href: "/admin/reviews", delay: 0.2 },
    { label: "FAQs", value: faqItems.length, icon: HelpCircle, href: "/admin/faq", delay: 0.3 },
  ];

  const templateEditors = [
    { label: "Home Template", href: "/admin/pages/home", icon: Home, color: "bg-blue-600", delay: 0.1 },
    { label: "About Template", href: "/admin/pages/about", icon: Info, color: "bg-indigo-600", delay: 0.2 },
    { label: "Contact Template", href: "/admin/pages/contact", icon: Mail, color: "bg-emerald-600", delay: 0.3 },
    { label: "Careers Template", href: "/admin/pages/careers", icon: UserCheck, color: "bg-amber-600", delay: 0.4 },
    { label: "Services Page", href: "/admin/pages/services", icon: Briefcase, color: "bg-sky-600", delay: 0.5 },
    { label: "Gallery Page", href: "/admin/pages/gallery", icon: GalleryIcon, color: "bg-rose-600", delay: 0.6 },
    { label: "FAQ Page", href: "/admin/pages/faq", icon: HelpCircle, color: "bg-teal-600", delay: 0.7 },
  ];

  const managementModules = [
    { label: "Service Inventory", href: "/admin/services", icon: Layers, color: "bg-slate-700", delay: 0.1 },
    { label: "Review Bank", href: "/admin/reviews", icon: Star, color: "bg-slate-700", delay: 0.2 },
    { label: "Project Catalog", href: "/admin/projects", icon: ImageIcon, color: "bg-slate-700", delay: 0.3 },
    { label: "Knowledge Base", href: "/admin/faq", icon: HelpCircle, color: "bg-slate-700", delay: 0.4 },
    { label: "Global Settings", href: "/admin/settings", icon: Settings, color: "bg-slate-900", delay: 0.5 },
  ];

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-8 pb-32 space-y-12">
      
      {/* Dense Header */}
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good {greeting}, <span className="text-primary italic">Admin.</span>
          </h1>
          <p className="text-slate-400 font-medium text-xs">
            Manage your global content from this unified control center.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
           <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:border-primary/20 transition-all group">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
              Preview Site
           </Link>
           <Link href="/admin/pages" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              <Plus className="w-3.5 h-3.5" />
              Page Manager
           </Link>
        </div>
      </div>

      {/* Stats Row - Only shows if > 0 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Template Editors Grid */}
        <div className="lg:col-span-7 space-y-6">
           <div className="flex items-center gap-3">
             <LayoutDashboard className="w-4 h-4 text-primary" />
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Template Editors</h2>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {templateEditors.map((m) => (
                <ManageCard key={m.label} {...m} />
              ))}
           </div>
        </div>

        {/* Global Management Sidebar */}
        <div className="lg:col-span-5 space-y-6">
           <div className="flex items-center gap-3">
             <Activity className="w-4 h-4 text-primary" />
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Inventory Management</h2>
           </div>
           <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
              {managementModules.map((m) => (
                <Link 
                  key={m.label} 
                  href={m.href}
                  className="flex items-center justify-between p-5 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                     <div className={`w-9 h-9 rounded-xl ${m.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                        <m.icon className="w-3.5 h-3.5" />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{m.label}</p>
                        <p className="text-[9px] text-slate-400 font-medium">Manage shared {m.label.toLowerCase()}</p>
                     </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
           </div>
        </div>

      </div>

    </div>
  );
}
