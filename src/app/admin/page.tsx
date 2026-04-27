"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, Briefcase, Users, Star, HelpCircle,
  ImageIcon, Phone, ArrowUpRight, Activity,
  TrendingUp, Eye, Clock, CheckCircle2, ChevronRight, Shield
} from "lucide-react";
import { useContent } from "@/hooks/useContent";

// ---- Stat Card ----
const StatCard = ({ label, value, icon: Icon, href, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Link href={href} className="block group">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 shadow-sm relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-slate-900 mb-1 tracking-tight group-hover:scale-105 transition-transform origin-left">{value}</p>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{label}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

// ---- Quick Action ----
const QuickAction = ({ label, desc, href, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Link href={href} className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-inner relative z-10">
        <Icon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
      </div>
      <div className="min-w-0 flex-1 relative z-10">
        <p className="text-slate-900 text-base font-bold group-hover:text-primary transition-colors">{label}</p>
        <p className="text-slate-500 text-xs font-medium truncate">{desc}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all relative z-10" />
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
    { label: "Edit Homepage", desc: "Update Hero, About & Contact", href: "/admin/pages/home", icon: Briefcase, delay: 0.05 },
    { label: "Manage Services", desc: "Edit service details & content", href: "/admin/services", icon: Briefcase, delay: 0.1 },
    { label: "Manage Team", desc: "Update team members & bios", href: "/admin/team", icon: Users, delay: 0.15 },
    { label: "Client Reviews", desc: "Moderate customer testimonials", href: "/admin/reviews", icon: Star, delay: 0.2 },
    { label: "Manage Gallery", desc: "Upload project photography", href: "/admin/gallery", icon: ImageIcon, delay: 0.25 },
    { label: "Submissions", desc: "View form leads & inquiries", href: "/admin/submissions", icon: Phone, delay: 0.3 },
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
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                System Status: Active
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {greeting()}, <span className="text-primary">Admin</span> 👋
            </h1>
            <p className="text-slate-500 font-bold text-base tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/50 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm group"
            >
              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Preview Live Site
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {stats.map((s, i) => (
            <Link key={s.label} href={s.href} className="group block">
              <div className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${s.color}`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-primary transition-colors">{s.value}</p>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{s.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">Manage {s.label}</div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-slate-900 font-extrabold text-lg tracking-tight uppercase tracking-widest text-xs">Quick Management</h2>
            </div>
            <Link href="/admin/pages" className="text-primary text-xs font-bold hover:underline">View All Pages</Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {quickActions.map((a, i) => (
                <Link key={a.href} href={a.href} className="group block">
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                        <a.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-slate-900 text-sm font-bold group-hover:text-primary transition-colors">{a.label}</p>
                        <p className="text-slate-500 text-xs font-medium">{a.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Site Pages (1/3) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-slate-900 font-extrabold text-lg tracking-tight uppercase tracking-widest text-xs">Live Status</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {sitePages.map((page, i) => (
              <div
                key={page.path}
                className={`flex items-center justify-between px-6 py-4 group hover:bg-slate-50 transition-colors ${i !== sitePages.length - 1 ? "border-b border-slate-100" : ""}`}
              >
                <div className="min-w-0">
                  <p className="text-slate-900 text-sm font-bold group-hover:text-primary transition-colors">{page.name}</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">{page.path}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <StatusBadge label="Live" status={page.status} />
                  <Link href={page.path} target="_blank" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-wrap gap-12 items-center shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Security Status</p>
            <StatusBadge label="All Systems Operational" status="live" />
          </div>
        </div>
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">CMS Engine</p>
          <p className="text-slate-900 text-sm font-extrabold">Eagle Revolution v2.4</p>
        </div>
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Architecture</p>
          <p className="text-slate-900 text-sm font-extrabold">Next.js 16 (App Router)</p>
        </div>
        <div className="ml-auto">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected to Database
          </div>
          <p className="text-slate-900 text-sm font-extrabold">MongoDB Atlas (Live)</p>
        </div>
      </motion.div>
    </div>
  );
}
