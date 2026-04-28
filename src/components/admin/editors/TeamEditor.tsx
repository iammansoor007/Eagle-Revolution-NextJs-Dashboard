"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Users, Linkedin, Sparkles, Quote, UserPlus
} from "lucide-react";

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

export default function TeamEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         team: {
           section: { badge: "Our Leadership", headline: "Expert hands with Visionary minds", description: "Meet the dedicated professionals leading the charge at Eagle Revolution." },
           members: []
         }
       });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const updateTeam = (section: string, field: string | null, value: any) => {
    const currentTeam = data.team || {
      section: { badge: "", headline: "", description: "" },
      members: []
    };

    const targetSectionData = currentTeam[section as keyof typeof currentTeam] || {};

    setData({
      ...data,
      team: {
        ...currentTeam,
        [section]: field ? {
          ...targetSectionData,
          [field]: value,
        } : value,
      },
    });
  };

  const tabs = [
    { id: "header", label: "Team Intro", icon: Type, title: "Leadership Roster Introduction" },
    { id: "members", label: "Roster Management", icon: Users, title: "Individual Team Member Profiles" },
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
           <p className="text-sm text-slate-400 mt-2 font-medium">Manage the leadership and specialists representing Eagle Revolution.</p>
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
                       <input type="text" value={data.team?.section?.badge || ""} onChange={(e) => updateTeam("section", "badge", e.target.value)} className="w-full bg-slate-50 px-5 py-3.5 rounded-xl text-xs font-bold text-blue-600 outline-none" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline (Use "with" for gradient split)</label>
                       <input type="text" value={data.team?.section?.headline || ""} onChange={(e) => updateTeam("section", "headline", e.target.value)} className="w-full bg-slate-50 px-5 py-4 rounded-xl text-xl font-bold outline-none" placeholder="Expert hands with Visionary minds" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Intro Narrative</label>
                       <textarea value={data.team?.section?.description || ""} onChange={(e) => updateTeam("section", "description", e.target.value)} rows={4} className="w-full bg-slate-50 px-5 py-4 rounded-2xl text-sm text-slate-500 outline-none leading-relaxed" />
                    </div>
                 </div>
              </div>
            )}

            {/* MEMBERS SECTION */}
            {activeTab === "members" && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 gap-12">
                    {(data.team?.members || []).map((member: any, i: number) => (
                      <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-10 relative group">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                           <div className="flex items-center gap-2">
                              <Quote className="w-3.5 h-3.5 text-blue-400" />
                              <span>Leadership Profile #{String(i+1).padStart(2, '0')}</span>
                           </div>
                           <button onClick={() => {
                              const newM = data.team.members.filter((_: any, idx: number) => idx !== i);
                              updateTeam("members", null, newM);
                           }} className="hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="grid grid-cols-12 gap-12">
                           <div className="col-span-7 space-y-8">
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Full Name</label>
                                    <input type="text" value={member.name} onChange={(e) => {
                                      const newM = [...data.team.members]; newM[i].name = e.target.value; updateTeam("members", null, newM);
                                    }} className="w-full bg-slate-50 px-5 py-3 rounded-xl text-base font-medium outline-none" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Professional Role</label>
                                    <input type="text" value={member.role} onChange={(e) => {
                                      const newM = [...data.team.members]; newM[i].role = e.target.value; updateTeam("members", null, newM);
                                    }} className="w-full bg-slate-50 px-5 py-3 rounded-xl text-base font-medium outline-none" />
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Top Accent Badge</label>
                                    <input type="text" value={member.badge1} onChange={(e) => {
                                      const newM = [...data.team.members]; newM[i].badge1 = e.target.value; updateTeam("members", null, newM);
                                    }} className="w-full bg-white border border-slate-100 px-4 py-2 rounded-lg text-[10px] font-bold text-slate-800 uppercase outline-none" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Bottom Accent Badge</label>
                                    <input type="text" value={member.badge2} onChange={(e) => {
                                      const newM = [...data.team.members]; newM[i].badge2 = e.target.value; updateTeam("members", null, newM);
                                    }} className="w-full bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-[10px] font-bold text-blue-400 uppercase outline-none" />
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Biography Paragraphs</label>
                                 <div className="space-y-4">
                                    {(member.description || []).map((desc: string, j: number) => (
                                      <div key={j} className="flex gap-4">
                                         <textarea value={desc} onChange={(e) => {
                                             const newM = [...data.team.members]; newM[i].description[j] = e.target.value; updateTeam("members", null, newM);
                                           }} rows={3} className="flex-1 bg-slate-50/50 p-5 rounded-2xl text-xs text-slate-500 leading-relaxed outline-none" />
                                         <button onClick={() => {
                                            const newM = [...data.team.members]; newM[i].description = member.description.filter((_: any, idx: number) => idx !== j); updateTeam("members", null, newM);
                                         }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                      </div>
                                    ))}
                                    <button onClick={() => {
                                        const newM = [...data.team.members]; newM[i].description = [...(member.description || []), ""]; updateTeam("members", null, newM);
                                      }} className="text-[10px] font-bold text-primary uppercase tracking-widest">+ Add Bio Segment</button>
                                 </div>
                              </div>
                           </div>
                           <div className="col-span-5">
                              <ImageUpload 
                                label="Cinematic Portrait" 
                                value={member.image} 
                                onChange={(url: string) => {
                                  const newM = [...data.team.members]; newM[i].image = url; updateTeam("members", null, newM);
                                }} 
                              />
                              <div className="mt-8 space-y-4">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">LinkedIn Profile</label>
                                    <input type="text" value={member.linkedin || ""} onChange={(e) => {
                                       const newM = [...data.team.members]; newM[i].linkedin = e.target.value; updateTeam("members", null, newM);
                                    }} className="w-full bg-white border border-slate-100 px-4 py-2 rounded-xl text-[10px] outline-none" placeholder="https://linkedin.com/in/..." />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Direct Email</label>
                                    <input type="text" value={member.email || ""} onChange={(e) => {
                                       const newM = [...data.team.members]; newM[i].email = e.target.value; updateTeam("members", null, newM);
                                    }} className="w-full bg-white border border-slate-100 px-4 py-2 rounded-xl text-[10px] outline-none" placeholder="name@eaglerevolution.com" />
                                 </div>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateTeam("members", null, [...(data.team?.members || []), { name: "New Leader", role: "Management", image: "", badge1: "EXPERTISE", badge2: "QUALITIES", description: [""] }])}
                      className="w-full border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-primary transition-all"
                    >
                      <UserPlus className="w-12 h-12" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Recruit New Team Leader</span>
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
