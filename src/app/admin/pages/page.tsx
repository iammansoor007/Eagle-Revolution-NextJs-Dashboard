"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Info, HelpCircle, Phone, ArrowRight, ChevronRight } from "lucide-react";

export default function PagesDashboard() {
  const pages = [
    { name: "Homepage", href: "/admin/pages/home", icon: Home, description: "Manage Hero, About preview, Why Choose Us, and Quote sections." },
    { name: "About Page", href: "/admin/pages/about", icon: Info, description: "Manage the full company story, mission, and leadership." },
    { name: "FAQ Page", href: "/admin/faq", icon: HelpCircle, description: "Manage frequently asked questions." },
    { name: "Contact Page", href: "/admin/pages/contact", icon: Phone, description: "Manage contact information and header content." },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Pages</h1>
        <p className="text-slate-700 text-lg font-medium">Select a page to manage its content and settings.</p>
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
              <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden h-full shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 shadow-inner">
                      <page.icon className="w-7 h-7 text-slate-500 group-hover:text-primary transition-colors" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{page.name}</h2>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {page.description}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center text-xs font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit Content <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
