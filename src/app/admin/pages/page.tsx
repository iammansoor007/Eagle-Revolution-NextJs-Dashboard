"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Info, HelpCircle, Phone, ArrowRight, ChevronRight, Layout, Star, Folder } from "lucide-react";

export default function PagesDashboard() {
  const pages = [
    { name: "Homepage", href: "/admin/pages/home", icon: Home, description: "Manage Hero, About preview, Why Choose Us, and Quote sections." },
    { name: "About Page", href: "/admin/pages/about", icon: Info, description: "Manage the full company story, mission, and leadership." },
    { name: "FAQ Page", href: "/admin/pages/faq", icon: HelpCircle, description: "Manage the full FAQ page header, intro text, and filtering." },
    { name: "Contact Page", href: "/admin/pages/contact", icon: Phone, description: "Manage contact information and header content." },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
          <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-bold">Pages</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Content Management</h1>
        <p className="text-slate-600 text-lg font-medium italic">Select a section to update your website's visual content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pages.map((page, i) => (
          <motion.div
            key={page.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={page.href}>
              <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl hover:shadow-slate-200 hover:border-primary/30 transition-all duration-500 relative overflow-hidden h-full shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-inner">
                      <page.icon className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight group-hover:text-primary transition-colors">{page.name}</h2>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      {page.description}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center text-xs font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                    Edit Section <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Global Elements */}
      <div className="mt-16 pt-10 border-t border-slate-200">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Global Site Elements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/admin/projects" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary/40 transition-all shadow-sm">
            <Folder className="w-6 h-6 text-slate-400 mb-4 group-hover:text-primary transition-colors" />
            <h3 className="text-slate-900 font-bold mb-1">Portfolio</h3>
            <p className="text-slate-400 text-xs font-medium">Manage projects grid</p>
          </Link>
          <Link href="/admin/reviews" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary/40 transition-all shadow-sm">
            <Star className="w-6 h-6 text-slate-400 mb-4 group-hover:text-primary transition-colors" />
            <h3 className="text-slate-900 font-bold mb-1">Reviews</h3>
            <p className="text-slate-400 text-xs font-medium">Customer testimonials</p>
          </Link>
          <Link href="/admin/submissions" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary/40 transition-all shadow-sm">
            <Phone className="w-6 h-6 text-slate-400 mb-4 group-hover:text-primary transition-colors" />
            <h3 className="text-slate-900 font-bold mb-1">Submissions</h3>
            <p className="text-slate-400 text-xs font-medium">Form lead inquiries</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
