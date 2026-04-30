"use client";

import React, { useState, useEffect } from "react";
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

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

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
      {/* WP Style Sub-tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-6 text-[13px] border-b border-[#f0f0f1] pb-1">
        {tabs.map((tab: any, idx: number) => (
          <React.Fragment key={tab.id}>
            <button 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-1 py-1 transition-colors ${activeTab === tab.id ? 'text-[#1d2327] font-bold' : 'text-[#2271b1] hover:text-[#135e96]'}`}
            >
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7] px-1">|</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-6">
        <div className="mb-6">
           <h2 className={UI.sectionHeader}>{activeTabTitle}</h2>
           <p className="text-[12px] text-[#646970] -mt-2">Manage the leadership and specialists representing Eagle Revolution.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="space-y-8 pb-10"
          >
            
            {/* HEADER SECTION */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-6">
                 <div className={UI.card + " space-y-5"}>
                    <div className="space-y-1.5">
                       <label className={UI.label}>Section Badge</label>
                       <input type="text" value={data.team?.section?.badge || ""} onChange={(e) => updateTeam("section", "badge", e.target.value)} className={UI.input} />
                    </div>
                    <div className="space-y-1.5">
                       <label className={UI.label}>Main Headline</label>
                       <input type="text" value={data.team?.section?.headline || ""} onChange={(e) => updateTeam("section", "headline", e.target.value)} className={UI.inputLarge} placeholder="Expert hands with Visionary minds" />
                    </div>
                    <div className="space-y-1.5">
                       <label className={UI.label}>Intro Narrative</label>
                       <textarea value={data.team?.section?.description || ""} onChange={(e) => updateTeam("section", "description", e.target.value)} rows={4} className={UI.textarea} />
                    </div>
                 </div>
              </div>
            )}

            {/* MEMBERS SECTION */}
            {activeTab === "members" && (
              <div className="space-y-6">
                  <div className="space-y-8">
                     {(data.team?.members || []).map((member: any, i: number) => (
                       <div key={i} className={UI.card + " space-y-8 relative"}>
                         <div className="flex justify-between items-center text-[10px] font-bold text-[#646970] uppercase tracking-widest border-b border-[#f0f0f1] pb-2">
                            <span>Leadership Profile #{String(i+1).padStart(2, '0')}</span>
                            <button onClick={() => {
                                const newM = data.team.members.filter((_: any, idx: number) => idx !== i);
                                updateTeam("members", null, newM);
                            }} className="text-slate-400 hover:text-[#d63638] transition-colors"><Trash2 className="w-4 h-4" /></button>
                         </div>
                         
                         <div className="space-y-8">
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
                               <div className="space-y-4">
                                  <div className="space-y-1.5">
                                     <label className={UI.label}>Full Name</label>
                                     <input type="text" value={member.name} onChange={(e) => {
                                       const newM = [...data.team.members]; newM[i].name = e.target.value; updateTeam("members", null, newM);
                                     }} className={UI.input + " font-bold"} />
                                  </div>
                                  <div className="space-y-1.5">
                                     <label className={UI.label}>Professional Role</label>
                                     <input type="text" value={member.role} onChange={(e) => {
                                       const newM = [...data.team.members]; newM[i].role = e.target.value; updateTeam("members", null, newM);
                                     }} className={UI.input} />
                                  </div>
                                  <div className="space-y-1.5">
                                     <label className={UI.label}>Top Accent Badge</label>
                                     <input type="text" value={member.badge1} onChange={(e) => {
                                       const newM = [...data.team.members]; newM[i].badge1 = e.target.value; updateTeam("members", null, newM);
                                     }} className={UI.input + " text-[10px] font-bold uppercase"} />
                                  </div>
                               </div>

                               <div className="space-y-4 border-t border-[#f0f0f1] pt-6">
                                  <label className={UI.label}>Biography Paragraphs</label>
                                  <div className="space-y-3">
                                     {(member.description || []).map((desc: string, j: number) => (
                                       <div key={j} className="flex gap-2">
                                          <textarea value={desc} onChange={(e) => {
                                              const newM = [...data.team.members]; newM[i].description[j] = e.target.value; updateTeam("members", null, newM);
                                            }} rows={3} className={UI.textarea} />
                                          <button onClick={() => {
                                             const newM = [...data.team.members]; newM[i].description = member.description.filter((_: any, idx: number) => idx !== j); updateTeam("members", null, newM);
                                          }} className="text-slate-400 hover:text-[#d63638] self-start"><X className="w-4 h-4" /></button>
                                       </div>
                                     ))}
                                     <button onClick={() => {
                                         const newM = [...data.team.members]; newM[i].description = [...(member.description || []), ""]; updateTeam("members", null, newM);
                                       }} className="text-[10px] font-bold text-[#2271b1] uppercase hover:underline">+ Add Bio Segment</button>
                                  </div>
                               </div>

                               <div className="space-y-4 border-t border-[#f0f0f1] pt-6">
                                  <div className="space-y-1.5">
                                     <label className={UI.label}>LinkedIn Profile URL</label>
                                     <input type="text" value={member.linkedin || ""} onChange={(e) => {
                                        const newM = [...data.team.members]; newM[i].linkedin = e.target.value; updateTeam("members", null, newM);
                                     }} className={UI.input} placeholder="https://linkedin.com/..." />
                                  </div>
                                  <div className="space-y-1.5">
                                     <label className={UI.label}>Direct Email</label>
                                     <input type="text" value={member.email || ""} onChange={(e) => {
                                        const newM = [...data.team.members]; newM[i].email = e.target.value; updateTeam("members", null, newM);
                                     }} className={UI.input} placeholder="name@eaglerevolution.com" />
                                  </div>
                               </div>
                            </div>
                         </div>
                       </div>
                     ))}
                  </div>  <button 
                      onClick={() => updateTeam("members", null, [...(data.team?.members || []), { name: "New Leader", role: "Management", image: "", badge1: "EXPERTISE", badge2: "QUALITIES", description: [""] }])}
                      className={UI.buttonAdd}
                    >
                      + Recruit New Team Leader
                    </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
