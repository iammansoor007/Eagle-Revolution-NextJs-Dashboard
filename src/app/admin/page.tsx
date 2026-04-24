"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, Briefcase, Users, Star, HelpCircle,
  ImageIcon, Phone, ArrowUpRight, Activity,
  TrendingUp, Eye, Clock, CheckCircle2
} from "lucide-react";
import { useContent } from "@/hooks/useContent";

// ---- Stat Card ----
const StatCard = ({ label, value, icon: Icon, href, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -3 }}
  >
    <Link href={href} className="block group">
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-white/40 text-sm">{label}</p>
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
    <Link href={href} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group">
      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-white text-sm font-medium truncate">{label}</p>
        <p className="text-white/30 text-xs truncate">{desc}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 flex-shrink-0 transition-colors" />
    </Link>
  </motion.div>
);

// ---- Status Badge ----
const StatusBadge = ({ label, status }: { label: string; status: "live" | "draft" | "ok" }) => {
  const colors: Record<string, string> = {
    live: "bg-green-500/15 text-green-400 border-green-500/20",
    draft: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    ok: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  };
  const icons: Record<string, React.ReactNode> = {
    live: <CheckCircle2 className="w-3 h-3" />,
    draft: <Clock className="w-3 h-3" />,
    ok: <Activity className="w-3 h-3" />,
  };
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${colors[status]}`}>
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
    { label: "Services",        value: servicesData.length,      icon: Briefcase,  href: "/admin/services",  color: "bg-blue-500/20",   delay: 0.05 },
    { label: "Team Members",    value: teamMembers.length,       icon: Users,      href: "/admin/team",       color: "bg-violet-500/20", delay: 0.1  },
    { label: "Testimonials",    value: testimonialsData.length,  icon: Star,       href: "/admin/reviews",   color: "bg-yellow-500/20", delay: 0.15 },
    { label: "FAQ Items",       value: faqItems.length,          icon: HelpCircle, href: "/admin/faq",        color: "bg-green-500/20",  delay: 0.2  },
  ];

  const quickActions = [
    { label: "Manage Services",  desc: "Edit service details & content",   href: "/admin/services",  icon: Briefcase,  delay: 0.05 },
    { label: "Manage Team",      desc: "Update team members & bios",        href: "/admin/team",       icon: Users,      delay: 0.1  },
    { label: "Manage Reviews",   desc: "Moderate customer testimonials",    href: "/admin/reviews",   icon: Star,       delay: 0.15 },
    { label: "Manage FAQ",       desc: "Add or edit frequently asked Qs",   href: "/admin/faq",        icon: HelpCircle, delay: 0.2  },
    { label: "Manage Gallery",   desc: "Upload and organize project photos", href: "/admin/gallery",   icon: ImageIcon,  delay: 0.25 },
    { label: "Contact Leads",    desc: "View form submissions",              href: "/admin/contact",   icon: Phone,      delay: 0.3  },
  ];

  const sitePages = [
    { name: "Home",     path: "/",               status: "live"  as const },
    { name: "About",    path: "/about",           status: "live"  as const },
    { name: "Services", path: "/services",        status: "live"  as const },
    { name: "Gallery",  path: "/gallery",         status: "live"  as const },
    { name: "Reviews",  path: "/reviews",         status: "live"  as const },
    { name: "FAQ",      path: "/faq",             status: "live"  as const },
    { name: "Contact",  path: "/contact",         status: "live"  as const },
    { name: "Team",     path: "/about/team",      status: "live"  as const },
    { name: "Careers",  path: "/about/careers",   status: "live"  as const },
  ];

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-full text-white space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {greeting()}, Admin 👋
            </h1>
            <p className="text-white/40 text-sm">
              {time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 bg-white/[0.05] border border-white/10 text-white/60 hover:text-white hover:border-white/20 px-4 py-2 rounded-xl text-sm transition-all"
            >
              <Eye className="w-4 h-4" />
              View Site
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions (2/3) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Quick Actions</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {quickActions.map((a) => <QuickAction key={a.href} {...a} />)}
          </div>
        </div>

        {/* Site Pages (1/3) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Site Pages</h2>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            {sitePages.map((page, i) => (
              <div
                key={page.path}
                className={`flex items-center justify-between px-4 py-3 ${i !== sitePages.length - 1 ? "border-b border-white/[0.05]" : ""}`}
              >
                <div className="min-w-0">
                  <p className="text-white/80 text-sm font-medium">{page.name}</p>
                  <p className="text-white/30 text-xs">{page.path}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <StatusBadge label="Live" status={page.status} />
                  <Link href={page.path} target="_blank" className="text-white/20 hover:text-white/60 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
        className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 flex flex-wrap gap-6 items-center"
      >
        <div>
          <p className="text-white/30 text-xs uppercase tracking-wider mb-1">CMS Version</p>
          <p className="text-white text-sm font-semibold">Eagle CMS v1.0</p>
        </div>
        <div>
          <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Framework</p>
          <p className="text-white text-sm font-semibold">Next.js 16 (App Router)</p>
        </div>
        <div>
          <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Database</p>
          <p className="text-white text-sm font-semibold">MongoDB (eagle_revolution)</p>
        </div>
        <div>
          <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Status</p>
          <StatusBadge label="All Systems Operational" status="live" />
        </div>
      </motion.div>
    </div>
  );
}
