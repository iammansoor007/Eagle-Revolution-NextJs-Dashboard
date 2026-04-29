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
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-[#8c8f94] rounded-[3px] px-3 py-1 text-[13px] hover:border-[#2271b1] transition-all"
      >
        <SelectedIcon className="w-3.5 h-3.5 text-[#50575e]" />
        <span>{value || "Select Icon"}</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 bg-white border border-[#c3c4c7] shadow-md p-3 rounded-[3px]">
          <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
            {ICON_LIST.map((iconName) => {
              const IconComp = IconComponentMap[iconName];
              return (
                <button
                  key={iconName}
                  onClick={() => {
                    onChange(iconName);
                    setIsOpen(false);
                  }}
                  className={`p-1.5 rounded hover:bg-[#f0f0f1] ${value === iconName ? "bg-[#2271b1] text-white" : "text-[#50575e]"}`}
                  title={iconName}
                >
                  <IconComp className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      )}
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
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState<any>({
    title: "", slug: "", tagline: "", description: "", overviewTitle: "", overview: "", overviewImage: "",
    cta: { text: "Start Your Project", link: "/contact" }, icon: "Layout", tag: "", features: [], stats: [], benefits: [], process: [], faq: []
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(json => {
        setData(json);
        setServices(json.services?.services || []);
      });
  }, []);

  useEffect(() => {
    if (isEditing !== null && form.title && !form.id) { // Only auto-slug for new ones
      const generatedSlug = form.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
      if (form.slug !== generatedSlug) setForm((prev: any) => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.title]);

  const saveToDb = async (newServices: any[]) => {
    setSaving(true);
    const updatedData = { ...data, services: { ...data.services, services: newServices } };
    try {
      const res = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedData) });
      if (res.ok) {
        setData(updatedData);
        setServices(newServices);
        setToast({ type: "ok", msg: "Services updated." });
        setTimeout(() => setToast(null), 3000);
        setIsEditing(null);
      }
    } catch {
      setToast({ type: "err", msg: "Failed to save." });
    } finally { setSaving(false); }
  };

  const handleSaveService = () => {
    if (!form.title || !form.slug) return alert("Title and slug are required.");
    const newServices = [...services];
    const serviceData = { ...form, seo: seo, id: form.id || Date.now().toString(), number: form.number || (services.length + 1).toString().padStart(2, '0') };
    if (isEditing !== null && isEditing < services.length) newServices[isEditing] = serviceData;
    else newServices.push(serviceData);
    saveToDb(newServices);
  };

  const handleEdit = (idx: number) => {
    const service = services[idx];
    setForm({ ...service, overviewTitle: service.overviewTitle || "Craftsmanship Without Compromise.", cta: service.cta || { text: "Start Your Project", link: "/contact" } });
    setSeo(service.seo || {});
    setIsEditing(idx);
    setActiveTab("general");
  };

  const filteredServices = services.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  if (!data) return <div className="flex h-screen items-center justify-center text-[#646970] font-serif">Loading...</div>;

  return (
    <div className="space-y-4">
      {/* WP Header Area */}
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-[23px] font-normal text-[#1d2327] font-serif m-0">Services</h1>
        {isEditing === null && (
          <button
            onClick={() => {
              setIsEditing(services.length);
              setForm({ title: "", slug: "", tagline: "", description: "", overviewTitle: "Craftsmanship Without Compromise.", overview: "", overviewImage: "", cta: { text: "Start Your Project", link: "/contact" }, icon: "Layout", tag: "", features: [], stats: [], benefits: [], process: [], faq: [] });
              setSeo({});
              setActiveTab("general");
            }}
            className="bg-white border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] hover:text-[#135e96] hover:border-[#135e96] px-2 py-1 text-[13px] rounded-[3px] transition-colors"
          >
            Add New
          </button>
        )}
      </div>

      {toast && (
        <div className={`px-4 py-2 border-l-4 text-[13px] bg-white shadow-sm mb-4 ${toast.type === 'ok' ? 'border-[#00a32a]' : 'border-[#d63638]'}`}>
          {toast.msg}
        </div>
      )}

      {isEditing !== null ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
           {/* Left Form Content */}
           <div className="lg:col-span-3 space-y-6">
              <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm p-6">
                 <input
                   type="text"
                   value={form.title}
                   onChange={(e) => setForm({ ...form, title: e.target.value })}
                   className="w-full border border-[#8c8f94] px-3 py-2 text-[18px] font-medium rounded-[3px] focus:border-[#2271b1] outline-none mb-4"
                   placeholder="Enter service title here"
                 />

                 {/* WP-Style Tabs for Service Editor */}
                 <div className="flex border-b border-[#c3c4c7] mb-6">
                    {[
                      { id: "general", label: "General" },
                      { id: "content", label: "Page Details" },
                      { id: "features", label: "Stats & Benefits" },
                      { id: "steps", label: "Process" },
                      { id: "faq", label: "FAQs" },
                      { id: "seo", label: "SEO" }
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-[13px] border-b-2 transition-all ${activeTab === tab.id ? 'border-[#2271b1] text-[#1d2327] font-bold' : 'border-transparent text-[#2271b1] hover:text-[#135e96]'}`}>
                        {tab.label}
                      </button>
                    ))}
                 </div>

                 <div className="space-y-6 min-h-[400px]">
                    {activeTab === "general" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[13px] font-bold">Category Tag</label>
                              <input type="text" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[13px] font-bold">Icon</label>
                              <IconSelector value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[13px] font-bold">Short Description (Card View)</label>
                           <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                        </div>
                      </div>
                    )}

                    {activeTab === "content" && (
                      <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[13px] font-bold">Page Tagline</label>
                               <input type="text" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[13px] font-bold">Overview Heading</label>
                               <input type="text" value={form.overviewTitle} onChange={(e) => setForm({ ...form, overviewTitle: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                            </div>
                         </div>
                         <ImageField label="Section Image" value={form.overviewImage || ""} onChange={(v) => setForm({ ...form, overviewImage: v })} />
                         <div className="space-y-1">
                            <label className="text-[13px] font-bold">Overview Detailed Text</label>
                            <textarea rows={5} value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                         </div>
                      </div>
                    )}

                    {activeTab === "features" && (
                       <div className="space-y-8">
                          <div className="space-y-4">
                             <div className="flex justify-between items-center"><h3 className="text-sm font-bold">Service Stats</h3><button onClick={() => setForm({ ...form, stats: [...(form.stats || []), { value: "", label: "", icon: "Star" }] })} className="text-[#2271b1] text-xs underline">+ Add Stat</button></div>
                             {form.stats?.map((s:any, i:number) => (
                                <div key={i} className="flex gap-2 bg-[#f6f7f7] p-2 border border-[#c3c4c7]">
                                   <input placeholder="Value" value={s.value} onChange={(e) => { const ns = [...form.stats]; ns[i].value = e.target.value; setForm({...form, stats: ns}); }} className="w-20 border border-[#8c8f94] px-2 py-1 text-xs" />
                                   <input placeholder="Label" value={s.label} onChange={(e) => { const ns = [...form.stats]; ns[i].label = e.target.value; setForm({...form, stats: ns}); }} className="flex-1 border border-[#8c8f94] px-2 py-1 text-xs" />
                                   <button onClick={() => { const ns = form.stats.filter((_:any,idx:number)=>idx!==i); setForm({...form, stats: ns}); }} className="text-[#d63638] text-xs">Remove</button>
                                </div>
                             ))}
                          </div>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center"><h3 className="text-sm font-bold">Key Benefits</h3><button onClick={() => setForm({ ...form, benefits: [...(form.benefits || []), { title: "", description: "", icon: "Shield" }] })} className="text-[#2271b1] text-xs underline">+ Add Benefit</button></div>
                             {form.benefits?.map((b:any, i:number) => (
                                <div key={i} className="bg-[#f6f7f7] border border-[#c3c4c7] p-3 space-y-2">
                                   <input placeholder="Title" value={b.title} onChange={(e) => { const nb = [...form.benefits]; nb[i].title = e.target.value; setForm({...form, benefits: nb}); }} className="w-full border border-[#8c8f94] px-2 py-1 text-xs" />
                                   <textarea placeholder="Description" rows={2} value={b.description} onChange={(e) => { const nb = [...form.benefits]; nb[i].description = e.target.value; setForm({...form, benefits: nb}); }} className="w-full border border-[#8c8f94] px-2 py-1 text-xs" />
                                   <button onClick={() => { const nb = form.benefits.filter((_:any,idx:number)=>idx!==i); setForm({...form, benefits: nb}); }} className="text-[#d63638] text-xs">Remove Benefit</button>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {activeTab === "steps" && (
                       <div className="space-y-4">
                          <button onClick={() => setForm({ ...form, process: [...(form.process || []), { title: "", description: "", icon: "Hammer" }] })} className="text-[#2271b1] text-xs underline font-bold">+ Add Step</button>
                          {form.process?.map((step:any, i:number) => (
                             <div key={i} className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 flex gap-4">
                                <div className="w-8 h-8 bg-[#2271b1] text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">{i+1}</div>
                                <div className="flex-1 space-y-2">
                                   <input value={step.title} onChange={(e) => { const np = [...form.process]; np[i].title = e.target.value; setForm({...form, process: np}); }} placeholder="Step Title" className="w-full border border-[#8c8f94] px-2 py-1 text-xs font-bold" />
                                   <textarea value={step.description} onChange={(e) => { const np = [...form.process]; np[i].description = e.target.value; setForm({...form, process: np}); }} placeholder="Description" rows={2} className="w-full border border-[#8c8f94] px-2 py-1 text-xs" />
                                   <button onClick={() => { const np = form.process.filter((_:any,idx:number)=>idx!==i); setForm({...form, process: np}); }} className="text-[#d63638] text-xs">Remove Step</button>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}

                    {activeTab === "faq" && (
                       <div className="space-y-4">
                          <button onClick={() => setForm({ ...form, faq: [...(form.faq || []), { question: "", answer: "" }] })} className="text-[#2271b1] text-xs underline font-bold">+ Add FAQ Item</button>
                          {form.faq?.map((item:any, i:number) => (
                             <div key={i} className="bg-white border border-[#c3c4c7] p-4 space-y-3 shadow-sm">
                                <input value={item.question} onChange={(e) => { const nf = [...form.faq]; nf[i].question = e.target.value; setForm({...form, faq: nf}); }} placeholder="Question" className="w-full border border-[#8c8f94] px-2 py-1 text-xs font-bold" />
                                <textarea value={item.answer} onChange={(e) => { const nf = [...form.faq]; nf[i].answer = e.target.value; setForm({...form, faq: nf}); }} placeholder="Answer" rows={3} className="w-full border border-[#8c8f94] px-2 py-1 text-xs" />
                                <button onClick={() => { const nf = form.faq.filter((_:any,idx:number)=>idx!==i); setForm({...form, faq: nf}); }} className="text-[#d63638] text-xs">Remove FAQ</button>
                             </div>
                          ))}
                       </div>
                    )}

                    {activeTab === "seo" && (
                       <SeoEditor data={seo} setData={setSeo} pageSlug={form.slug} pageTitle={form.title} pageContent={form} />
                    )}
                 </div>
              </div>
           </div>

           {/* Sidebar: Publish Box */}
           <div className="lg:col-span-1 space-y-6 sticky top-4">
              <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
                 <div className="px-3 py-2 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                    <h2 className="text-[14px] font-semibold text-[#1d2327]">Publish</h2>
                 </div>
                 <div className="p-4 space-y-4 text-[13px] text-[#2c3338]">
                    <div className="flex flex-col gap-2">
                       <p><strong>Status:</strong> Draft <Link href="#" className="text-[#2271b1] underline ml-1">Edit</Link></p>
                       <p><strong>Visibility:</strong> Public <Link href="#" className="text-[#2271b1] underline ml-1">Edit</Link></p>
                    </div>
                 </div>
                 <div className="px-3 py-2 bg-[#f6f7f7] border-t border-[#c3c4c7] flex justify-between items-center">
                    <button onClick={() => setIsEditing(null)} className="text-[#d63638] underline text-[13px]">Cancel</button>
                    <button
                      onClick={handleSaveService}
                      disabled={saving}
                      className="bg-[#2271b1] text-white px-4 py-1.5 rounded-[3px] text-[13px] font-semibold border border-[#2271b1] hover:bg-[#135e96] flex items-center gap-2"
                    >
                      {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {isEditing < services.length ? "Update" : "Publish"}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        /* WP List View */
        <div className="space-y-4">
           <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                 <select className="border border-[#8c8f94] bg-white text-[#2c3338] px-2 py-1 text-[13px] rounded-[3px]">
                   <option value="">Bulk actions</option>
                   <option value="delete">Delete Permanently</option>
                 </select>
                 <button className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 text-[13px] rounded-[3px] hover:bg-[#f6f7f7]">Apply</button>
              </div>
              <div className="flex items-center gap-2">
                 <input type="text" placeholder="Search Services" value={search} onChange={(e) => setSearch(e.target.value)} className="border border-[#8c8f94] bg-white px-3 py-1 text-[13px] rounded-[3px] outline-none" />
                 <button className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 text-[13px] rounded-[3px] hover:bg-[#f6f7f7]">Search</button>
              </div>
           </div>

           <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-[#c3c4c7] bg-white text-[#1d2327]">
                       <th className="w-8 py-2 px-3 align-top"><input type="checkbox" className="w-4 h-4 border-[#8c8f94] rounded-[3px]" /></th>
                       <th className="py-2 px-3 text-[14px] font-semibold">Service Name</th>
                       <th className="py-2 px-3 text-[14px] font-semibold w-40">Category</th>
                       <th className="py-2 px-3 text-[14px] font-semibold w-32">Status</th>
                    </tr>
                 </thead>
                 <tbody className="text-[13px] text-[#2c3338]">
                    {filteredServices.map((service, idx) => {
                       const ServiceIcon = IconComponentMap[service.icon] || Layout;
                       return (
                          <tr key={idx} className={`border-b border-[#f0f0f1] group ${idx % 2 === 0 ? "bg-[#f9f9f9]" : "bg-white"} hover:bg-[#f0f0f1]`}>
                             <td className="py-4 px-3 align-top"><input type="checkbox" className="w-4 h-4 border-[#8c8f94] rounded-[3px]" /></td>
                             <td className="py-4 px-3 align-top">
                                <div className="flex gap-3">
                                   <div className="w-10 h-10 bg-white border border-[#c3c4c7] rounded-[3px] flex items-center justify-center text-[#8c8f94] shrink-0">
                                      <ServiceIcon className="w-5 h-5" />
                                   </div>
                                   <div>
                                      <strong className="text-[#2271b1] block text-[14px]">{service.title}</strong>
                                      <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button onClick={() => handleEdit(idx)} className="text-[#2271b1] hover:underline text-[12px]">Edit</button>
                                         <span className="text-[#a7aaad]">|</span>
                                         <Link href={`/services/${service.slug}`} target="_blank" className="text-[#2271b1] hover:underline text-[12px]">View</Link>
                                         <span className="text-[#a7aaad]">|</span>
                                         <button onClick={() => { if(confirm("Delete this service?")) saveToDb(services.filter((_,i)=>i!==idx)); }} className="text-[#d63638] hover:underline text-[12px]">Trash</button>
                                      </div>
                                   </div>
                                </div>
                             </td>
                             <td className="py-4 px-3 align-top text-[#50575e]">{service.tag}</td>
                             <td className="py-4 px-3 align-top font-semibold text-[#00a32a]">Published</td>
                          </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
}
