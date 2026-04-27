"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Users, Linkedin
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
      fetch("/api/content")
        .then(res => res.json())
        .then(json => {
           if (!json.team) {
             json.team = {
               section: { badge: "", headline: "", description: "" },
               members: []
             };
           }
           setData(json);
        })
        .catch(err => console.error("Failed to seed content:", err));
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
    <div className="bg-white min-h-[600px] flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-1 p-4 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all ${
                activeTab === tab.id
                ? "bg-primary/5 text-primary"
                : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-10 overflow-y-auto max-h-[800px] custom-scrollbar">
        <div className="mb-10 pb-6 border-b border-slate-50">
           <h2 className="text-2xl font-normal text-slate-900 tracking-tight">{activeTabTitle}</h2>
           <p className="text-xs text-slate-400 mt-1">Manage the leadership and specialists representing Eagle Revolution.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            
            {/* HEADER SECTION */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Section Badge</label>
                    <input type="text" value={data.team?.section?.badge || ""} onChange={(e) => updateTeam("section", "badge", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Main Headline</label>
                    <input type="text" value={data.team?.section?.headline || ""} onChange={(e) => updateTeam("section", "headline", e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-xs outline-none focus:bg-white focus:border-primary/30 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Supporting Narrative</label>
                    <textarea value={data.team?.section?.description || ""} onChange={(e) => updateTeam("section", "description", e.target.value)} rows={4} className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xs text-slate-600 outline-none focus:bg-white focus:border-primary/30 transition-all" />
                 </div>
              </div>
            )}

            {/* MEMBERS SECTION */}
            {activeTab === "members" && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 gap-8">
                    {(data.team?.members || []).map((member: any, i: number) => (
                      <div key={i} className="bg-slate-50/30 rounded-3xl p-8 border border-slate-100 space-y-8">
                        <div className="flex justify-between items-center text-[9px] font-medium text-slate-300 uppercase tracking-widest">
                           <span>Team Member #{i+1}</span>
                           <button onClick={() => {
                              const newM = data.team.members.filter((_: any, idx: number) => idx !== i);
                              updateTeam("members", null, newM);
                           }} className="hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-10">
                           <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Full Name</label>
                                    <input type="text" value={member.name} onChange={(e) => {
                                      const newM = [...data.team.members];
                                      newM[i].name = e.target.value;
                                      updateTeam("members", null, newM);
                                    }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary/30" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Role/Title</label>
                                    <input type="text" value={member.role} onChange={(e) => {
                                      const newM = [...data.team.members];
                                      newM[i].role = e.target.value;
                                      updateTeam("members", null, newM);
                                    }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary/30" />
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Accent Badge 1</label>
                                    <input type="text" value={member.badge1} onChange={(e) => {
                                      const newM = [...data.team.members];
                                      newM[i].badge1 = e.target.value;
                                      updateTeam("members", null, newM);
                                    }} className="w-full bg-primary/5 text-primary border border-primary/20 rounded-xl px-4 py-2.5 text-[9px] font-medium uppercase tracking-widest outline-none" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Accent Badge 2</label>
                                    <input type="text" value={member.badge2} onChange={(e) => {
                                      const newM = [...data.team.members];
                                      newM[i].badge2 = e.target.value;
                                      updateTeam("members", null, newM);
                                    }} className="w-full bg-slate-100/50 border border-slate-200 rounded-xl px-4 py-2.5 text-[9px] font-medium uppercase tracking-widest outline-none" />
                                 </div>
                              </div>
                           </div>
                           <div>
                              <ImageUpload 
                                label="Member Portrait" 
                                value={member.image} 
                                onChange={(url: string) => {
                                  const newM = [...data.team.members];
                                  newM[i].image = url;
                                  updateTeam("members", null, newM);
                                }} 
                              />
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Personal Biography (Paragraphs)</label>
                           <div className="space-y-3">
                              {(member.description || []).map((desc: string, j: number) => (
                                <div key={j} className="flex gap-4">
                                   <textarea value={desc} onChange={(e) => {
                                       const newM = [...data.team.members];
                                       newM[i].description[j] = e.target.value;
                                       updateTeam("members", null, newM);
                                     }} rows={2} className="flex-1 bg-white border border-slate-200 rounded-xl px-5 py-3 text-xs text-slate-500 outline-none focus:border-primary/30" />
                                   <button onClick={() => {
                                      const newM = [...data.team.members];
                                      newM[i].description = member.description.filter((_: any, idx: number) => idx !== j);
                                      updateTeam("members", null, newM);
                                   }} className="text-slate-200 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              ))}
                              <button onClick={() => {
                                  const newM = [...data.team.members];
                                  newM[i].description = [...(member.description || []), ""];
                                  updateTeam("members", null, newM);
                                }} className="text-[10px] font-medium text-primary uppercase tracking-widest">+ Add Bio Paragraph</button>
                           </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateTeam("members", null, [...(data.team?.members || []), { name: "New Member", role: "Specialist", image: "", badge1: "TITLE", badge2: "QUALITIES", description: [""] }])} className="w-full border border-dashed border-slate-200 rounded-3xl py-10 text-[10px] font-medium text-slate-300 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest">
                      + Recruit New Team Member
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
