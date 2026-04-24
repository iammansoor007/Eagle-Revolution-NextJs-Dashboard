"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, ChevronRight, Star, Phone, Plus, Trash2, Mail } from "lucide-react";
import Link from "next/link";

export default function HomeEditor() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the raw content from the API directly to get the latest DB state
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
        setMessage("Homepage content saved successfully!");
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

  const updateSection = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
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

  const tabs = [
    { id: "hero", label: "Hero Section", icon: LayoutTemplate },
    { id: "about", label: "About Section", icon: Type },
    { id: "services", label: "Services Section", icon: LayoutTemplate },
    { id: "founder", label: "Founder Section", icon: Type },
    { id: "portfolio", label: "Portfolio Section", icon: ImageIcon },
    { id: "testimonials", label: "Testimonials", icon: Type },
    { id: "whyChooseUs", label: "Why Choose Us", icon: ImageIcon },
    { id: "quote", label: "Homepage Contact", icon: Mail },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/admin/pages" className="hover:text-gray-900 transition-colors">Pages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">Home</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Homepage</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes("success") ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab: any) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20 hover:bg-gray-100"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Editor Area */}
        <div className="md:col-span-3 bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
          <AnimatePresence mode="wait">
            {activeTab === "hero" && (
              <motion.div key="hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-6">Hero Section</h2>

                {/* Background Image */}
                <div className="space-y-2">
                  <label className="text-slate-600 font-bold tracking-widest uppercase text-[10px]">Background Image</label>

                  {data.hero?.images?.[0] && (
                    <div className="mb-2 relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
                      <img src={data.hero.images[0]} alt="Hero background" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Upload file
                      const formData = new FormData();
                      formData.append("file", file);

                      try {
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });
                        if (res.ok) {
                          const { url } = await res.json();
                          const currentImages = Array.isArray(data.hero?.images) ? data.hero.images : [];
                          const newImages = [...currentImages];
                          newImages[0] = url;
                          updateSection("hero", "images", newImages);
                        } else {
                          alert("Upload failed.");
                        }
                      } catch (err) {
                        alert("Error uploading image.");
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload an image from your computer to replace the hero background.</p>
                </div>

                {/* Badge & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Badge</label>
                    <input
                      type="text"
                      value={data.hero?.badge || ""}
                      onChange={(e) => updateSection("hero", "badge", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Description</label>
                    <textarea
                      rows={2}
                      value={data.hero?.description || ""}
                      onChange={(e) => updateSection("hero", "description", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Headlines */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Headlines</h3>
                  {(data.hero?.headlines || []).map((line: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Line {idx + 1} Text</label>
                        <input
                          type="text"
                          value={line.text || ""}
                          onChange={(e) => {
                            const newHeadlines = [...data.hero.headlines];
                            newHeadlines[idx].text = e.target.value;
                            updateSection("hero", "headlines", newHeadlines);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-center justify-center pt-6">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Highlight?</label>
                        <input
                          type="checkbox"
                          checked={line.highlight || false}
                          onChange={(e) => {
                            const newHeadlines = [...data.hero.headlines];
                            newHeadlines[idx].highlight = e.target.checked;
                            updateSection("hero", "headlines", newHeadlines);
                          }}
                          className="w-5 h-5 accent-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buttons (CTAs) */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Call to Action Buttons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data.hero?.buttons || []).map((btn: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Button {idx + 1}</p>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Label</label>
                          <input
                            type="text"
                            value={btn.text || ""}
                            onChange={(e) => {
                              const newBtns = [...data.hero.buttons];
                              newBtns[idx].text = e.target.value;
                              updateSection("hero", "buttons", newBtns);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Link (href)</label>
                          <input
                            type="text"
                            value={btn.href || ""}
                            onChange={(e) => {
                              const newBtns = [...data.hero.buttons];
                              newBtns[idx].href = e.target.value;
                              updateSection("hero", "buttons", newBtns);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Hero Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(data.hero?.stats || []).map((stat: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Value</label>
                          <input
                            type="text"
                            value={stat.value || ""}
                            onChange={(e) => {
                              const newStats = [...data.hero.stats];
                              newStats[idx].value = e.target.value;
                              updateSection("hero", "stats", newStats);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm font-bold focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Label</label>
                          <input
                            type="text"
                            value={stat.label || ""}
                            onChange={(e) => {
                              const newStats = [...data.hero.stats];
                              newStats[idx].label = e.target.value;
                              updateSection("hero", "stats", newStats);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "about" && (
              <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">About Section</h2>

                {/* Image Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Left Side Image</label>
                    {data.about?.image?.src && (
                      <div className="mb-2 relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
                        <img src={data.about.image.src} alt="About" className="w-full h-full object-cover" />
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
                            setData((prev: any) => ({ ...prev, about: { ...prev.about, image: { ...prev.about.image, src: url } } }));
                          } else {
                            alert("Upload failed.");
                          }
                        } catch (err) {
                          alert("Error uploading image.");
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Badge Over Image</label>
                      <input
                        type="text"
                        value={data.about?.image?.badge || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, about: { ...prev.about, image: { ...prev.about.image, badge: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. 10+ YEARS EXPERIENCE"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Section Top Badge</label>
                      <input
                        type="text"
                        value={data.about?.badge || ""}
                        onChange={(e) => updateSection("about", "badge", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Section Headline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Prefix</label>
                      <input
                        type="text"
                        value={data.about?.headline?.prefix || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, about: { ...prev.about, headline: { ...prev.about.headline, prefix: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-bold text-primary">Highlight</label>
                      <input
                        type="text"
                        value={data.about?.headline?.highlight || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, about: { ...prev.about, headline: { ...prev.about.headline, highlight: e.target.value } } }))}
                        className="w-full bg-white border border-primary/30 text-primary font-bold rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Suffix</label>
                      <input
                        type="text"
                        value={data.about?.headline?.suffix || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, about: { ...prev.about, headline: { ...prev.about.headline, suffix: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Description & Core Values */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Description</label>
                    <textarea
                      rows={4}
                      value={data.about?.description || ""}
                      onChange={(e) => updateSection("about", "description", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">5 Trust Badges (Comma separated)</label>
                    <input
                      type="text"
                      value={(data.about?.coreValues || []).join(", ")}
                      onChange={(e) => updateSection("about", "coreValues", e.target.value.split(",").map((s: any) => s.trim()).filter(Boolean))}
                      placeholder="Licensed, Insured, Veteran Owned..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Buttons (CTAs) */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Call to Action Buttons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data.about?.buttons || []).map((btn: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Button {idx + 1}</p>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Label</label>
                          <input
                            type="text"
                            value={btn.text || ""}
                            onChange={(e) => {
                              const newBtns = [...data.about.buttons];
                              newBtns[idx].text = e.target.value;
                              updateSection("about", "buttons", newBtns);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Link (href)</label>
                          <input
                            type="text"
                            value={btn.href || ""}
                            onChange={(e) => {
                              const newBtns = [...data.about.buttons];
                              newBtns[idx].href = e.target.value;
                              updateSection("about", "buttons", newBtns);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Stats Cards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(data.about?.stats || []).map((stat: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Value</label>
                          <input
                            type="number"
                            value={stat.value || 0}
                            onChange={(e) => {
                              const newStats = [...data.about.stats];
                              newStats[idx].value = parseInt(e.target.value) || 0;
                              updateSection("about", "stats", newStats);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm font-bold focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Suffix (e.g. +)</label>
                          <input
                            type="text"
                            value={stat.suffix || ""}
                            onChange={(e) => {
                              const newStats = [...data.about.stats];
                              newStats[idx].suffix = e.target.value;
                              updateSection("about", "stats", newStats);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Label</label>
                          <input
                            type="text"
                            value={stat.label || ""}
                            onChange={(e) => {
                              const newStats = [...data.about.stats];
                              newStats[idx].label = e.target.value;
                              updateSection("about", "stats", newStats);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "services" && (
              <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Services Section</h2>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 3</span>
                </div>

                {/* Image Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Right Side Media
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Image Upload</label>
                      {data.services?.image?.src && (
                        <div className="mb-3 relative w-full h-40 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg group">
                          <img src={data.services.image.src} alt="Services" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
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
                              setData((prev: any) => ({ ...prev, services: { ...prev.services, image: { ...prev.services.image, src: url } } }));
                            } else {
                              alert("Upload failed.");
                            }
                          } catch (err) {
                            alert("Error uploading image.");
                          }
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:tracking-wider file:bg-primary/10 text-primary border border-primary/20 hover:file:bg-primary/80 transition-colors"
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Floating Image Badge</label>
                        <input
                          type="text"
                          value={data.services?.image?.badge || ""}
                          onChange={(e) => setData((prev: any) => ({ ...prev, services: { ...prev.services, image: { ...prev.services.image, badge: e.target.value } } }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all transition-colors"
                          placeholder="e.g. 🇺🇸 Veteran Owned & Operated"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Top Badge</label>
                        <input
                          type="text"
                          value={data.services?.badge || ""}
                          onChange={(e) => updateSection("services", "badge", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all transition-colors"
                          placeholder="e.g. Our Expertise"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    Text Content
                  </h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Headline Prefix</label>
                        <input
                          type="text"
                          value={data.services?.headline?.prefix || ""}
                          onChange={(e) => setData((prev: any) => ({ ...prev, services: { ...prev.services, headline: { ...prev.services.headline, prefix: e.target.value } } }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-primary font-bold">Highlight</label>
                        <input
                          type="text"
                          value={data.services?.headline?.highlight || ""}
                          onChange={(e) => setData((prev: any) => ({ ...prev, services: { ...prev.services, headline: { ...prev.services.headline, highlight: e.target.value } } }))}
                          className="w-full bg-primary/10 border border-primary/30 text-primary font-bold rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Headline Suffix</label>
                        <input
                          type="text"
                          value={data.services?.headline?.suffix || ""}
                          onChange={(e) => setData((prev: any) => ({ ...prev, services: { ...prev.services, headline: { ...prev.services.headline, suffix: e.target.value } } }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold flex justify-between">
                        <span>Description Paragraphs</span>
                        <span className="text-gray-400 lowercase font-normal italic">Hit enter for a new paragraph</span>
                      </label>
                      <textarea
                        rows={5}
                        value={(data.services?.description || []).join('\n')}
                        onChange={(e) => updateSection("services", "description", e.target.value.split('\n').filter(Boolean))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-sm leading-relaxed focus:border-primary/50 focus:outline-none resize-y min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-primary" />
                    Stats Indicators
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(data.services?.stats || []).map((stat: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest border-b border-gray-200 pb-2">Stat #{idx + 1}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Value</label>
                            <input
                              type="number"
                              value={stat.value || 0}
                              onChange={(e) => {
                                const newStats = [...data.services.stats];
                                newStats[idx].value = parseInt(e.target.value) || 0;
                                updateSection("services", "stats", newStats);
                              }}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-lg font-bold focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Suffix</label>
                            <input
                              type="text"
                              value={stat.suffix || ""}
                              onChange={(e) => {
                                const newStats = [...data.services.stats];
                                newStats[idx].suffix = e.target.value;
                                updateSection("services", "stats", newStats);
                              }}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                              placeholder="e.g. +"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Label</label>
                          <input
                            type="text"
                            value={stat.label || ""}
                            onChange={(e) => {
                              const newStats = [...data.services.stats];
                              newStats[idx].label = e.target.value;
                              updateSection("services", "stats", newStats);
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Panel */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10">
                    <ChevronRight className="w-5 h-5 text-primary" />
                    Bottom Call to Action
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Heading</label>
                      <input
                        type="text"
                        value={data.services?.cta?.title || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, services: { ...prev.services, cta: { ...prev.services.cta, title: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Button Label</label>
                      <input
                        type="text"
                        value={data.services?.cta?.buttonText || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, services: { ...prev.services, cta: { ...prev.services.cta, buttonText: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Description Text</label>
                      <textarea
                        rows={2}
                        value={data.services?.cta?.description || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, services: { ...prev.services, cta: { ...prev.services.cta, description: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Destination Link</label>
                      <input
                        type="text"
                        value={data.services?.cta?.buttonLink || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, services: { ...prev.services, cta: { ...prev.services.cta, buttonLink: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "founder" && (
              <motion.div key="founder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Founder Section</h2>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 4</span>
                </div>

                {/* Intro Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    Section Intro Header
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Badge</label>
                      <input
                        type="text"
                        value={data.leadership?.section?.badge || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, section: { ...prev.leadership.section, badge: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. OUR LEADERSHIP"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Heading</label>
                      <input
                        type="text"
                        value={data.leadership?.section?.headline || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, section: { ...prev.leadership.section, headline: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Paragraph</label>
                      <textarea
                        rows={2}
                        value={data.leadership?.section?.description || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, section: { ...prev.leadership.section, description: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Left Side Panel (Portrait & Badges) */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Left Side: Founder Portrait
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Image Upload</label>
                      {data.leadership?.ceo?.image?.src && (
                        <div className="mb-3 relative w-full h-40 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg group">
                          <img src={data.leadership.ceo.image.src} alt="CEO" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
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
                              setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, image: { ...prev.leadership.ceo.image, src: url } } } }));
                            } else {
                              alert("Upload failed.");
                            }
                          } catch (err) {
                            alert("Error uploading image.");
                          }
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:tracking-wider file:bg-primary/10 text-primary border border-primary/20 hover:file:bg-primary/80 transition-colors"
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Top Image Badge</label>
                        <input
                          type="text"
                          value={data.leadership?.ceo?.badges?.top || ""}
                          onChange={(e) => setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, badges: { ...prev.leadership.ceo.badges, top: e.target.value } } } }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all transition-colors"
                          placeholder="e.g. Founder & CEO"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Bottom Image Badge</label>
                        <input
                          type="text"
                          value={data.leadership?.ceo?.badges?.bottom || ""}
                          onChange={(e) => setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, badges: { ...prev.leadership.ceo.badges, bottom: e.target.value } } } }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all transition-colors"
                          placeholder="e.g. 15+ Years Experience"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Content Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-primary" />
                    Right Side: Founder Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Founder Name</label>
                      <input
                        type="text"
                        value={data.leadership?.ceo?.name || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, name: e.target.value } } }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-bold focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-primary font-bold">Founder Title / Keypoint</label>
                      <input
                        type="text"
                        value={data.leadership?.ceo?.title || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, title: e.target.value } } }))}
                        className="w-full bg-primary/10 border border-primary/30 text-primary font-bold rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold flex justify-between">
                        <span>Founder Quotes</span>
                        <span className="text-gray-400 lowercase font-normal italic">Hit enter for a new quote</span>
                      </label>
                      <textarea
                        rows={3}
                        value={(data.leadership?.ceo?.quotes || []).join('\n')}
                        onChange={(e) => setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, quotes: e.target.value.split('\n').filter(Boolean) } } }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-lg font-medium leading-relaxed focus:border-primary/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold flex justify-between">
                        <span>Complete Description</span>
                        <span className="text-gray-400 lowercase font-normal italic">Hit enter for a new paragraph</span>
                      </label>
                      <textarea
                        rows={5}
                        value={(data.leadership?.ceo?.description || []).join('\n')}
                        onChange={(e) => setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, description: e.target.value.split('\n').filter(Boolean) } } }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-sm leading-relaxed focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Socials Panel */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-primary" />
                      Founder Social Links
                    </h3>
                    <button
                      onClick={() => {
                        const newSocials = [...(data.leadership?.ceo?.socials || [])];
                        newSocials.push({ icon: "Linkedin", url: "", label: "" });
                        setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, socials: newSocials } } }));
                      }}
                      className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      + Add Social Link
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(data.leadership?.ceo?.socials || []).map((social: any, idx: number) => (
                      <div key={idx} className="flex flex-wrap md:flex-nowrap gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 items-end">
                        <div className="space-y-2 flex-shrink-0 w-full md:w-auto">
                          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Icon</label>
                          <select
                            value={social.icon}
                            onChange={(e) => {
                              const newSocials = [...data.leadership.ceo.socials];
                              newSocials[idx].icon = e.target.value;
                              setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, socials: newSocials } } }));
                            }}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all appearance-none"
                          >
                            <option value="Linkedin">LinkedIn</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Youtube">YouTube</option>
                            <option value="Mail">Email (Mail)</option>
                            <option value="Phone">Phone</option>
                            <option value="Globe">Website (Globe)</option>
                          </select>
                        </div>
                        <div className="space-y-2 flex-grow">
                          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">URL / Link</label>
                          <input
                            type="text"
                            value={social.url || ""}
                            onChange={(e) => {
                              const newSocials = [...data.leadership.ceo.socials];
                              newSocials[idx].url = e.target.value;
                              setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, socials: newSocials } } }));
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                            placeholder="e.g. https://linkedin.com/in/... or mailto:ceo@..."
                          />
                        </div>
                        <div className="space-y-2 flex-grow">
                          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Label (Optional)</label>
                          <input
                            type="text"
                            value={social.label || ""}
                            onChange={(e) => {
                              const newSocials = [...data.leadership.ceo.socials];
                              newSocials[idx].label = e.target.value;
                              setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, socials: newSocials } } }));
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                            placeholder="e.g. admin@example.com"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newSocials = data.leadership.ceo.socials.filter((_: any, i: number) => i !== idx);
                            setData((prev: any) => ({ ...prev, leadership: { ...prev.leadership, ceo: { ...prev.leadership.ceo, socials: newSocials } } }));
                          }}
                          className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {(!data.leadership?.ceo?.socials || data.leadership.ceo.socials.length === 0) && (
                      <p className="text-gray-500 text-sm text-center py-4 italic">No social links added yet.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "portfolio" && (
              <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Portfolio Section</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure the design settings for the homepage portfolio section. (To add/remove actual projects, use the Projects sidebar tab).</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 5</span>
                </div>

                {/* Intro Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    Section Headers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Badge</label>
                      <input
                        type="text"
                        value={data.portfolio?.section?.badge || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, portfolio: { ...prev.portfolio, section: { ...prev.portfolio.section, badge: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. OUR WORK"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Heading</label>
                      <input
                        type="text"
                        value={data.portfolio?.section?.headline || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, portfolio: { ...prev.portfolio, section: { ...prev.portfolio.section, headline: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. Featured Projects"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-primary" />
                    Bottom Call to Action Button
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Button Label</label>
                      <input
                        type="text"
                        value={data.portfolio?.button?.text || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, portfolio: { ...prev.portfolio, button: { ...prev.portfolio.button, text: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. View All Projects"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Destination Link</label>
                      <input
                        type="text"
                        value={data.portfolio?.button?.link || "/gallery"}
                        onChange={(e) => setData((prev: any) => ({ ...prev, portfolio: { ...prev.portfolio, button: { ...prev.portfolio.button, link: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. /gallery"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "testimonials" && (
              <motion.div key="testimonials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Testimonials Section</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure the headers and stats for the reviews section. (To add/remove actual reviews, use the Reviews sidebar tab).</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 6</span>
                </div>

                {/* Intro Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    Section Headers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Badge</label>
                      <input
                        type="text"
                        value={data.testimonials?.section?.badge || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, testimonials: { ...prev.testimonials, section: { ...prev.testimonials.section, badge: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. TESTIMONIALS"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Heading</label>
                      <input
                        type="text"
                        value={data.testimonials?.section?.headline || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, testimonials: { ...prev.testimonials, section: { ...prev.testimonials.section, headline: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. What Our Clients Say"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Paragraph</label>
                      <textarea
                        rows={2}
                        value={data.testimonials?.section?.description || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, testimonials: { ...prev.testimonials, section: { ...prev.testimonials.section, description: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Bottom Highlights & Stats
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Featured Platform Text (Next to Google Icon)</label>
                      <input
                        type="text"
                        value={data.testimonials?.section?.featured || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, testimonials: { ...prev.testimonials, section: { ...prev.testimonials.section, featured: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. 5.0 Rating on Google"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Subscribers / Customer Count</label>
                      <input
                        type="text"
                        value={data.testimonials?.stats?.subscribers || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, testimonials: { ...prev.testimonials, stats: { ...prev.testimonials.stats, subscribers: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. 500+ Satisfied Customers"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "whyChooseUs" && (
              <motion.div key="whyChooseUs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Why Choose Us</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage the features, stats, and the big call-to-action banner.</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 7</span>
                </div>

                {/* Section Headers */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Section Headers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Badge</label>
                      <input
                        type="text"
                        value={data.whyChooseUs?.section?.badge || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, section: { ...prev.whyChooseUs.section, badge: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Headline</label>
                      <input
                        type="text"
                        value={data.whyChooseUs?.section?.headline || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, section: { ...prev.whyChooseUs.section, headline: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Description</label>
                      <textarea
                        rows={2}
                        value={data.whyChooseUs?.section?.description || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, section: { ...prev.whyChooseUs.section, description: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Features (Cards) */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Feature Cards</h3>
                    <button
                      onClick={() => {
                        const newFeatures = [...(data.whyChooseUs?.features || []), { title: "New Feature", description: "Description...", icon: "CheckCircle2" }];
                        setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, features: newFeatures } }));
                      }}
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                    >
                      + Add Card
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data.whyChooseUs?.features?.map((feature: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-4 flex gap-4 bg-gray-50 relative group">
                        <button
                          onClick={() => {
                            const newFeatures = [...data.whyChooseUs.features];
                            newFeatures.splice(idx, 1);
                            setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, features: newFeatures } }));
                          }}
                          className="absolute top-3 right-3 text-xs font-semibold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                        <div className="w-1/4 space-y-2">
                          <label className="text-[10px] uppercase text-gray-500 font-bold">Icon</label>
                          <select
                            value={feature.icon}
                            onChange={(e) => {
                              const newFeatures = [...data.whyChooseUs.features];
                              newFeatures[idx].icon = e.target.value;
                              setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, features: newFeatures } }));
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                          >
                            <option value="Veteran">Veteran (Custom)</option>
                            <option value="Experience">Experience (Custom)</option>
                            <option value="Warranty">Warranty (Custom)</option>
                            <option value="Financing">Financing (Custom)</option>
                            <option value="Certified">Certified (Custom)</option>
                            <option value="Community">Community (Custom)</option>
                            <option value="Shield">Shield (Lucide)</option>
                            <option value="Star">Star (Lucide)</option>
                            <option value="CheckCircle2">Check (Lucide)</option>
                            <option value="Award">Award (Lucide)</option>
                          </select>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Title</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                const newFeatures = [...data.whyChooseUs.features];
                                newFeatures[idx].title = e.target.value;
                                setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, features: newFeatures } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Description</label>
                            <textarea
                              rows={2}
                              value={feature.description}
                              onChange={(e) => {
                                const newFeatures = [...data.whyChooseUs.features];
                                newFeatures[idx].description = e.target.value;
                                setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, features: newFeatures } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Stats Grid</h3>
                    <button
                      onClick={() => {
                        const newStats = [...(data.whyChooseUs?.stats || []), { label: "New Stat", value: "0", suffix: "+" }];
                        setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, stats: newStats } }));
                      }}
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                    >
                      + Add Stat
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {data.whyChooseUs?.stats?.map((stat: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-3 bg-gray-50 relative group">
                        <button
                          onClick={() => {
                            const newStats = [...data.whyChooseUs.stats];
                            newStats.splice(idx, 1);
                            setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, stats: newStats } }));
                          }}
                          className="absolute top-1 right-1 text-[10px] font-bold bg-red-100 text-red-600 px-1.5 rounded opacity-0 group-hover:opacity-100"
                        >
                          X
                        </button>
                        <div className="space-y-2">
                          <div>
                            <label className="text-[9px] uppercase text-gray-500 font-bold">Label</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...data.whyChooseUs.stats];
                                newStats[idx].label = e.target.value;
                                setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, stats: newStats } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="text-[9px] uppercase text-gray-500 font-bold">Value</label>
                              <input
                                type="text"
                                value={stat.value}
                                onChange={(e) => {
                                  const newStats = [...data.whyChooseUs.stats];
                                  newStats[idx].value = e.target.value;
                                  setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, stats: newStats } }));
                                }}
                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-primary/50 focus:outline-none"
                              />
                            </div>
                            <div className="w-10">
                              <label className="text-[9px] uppercase text-gray-500 font-bold">Suffix</label>
                              <input
                                type="text"
                                value={stat.suffix || ""}
                                onChange={(e) => {
                                  const newStats = [...data.whyChooseUs.stats];
                                  newStats[idx].suffix = e.target.value;
                                  setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, stats: newStats } }));
                                }}
                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-primary/50 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Banner */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">CTA Banner (Bottom)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Offer Badge</label>
                        <input
                          type="text"
                          value={data.whyChooseUs?.cta?.badge || ""}
                          onChange={(e) => setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, badge: e.target.value } } }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Title</label>
                        <input
                          type="text"
                          value={data.whyChooseUs?.cta?.title || ""}
                          onChange={(e) => setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, title: e.target.value } } }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Description</label>
                      <textarea
                        rows={2}
                        value={data.whyChooseUs?.cta?.description || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, description: e.target.value } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Trust Badges (Comma separated)</label>
                      <input
                        type="text"
                        value={data.whyChooseUs?.cta?.trustBadges?.join(', ') || ""}
                        onChange={(e) => setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, trustBadges: e.target.value.split(',').map((s: any) => s.trim()).filter(Boolean) } } }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">CTA Buttons</h4>
                      {data.whyChooseUs?.cta?.buttons?.map((btn: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-end">
                          <div className="flex-1 space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase">Button Label</label>
                            <input
                              type="text"
                              value={btn.text}
                              onChange={(e) => {
                                const newBtns = [...data.whyChooseUs.cta.buttons];
                                newBtns[idx].text = e.target.value;
                                setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, buttons: newBtns } } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase">Destination Link</label>
                            <input
                              type="text"
                              value={btn.href}
                              onChange={(e) => {
                                const newBtns = [...data.whyChooseUs.cta.buttons];
                                newBtns[idx].href = e.target.value;
                                setData((prev: any) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, buttons: newBtns } } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "quote" && (
              <motion.div key="quote" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Homepage Contact Section (QA Form)</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Section Badge</label>
                    <input
                      type="text"
                      value={data.quote?.section?.badge || ""}
                      onChange={(e) => setData((prev: any) => ({ ...prev, quote: { ...(prev.quote || {}), section: { ...(prev.quote?.section || {}), badge: e.target.value } } }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Section Title (Headline)</label>
                    <input
                      type="text"
                      value={data.quote?.section?.headline || ""}
                      onChange={(e) => setData((prev: any) => ({ ...prev, quote: { ...(prev.quote || {}), section: { ...(prev.quote?.section || {}), headline: e.target.value } } }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Section Description</label>
                    <textarea
                      rows={3}
                      value={data.quote?.section?.description || ""}
                      onChange={(e) => setData((prev: any) => ({ ...prev, quote: { ...(prev.quote || {}), section: { ...(prev.quote?.section || {}), description: e.target.value } } }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Receiver Email</label>
                    <input
                      type="email"
                      value={data.quote?.email || ""}
                      onChange={(e) => setData((prev: any) => ({ ...prev, quote: { ...(prev.quote || {}), email: e.target.value } }))}
                      placeholder="Email for submissions"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
