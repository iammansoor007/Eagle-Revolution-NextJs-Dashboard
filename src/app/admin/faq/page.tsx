"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, HelpCircle, Save, X, ChevronRight, Globe, Layers, ListFilter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function FAQAdminPage() {
  const [data, setData] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Form State
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "",
    visibility: "global", // 'global' or 'specific'
    targetPages: [] as string[]
  });

  const availablePages = [
    { id: "home", label: "Homepage" },
    { id: "about", label: "About Page" },
    { id: "services", label: "Services Page" },
    { id: "gallery", label: "Gallery Page" },
    { id: "reviews", label: "Reviews Page" },
    { id: "faq", label: "FAQ Page" },
    { id: "contact", label: "Contact Page" },
    { id: "service_detail", label: "Individual Service Pages" }
  ];

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setFaqs(json.faq?.items || []);
        setCategories(json.faq?.categories || ["General", "Services", "Pricing"]);
      });
  }, []);

  const saveToDb = async (updatedFaqs: any[], updatedCategories: string[]) => {
    setSaving(true);
    const updatedData = {
      ...data,
      faq: {
        ...data.faq,
        items: updatedFaqs,
        categories: updatedCategories
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
        setFaqs(updatedFaqs);
        setCategories(updatedCategories);
        setForm({ question: "", answer: "", category: updatedCategories[0] || "", visibility: "global", targetPages: [] });
        setIsEditing(null);
      } else {
        alert("Failed to save FAQ data");
      }
    } catch (e) {
      alert("Error saving FAQ data");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFAQ = () => {
    if (!form.question || !form.answer || !form.category) {
      alert("Question, Answer, and Category are required!");
      return;
    }

    const newFaqs = [...faqs];
    if (isEditing !== null && isEditing < faqs.length) {
      newFaqs[isEditing] = { ...form };
    } else {
      newFaqs.push({ ...form });
    }

    saveToDb(newFaqs, categories);
  };

  const handleDeleteFAQ = (idx: number) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    const newFaqs = faqs.filter((_, i) => i !== idx);
    saveToDb(newFaqs, categories);
  };

  const handleEdit = (idx: number) => {
    const faq = faqs[idx];
    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || categories[0],
      visibility: faq.visibility || "global",
      targetPages: faq.targetPages || []
    });
    setIsEditing(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = () => {
    if (!newCategory || categories.includes(newCategory)) return;
    const updatedCats = [...categories, newCategory];
    saveToDb(faqs, updatedCats);
    setNewCategory("");
  };

  const handleDeleteCategory = (cat: string) => {
    if (!confirm(`Delete category "${cat}"? FAQs in this category will need a new category.`)) return;
    const updatedCats = categories.filter(c => c !== cat);
    // Optionally reassign FAQs or keep them as is (UI should handle missing category)
    saveToDb(faqs, updatedCats);
  };

  const togglePage = (pageId: string) => {
    setForm(prev => ({
      ...prev,
      targetPages: prev.targetPages.includes(pageId)
        ? prev.targetPages.filter(p => p !== pageId)
        : [...prev.targetPages, pageId]
    }));
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
            <span className="text-slate-900 font-bold">FAQs</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            FAQ Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage questions, answers, categories, and page targeting.</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-bold transition-all hover:bg-slate-200"
          >
            <Layers className="w-5 h-5" />
            Categories
          </button>
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(faqs.length);
                setForm({ question: "", answer: "", category: categories[0] || "", visibility: "global", targetPages: [] });
              }}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              Add FAQ
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCategoryManager && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 mb-10 overflow-hidden shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-primary" />
              Manage Categories
            </h2>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button
                onClick={handleAddCategory}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
              >
                Add Category
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <div key={cat} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full group">
                  <span className="text-slate-700 font-bold text-sm">{cat}</span>
                  <button onClick={() => handleDeleteCategory(cat)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                {isEditing < faqs.length ? "Edit FAQ" : "Create New FAQ"}
              </h2>
              <button onClick={() => setIsEditing(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Question & Answer */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Question</label>
                  <input
                    type="text"
                    value={form.question}
                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Enter the question..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Answer</label>
                  <textarea
                    rows={6}
                    value={form.answer}
                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 outline-none leading-relaxed"
                    placeholder="Provide a clear answer..."
                  />
                </div>
              </div>

              {/* Category & Visibility */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setForm({ ...form, category: cat })}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                          form.category === cat 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                          : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Visibility Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setForm({ ...form, visibility: "global" })}
                      className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                        form.visibility === "global"
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Globe className={`w-6 h-6 ${form.visibility === "global" ? "text-primary" : "text-slate-400"}`} />
                      <div className="text-center">
                        <p className={`text-sm font-bold ${form.visibility === "global" ? "text-slate-900" : "text-slate-500"}`}>Global</p>
                        <p className="text-[10px] text-slate-400 mt-1">Show on all FAQ sections</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setForm({ ...form, visibility: "specific" })}
                      className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                        form.visibility === "specific"
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Plus className={`w-6 h-6 ${form.visibility === "specific" ? "text-primary" : "text-slate-400"}`} />
                      <div className="text-center">
                        <p className={`text-sm font-bold ${form.visibility === "specific" ? "text-slate-900" : "text-slate-500"}`}>Specific Pages</p>
                        <p className="text-[10px] text-slate-400 mt-1">Select target pages</p>
                      </div>
                    </button>
                  </div>
                </div>

                {form.visibility === "specific" && (
                  <div className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Target Pages</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availablePages.map(page => (
                        <label key={page.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={form.targetPages.includes(page.id)}
                            onChange={() => togglePage(page.id)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                          />
                          <span className={`text-xs font-bold ${form.targetPages.includes(page.id) ? "text-slate-900" : "text-slate-500"} group-hover:text-slate-900`}>
                            {page.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 mt-10 pt-8">
              <button
                onClick={handleSaveFAQ}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Saving Changes..." : "Save FAQ"}
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

      {/* FAQs List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 group hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 relative"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
                    {faq.category}
                  </span>
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                    faq.visibility === 'global' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {faq.visibility === 'global' ? <Globe className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    {faq.visibility === 'global' ? 'Global' : 'Specific Pages'}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2 leading-tight">{faq.question}</h3>
                <p className="text-slate-500 text-sm font-medium line-clamp-1 group-hover:line-clamp-none transition-all duration-500">
                  {faq.answer}
                </p>
                {faq.visibility === 'specific' && faq.targetPages?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Visible on:</span>
                    {faq.targetPages.map((p: string) => (
                      <span key={p} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">
                        {p.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => handleEdit(idx)}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-slate-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFAQ(idx)}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {faqs.length === 0 && !isEditing && (
          <div className="py-20 text-center bg-white border border-slate-200 border-dashed rounded-3xl">
            <HelpCircle className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No questions found. Start by adding one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
