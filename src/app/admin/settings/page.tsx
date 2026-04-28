"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, Settings, LayoutTemplate, Type, Image as ImageIcon, ChevronRight, Globe, Mail, Phone, MapPin, Share2, Plus, Trash2, List, ExternalLink, Search, Check, X, Upload } from "lucide-react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import ImageField from "@/components/admin/ImageField";

const COMMON_ICONS = [
  "Home", "Info", "Briefcase", "Phone", "Mail", "MapPin", "Shield", "Star", "Check", "Award",
  "Hammer", "Construction", "Wind", "Sun", "Cloud", "Zap", "Layers", "Box", "Package",
  "Facebook", "Instagram", "Twitter", "Linkedin", "Youtube", "Github", "Globe",
  "Calendar", "Clock", "User", "Users", "Camera", "Image", "Video", "FileText", "File",
  "ShieldCheck", "Trophy", "CreditCard", "Settings", "Layout", "Menu", "ExternalLink",
  "ArrowRight", "ChevronRight", "Search", "Map", "Truck", "HardHat", "Ruler", "Paintbrush"
];

function IconPicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = COMMON_ICONS.filter(icon =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  const CurrentIcon = (LucideIcons as any)[value] || LucideIcons.HelpCircle;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm hover:border-black transition-colors min-w-[140px]"
      >
        <CurrentIcon className="w-4 h-4 text-black" />
        <span className="font-bold text-black">{value || "Select Icon"}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in duration-200">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {filteredIcons.map(iconName => {
              const Icon = (LucideIcons as any)[iconName];
              return (
                <button
                  key={iconName}
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                  }}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:bg-black/5 group ${value === iconName ? "bg-black text-white" : ""}`}
                  title={iconName}
                >
                  {Icon && <Icon className={`w-5 h-5 ${value === iconName ? "text-white" : "text-black group-hover:text-black"}`} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Removed legacy ImageUpload component in favor of unified ImageField

function PageSelector({ value, pages, onChange }: { value: string, pages: any[], onChange: (page: any) => void }) {
  const selectedPage = pages.find(p => p._id === value);

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-black uppercase tracking-widest">Link to CMS Page</label>
      <select 
        value={value || ""} 
        onChange={(e) => {
          const page = pages.find(p => p._id === e.target.value);
          onChange(page);
        }}
        className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5 text-xs font-bold text-black focus:bg-white focus:border-black outline-none transition-all appearance-none"
      >
        <option value="">-- Custom Link (No Page) --</option>
        {pages.map(page => (
          <option key={page._id} value={page._id}>{page.title} ({page.slug})</option>
        ))}
      </select>
    </div>
  );
}

export default function SettingsEditor() {
  const [data, setData] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch settings
    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => {
        const d = { ...json };
        // Ensure structure
        if (!d.settings) d.settings = { siteTitle: "Eagle Revolution", siteTemplate: "%s | Eagle Revolution", favicon: "/eagle-logo.png" };
        if (!d.navbar) d.navbar = { companyLinks: [], ctaText: "Book Now", ctaLink: "/contact", logo: "/eagle-logo.png" };
        setData(d);
      });

    // Fetch pages for dropdown
    fetch("/api/admin/pages")
      .then(res => res.json())
      .then(setPages)
      .catch(err => console.error("Failed to load pages:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      // 1. Update Content JSON
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // 2. Sync Page Slugs for mapped links
      const allLinks = [
        ...data.navbar.companyLinks,
        ...data.navbar.companyLinks.flatMap((l: any) => l.subLinks || [])
      ];

      for (const link of allLinks) {
        if (link.pageId) {
          const path = link.href.startsWith("/") ? link.href.substring(1) : link.href;
          await fetch(`/api/admin/pages/${link.pageId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: path, title: link.label })
          });
        }
      }

      if (res.ok) {
        setMessage("Settings and Page Mappings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save settings.");
      }
    } catch (err) {
      setMessage("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const updateData = (section: string, field: string | null, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: field ? {
        ...prev[section],
        [field]: value,
      } : value,
    }));
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General Settings", icon: Globe },
    { id: "header", label: "Header / Navbar", icon: LayoutTemplate },
    { id: "footer", label: "Footer Content", icon: List },
    { id: "contact", label: "Global Contact", icon: Phone },
    { id: "social", label: "Social Media", icon: Share2 },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-medium text-slate-900 tracking-tight">Site Settings</h1>
          <p className="text-slate-400 mt-2 text-sm font-normal">Manage global configuration, header, and footer.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-normal transition-all shadow-xl shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes("success") ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((tab: any) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm transition-all ${activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className={activeTab === tab.id ? "font-medium" : "font-normal"}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3 bg-white shadow-xl shadow-slate-200/50 border border-slate-200 rounded-3xl p-8">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                <h2 className="text-xl font-medium text-slate-900 border-b border-slate-50 pb-6">General Settings</h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Site Default Title</label>
                    <input
                      type="text"
                      value={data.settings?.siteTitle || ""}
                      onChange={(e) => updateData("settings", "siteTitle", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Site Title Template (%s is page name)</label>
                    <input
                      type="text"
                      value={data.settings?.siteTemplate || ""}
                      onChange={(e) => updateData("settings", "siteTemplate", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium"
                    />
                  </div>
                  <ImageField
                    label="Favicon URL / Logo"
                    value={data.settings?.favicon || ""}
                    onChange={(val) => updateData("settings", "favicon", val)}
                    description="The small icon shown in browser tabs."
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "header" && (
              <motion.div key="header" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                <h2 className="text-xl font-medium text-slate-900 border-b border-slate-50 pb-6">Header & Navigation</h2>

                <div className="space-y-6">
                  <ImageField
                    label="Navbar Logo"
                    value={data.navbar?.logo || ""}
                    onChange={(val) => updateData("navbar", "logo", val)}
                    description="Main logo appearing in the navigation bar."
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">CTA Button Text</label>
                      <input
                        type="text"
                        value={data.navbar?.ctaText || ""}
                        onChange={(e) => updateData("navbar", "ctaText", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">CTA Link</label>
                      <input
                        type="text"
                        value={data.navbar?.ctaLink || ""}
                        onChange={(e) => updateData("navbar", "ctaLink", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-base font-medium text-slate-900">Navigation Menu</h3>
                        <p className="text-xs text-slate-400 mt-1 font-normal">Manage top-level links and their sub-menus.</p>
                      </div>
                      <button
                        onClick={() => {
                          const newLinks = [...(data.navbar?.companyLinks || []), { label: "New Link", href: "/", icon: "Info", subLinks: [] }];
                          updateData("navbar", "companyLinks", newLinks);
                        }}
                        className="text-slate-900 border border-slate-200 px-4 py-2 rounded-xl font-normal text-xs flex items-center gap-2 hover:bg-slate-50 transition-all"
                      >
                        <Plus className="w-3 h-3" /> Add Main Link
                      </button>
                    </div>

                    <div className="space-y-6">
                      {(data.navbar?.companyLinks || []).map((link: any, idx: number) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6 relative group hover:border-slate-200 transition-colors">
                          <button
                            onClick={() => {
                              const newLinks = data.navbar.companyLinks.filter((_: any, i: number) => i !== idx);
                              updateData("navbar", "companyLinks", newLinks);
                            }}
                            className="absolute top-6 right-6 p-1 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-1.5">
                              <PageSelector 
                                value={link.pageId} 
                                pages={pages} 
                                onChange={(page) => {
                                  const newLinks = [...data.navbar.companyLinks];
                                  newLinks[idx].pageId = page?._id || "";
                                  if (page) {
                                    newLinks[idx].label = page.title;
                                    newLinks[idx].href = "/" + page.slug;
                                  }
                                  updateData("navbar", "companyLinks", newLinks);
                                }} 
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Label</label>
                              <input type="text" value={link.label} onChange={(e) => {
                                const newLinks = [...data.navbar.companyLinks];
                                newLinks[idx].label = e.target.value;
                                updateData("navbar", "companyLinks", newLinks);
                              }} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-sm font-normal focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Custom Path</label>
                              <input type="text" value={link.href} onChange={(e) => {
                                const newLinks = [...data.navbar.companyLinks];
                                newLinks[idx].href = e.target.value;
                                updateData("navbar", "companyLinks", newLinks);
                              }} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-sm font-normal focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Icon</label>
                              <IconPicker value={link.icon} onChange={(val) => {
                                const newLinks = [...data.navbar.companyLinks];
                                newLinks[idx].icon = val;
                                updateData("navbar", "companyLinks", newLinks);
                              }} />
                            </div>
                          </div>

                          {/* Sublinks Section */}
                          <div className="pl-6 border-l-2 border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Sub-Menu Links</h4>
                              <button
                                onClick={() => {
                                  const newLinks = [...data.navbar.companyLinks];
                                  if (!newLinks[idx].subLinks) newLinks[idx].subLinks = [];
                                  newLinks[idx].subLinks.push({ label: "Sub Link", href: "/", icon: "" });
                                  updateData("navbar", "companyLinks", newLinks);
                                }}
                                className="text-[10px] font-medium text-primary hover:underline flex items-center gap-1"
                              >
                                <Plus className="w-2 h-2" /> Add Sub-Link
                              </button>
                            </div>

                            {(link.subLinks || []).map((sub: any, sIdx: number) => (
                              <div key={sIdx} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center bg-white/50 p-2 rounded-lg border border-slate-100">
                                <PageSelector 
                                  value={sub.pageId} 
                                  pages={pages} 
                                  onChange={(page) => {
                                    const newLinks = [...data.navbar.companyLinks];
                                    newLinks[idx].subLinks[sIdx].pageId = page?._id || "";
                                    if (page) {
                                      newLinks[idx].subLinks[sIdx].label = page.title;
                                      newLinks[idx].subLinks[sIdx].href = "/" + page.slug;
                                    }
                                    updateData("navbar", "companyLinks", newLinks);
                                  }} 
                                />
                                <input type="text" value={sub.label} onChange={(e) => {
                                  const newLinks = [...data.navbar.companyLinks];
                                  newLinks[idx].subLinks[sIdx].label = e.target.value;
                                  updateData("navbar", "companyLinks", newLinks);
                                }} placeholder="Label" className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-medium" />
                                <input type="text" value={sub.href} onChange={(e) => {
                                  const newLinks = [...data.navbar.companyLinks];
                                  newLinks[idx].subLinks[sIdx].href = e.target.value;
                                  updateData("navbar", "companyLinks", newLinks);
                                }} placeholder="Path" className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs" />
                                <div className="flex items-center gap-2">
                                  <IconPicker value={sub.icon} onChange={(val) => {
                                    const newLinks = [...data.navbar.companyLinks];
                                    newLinks[idx].subLinks[sIdx].icon = val;
                                    updateData("navbar", "companyLinks", newLinks);
                                  }} />
                                  <button onClick={() => {
                                    const newLinks = [...data.navbar.companyLinks];
                                    newLinks[idx].subLinks = newLinks[idx].subLinks.filter((_: any, i: number) => i !== sIdx);
                                    updateData("navbar", "companyLinks", newLinks);
                                  }} className="text-slate-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "footer" && (
              <motion.div key="footer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                <h2 className="text-xl font-medium text-slate-900 border-b border-slate-50 pb-6">Footer Management</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Company Name</label>
                      <input type="text" value={data.footer?.company?.name || ""} onChange={(e) => updateData("footer", "company", { ...data.footer.company, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Company Tagline</label>
                      <input type="text" value={data.footer?.company?.tagline || ""} onChange={(e) => updateData("footer", "company", { ...data.footer.company, tagline: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900" />
                    </div>
                  </div>
                  <ImageField
                    label="Footer Logo"
                    value={data.footer?.company?.logo || ""}
                    onChange={(val) => updateData("footer", "company", { ...data.footer.company, logo: val })}
                    description="Brand logo for the footer section."
                  />
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Footer Description</label>
                    <textarea rows={3} value={data.footer?.company?.description || ""} onChange={(e) => updateData("footer", "company", { ...data.footer.company, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900" />
                  </div>

                  <div className="pt-10 border-t border-slate-50 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-base font-medium text-slate-900">Footer Marquee</h3>
                        <p className="text-xs text-slate-400 mt-1 font-normal">Animated scrolling text at the very bottom.</p>
                      </div>
                      <button onClick={() => updateData("footer", "marquee", { ...data.footer.marquee, texts: [...(data.footer.marquee?.texts || []), "New Marquee Text"] })} className="text-slate-900 border border-slate-200 px-4 py-2 rounded-xl font-normal text-xs flex items-center gap-2 hover:bg-slate-50 transition-all">+ Add Text</button>
                    </div>
                    <div className="space-y-3">
                      {(data.footer?.marquee?.texts || []).map((t: string, i: number) => (
                        <div key={i} className="flex gap-2 items-center bg-white border border-slate-100 p-2 rounded-xl">
                          <input type="text" value={t} onChange={(e) => {
                            const nt = [...data.footer.marquee.texts];
                            nt[i] = e.target.value;
                            updateData("footer", "marquee", { ...data.footer.marquee, texts: nt });
                          }} className="flex-1 bg-transparent px-2 py-1 text-sm font-normal outline-none" />
                          <button onClick={() => {
                            const nt = data.footer.marquee.texts.filter((_: any, idx: number) => idx !== i);
                            updateData("footer", "marquee", { ...data.footer.marquee, texts: nt });
                          }} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h3 className="text-lg font-medium text-slate-800">Newsletter Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Input Placeholder</label>
                        <input type="text" value={data.footer?.newsletter?.placeholder || ""} onChange={(e) => updateData("footer", "newsletter", { ...data.footer.newsletter, placeholder: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Button Text</label>
                        <input type="text" value={data.footer?.newsletter?.buttonText || ""} onChange={(e) => updateData("footer", "newsletter", { ...data.footer.newsletter, buttonText: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-slate-800">Certifications</h3>
                      <button onClick={() => updateData("footer", "certifications", [...(data.footer?.certifications || []), { cert: "New Cert", number: "12345", icon: "ShieldCheck" }])} className="text-xs font-medium text-primary">+ Add Cert</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(data.footer?.certifications || []).map((c: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                          <button onClick={() => updateData("footer", "certifications", data.footer.certifications.filter((_: any, idx: number) => idx !== i))} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                          <div className="space-y-2">
                            <input type="text" value={c.cert} onChange={(e) => {
                              const nc = [...data.footer.certifications];
                              nc[i].cert = e.target.value;
                              updateData("footer", "certifications", nc);
                            }} placeholder="Cert Name" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-medium" />
                            <div className="flex gap-2">
                              <input type="text" value={c.number} onChange={(e) => {
                                const nc = [...data.footer.certifications];
                                nc[i].number = e.target.value;
                                updateData("footer", "certifications", nc);
                              }} placeholder="Number" className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px]" />
                              <IconPicker value={c.icon} onChange={(val) => {
                                const nc = [...data.footer.certifications];
                                nc[i].icon = val;
                                updateData("footer", "certifications", nc);
                              }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-50 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-base font-medium text-slate-900">Copyright & Bottom Bar</h3>
                        <p className="text-xs text-slate-400 mt-1 font-normal">Legal links and copyright information.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Copyright Text</label>
                        <input type="text" value={data.footer?.bottom?.copyright || ""} onChange={(e) => updateData("footer", "bottom", { ...data.footer.bottom, copyright: e.target.value })} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-normal" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Rights Text</label>
                        <input type="text" value={data.footer?.bottom?.rights || ""} onChange={(e) => updateData("footer", "bottom", { ...data.footer.bottom, rights: e.target.value })} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-normal" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Bottom Tagline</label>
                      <input type="text" value={data.footer?.bottom?.tagline || ""} onChange={(e) => updateData("footer", "bottom", { ...data.footer.bottom, tagline: e.target.value })} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-normal" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Bottom Bar Links</label>
                        <button onClick={() => updateData("footer", "bottom", { ...data.footer.bottom, links: [...(data.footer.bottom?.links || []), { label: "New Link", href: "/" }] })} className="text-xs font-normal text-slate-400 hover:text-slate-900">+ Add Link</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(data.footer?.bottom?.links || []).map((l: any, i: number) => (
                          <div key={i} className="flex gap-2 bg-white border border-slate-100 p-2 rounded-xl items-center group">
                            <input type="text" value={l.label} onChange={(e) => {
                              const nl = [...data.footer.bottom.links];
                              nl[i].label = e.target.value;
                              updateData("footer", "bottom", { ...data.footer.bottom, links: nl });
                            }} className="flex-1 bg-transparent px-2 py-1 text-xs font-normal outline-none" placeholder="Label" />
                            <input type="text" value={l.href} onChange={(e) => {
                              const nl = [...data.footer.bottom.links];
                              nl[i].href = e.target.value;
                              updateData("footer", "bottom", { ...data.footer.bottom, links: nl });
                            }} className="flex-1 bg-transparent px-2 py-1 text-xs font-normal border-l border-slate-100 outline-none" placeholder="URL" />
                            <button onClick={() => {
                              const nl = data.footer.bottom.links.filter((_: any, idx: number) => idx !== i);
                              updateData("footer", "bottom", { ...data.footer.bottom, links: nl });
                            }} className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                <h2 className="text-xl font-medium text-slate-900 border-b border-slate-50 pb-6">Global Contact Info</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Public Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="email" value={data.footer?.contact?.email || ""} onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Public Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" value={data.footer?.contact?.phone || ""} onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Full Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                      <textarea rows={2} value={data.footer?.contact?.address || ""} onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Emergency Line Text</label>
                      <input type="text" value={data.footer?.contact?.emergency || ""} onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, emergency: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Service Areas Summary</label>
                      <input type="text" value={data.footer?.contact?.areas || ""} onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, areas: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h3 className="text-lg font-medium text-slate-800">Office Hours</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">Monday - Friday</label>
                        <input type="text" value={data.hours?.monday || ""} onChange={(e) => updateData("hours", "monday", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">Saturday</label>
                        <input type="text" value={data.hours?.saturday || ""} onChange={(e) => updateData("hours", "saturday", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">Sunday</label>
                        <input type="text" value={data.hours?.sunday || ""} onChange={(e) => updateData("hours", "sunday", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "social" && (
              <motion.div key="social" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                  <h2 className="text-xl font-medium text-slate-900">Social Media Links</h2>
                  <button
                    onClick={() => {
                      const newSocial = [...(data.footer?.social || []), { platform: "Facebook", href: "", icon: "Facebook" }];
                      updateData("footer", "social", newSocial);
                    }}
                    className="text-slate-900 border border-slate-200 px-4 py-2 rounded-xl font-normal text-xs flex items-center gap-2 hover:bg-slate-50 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(data.footer?.social || []).map((s: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6 relative group hover:border-slate-200 transition-colors">
                      <button
                        onClick={() => {
                          const newSocial = data.footer.social.filter((_: any, idx: number) => idx !== i);
                          updateData("footer", "social", newSocial);
                        }}
                        className="absolute top-6 right-6 p-1 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Platform</label>
                          <input type="text" value={s.platform} onChange={(e) => {
                            const ns = [...data.footer.social];
                            ns[i].platform = e.target.value;
                            updateData("footer", "social", ns);
                          }} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-sm font-normal focus:bg-white transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Icon</label>
                          <IconPicker value={s.icon} onChange={(val) => {
                            const ns = [...data.footer.social];
                            ns[i].icon = val;
                            updateData("footer", "social", ns);
                          }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Profile URL</label>
                        <input type="text" value={s.href} onChange={(e) => {
                          const ns = [...data.footer.social];
                          ns[i].href = e.target.value;
                          updateData("footer", "social", ns);
                        }} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-sm font-normal focus:bg-white transition-colors" placeholder="https://..." />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
