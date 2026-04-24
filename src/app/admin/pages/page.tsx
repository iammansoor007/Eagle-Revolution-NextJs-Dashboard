"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Info, HelpCircle, Phone, ArrowUpRight } from "lucide-react";

export default function PagesDashboard() {
  const pages = [
    { title: "Homepage", path: "/admin/pages/home", icon: Home, description: "Manage Hero, About preview, Why Choose Us, and Quote sections." },
    { title: "About Page", path: "/admin/pages/about", icon: Info, description: "Manage the full company story, mission, and leadership." },
    { title: "FAQ Page", path: "/admin/faq", icon: HelpCircle, description: "Manage frequently asked questions." },
    { title: "Contact Page", path: "/admin/contact", icon: Phone, description: "Manage contact information and locations." },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pages Management</h1>
        <p className="text-white/50 text-sm">Select a page to edit its static content and layout data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map((page, i) => {
          const Icon = page.icon;
          return (
            <motion.div
              key={page.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={page.path} className="group block bg-white/[0.02] border border-white/[0.05] hover:border-primary/40 hover:bg-white/[0.04] p-5 rounded-2xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{page.title}</h2>
                    <p className="text-sm text-white/50 line-clamp-2">{page.description}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
