"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Pencil, Trash2, Loader2, HelpCircle, Save, X, 
  ChevronRight, Globe, Layers, ListFilter, Layout, 
  Settings, Info, Shield, CheckCircle, HelpCircle as FaqIcon,
  Search, ExternalLink, Image as ImageIcon, Upload,
  Check, MoveUp, MoveDown, Home, Building2, Building, 
  Droplets, ShieldCheck, Clock, Award, Users, TrendingUp, 
  BadgeCheck, Star, Zap, Sparkles, Palette, Sun, Snowflake,
  Trophy, Hammer, Truck, ClipboardCheck, FileText, ArrowRight,
  Wrench, HardHat, Ruler, Paintbrush, Wind, Flame, Thermometer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ImageField from "@/components/admin/ImageField";
import SeoEditor from "@/components/admin/SeoEditor";

const ICON_LIST = [
  "Home", "Layout", "Building2", "Building", "Droplets", "Shield", "ShieldCheck", 
  "Award", "Clock", "BadgeCheck", "TrendingUp", "Star", "Zap", "Sparkles", 
  "Palette", "Sun", "Snowflake", "Trophy", "Hammer", "Truck", "ClipboardCheck", 
  "FileText", "ArrowRight", "CheckCircle", "Check", "Wrench", "HardHat", 
  "Ruler", "Paintbrush", "Wind", "Flame", "Thermometer", "Users"
];

const IconComponentMap: Record<string, any> = {
  Home, Layout, Building2, Building, Droplets, Shield, ShieldCheck, 
  Award, Clock, BadgeCheck, TrendingUp, Star, Zap, Sparkles, 
  Palette, Sun, Snowflake, Trophy, Hammer, Truck, ClipboardCheck, 
  FileText, ArrowRight, CheckCircle, Check, Wrench, HardHat, 
  Ruler, Paintbrush, Wind, Flame, Thermometer, Users
};

function IconSelector({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const SelectedIcon = IconComponentMap[value] || HelpCircle;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
      >
        <SelectedIcon className="w-5 h-5 text-primary" />
        <span className="flex-1 text-left">{value || "Select Icon"}</span>
        <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 grid grid-cols-6 gap-2 max-h-64 overflow-y-auto"
          >
            {ICON_LIST.map((iconName) => {
              const IconComp = IconComponentMap[iconName];
              return (
                <button
                  key={iconName}
                  onClick={() => {
                    onChange(iconName);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                    value === iconName ? "bg-primary text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}
                  title={iconName}
                >
                  <IconComp className="w-5 h-5" />
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function ServicesAdminPage() {
  const [data, setData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("general"); 
  const [seo, setSeo] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Form State
  const [form, setForm] = useState<any>({
    title: "",
    slug: "",
    tagline: "",
    description: "",
    overviewTitle: "",
    overview: "",
    overviewImage: "",
    cta: { text: "Start Your Project", link: "/contact" },
    icon: "Layout",
    tag: "",
    features: [] as any[], 
    stats: [] as any[],
    benefits: [] as any[],
    process: [] as any[],
    faq: [] as any[]
  });

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setServices(json.services?.services || []);
      });
  }, []);

  // Slug Generation Logic
  useEffect(() => {
    if (isEditing !== null && form.title) {
      const generatedSlug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-");
      
      if (form.slug !== generatedSlug) {
        setForm((prev: any) => ({ ...prev, slug: generatedSlug }));
      }
    }
  }, [form.title]);

  const saveToDb = async (newServices: any[]) => {
    setSaving(true);
    const updatedData = {
      ...data,
      services: {
        ...data.services,
        services: newServices
      }
    };

    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        setData(updatedData);
        setServices(newServices);
        setMessage("Services updated successfully!");
        setTimeout(() => setMessage(""), 3000);
        setIsEditing(null);
      }
    } catch (err) {
      setMessage("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveService = () => {
    if (!form.title || !form.slug) {
      alert("Title is required.");
      return;
    }

    const newServices = [...services];
    const serviceData = { 
      ...form, 
      seo: seo,
      id: form.id || Date.now().toString(),
      number: form.number || (services.length + 1).toString().padStart(2, '0')
    };

    if (isEditing !== null && isEditing < services.length) {
      newServices[isEditing] = serviceData;
    } else {
      newServices.push(serviceData);
    }

    saveToDb(newServices);
  };

  const handleDeleteService = (idx: number) => {
    if (!confirm("Are you sure you want to delete this service? All page content for this service will be lost.")) return;
    const newServices = services.filter((_, i) => i !== idx);
    saveToDb(newServices);
  };

  const handleEdit = (idx: number) => {
    const service = services[idx];
    const normalizedFeatures = (service.features || []).map((f: any) => 
      typeof f === 'string' ? { text: f, icon: "CheckCircle" } : f
    );
    
    setForm({
      ...service,
      features: normalizedFeatures,
      overviewTitle: service.overviewTitle || "Craftsmanship Without Compromise.",
      cta: service.cta || { text: "Start Your Project", link: "/contact" }
    });
    setSeo(service.seo || {});
    setIsEditing(idx);
    setActiveTab("general");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addNewItem = (field: string, template: any) => {
    setForm({ ...form, [field]: [...(form[field] || []), template] });
  };

  const removeItem = (field: string, idx: number) => {
    const newList = [...form[field]];
    newList.splice(idx, 1);
    setForm({ ...form, [field]: newList });
  };

  const updateListItem = (field: string, idx: number, key: string, value: any) => {
    const newList = [...form[field]];
    newList[idx] = { ...newList[idx], [key]: value };
    setForm({ ...form, [field]: newList });
  };

  if (!data) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
            <Link href="/admin/pages" className="hover:text-primary transition-colors font-bold">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-bold">Services Management</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manage Services</h1>
          <p className="text-slate-500 font-medium mt-1">Create and customize every detail of your service offerings.</p>
        </div>
        
        {isEditing === null && (
          <button
            onClick={() => {
              setIsEditing(services.length);
              setForm({
                title: "", slug: "", tagline: "", description: "", overviewTitle: "Craftsmanship Without Compromise.", overview: "", overviewImage: "",
                cta: { text: "Start Your Project", link: "/contact" },
                icon: "Layout", tag: "", features: [], stats: [], benefits: [], process: [], faq: []
              });
              setActiveTab("general");
            }}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Service
          </button>
        )}
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl mb-8 text-center font-bold shadow-sm shadow-emerald-100/50">
          {message}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isEditing !== null ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl mb-12"
          >
            {/* Editor Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEditing < services.length ? `Edit Service: ${form.title}` : "Create New Service"}
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">Fill in all details to build a premium service page.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(null)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveService}
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Service
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-8 bg-white sticky top-0 z-10 overflow-x-auto">
              {[
                { id: "general", label: "General Info", icon: Info },
                { id: "content", label: "Page Content", icon: Layout },
                { id: "features", label: "Stats & Benefits", icon: Shield },
                { id: "steps", label: "Process Steps", icon: CheckCircle },
                { id: "faq", label: "Service FAQs", icon: FaqIcon },
                { id: "seo", label: "SEO Management", icon: Globe }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-5 font-bold text-sm transition-all relative whitespace-nowrap ${
                    activeTab === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <div className="p-10 bg-slate-50/30 min-h-[500px]">
              {activeTab === "general" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Service Title</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="e.g. Residential Roofing"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">URL Slug (Auto-generated)</label>
                      <input
                        type="text"
                        value={form.slug}
                        readOnly
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-400 font-bold outline-none cursor-not-allowed"
                        placeholder="Generated from title..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Service Icon</label>
                      <IconSelector 
                        value={form.icon} 
                        onChange={(val) => setForm({ ...form, icon: val })} 
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Category Tag</label>
                      <input
                        type="text"
                        value={form.tag}
                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="e.g. Roofing"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Brief Description (Card View)</label>
                      <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="A short summary for the services list page..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "content" && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Page Tagline</label>
                        <input
                          type="text"
                          value={form.tagline}
                          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                          placeholder="e.g. Military Grade Protection"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Section Heading</label>
                        <input
                          type="text"
                          value={form.overviewTitle}
                          onChange={(e) => setForm({ ...form, overviewTitle: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                          placeholder="e.g. Craftsmanship Without Compromise."
                        />
                      </div>
                      <ImageField 
                        label="Section Image"
                        value={form.overviewImage || ""}
                        onChange={(val) => setForm({ ...form, overviewImage: val })}
                        description="This image appears in the overview section of the service page."
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">CTA Button Text</label>
                        <input
                          type="text"
                          value={form.cta?.text}
                          onChange={(e) => setForm({ ...form, cta: { ...form.cta, text: e.target.value } })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">CTA Button Link</label>
                        <input
                          type="text"
                          value={form.cta?.link}
                          onChange={(e) => setForm({ ...form, cta: { ...form.cta, link: e.target.value } })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Overview Description</label>
                        <textarea
                          rows={4}
                          value={form.overview}
                          onChange={(e) => setForm({ ...form, overview: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-extrabold text-slate-900 uppercase tracking-tight">Key Points (Bullet List)</h3>
                      <button onClick={() => addNewItem("features", { text: "", icon: "CheckCircle" })} className="text-sm font-bold text-primary hover:underline">+ Add Key Point</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {form.features?.map((f: any, idx: number) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 items-center shadow-sm">
                          <div className="w-1/3">
                            <IconSelector value={f.icon} onChange={(val) => updateListItem("features", idx, "icon", val)} />
                          </div>
                          <input 
                            placeholder="Point Text" 
                            value={f.text} 
                            onChange={(e) => updateListItem("features", idx, "text", e.target.value)} 
                            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold" 
                          />
                          <button onClick={() => removeItem("features", idx)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "features" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900 uppercase tracking-tight text-sm">Service Stats</h3>
                      <button onClick={() => addNewItem("stats", { value: "", label: "", icon: "Star" })} className="text-xs text-primary font-bold hover:underline">+ Add Stat</button>
                    </div>
                    <div className="space-y-4">
                      {form.stats?.map((stat: any, idx: number) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-sm">
                          <div className="flex gap-2">
                             <input placeholder="Value" value={stat.value} onChange={(e) => updateListItem("stats", idx, "value", e.target.value)} className="w-24 bg-slate-50 border-none rounded-lg p-2 text-xs font-bold" />
                             <input placeholder="Label" value={stat.label} onChange={(e) => updateListItem("stats", idx, "label", e.target.value)} className="flex-1 bg-slate-50 border-none rounded-lg p-2 text-xs" />
                             <button onClick={() => removeItem("stats", idx)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <IconSelector value={stat.icon} onChange={(val) => updateListItem("stats", idx, "icon", val)} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900 uppercase tracking-tight text-sm">Key Benefits</h3>
                      <button onClick={() => addNewItem("benefits", { title: "", description: "", icon: "Shield" })} className="text-xs text-primary font-bold hover:underline">+ Add Benefit</button>
                    </div>
                    <div className="space-y-4">
                      {form.benefits?.map((benefit: any, idx: number) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <input placeholder="Title" value={benefit.title} onChange={(e) => updateListItem("benefits", idx, "title", e.target.value)} className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold" />
                            <button onClick={() => removeItem("benefits", idx)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <IconSelector value={benefit.icon} onChange={(val) => updateListItem("benefits", idx, "icon", val)} />
                          <textarea placeholder="Description" rows={2} value={benefit.description} onChange={(e) => updateListItem("benefits", idx, "description", e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-medium" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "steps" && (
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 uppercase tracking-tight">Installation Process</h3>
                    <button onClick={() => addNewItem("process", { title: "", description: "", icon: "Hammer" })} className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-primary/20 hover:scale-105 transition-all">
                      Add Step
                    </button>
                  </div>
                  <div className="space-y-6">
                    {form.process?.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-6 items-start group">
                        <div className="w-12 h-12 bg-white border-2 border-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative space-y-4">
                           <div className="flex items-center gap-4">
                             <input value={step.title} onChange={(e) => updateListItem("process", idx, "title", e.target.value)} className="flex-1 border-none bg-slate-50 font-bold p-3 rounded-xl" placeholder="Step Title" />
                             <button onClick={() => removeItem("process", idx)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                           </div>
                           <IconSelector value={step.icon} onChange={(val) => updateListItem("process", idx, "icon", val)} />
                           <textarea value={step.description} onChange={(e) => updateListItem("process", idx, "description", e.target.value)} className="w-full border-none bg-slate-50 text-sm p-4 rounded-xl h-24" placeholder="Describe the work done in this step..." />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "faq" && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-extrabold text-slate-900 uppercase tracking-tight">Service-Specific FAQs</h3>
                    <button onClick={() => addNewItem("faq", { question: "", answer: "" })} className="text-primary font-bold text-sm">+ Add FAQ Item</button>
                  </div>
                  {form.faq?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary font-bold text-sm">Q</div>
                        <input value={item.question} onChange={(e) => updateListItem("faq", idx, "question", e.target.value)} className="flex-1 border-none bg-slate-50 p-4 rounded-xl text-sm font-bold" placeholder="The question..." />
                        <button onClick={() => removeItem("faq", idx)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm">A</div>
                        <textarea value={item.answer} onChange={(e) => updateListItem("faq", idx, "answer", e.target.value)} className="flex-1 border-none bg-slate-50 p-4 rounded-xl text-sm h-32 leading-relaxed" placeholder="The answer..." />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "seo" && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                  <SeoEditor 
                    data={seo}
                    setData={setSeo}
                    pageSlug={form.slug}
                    pageTitle={form.title}
                    pageContent={form}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Services List */
          <div className="space-y-4">
            {services.map((service, idx) => {
              const ServiceIcon = IconComponentMap[service.icon] || Layout;
              return (
                <motion.div
                  key={service.slug || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-200 transition-all flex items-center gap-6 shadow-sm"
                >
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                    <ServiceIcon className="w-7 h-7 text-slate-400 group-hover:text-white transition-colors" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-primary transition-colors truncate">{service.title}</h2>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-wider">{service.tag}</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium line-clamp-1">{service.description}</p>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{service.faq?.length || 0} FAQs</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span>{service.process?.length || 0} Steps</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/services/${service.slug}`} target="_blank" className="p-2.5 text-slate-400 hover:text-primary transition-all">
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleEdit(idx)} className="p-2.5 text-slate-400 hover:text-primary transition-all">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteService(idx)} className="p-2.5 text-slate-400 hover:text-red-500 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
