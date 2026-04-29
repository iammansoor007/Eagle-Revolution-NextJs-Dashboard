"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Briefcase, Star,
  HelpCircle, ImageIcon, Phone, Settings, LogOut,
  Shield, Menu, X, Globe, Folder, Code2, ExternalLink, User, Plus, ChevronDown
} from "lucide-react";

const navItems = [
  { label: "Dashboard",   href: "/admin",           icon: LayoutDashboard },
  { label: "Pages",       href: "/admin/pages",      icon: FileText, sub: [{label: "All Pages", href: "/admin/pages"}, {label: "Add New", href: "/admin/pages"}] },
  { label: "Media",       href: "/admin/media",      icon: ImageIcon, sub: [{label: "Library", href: "/admin/media"}, {label: "Add New", href: "/admin/media"}] },
  { label: "Reviews",     href: "/admin/reviews",    icon: Star, sub: [{label: "All Reviews", href: "/admin/reviews"}, {label: "Add New", href: "/admin/reviews"}] },
  { label: "Projects",    href: "/admin/projects",   icon: Folder, sub: [{label: "All Projects", href: "/admin/projects"}, {label: "Add New", href: "/admin/projects"}] },
  { label: "FAQ",         href: "/admin/faq",        icon: HelpCircle, sub: [{label: "All FAQs", href: "/admin/faq"}, {label: "Add New", href: "/admin/faq"}] },
  { label: "Services",    href: "/admin/services",   icon: Briefcase, sub: [{label: "All Services", href: "/admin/services"}, {label: "Add New", href: "/admin/services"}] },
  { label: "Submissions", href: "/admin/submissions", icon: Phone },
  { label: "Scripts",     href: "/admin/scripts",    icon: Code2 },
  { label: "Settings",    href: "/admin/settings",   icon: Settings },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSub, setOpenSub] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="h-full flex flex-col bg-[#1d2327] text-[#f0f0f1] select-none border-r border-[#3c434a]">
      {/* Main Nav */}
      <nav className="flex-1 py-1 no-scrollbar">
        {navItems.map(({ label, href, icon: Icon, sub }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          const hasSub = !!sub;
          
          return (
            <div 
              key={href} 
              className="relative group"
            >
              <Link
                href={href}
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-[14px] transition-colors relative ${
                  active
                    ? "bg-[#2271b1] text-white font-semibold"
                    : "hover:bg-[#2c3338] hover:text-[#72aee6] text-[#c3c4c7]"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${active ? "text-white" : "text-[#a7aaad] group-hover:text-[#72aee6]"}`} />
                <span className="flex-1">{label}</span>
                {active && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#72aee6]" />
                )}
              </Link>
              
              {/* WP Style Flyout Submenu */}
              {hasSub && (
                <div className="absolute left-[100%] top-0 w-40 bg-[#2c3338] border-y border-r border-[#3c434a] shadow-lg hidden group-hover:block z-[9999]">
                  <div className="py-1">
                    {sub.map(s => (
                       <Link 
                        key={s.label} 
                        href={s.href} 
                        onClick={onClose}
                        className="block px-4 py-2 text-[13px] text-[#c3c4c7] hover:text-[#72aee6] transition-colors border-b border-[#3c434a] last:border-0"
                       >
                          {s.label}
                       </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-2 bg-[#1d2327] border-t border-[#3c434a]">
         <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#c3c4c7] hover:text-[#72aee6] transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Visit Website</span>
          </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#c3c4c7] hover:text-[#d63638] transition-colors rounded"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
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
    <div className="h-screen flex flex-col bg-[#f0f0f1] text-[#2c3338] overflow-hidden antialiased font-sans">
      {/* WP Admin Toolbar */}
      <header className="flex items-center justify-between px-2 h-8 bg-[#1d2327] text-[#c3c4c7] text-[13px] z-[60] flex-shrink-0">
         <div className="flex items-center h-full">
            <Link href="/admin" className="hover:bg-[#2c3338] px-3 h-full flex items-center gap-2">
               <Shield className="w-4 h-4 text-[#72aee6]" />
               <span className="font-bold text-[#f0f0f1]">Eagle Revolution</span>
            </Link>
            <Link href="/" target="_blank" className="hover:bg-[#2c3338] px-3 h-full flex items-center gap-1.5 transition-colors">
               <Globe className="w-3.5 h-3.5" />
               <span className="font-medium text-[#c3c4c7]">Visit Site</span>
            </Link>
            
            {/* Standard WP + New Menu */}
            <div className="relative h-full group">
               <div className="hover:bg-[#2c3338] px-3 h-full flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
               </div>
               <div className="absolute left-0 top-full w-40 bg-[#2c3338] border border-[#3c434a] shadow-lg hidden group-hover:block">
                  <Link href="/admin/pages" className="block px-4 py-2 hover:text-[#72aee6] border-b border-[#3c434a]">Page</Link>
                  <Link href="/admin/services" className="block px-4 py-2 hover:text-[#72aee6] border-b border-[#3c434a]">Service</Link>
                  <Link href="/admin/reviews" className="block px-4 py-2 hover:text-[#72aee6] border-b border-[#3c434a]">Review</Link>
                  <Link href="/admin/projects" className="block px-4 py-2 hover:text-[#72aee6] border-b border-[#3c434a]">Project</Link>
                  <Link href="/admin/media" className="block px-4 py-2 hover:text-[#72aee6]">Media</Link>
               </div>
            </div>
         </div>
         <div className="flex items-center h-full">
            <div className="hover:bg-[#2c3338] px-3 h-full flex items-center gap-2 cursor-pointer group">
               <span className="text-[#c3c4c7] group-hover:text-[#72aee6]">Howdy, Admin</span>
               <div className="w-5 h-5 bg-[#3c434a] rounded-sm flex items-center justify-center overflow-hidden border border-[#50575e]">
                  <User className="w-4 h-4 text-[#a7aaad]" />
               </div>
            </div>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* WP Admin Sidebar - Desktop */}
        <div className="hidden lg:flex w-40 flex-col flex-shrink-0 z-50">
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
                className="fixed inset-0 bg-[#00000066] z-[70] lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: -200 }}
                animate={{ x: 0 }}
                exit={{ x: -200 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="fixed left-0 top-8 bottom-0 w-48 z-[80] lg:hidden"
              >
                <Sidebar onClose={() => setMobileOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center px-4 py-2 bg-[#1d2327] text-white shadow-sm border-t border-[#3c434a]">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1 text-[#a7aaad] hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="ml-3 text-sm font-semibold uppercase tracking-wider text-[#c3c4c7]">Menu</span>
          </div>

          {/* Content scrolling area */}
          <main className="flex-1 overflow-y-auto relative p-3 md:p-4 lg:p-6">
             {children}
          </main>
        </div>
      </div>

      <style jsx global>{`
        body {
          background-color: #f0f0f1;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Custom scrollbar to match WP */
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #f0f0f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #c3c4c7;
          border: 2px solid #f0f0f1;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a7aaad;
        }
      `}</style>
    </div>
  );
}
