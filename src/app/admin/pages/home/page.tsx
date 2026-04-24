"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, ChevronRight } from "lucide-react";
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
    { id: "whyChooseUs", label: "Why Choose Us", icon: ImageIcon },
    { id: "quote", label: "Quote CTA", icon: Type },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/40 mb-2">
            <Link href="/admin/pages" className="hover:text-white transition-colors">Pages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Home</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Edit Homepage</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
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
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Editor Area */}
        <div className="md:col-span-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
          <AnimatePresence mode="wait">
            {activeTab === "hero" && (
              <motion.div key="hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Hero Section</h2>
                
                {/* Background Image */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Background Image</label>
                  
                  {data.hero?.images?.[0] && (
                    <div className="mb-2 relative w-full h-32 rounded-xl overflow-hidden border border-white/10">
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                  />
                  <p className="text-xs text-white/40 mt-1">Upload an image from your computer to replace the hero background.</p>
                </div>

                {/* Badge & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Badge</label>
                    <input
                      type="text"
                      value={data.hero?.badge || ""}
                      onChange={(e) => updateSection("hero", "badge", e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Description</label>
                    <textarea
                      rows={2}
                      value={data.hero?.description || ""}
                      onChange={(e) => updateSection("hero", "description", e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Headlines */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white">Headlines</h3>
                  {(data.hero?.headlines || []).map((line: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Line {idx + 1} Text</label>
                        <input
                          type="text"
                          value={line.text || ""}
                          onChange={(e) => {
                            const newHeadlines = [...data.hero.headlines];
                            newHeadlines[idx].text = e.target.value;
                            updateSection("hero", "headlines", newHeadlines);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-center justify-center pt-6">
                        <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Highlight?</label>
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
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white">Call to Action Buttons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data.hero?.buttons || []).map((btn: any, idx: number) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Button {idx + 1}</p>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Label</label>
                          <input
                            type="text"
                            value={btn.text || ""}
                            onChange={(e) => {
                              const newBtns = [...data.hero.buttons];
                              newBtns[idx].text = e.target.value;
                              updateSection("hero", "buttons", newBtns);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Link (href)</label>
                          <input
                            type="text"
                            value={btn.href || ""}
                            onChange={(e) => {
                              const newBtns = [...data.hero.buttons];
                              newBtns[idx].href = e.target.value;
                              updateSection("hero", "buttons", newBtns);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white">Hero Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(data.hero?.stats || []).map((stat: any, idx: number) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Value</label>
                          <input
                            type="text"
                            value={stat.value || ""}
                            onChange={(e) => {
                              const newStats = [...data.hero.stats];
                              newStats[idx].value = e.target.value;
                              updateSection("hero", "stats", newStats);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-bold focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Label</label>
                          <input
                            type="text"
                            value={stat.label || ""}
                            onChange={(e) => {
                              const newStats = [...data.hero.stats];
                              newStats[idx].label = e.target.value;
                              updateSection("hero", "stats", newStats);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none"
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
                <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">About Section</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Badge</label>
                    <input
                      type="text"
                      value={data.about?.badge || ""}
                      onChange={(e) => updateSection("about", "badge", e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Years Experience</label>
                    <input
                      type="text"
                      value={data.about?.yearsExperience || ""}
                      onChange={(e) => updateSection("about", "yearsExperience", e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Headline (HTML Allowed)</label>
                  <input
                    type="text"
                    value={data.about?.headline || ""}
                    onChange={(e) => updateSection("about", "headline", e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Main Description</label>
                  <textarea
                    rows={4}
                    value={data.about?.description || ""}
                    onChange={(e) => updateSection("about", "description", e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "whyChooseUs" && (
              <motion.div key="whyChooseUs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Why Choose Us</h2>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Headline</label>
                  <input
                    type="text"
                    value={data.whyChooseUs?.headline || ""}
                    onChange={(e) => updateSection("whyChooseUs", "headline", e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Description</label>
                  <textarea
                    rows={3}
                    value={data.whyChooseUs?.description || ""}
                    onChange={(e) => updateSection("whyChooseUs", "description", e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "quote" && (
              <motion.div key="quote" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Quote / Call to Action</h2>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Headline</label>
                  <input
                    type="text"
                    value={data.quote?.headline || ""}
                    onChange={(e) => updateSection("quote", "headline", e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Sub-headline</label>
                  <input
                    type="text"
                    value={data.quote?.subHeadline || ""}
                    onChange={(e) => updateSection("quote", "subHeadline", e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
