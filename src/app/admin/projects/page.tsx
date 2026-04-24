"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Folder, Image as ImageIcon, ChevronRight, Save, X, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProjectsAdminPage() {
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    title: "",
    category: "",
    year: "",
    desc: "",
    image: "",
    number: "",
    location: "",
    architect: "",
    accent: "from-primary to-primary/80"
  });

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setProjects(json.portfolio?.projects || []);
      });
  }, []);

  const saveToDb = async (newProjects: any[]) => {
    setSaving(true);
    const updatedData = {
      ...data,
      portfolio: {
        ...data.portfolio,
        projects: newProjects
      }
    };

    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setData(updatedData);
        setProjects(newProjects);
        setForm({ title: "", category: "", year: "", desc: "", image: "", number: "", location: "", architect: "", accent: "from-primary to-primary/80" });
        setIsEditing(null);
      } else {
        alert("Failed to save projects");
      }
    } catch (e) {
      alert("Error saving projects");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProject = () => {
    if (!form.title || !form.image) {
      alert("Project title and image are required!");
      return;
    }

    const newProjects = [...projects];
    if (isEditing !== null && isEditing < projects.length) {
      newProjects[isEditing] = { ...form };
    } else {
      const number = String(newProjects.length + 1).padStart(2, '0');
      newProjects.push({ ...form, number });
    }

    saveToDb(newProjects);
  };

  const handleDelete = (idx: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const newProjects = projects.filter((_, i) => i !== idx);
    saveToDb(newProjects);
  };

  const handleEdit = (idx: number) => {
    setIsEditing(idx);
    setForm(projects[idx]);
  };

  if (!data) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-bold">Projects</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Portfolio Projects
          </h1>
          <p className="text-slate-500 font-medium mt-1">Showcase your best work to potential clients.</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(projects.length)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Add New Project
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing !== null ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 mb-12 shadow-xl shadow-slate-200/50"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {isEditing < projects.length ? "Edit Project" : "Create New Project"}
              </h2>
              <button onClick={() => setIsEditing(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Image Upload Column */}
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Project Showcase Image</label>
                <div className="relative group">
                  <div className="w-full h-64 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center relative">
                    {form.image ? (
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-6">
                        <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm font-medium">No image selected</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        try {
                          const res = await fetch("/api/upload", { method: "POST", body: formData });
                          if (res.ok) {
                            const { url } = await res.json();
                            setForm({ ...form, image: url });
                          }
                        } catch (err) {
                          alert("Upload failed.");
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Details Column */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Project Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner"
                      placeholder="e.g. Modern Residential Roof"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Category</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner"
                      placeholder="e.g. ROOFING"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Completion Year</label>
                    <input
                      type="text"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner"
                      placeholder="e.g. 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Location</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner"
                      placeholder="e.g. Dallas, TX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Project Description</label>
                  <textarea
                    rows={4}
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner"
                    placeholder="Provide some details about the scope of work..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 mt-10 pt-8">
              <button
                onClick={handleSaveProject}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Saving Changes..." : "Save Project"}
              </button>
              <button
                onClick={() => setIsEditing(null)}
                className="bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 relative"
          >
            <div className="relative h-56 overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-slate-200" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-primary/90 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                  {project.category || "Project"}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={(e) => { e.preventDefault(); handleEdit(idx); }}
                  className="p-2.5 bg-white text-slate-900 rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); handleDelete(idx); }}
                  className="p-2.5 bg-white text-red-600 rounded-xl shadow-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight">{project.title}</h3>
                <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                  {project.desc || "No description provided."}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {project.year || "2024"}
                </div>
                {project.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {project.location}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white border border-slate-200 border-dashed rounded-3xl">
            <Folder className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No projects found. Start by adding one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
