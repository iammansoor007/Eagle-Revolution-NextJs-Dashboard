"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, Briefcase, Users, Star, HelpCircle,
  ImageIcon, Phone, ArrowUpRight, Activity,
  TrendingUp, Eye, Clock, CheckCircle2, ChevronRight, Shield,
  LayoutDashboard, Settings
} from "lucide-react";
import { useContent } from "@/hooks/useContent";

// ---- Stat Card ----
const StatCard = ({ label, value, icon: Icon, href, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Link href={href} className="block group">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-black transition-all duration-300 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-black transition-colors group-hover:bg-black group-hover:text-white">
            <Icon className="w-4 h-4" />
          </div>
          <ArrowUpRight className="w-3 h-3 text-black/20 group-hover:text-black transition-colors" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-normal text-black tracking-tight">{value}</p>
          <p className="text-black font-normal text-[10px] uppercase tracking-widest">{label}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

// ---- Quick Action ----
const QuickAction = ({ label, desc, href, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -5 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Link href={href} className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-black transition-all h-full">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-black/40 transition-colors group-hover:bg-black group-hover:text-white">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black mb-0.5">{label}</p>
        <p className="text-[11px] text-black/60 font-normal line-clamp-1">{desc}</p>
      </div>
      <ChevronRight className="w-3 h-3 text-black/20 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
    </Link>
  </motion.div>
);

// ---- Status Badge ----
const StatusBadge = ({ label, status }: { label: string; status: "live" | "draft" | "ok" }) => {
  const colors: Record<string, string> = {
    live: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50",
    draft: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50",
    ok: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/50",
  };
  const icons: Record<string, React.ReactNode> = {
    live: <CheckCircle2 className="w-3.5 h-3.5" />,
    draft: <Clock className="w-3.5 h-3.5" />,
    ok: <Activity className="w-3.5 h-3.5" />,
  };
  return (
    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${colors[status]}`}>
      {icons[status]} {label}
    </div>
  );
};

// ---- Main Dashboard ----
export default function AdminDashboard() {
  const { services: servicesRaw, testimonials, faq, team } = useContent();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const servicesData = (servicesRaw as any).services || [];
  const testimonialsData = (testimonials as any).testimonials || [];
  const faqItems = (faq as any).items || [];
  const teamMembers = (team as any).members || [];

  const stats = [
    { label: "Services", value: servicesData.length, icon: Briefcase, href: "/admin/services", color: "bg-blue-500", delay: 0.05 },
    { label: "Team Members", value: teamMembers.length, icon: Users, href: "/admin/team", color: "bg-indigo-500", delay: 0.1 },
    { label: "Testimonials", value: testimonialsData.length, icon: Star, href: "/admin/reviews", color: "bg-amber-500", delay: 0.15 },
    { label: "FAQ Items", value: faqItems.length, icon: HelpCircle, href: "/admin/faq", color: "bg-emerald-500", delay: 0.2 },
  ];

  const quickActions = [
    { label: "Edit Website Home", desc: "Hero, About & Contact sections", href: "/admin/pages/home", icon: LayoutDashboard, delay: 0.05 },
    { label: "Manage All Pages", desc: "List of all dynamic CMS pages", href: "/admin/pages", icon: FileText, delay: 0.1 },
    { label: "Settings & SEO", desc: "Title, Favicon & Meta Data", href: "/admin/settings", icon: Settings, delay: 0.15 },
  ];

  const tools = [
    { label: "Header & Nav", desc: "Manage logo and navbar links", href: "/admin/settings?tab=header", icon: LayoutDashboard },
    { label: "Footer Info", desc: "Update footer text and links", href: "/admin/settings?tab=footer", icon: LayoutDashboard },
    { label: "Social Media", desc: "Connect your social profiles", href: "/admin/settings?tab=social", icon: Users },
    { label: "Services Bank", desc: "Edit your service offerings", href: "/admin/services", icon: Briefcase },
    { label: "Project Gallery", desc: "Manage project photography", href: "/admin/projects", icon: ImageIcon },
    { label: "Client Reviews", desc: "Moderate customer testimonials", href: "/admin/reviews", icon: Star },
    { label: "FAQ Builder", desc: "Build & edit question banks", href: "/admin/faq", icon: HelpCircle },
    { label: "Team Directory", desc: "Update team profiles & bios", href: "/admin/team", icon: Users },
    { label: "Job Postings", desc: "Manage career opportunities", href: "/admin/submissions", icon: Phone },
  ];

  const sitePages = [
    { name: "Homepage", path: "/", status: "live" as const },
    { name: "Services", path: "/services", status: "live" as const },
    { name: "Gallery", path: "/gallery", status: "live" as const },
    { name: "Contact Us", path: "/contact", status: "live" as const },
    { name: "FAQ", path: "/faq", status: "live" as const },
  ];

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-full space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between pb-8 border-b border-slate-200 mb-10">
          <div className="space-y-1">
            <h1 className="text-2xl font-normal text-black tracking-tight">
              {greeting()}, <span className="text-black font-medium">Admin</span>
            </h1>
            <p className="text-black font-normal text-xs uppercase tracking-[0.2em]">
              Dashboard Control &bull; {time.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-[11px] font-medium uppercase tracking-widest text-black hover:opacity-70 transition-colors flex items-center gap-2 border border-black px-4 py-2 rounded-full"
          >
            Preview Site <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="space-y-12">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Actions Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Core Actions</span>
            <div className="h-[1px] bg-slate-100 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((a, i) => (
              <QuickAction key={a.href} {...a} />
            ))}
          </div>
        </div>
      </div>

      {/* Additional Tools Section */}
      <div className="space-y-6 pt-12 border-t border-slate-200">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-medium text-black uppercase tracking-widest">Site Management Toolbox</span>
          <div className="h-[1px] bg-slate-200 flex-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
          {tools.map((tool, i) => (
            <Link 
              key={tool.label} 
              href={tool.href}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-black hover:bg-slate-50 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-black/40 group-hover:text-black transition-colors">
                <tool.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-black">{tool.label}</p>
                <p className="text-[10px] text-black/60 truncate">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
