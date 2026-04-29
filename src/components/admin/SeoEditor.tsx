"use client";

import { useState, useEffect } from "react";
import { 
  Search, Globe, Share2, Twitter, Info, CheckCircle, AlertCircle, 
  ChevronDown, ChevronUp, Eye, Layout, Type, Image as ImageIcon,
  MousePointer2, ExternalLink, Link2, FileJson, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageField from "./ImageField";

interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  metaRobotsIndex?: string;
  metaRobotsFollow?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaData?: string;
  breadcrumbTitle?: string;
}

interface SeoEditorProps {
  data: SeoData;
  setData: (data: SeoData) => void;
  pageSlug: string;
  pageTitle: string;
  pageContent?: any;
}

export default function SeoEditor({ data, setData, pageSlug, pageTitle, pageContent }: SeoEditorProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'schema' | 'analysis'>('general');
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  const updateField = (field: keyof SeoData, value: string) => {
    setData({ ...data, [field]: value });
  };

  useEffect(() => {
    runAnalysis();
  }, [data, pageSlug, pageTitle, pageContent]);

  const runAnalysis = () => {
    const issues = [];
    const keyword = data.focusKeyword?.toLowerCase() || "";
    const title = data.metaTitle || pageTitle || "";
    const description = data.metaDescription || "";
    const slug = pageSlug || "";

    // Title checks
    if (!data.metaTitle) issues.push({ type: 'warning', text: "Meta title is missing. Using default page title." });
    else if (data.metaTitle.length < 30) issues.push({ type: 'warning', text: "Meta title is too short." });
    else if (data.metaTitle.length > 60) issues.push({ type: 'error', text: "Meta title is too long (over 60 chars)." });
    else issues.push({ type: 'success', text: "Meta title length is optimal." });

    // Description checks
    if (!description) issues.push({ type: 'error', text: "Meta description is missing." });
    else if (description.length < 120) issues.push({ type: 'warning', text: "Meta description is too short." });
    else if (description.length > 160) issues.push({ type: 'error', text: "Meta description is too long (over 160 chars)." });
    else issues.push({ type: 'success', text: "Meta description length is optimal." });

    // Keyword checks
    if (keyword) {
      if (title.toLowerCase().includes(keyword)) issues.push({ type: 'success', text: `Keyword "${keyword}" found in title.` });
      else issues.push({ type: 'error', text: `Keyword "${keyword}" not found in title.` });

      if (description.toLowerCase().includes(keyword)) issues.push({ type: 'success', text: `Keyword "${keyword}" found in description.` });
      else issues.push({ type: 'warning', text: `Keyword "${keyword}" not found in description.` });

      if (slug.toLowerCase().includes(keyword.replace(/\s+/g, '-'))) issues.push({ type: 'success', text: `Keyword found in URL slug.` });
      else issues.push({ type: 'warning', text: `Keyword not found in URL slug.` });
      
      if (slug.length > 50) issues.push({ type: 'warning', text: "URL slug is a bit long. Consider shortening it." });
    } else {
      issues.push({ type: 'info', text: "Add a focus keyword to improve analysis." });
    }

    setAnalysis(issues);
    
    // Calculate score
    const successCount = issues.filter(i => i.type === 'success').length;
    const totalCount = issues.filter(i => i.type !== 'info').length;
    setScore(totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0);
  };

  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-100 px-8 py-4">
        {[
          { id: 'general', label: 'General SEO', icon: Search },
          { id: 'social', label: 'Social Media', icon: Share2 },
          { id: 'schema', label: 'Structured Data', icon: FileJson },
          { id: 'analysis', label: 'Analysis & Feedback', icon: CheckCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? "bg-primary/5 text-primary shadow-sm border border-primary/10" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
        
        <div className="ml-auto flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEO Score</div>
           <div className={`text-sm font-bold ${getScoreColor()}`}>{score}%</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className="col-span-7 border-r border-slate-50 p-10 overflow-y-auto max-h-[800px] scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                      <MousePointer2 className="w-3 h-3" />
                      Focus Keyword(s)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Roofing St. Louis"
                      value={data.focusKeyword || ""}
                      onChange={(e) => updateField('focusKeyword', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm"
                    />
                    <p className="text-[9px] text-slate-400 ml-1">The primary keyword you want this page to rank for.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Type className="w-3 h-3" />
                        SEO Title (Meta Title)
                      </label>
                      <span className={`text-[9px] font-bold uppercase ${
                        (data.metaTitle?.length || 0) > 60 ? "text-red-500" : (data.metaTitle?.length || 0) > 50 ? "text-emerald-500" : "text-slate-400"
                      }`}>
                        {data.metaTitle?.length || 0} / 60
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder={pageTitle}
                      value={data.metaTitle || ""}
                      onChange={(e) => updateField('metaTitle', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Meta Description
                      </label>
                      <span className={`text-[9px] font-bold uppercase ${
                        (data.metaDescription?.length || 0) > 160 ? "text-red-500" : (data.metaDescription?.length || 0) > 120 ? "text-emerald-500" : "text-slate-400"
                      }`}>
                        {data.metaDescription?.length || 0} / 160
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="A short summary of the page for search results..."
                      value={data.metaDescription || ""}
                      onChange={(e) => updateField('metaDescription', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <Link2 className="w-3 h-3" />
                        Canonical URL
                      </label>
                      <input
                        type="text"
                        placeholder={`https://eaglerevolution.com/${pageSlug}`}
                        value={data.canonicalUrl || ""}
                        onChange={(e) => updateField('canonicalUrl', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <Type className="w-3 h-3" />
                        Breadcrumb Title
                      </label>
                      <input
                        type="text"
                        placeholder={pageTitle}
                        value={data.breadcrumbTitle || ""}
                        onChange={(e) => updateField('breadcrumbTitle', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                      <Eye className="w-3 h-3" />
                      Robots Settings
                    </label>
                    <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-sm max-w-xs">
                      <select
                        value={data.metaRobotsIndex || 'index'}
                        onChange={(e) => updateField('metaRobotsIndex', e.target.value)}
                        className="flex-1 bg-white border border-slate-100 rounded-lg px-3 py-2 text-[10px] font-bold uppercase outline-none"
                      >
                        <option value="index">Index</option>
                        <option value="noindex">NoIndex</option>
                      </select>
                      <select
                        value={data.metaRobotsFollow || 'follow'}
                        onChange={(e) => updateField('metaRobotsFollow', e.target.value)}
                        className="flex-1 bg-white border border-slate-100 rounded-lg px-3 py-2 text-[10px] font-bold uppercase outline-none"
                      >
                        <option value="follow">Follow</option>
                        <option value="nofollow">NoFollow</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="space-y-10"
              >
                {/* Open Graph */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Facebook / Open Graph</h3>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">OG Title</label>
                        <input
                          type="text"
                          placeholder={data.metaTitle || pageTitle}
                          value={data.ogTitle || ""}
                          onChange={(e) => updateField('ogTitle', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">OG Description</label>
                        <textarea
                          rows={3}
                          placeholder={data.metaDescription}
                          value={data.ogDescription || ""}
                          onChange={(e) => updateField('ogDescription', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <ImageField 
                          label="OG Image" 
                          value={data.ogImage || ""} 
                          onChange={(url) => updateField('ogImage', url)} 
                          description="The image shown when the page is shared on Facebook/LinkedIn. Recommended size: 1200x630px."
                        />
                      </div>
                   </div>
                </div>

                {/* Twitter */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-black">
                        <Twitter className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Twitter Card</h3>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Card Type</label>
                        <select
                          value={data.twitterCard || 'summary_large_image'}
                          onChange={(e) => updateField('twitterCard', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none appearance-none cursor-pointer"
                        >
                          <option value="summary">Summary</option>
                          <option value="summary_large_image">Summary Large Image</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Twitter Title</label>
                        <input
                          type="text"
                          placeholder={data.ogTitle || data.metaTitle || pageTitle}
                          value={data.twitterTitle || ""}
                          onChange={(e) => updateField('twitterTitle', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-primary/30 transition-all"
                        />
                      </div>
                   </div>

                   <div className="pt-6">
                      <ImageField 
                        label="Twitter Card Image" 
                        value={data.twitterImage || ""} 
                        onChange={(url) => updateField('twitterImage', url)} 
                        description="Optional: Override the OG image specifically for Twitter shares."
                      />
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'schema' && (
              <motion.div
                key="schema"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                 <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
                    <Info className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                       <h4 className="text-sm font-bold text-amber-900 mb-1">Custom Structured Data</h4>
                       <p className="text-xs text-amber-700 leading-relaxed">
                         Paste your JSON-LD schema here. This will be injected into the page head. Ensure the JSON is valid to avoid rendering issues.
                       </p>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                      <FileJson className="w-3.5 h-3.5" />
                      JSON-LD Schema
                    </label>
                    <textarea
                      rows={12}
                      placeholder='{ "@context": "https://schema.org", "@type": "Article", ... }'
                      value={data.schemaData || ""}
                      onChange={(e) => updateField('schemaData', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-5 text-xs font-mono text-emerald-400 outline-none focus:border-primary/50 transition-all shadow-2xl"
                    />
                 </div>
              </motion.div>
            )}

            {activeTab === 'analysis' && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
                      <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Passes</div>
                      <div className="text-2xl font-bold text-emerald-900">{analysis.filter(i => i.type === 'success').length}</div>
                   </div>
                   <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6">
                      <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Warnings</div>
                      <div className="text-2xl font-bold text-amber-900">{analysis.filter(i => i.type === 'warning' || i.type === 'error').length}</div>
                   </div>
                </div>

                <div className="space-y-3">
                  {analysis.map((issue, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl border ${
                      issue.type === 'success' ? "bg-emerald-50/20 border-emerald-100" :
                      issue.type === 'error' ? "bg-red-50/20 border-red-100" :
                      issue.type === 'warning' ? "bg-amber-50/20 border-amber-100" :
                      "bg-slate-50 border-slate-100"
                    }`}>
                      {issue.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      {issue.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      {issue.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                      {issue.type === 'info' && <Info className="w-4 h-4 text-slate-400" />}
                      <span className="text-xs font-medium text-slate-700">{issue.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preview Area */}
        <div className="col-span-5 bg-slate-50/50 p-10 overflow-y-auto">
          <div className="space-y-10 sticky top-0">
             {/* Google Search Preview */}
             <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                   <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <Search className="w-3 h-3" />
                     Google Search Preview
                   </h3>
                   <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                   </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-2">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Globe className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] text-slate-500 leading-none">eaglerevolution.com</span>
                         <span className="text-[9px] text-slate-300 leading-none">https://eaglerevolution.com › {pageSlug}</span>
                      </div>
                   </div>
                   <h4 className="text-[18px] text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight">
                     {data.metaTitle || pageTitle}
                   </h4>
                   <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                     {data.metaDescription || "No meta description provided. Search engines will attempt to find relevant content from the page to display here."}
                   </p>
                </div>
             </div>

             {/* Facebook Preview */}
             <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Share2 className="w-3 h-3" />
                  Social Card Preview
                </h3>
                
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                   <div className="aspect-[1.91/1] bg-slate-100 relative group overflow-hidden">
                      {data.ogImage ? (
                        <img src={data.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                           <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">No OG Image</span>
                        </div>
                      )}
                   </div>
                   <div className="p-6 border-t border-slate-50">
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">eaglerevolution.com</div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-1">{data.ogTitle || data.metaTitle || pageTitle}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {data.ogDescription || data.metaDescription || "Click here to view more details about our veteran-owned roofing services..."}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
