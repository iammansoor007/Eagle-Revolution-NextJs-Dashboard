"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, MessageSquare, Quote, Video, Play
} from "lucide-react";
import ContentSelector from "@/components/admin/ContentSelector";

// Shared Reusable Image Upload Component
const ImageUpload = ({ label, value, onChange, description }: any) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        onChange(url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="group relative">
        <div className="aspect-video w-full bg-slate-50/50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center transition-all group-hover:border-primary/30">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <label className="cursor-pointer bg-primary text-white px-5 py-2 rounded-lg text-[10px] font-medium uppercase tracking-widest hover:scale-105 transition-all">
                  Update Photo
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
                <button onClick={() => onChange("")} className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-lg text-[10px] font-medium uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
                  Remove
                </button>
              </div>
            </>
          ) : (
            <label className="flex flex-col items-center gap-3 cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Upload className="w-5 h-5 text-slate-300" />}
              </div>
              <div className="text-center">
                <p className="text-[10px] font-medium text-slate-400">Click to upload media</p>
              </div>
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ReviewsEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         testimonials: {
           section: { badge: "Social Proof", headline: "What Our Customers Say", description: "Discover why homeowners across St. Louis trust Eagle Revolution." },
           testimonials: [],
           videos: [],
           stats: { rating: 5.0, count: 500, label: "Google Reviews" }
         }
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateTestimonials = (section: string, field: string | null, value: any) => {
    const currentData = data.testimonials || {
      section: { badge: "", headline: "", description: "" },
      testimonials: [],
      videos: [],
      stats: {}
    };

    const targetSectionData = currentData[section as keyof typeof currentData] || {};

    setData({
      ...data,
      testimonials: {
        ...currentData,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "header", label: "Review Header", icon: Type, title: "Social Proof Introduction" },
    { id: "items", label: "Testimonials", icon: Quote, title: "Individual Review Management" },
    { id: "videos", label: "Video Proof", icon: Video, title: "Video Success Stories" },
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  return (
    <div className="bg-white min-h-[700px] flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-1 p-4 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all shrink-0 ${
                activeTab === tab.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-10 overflow-y-auto max-h-[850px] custom-scrollbar bg-[#F8FAFC]">
        <div className="mb-12 pb-8 border-b border-slate-200">
           <h2 className="text-3xl font-medium text-slate-900 tracking-tight">{activeTabTitle}</h2>
           <p className="text-sm text-slate-400 mt-2 font-medium">Manage testimonials, video stories, and global social proof metrics.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }} 
            className="space-y-16 pb-20"
          >
            
            {/* HEADER SECTION */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-10">
                 <div className="space-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Badge</label>
                       <input type="text" value={data.testimonials?.section?.badge || ""} onChange={(e) => updateTestimonials("section", "badge", e.target.value)} className="w-full bg-slate-50 px-5 py-3.5 rounded-xl text-xs font-bold text-primary outline-none" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline</label>
                       <input type="text" value={data.testimonials?.section?.headline || ""} onChange={(e) => updateTestimonials("section", "headline", e.target.value)} className="w-full bg-slate-50 px-5 py-4 rounded-xl text-xl font-bold outline-none" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Intro Narrative</label>
                       <textarea value={data.testimonials?.section?.description || ""} onChange={(e) => updateTestimonials("section", "description", e.target.value)} rows={4} className="w-full bg-slate-50 px-5 py-4 rounded-2xl text-sm text-slate-500 outline-none leading-relaxed" />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Review Summary Stats</label>
                    <div className="grid grid-cols-3 gap-6">
                       <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                          <span className="text-[9px] font-bold text-slate-300 uppercase">Avg Rating</span>
                          <input type="text" value={data.testimonials?.stats?.rating || ""} onChange={(e) => updateTestimonials("stats", "rating", e.target.value)} className="w-full text-xl font-bold text-primary outline-none" />
                       </div>
                       <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                          <span className="text-[9px] font-bold text-slate-300 uppercase">Total Count</span>
                          <input type="text" value={data.testimonials?.stats?.count || ""} onChange={(e) => updateTestimonials("stats", "count", e.target.value)} className="w-full text-xl font-bold text-slate-900 outline-none" />
                       </div>
                       <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                          <span className="text-[9px] font-bold text-slate-300 uppercase">Source Label</span>
                          <input type="text" value={data.testimonials?.stats?.label || ""} onChange={(e) => updateTestimonials("stats", "label", e.target.value)} className="w-full text-[10px] font-medium text-slate-400 outline-none" />
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* TESTIMONIALS SECTION */}
            {activeTab === "items" && (
              <div className="space-y-10">
                 <div className="grid grid-cols-2 gap-8">
                    {(data.testimonials?.testimonials || []).map((review: any, i: number) => (
                      <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8 relative group">
                        <button onClick={() => {
                          const newT = data.testimonials.testimonials.filter((_: any, idx: number) => idx !== i);
                          updateTestimonials("testimonials", null, newT);
                        }} className="absolute top-6 right-6 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        
                        <div className="space-y-4">
                           <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Review Content</label>
                           <textarea value={review.text} onChange={(e) => {
                             const newT = [...data.testimonials.testimonials]; newT[i].text = e.target.value; updateTestimonials("testimonials", null, newT);
                           }} rows={5} className="w-full bg-slate-50/50 p-6 rounded-2xl text-sm italic text-slate-600 outline-none leading-relaxed" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-bold text-slate-300 uppercase">Customer Name</label>
                                 <input type="text" value={review.name} onChange={(e) => {
                                   const newT = [...data.testimonials.testimonials]; newT[i].name = e.target.value; updateTestimonials("testimonials", null, newT);
                                 }} className="w-full bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold outline-none" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-bold text-slate-300 uppercase">Position/Role</label>
                                 <input type="text" value={review.position} onChange={(e) => {
                                   const newT = [...data.testimonials.testimonials]; newT[i].position = e.target.value; updateTestimonials("testimonials", null, newT);
                                 }} className="w-full bg-slate-50 px-4 py-2 rounded-xl text-[10px] outline-none" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-bold text-slate-300 uppercase">Company/Location</label>
                                 <input type="text" value={review.company} onChange={(e) => {
                                   const newT = [...data.testimonials.testimonials]; newT[i].company = e.target.value; updateTestimonials("testimonials", null, newT);
                                 }} className="w-full bg-slate-50 px-4 py-2 rounded-xl text-[10px] outline-none" />
                              </div>
                           </div>
                           <ImageUpload label="Avatar" value={review.image} onChange={(url: string) => {
                             const newT = [...data.testimonials.testimonials]; newT[i].image = url; updateTestimonials("testimonials", null, newT);
                           }} />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateTestimonials("testimonials", null, [...(data.testimonials?.testimonials || []), { text: "", name: "", position: "Homeowner", company: "St. Louis, MO", image: "" }])} className="border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-primary transition-all">
                       <Plus className="w-12 h-12" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Add New Written Review</span>
                    </button>
                 </div>
              </div>
            )}

            {/* VIDEOS SECTION */}
            {activeTab === "videos" && (
              <div className="space-y-10">
                 <div className="grid grid-cols-2 gap-8">
                    {(data.testimonials?.videos || []).map((video: any, i: number) => (
                      <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6 relative group">
                        <button onClick={() => {
                          const newV = data.testimonials.videos.filter((_: any, idx: number) => idx !== i);
                          updateTestimonials("videos", null, newV);
                        }} className="absolute top-6 right-6 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                              <Video className="w-6 h-6" />
                           </div>
                           <div className="flex-1 space-y-1">
                              <input type="text" value={video.title} onChange={(e) => {
                                 const newV = [...data.testimonials.videos]; newV[i].title = e.target.value; updateTestimonials("videos", null, newV);
                              }} className="w-full bg-transparent font-bold text-slate-900 outline-none text-sm" placeholder="Video Title" />
                              <div className="flex items-center gap-2">
                                 <span className="text-[9px] font-bold text-slate-300 uppercase">YouTube ID:</span>
                                 <input type="text" value={video.id} onChange={(e) => {
                                    const newV = [...data.testimonials.videos]; newV[i].id = e.target.value; updateTestimonials("videos", null, newV);
                                 }} className="bg-slate-50 px-2 py-0.5 rounded text-[10px] font-mono text-primary outline-none" />
                              </div>
                           </div>
                        </div>
                        <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                           {video.id ? (
                             <img src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} className="w-full h-full object-cover opacity-50" alt="Thumbnail" />
                           ) : (
                             <Play className="w-10 h-10 text-slate-300" />
                           )}
                           <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                              <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                                 <Play className="w-6 h-6 text-primary ml-1" />
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateTestimonials("videos", null, [...(data.testimonials?.videos || []), { title: "New Success Story", id: "" }])} className="border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-primary transition-all">
                       <Video className="w-12 h-12" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Embed Video Testimonial</span>
                    </button>
                 </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
