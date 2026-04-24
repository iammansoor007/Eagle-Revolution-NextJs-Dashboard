"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Folder, Image as ImageIcon } from "lucide-react";

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
    if (isEditing !== null) {
      newProjects[isEditing] = { ...form };
    } else {
      // Auto-assign number like 01, 02
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
    <div className="max-w-5xl mx-auto pb-20 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Folder className="w-8 h-8 text-primary" />
            Projects Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, or remove projects shown in the portfolio.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(projects.length)}
            className="flex items-center gap-2 bg-primary-white px-5 py-2.5 rounded-xl font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        )}
      </div>

      {isEditing !== null && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isEditing < projects.length ? "Edit Project" : "Create New Project"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Project Image</label>
              {form.image && (
                <div className="mb-3 relative w-full h-40 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
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
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-primary-white"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Project Name</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 outline-none"
                  placeholder="e.g. Modern Home Renovation"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 outline-none"
                    placeholder="e.g. ROOFING"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Year</label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 outline-none"
                    placeholder="e.g. 2024"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Description</label>
              <textarea
                rows={3}
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
            <button
              onClick={handleSaveProject}
              disabled={saving}
              className="bg-primary-white px-6 py-2.5 rounded-xl font-medium transition-all"
            >
              {saving ? "Saving..." : "Save Project"}
            </button>
            <button
              onClick={() => setIsEditing(null)}
              className="bg-gray-50 hover:bg-gray-100 text-gray-900 bg-gray-50 hover:bg-gray-100 px-6 py-2.5 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <div key={idx} className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden group">
            <div className="relative h-48 bg-gray-100">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-900/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/20 px-2 py-1 rounded-md backdrop-blur-md">
                  {project.category}
                </span>
                <h3 className="text-gray-900 font-bold mt-2">{project.title}</h3>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between bg-gray-50">
              <span className="text-gray-500 text-sm">{project.year}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(idx)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
