"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, Type, ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function FAQPageEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to load content:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage("FAQ Page content saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save content.");
      }
    } catch (err) {
      setMessage("Error saving content.");
    } finally {
      setSaving(false);
    }
  };

  const updatePage = (field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      faqPage: {
        ...prev.faqPage,
        [field]: value,
      },
    }));
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
            <Link href="/admin/pages" className="hover:text-primary transition-colors">Pages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-bold">FAQ Page</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">FAQ Page Layout</h1>
          <p className="text-slate-500 font-medium mt-1">Control the intro content of your dedicated FAQ page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Layout"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl mb-8 text-sm font-bold shadow-sm border ${message.includes("success") ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
          {message}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-10">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">Page Identity</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Page Badge</label>
            <input
              type="text"
              value={data.faqPage?.badge || ""}
              onChange={(e) => updatePage("badge", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner"
              placeholder="e.g. HELP CENTER"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Main Heading</label>
            <input
              type="text"
              value={data.faqPage?.title || ""}
              onChange={(e) => updatePage("title", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner"
              placeholder="e.g. Frequently Asked Questions"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">Page Description</label>
            <textarea
              rows={4}
              value={data.faqPage?.description || ""}
              onChange={(e) => updatePage("description", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner leading-relaxed"
              placeholder="Provide a brief overview of what this page covers..."
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-start gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">!</div>
            <p className="text-slate-600 text-sm font-medium">
              Note: This page only controls the header text. To manage the actual questions and categories, visit the 
              <Link href="/admin/faq" className="text-primary font-bold hover:underline ml-1">FAQ Management</Link> section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
