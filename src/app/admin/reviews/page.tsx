"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Star, Image as ImageIcon, ChevronRight, Save, X, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ReviewsAdminPage() {
  const [data, setData] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    name: "",
    position: "",
    company: "",
    text: "",
    avatar: "",
    rating: 5,
    videoId: ""
  });

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setTestimonials(json.testimonials?.testimonials || []);
      });
  }, []);

  const saveToDb = async (newTestimonials: any[]) => {
    setSaving(true);
    const updatedData = {
      ...data,
      testimonials: {
        ...data.testimonials,
        testimonials: newTestimonials
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
        setTestimonials(newTestimonials);
        setForm({ name: "", position: "", company: "", text: "", avatar: "", rating: 5, videoId: "" });
        setIsEditing(null);
      } else {
        alert("Failed to save testimonials");
      }
    } catch (e) {
      alert("Error saving testimonials");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTestimonial = () => {
    if (!form.name || !form.text) {
      alert("Name and review text are required!");
      return;
    }

    const newTestimonials = [...testimonials];
    if (isEditing !== null && isEditing < testimonials.length) {
      newTestimonials[isEditing] = { ...form };
    } else {
      newTestimonials.push({ ...form });
    }

    saveToDb(newTestimonials);
  };

  const handleDelete = (idx: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const newTestimonials = testimonials.filter((_, i) => i !== idx);
    saveToDb(newTestimonials);
  };

  const handleEdit = (idx: number) => {
    setIsEditing(idx);
    setForm(testimonials[idx]);
  };

  if (!data) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
            <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-bold">Reviews</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Customer Testimonials
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage and moderate reviews shown on the website.</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(testimonials.length)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Add New Review
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
                {isEditing < testimonials.length ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <button onClick={() => setIsEditing(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Avatar Column */}
              <div className="space-y-6">
                <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Client Identity</label>
                <div className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
                  <div className="relative">
                    {form.avatar && (form.avatar.startsWith('http') || form.avatar.startsWith('/uploads')) ? (
                      <img src={form.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-2 border-white shadow-md uppercase">
                        {form.avatar || form.name.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
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
                            setForm({ ...form, avatar: url });
                          }
                        } catch (err) {
                          alert("Upload failed.");
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-900 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary transition-all cursor-pointer shadow-sm"
                    />
                    <input
                      type="text"
                      value={form.avatar}
                      onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-900 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none transition-all shadow-sm"
                      placeholder="Or enter initials / URL"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Rating (1-5)</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-inner">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-xl font-extrabold text-slate-900">{form.rating}</span>
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">YouTube ID</label>
                    <input
                      type="text"
                      value={form.videoId || ""}
                      onChange={(e) => setForm({ ...form, videoId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                      placeholder="Optional Video ID"
                    />
                  </div>
                </div>
              </div>

              {/* Text Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Position</label>
                    <input
                      type="text"
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                      placeholder="e.g. Property Manager"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Company / City</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                      placeholder="e.g. Austin, TX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Review Content</label>
                  <textarea
                    rows={4}
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner leading-relaxed"
                    placeholder="The team was incredibly professional..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 mt-10 pt-8">
              <button
                onClick={handleSaveTestimonial}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Publishing Review..." : "Publish Review"}
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

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {testimonials.map((test, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 relative group flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {test.avatar && (test.avatar.startsWith('http') || test.avatar.startsWith('/uploads')) ? (
                    <img src={test.avatar} alt={test.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary font-bold text-lg uppercase">
                      {test.avatar || test.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
                    <Quote className="w-3 h-3 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{test.name}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{test.position} • {test.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
                <span className="text-amber-600 font-bold text-xs mr-1">{test.rating || 5}</span>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
            </div>
            
            <p className="text-slate-600 font-medium italic leading-relaxed mb-8 flex-1">
              "{test.text}"
            </p>
            
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                {test.videoId && (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 uppercase tracking-widest shadow-sm">
                    Video Attached
                  </span>
                )}
                <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                  Verified Client
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <button
                  onClick={() => handleEdit(idx)}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-slate-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {testimonials.length === 0 && !isEditing && (
          <div className="col-span-full py-20 text-center bg-white border border-slate-200 border-dashed rounded-3xl">
            <Star className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No reviews yet. Share your success stories!</p>
          </div>
        )}
      </div>
    </div>
  );
}
