"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, Briefcase, Star, HelpCircle,
  ImageIcon, Phone, ArrowUpRight, Activity,
  ChevronRight, LayoutDashboard, Settings, Plus, ExternalLink,
  Home, Info, Mail, UserCheck, Layers, Image as GalleryIcon, Shield,
  MessageSquare, Users,
  Settings2
} from "lucide-react";
import { useContent } from "@/hooks/useContent";

export default function AdminDashboard() {
  const { services: servicesRaw, testimonials, faq } = useContent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const servicesData = (servicesRaw as any).services || [];
  const testimonialsData = (testimonials as any).testimonials || [];
  const faqItems = (faq as any).items || [];

  if (!mounted) return null;

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* At a Glance Widget */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
            <h2 className="text-[14px] font-semibold text-[#1d2327]">At a Glance</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Link href="/admin/pages" className="flex items-center gap-2 text-[#2271b1] hover:text-[#135e96] text-[13px]">
                <FileText className="w-4 h-4 text-[#82878c]" />
                <span>8 Pages</span>
              </Link>
              <Link href="/admin/services" className="flex items-center gap-2 text-[#2271b1] hover:text-[#135e96] text-[13px]">
                <Briefcase className="w-4 h-4 text-[#82878c]" />
                <span>{servicesData.length} Services</span>
              </Link>
            </div>
            <div className="space-y-3">
              <Link href="/admin/reviews" className="flex items-center gap-2 text-[#2271b1] hover:text-[#135e96] text-[13px]">
                <Star className="w-4 h-4 text-[#82878c]" />
                <span>{testimonialsData.length} Reviews</span>
              </Link>
              <Link href="/admin/faq" className="flex items-center gap-2 text-[#2271b1] hover:text-[#135e96] text-[13px]">
                <HelpCircle className="w-4 h-4 text-[#82878c]" />
                <span>{faqItems.length} FAQ Items</span>
              </Link>
            </div>
          </div>
          <div className="px-4 py-3 bg-[#f6f7f7] border-t border-[#f0f0f1] text-[13px] text-[#646970]">
            Eagle CMS is running on Next.js 16
          </div>
        </div>

        {/* Activity Widget */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
            <h2 className="text-[14px] font-semibold text-[#1d2327]">Activity</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="text-[13px] text-[#646970] font-medium border-b border-[#f0f0f1] pb-2 uppercase tracking-tight">Recently Published</div>
            <div className="space-y-3">
              {[
                { time: "9:42 am", title: "Home Page Updated" },
                { time: "Yesterday", title: "New Review from John D." },
                { time: "Oct 24th", title: "Script 'GA4' Activated" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 text-[13px]">
                  <span className="text-[#646970] w-20 flex-shrink-0">{item.time}</span>
                  <span className="text-[#2271b1] hover:underline cursor-pointer">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links Widget */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
            <h2 className="text-[14px] font-semibold text-[#1d2327]">Quick Links</h2>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: "Customize Home Page", href: "/admin/pages/home", icon: Home },
              { label: "Update Services", href: "/admin/services", icon: Layers },
              { label: "View Submissions", href: "/admin/submissions", icon: Phone },
              { label: "Configure Site Settings", href: "/admin/settings", icon: Settings },
            ].map((link, i) => (
              <Link key={i} href={link.href} className="flex items-center gap-3 text-[#2271b1] hover:text-[#135e96] text-[13px] group">
                <link.icon className="w-4 h-4 text-[#82878c] group-hover:text-[#2271b1]" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* CMS Status Widget */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
            <h2 className="text-[14px] font-semibold text-[#1d2327]">Eagle CMS Status</h2>
          </div>
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-[#f0f0f1] rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-[#00a32a]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-[#1d2327]">Site Health is Good</h3>
              <p className="text-[13px] text-[#646970]">Your site has no critical issues and is fully optimized for SEO.</p>
            </div>
            <Link href="/admin/settings" className="inline-block bg-[#2271b1] text-white text-[13px] px-4 py-1.5 rounded-[3px] hover:bg-[#135e96] transition-colors">
              Check Settings
            </Link>
          </div>
        </div>

      </div>

      {/* WP-Style Welcome Panel */}
      <div className="mt-8 bg-white border border-[#c3c4c7] p-8 rounded-sm shadow-sm">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-normal text-[#1d2327] mb-2 font-serif">Welcome to your dashboard</h2>
          <p className="text-[#646970] text-[15px] mb-8">We’ve assembled some links to get you started:</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-[14px] font-bold text-[#1d2327] mb-4">Get Started</h3>
              <Link href="/admin/pages/home" className="inline-block bg-[#2271b1] text-white px-6 py-2 rounded-[3px] text-[14px] hover:bg-[#135e96] mb-4">Customize Your Site</Link>
              <p className="text-[13px] text-[#646970]">or, <Link href="/admin/pages" className="text-[#2271b1] hover:underline">manage your pages</Link></p>
            </div>
            <div className="space-y-3">
              <h3 className="text-[14px] font-bold text-[#1d2327]">Next Steps</h3>
              <Link href="/admin/services" className="flex items-center gap-2 text-[#2271b1] text-[13px] hover:underline"><Plus className="w-4 h-4" /> Add a service</Link>
              <Link href="/admin/reviews" className="flex items-center gap-2 text-[#2271b1] text-[13px] hover:underline"><Plus className="w-4 h-4" /> Add a review</Link>
              <Link href="/admin/projects" className="flex items-center gap-2 text-[#2271b1] text-[13px] hover:underline"><ImageIcon className="w-4 h-4" /> Manage gallery</Link>
            </div>
            <div className="space-y-3">
              <h3 className="text-[14px] font-bold text-[#1d2327]">More Actions</h3>
              <Link href="/admin/scripts" className="flex items-center gap-2 text-[#2271b1] text-[13px] hover:underline"><Settings2 className="w-4 h-4" /> Manage Scripts</Link>
              <Link href="/admin/settings" className="flex items-center gap-2 text-[#2271b1] text-[13px] hover:underline"><Settings className="w-4 h-4" /> Global Settings</Link>
              <Link href="/" target="_blank" className="flex items-center gap-2 text-[#2271b1] text-[13px] hover:underline"><ExternalLink className="w-4 h-4" /> View frontend</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
