"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Briefcase, Users, Star,
  HelpCircle, ImageIcon, Phone, Settings, LogOut,
  Shield, Menu, X, ChevronRight, Globe, Folder
} from "lucide-react";

const navItems = [
  { label: "Dashboard",   href: "/admin",          icon: LayoutDashboard },
  { label: "Pages",       href: "/admin/pages",     icon: FileText },
  { label: "Reviews",     href: "/admin/reviews",   icon: Star },
  { label: "Projects",    href: "/admin/projects",  icon: Folder },
  { label: "FAQ",         href: "/admin/faq",       icon: HelpCircle },
  { label: "Services",    href: "/admin/services",  icon: Briefcase },
  { label: "Submissions", href: "/admin/submissions", icon: Phone },
  { label: "Settings",    href: "/admin/settings",  icon: Settings },
];

function Sidebar({ collapsed, onClose }: { collapsed?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="h-full flex flex-col bg-white border-r border-slate-200 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-8 border-b border-slate-200">
        <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-gray-900 font-bold text-base leading-tight truncate">Eagle Revolution</p>
          <p className="text-primary/60 text-[10px] uppercase tracking-[0.2em] font-bold">CMS Admin</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-900 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group relative ${
                active
                  ? "text-primary bg-primary/5 border border-primary/20 shadow-sm"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}`} />
              <span className="truncate">{label}</span>
              {active && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-primary/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-slate-200 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all"
        >
          <Globe className="w-4 h-4" />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 flex-col flex-shrink-0 z-50">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-4 border-b border-slate-200 bg-white shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-gray-900 text-base font-bold tracking-tight">Eagle CMS</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative p-6 sm:p-8 lg:p-10 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
