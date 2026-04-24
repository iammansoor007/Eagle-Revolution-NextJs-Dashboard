"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Star, Image as ImageIcon } from "lucide-react";

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
    if (isEditing !== null) {
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
    <div className="max-w-5xl mx-auto pb-20 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Star className="w-8 h-8 text-primary" />
            Reviews Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, or remove client testimonials.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(testimonials.length)}
            className="flex items-center gap-2 bg-primary-white px-5 py-2.5 rounded-xl font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Review
          </button>
        )}
      </div>

      {isEditing !== null && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isEditing < testimonials.length ? "Edit Review" : "Add New Review"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Client Photo / Avatar</label>
              <div className="flex items-center gap-4">
                {form.avatar && (form.avatar.startsWith('http') || form.avatar.startsWith('/uploads')) ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 flex-shrink-0">
                    <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ) : form.avatar ? (
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border-2 border-primary/50 flex-shrink-0">
                    {form.avatar}
                  </div>
                ) : null}
                <div className="flex-1 space-y-2">
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
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-primary-white"
                  />
                  <input
                    type="text"
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 text-sm focus:border-primary/50 outline-none"
                    placeholder="Or type initials (e.g. JD)"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Client Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Destination/Position</label>
                  <input
                    type="text"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 outline-none"
                    placeholder="e.g. Homeowner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">City/Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 outline-none"
                    placeholder="e.g. Dallas, TX"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Review Text</label>
              <textarea
                rows={4}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 outline-none"
                placeholder="The team did a fantastic job..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">YouTube Video ID (Optional)</label>
                <input
                  type="text"
                  value={form.videoId || ""}
                  onChange={(e) => setForm({ ...form, videoId: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 outline-none"
                  placeholder="e.g. dQw4w9WgXcQ"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
            <button
              onClick={handleSaveTestimonial}
              disabled={saving}
              className="bg-primary-white px-6 py-2.5 rounded-xl font-medium transition-all"
            >
              {saving ? "Saving..." : "Save Review"}
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

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((test, idx) => (
          <div key={idx} className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 flex flex-col group relative">
            <div className="flex items-center gap-4 mb-4">
              {test.avatar && (test.avatar.startsWith('http') || test.avatar.startsWith('/uploads')) ? (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30">
                  <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                  {test.avatar || test.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-gray-900 font-bold">{test.name}</h3>
                <p className="text-gray-500 text-xs">{test.position}, {test.company}</p>
              </div>
              <div className="ml-auto flex">
                {[...Array(test.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-3 mb-4 italic flex-1">"{test.text}"</p>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-gray-400 text-xs">
                {test.videoId ? "Has Video Attachment" : "Text Only"}
              </span>
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
        {testimonials.length === 0 && !isEditing && (
          <div className="col-span-full py-12 text-center border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500">No reviews found. Click "Add Review" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
