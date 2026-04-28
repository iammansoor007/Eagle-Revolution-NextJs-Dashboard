"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, 
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload, 
  List, Heart, HelpCircle, Check, Target, Award, Shield, 
  ArrowRight, Users, Linkedin, Sparkles, Quote, UserPlus, X
} from "lucide-react";
import { UI } from "./styles";
import ImageField from "@/components/admin/ImageField";


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
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-1 p-4 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${
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

      <div className="p-10 bg-[#F8FAFC]">
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
                 <div className={UI.card + " space-y-6"}>
                    <label className={UI.sectionHeader}>Section Branding</label>
                    <div className="space-y-2">
                       <label className={UI.label}>Section Badge</label>
                       <input type="text" value={data.team?.section?.badge || ""} onChange={(e) => updateTeam("section", "badge", e.target.value)} className={UI.inputPrimary} />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Main Headline</label>
                       <input type="text" value={data.team?.section?.headline || ""} onChange={(e) => updateTeam("section", "headline", e.target.value)} className={UI.inputLarge} placeholder="Expert hands with Visionary minds" />
                    </div>
                    <div className="space-y-2">
                       <label className={UI.label}>Intro Narrative</label>
                       <textarea value={data.team?.section?.description || ""} onChange={(e) => updateTeam("section", "description", e.target.value)} rows={4} className={UI.textarea} />
                    </div>
                 </div>
              </div>
            )}

            {/* MEMBERS SECTION */}
            {activeTab === "members" && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 gap-12">
                    {(data.team?.members || []).map((member: any, i: number) => (
                      <div key={i} className={UI.card + " space-y-10 relative group p-10 rounded-[2.5rem]"}>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary/5 text-primary rounded-lg flex items-center justify-center">
                                 <Quote className="w-4 h-4" />
                              </div>
                              <span>Leadership Profile #{String(i+1).padStart(2, '0')}</span>
                           </div>
                           <button onClick={() => {
                               const newM = data.team.members.filter((_: any, idx: number) => idx !== i);
                               updateTeam("members", null, newM);
                           }} className="hover:text-red-500 transition-colors absolute top-10 right-10"><Trash2 className="w-6 h-6" /></button>
                        </div>
                        
                        <div className="grid grid-cols-12 gap-12 pt-4">
                           <div className="col-span-7 space-y-8">
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className={UI.label}>Full Name</label>
                                    <input type="text" value={member.name} onChange={(e) => {
                                      const newM = [...data.team.members]; newM[i].name = e.target.value; updateTeam("members", null, newM);
                                    }} className={UI.input + " font-bold"} />
                                 </div>
                                 <div className="space-y-2">
                                    <label className={UI.label}>Professional Role</label>
                                    <input type="text" value={member.role} onChange={(e) => {
                                      const newM = [...data.team.members]; newM[i].role = e.target.value; updateTeam("members", null, newM);
                                    }} className={UI.inputPrimary} />
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className={UI.label}>Top Accent Badge</label>
                                    <input type="text" value={member.badge1} onChange={(e) => {
                                      const newM = [...data.team.members]; newM[i].badge1 = e.target.value; updateTeam("members", null, newM);
                                    }} className={UI.input + " text-[10px] font-bold uppercase"} />
                                 </div>
                                 <div className="space-y-2">
                                    <label className={UI.label}>Bottom Accent Badge</label>
                                    <input type="text" value={member.badge2} onChange={(e) => {
                                      const newM = [...data.team.members]; newM[i].badge2 = e.target.value; updateTeam("members", null, newM);
                                    }} className="w-full bg-slate-900 border border-slate-800 text-primary px-4 py-3 rounded-xl text-[10px] font-bold uppercase outline-none shadow-lg" />
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <label className={UI.label}>Biography Paragraphs</label>
                                 <div className="space-y-4">
                                    {(member.description || []).map((desc: string, j: number) => (
                                      <div key={j} className="flex gap-4 group/bio">
                                         <textarea value={desc} onChange={(e) => {
                                             const newM = [...data.team.members]; newM[i].description[j] = e.target.value; updateTeam("members", null, newM);
                                           }} rows={3} className={UI.textarea} />
                                         <button onClick={() => {
                                            const newM = [...data.team.members]; newM[i].description = member.description.filter((_: any, idx: number) => idx !== j); updateTeam("members", null, newM);
                                         }} className="text-slate-200 hover:text-red-500 self-center transition-colors"><Trash2 className="w-4 h-4" /></button>
                                      </div>
                                    ))}
                                    <button onClick={() => {
                                        const newM = [...data.team.members]; newM[i].description = [...(member.description || []), ""]; updateTeam("members", null, newM);
                                      }} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-all">+ Add Bio Segment</button>
                                 </div>
                              </div>
                           </div>
                           <div className="col-span-5 space-y-8">
                               <ImageField
                                 label="Cinematic Portrait"
                                 value={member.image || ""}
                                 onChange={(url: string) => {
                                   const newM = [...data.team.members]; newM[i].image = url; updateTeam("members", null, newM);
                                 }}
                                 altValue={member.imageAlt || ""}
                                 onAltChange={(alt: string) => {
                                   const newM = [...data.team.members]; newM[i].imageAlt = alt; updateTeam("members", null, newM);
                                 }}
                               />
                              <div className="space-y-6">
                                 <div className="space-y-2">
                                    <label className={UI.label}>LinkedIn Profile URL</label>
                                    <div className="relative">
                                       <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                       <input type="text" value={member.linkedin || ""} onChange={(e) => {
                                          const newM = [...data.team.members]; newM[i].linkedin = e.target.value; updateTeam("members", null, newM);
                                       }} className={UI.input + " pl-12"} placeholder="https://linkedin.com/..." />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className={UI.label}>Direct Email</label>
                                    <div className="relative">
                                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                       <input type="text" value={member.email || ""} onChange={(e) => {
                                          const newM = [...data.team.members]; newM[i].email = e.target.value; updateTeam("members", null, newM);
                                       }} className={UI.input + " pl-12"} placeholder="name@eaglerevolution.com" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateTeam("members", null, [...(data.team?.members || []), { name: "New Leader", role: "Management", image: "", badge1: "EXPERTISE", badge2: "QUALITIES", description: [""] }])}
                      className={UI.buttonAdd + " py-20"}
                    >
                      <UserPlus className="w-12 h-12 mx-auto" />
                      <span>Recruit New Team Leader</span>
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
