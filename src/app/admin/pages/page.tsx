"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Info, HelpCircle, Phone, ArrowRight, ChevronRight, Layout, Star, Folder, Briefcase } from "lucide-react";

export default function PagesDashboard() {
  const pages = [
    { name: "Homepage", href: "/admin/pages/home", icon: Home, description: "Manage Hero, About preview, Why Choose Us, and Quote sections." },
    { name: "About Page", href: "/admin/pages/about", icon: Info, description: "Manage the full company story, mission, and leadership." },
    { name: "Meet the Team", href: "/admin/pages/team", icon: Layout, description: "Manage team member profiles, photos, roles, and bio text." },
    { name: "Careers Page", href: "/admin/pages/careers", icon: Briefcase, description: "Manage job openings, benefits, and career header." },
    { name: "Gallery Page", href: "/admin/pages/gallery", icon: Folder, description: "Manage the project gallery header and category text." },
    { name: "Reviews Page", href: "/admin/pages/reviews", icon: Star, description: "Manage the customer reviews page header and testimonials." },
    { name: "Services Page", href: "/admin/pages/services", icon: Layout, description: "Manage the services list header, headlines, and general intro." },
    { name: "FAQ Page", href: "/admin/pages/faq", icon: HelpCircle, description: "Manage the full FAQ page header, intro text, and filtering." },
    { name: "Contact Page", href: "/admin/pages/contact", icon: Phone, description: "Manage contact information and header content." },
  ];

  const globals = [
    { name: "Services Bank", href: "/admin/services", icon: Layout, desc: "Detailed service descriptions" },
    { name: "Portfolio Grid", href: "/admin/projects", icon: Folder, desc: "Project gallery items" },
    { name: "Reviews Bank", href: "/admin/reviews", icon: Star, desc: "Customer testimonials" },
    { name: "FAQ Data", href: "/admin/faq", icon: HelpCircle, desc: "Question bank management" },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
          <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-bold">Content Editor</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Page Management</h1>
        <p className="text-slate-500 font-medium italic">Update your website content section by section.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Core Pages</h2>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {pages.map((page, i) => (
              <Link key={page.name} href={page.href} className="group block">
                <div className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <page.icon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{page.name}</h3>
                      <p className="text-slate-500 text-sm font-medium line-clamp-1">{page.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-10 mb-4">Global Data Banks</h2>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {globals.map((item) => (
              <Link key={item.name} href={item.href} className="group block">
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <item.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
