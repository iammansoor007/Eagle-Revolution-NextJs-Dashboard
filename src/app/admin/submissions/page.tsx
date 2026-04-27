"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Calendar, User, Phone, Briefcase, Filter, Search, X, CheckCircle2, AlertCircle, FileDown, ExternalLink, ChevronRight, Download } from "lucide-react";
import Link from "next/link";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Quotes", value: "Quote Request" },
    { label: "Jobs", value: "Job Application" },
    { label: "Inquiries", value: "Contact Form" },
    { label: "Newsletter", value: "Newsletter" },
  ];

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesType = filterType === "All" || sub.type === filterType;
      const matchesSearch = 
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.message && sub.message.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [submissions, filterType, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col h-64 items-center justify-center text-slate-400 gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="font-bold uppercase tracking-widest text-xs">Loading Submissions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
            <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-bold">Submissions</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Form Submissions</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200">
            {submissions.length} Total Entries
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-2">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none rounded-xl pl-11 pr-4 py-3 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-0 outline-none"
          />
        </div>
        
        <div className="flex items-center gap-1 w-full md:w-auto p-1 bg-slate-50 rounded-xl">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterType === opt.value 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simplified List Layout */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Message Snippet</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Files</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-10 h-10 text-slate-200" />
                        <p className="text-slate-400 font-medium">No matching submissions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub: any) => (
                    <motion.tr
                      key={sub._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-bold text-sm">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-slate-400 text-[10px] font-medium uppercase">
                          {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                          sub.type === 'Job Application' ? 'bg-amber-100 text-amber-700' :
                          sub.type === 'Quote Request' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {sub.type.replace(' Application', '').replace(' Request', '')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-bold text-sm truncate max-w-[150px]">{sub.name}</div>
                        <div className="text-slate-400 text-xs truncate max-w-[150px]">{sub.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-500 text-xs truncate max-w-[200px] italic">
                          "{sub.message}"
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {sub.attachmentUrl ? (
                          <a 
                            href={sub.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold"
                          >
                            <FileDown className="w-4 h-4" />
                            <span className="text-[10px] uppercase tracking-wider">Download CV</span>
                          </a>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-medium">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 bg-slate-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                    selectedSubmission.type === 'Job Application' ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'
                  }`}>
                    {selectedSubmission.type === 'Job Application' ? <Briefcase className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedSubmission.name}</h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{selectedSubmission.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <a href={`mailto:${selectedSubmission.email}`} className="block text-slate-900 font-bold hover:text-primary transition-colors">{selectedSubmission.email}</a>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <p className="text-slate-900 font-bold">{selectedSubmission.phone || "Not provided"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Submitted Date</label>
                    <p className="text-slate-900 font-bold">{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedSubmission.attachmentUrl && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Documents</label>
                      <a 
                        href={selectedSubmission.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all font-bold text-xs shadow-sm"
                      >
                        <FileDown className="w-5 h-5" />
                        Download Applicant CV
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Message / Application Summary</label>
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl italic text-slate-700 leading-relaxed font-medium">
                    "{selectedSubmission.message}"
                  </div>
                </div>

                {selectedSubmission.extraData && Object.keys(selectedSubmission.extraData).length > 0 && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Additional Information</label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedSubmission.extraData).map(([key, value]: any) => (
                        <div key={key} className="p-3 bg-white border border-slate-200 rounded-xl">
                          <span className="text-slate-400 mr-2 font-bold text-[9px] uppercase tracking-widest">{key.replace(/_/g, ' ')}</span>
                          <span className="text-slate-900 font-bold text-xs">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                  Close Detail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
