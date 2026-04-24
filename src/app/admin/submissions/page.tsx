"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Calendar, User, Phone, Briefcase } from "lucide-react";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="p-8 text-gray-500">Loading submissions...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Form Submissions</h1>
        <p className="text-slate-500 text-lg font-medium">View and manage all leads, contact requests, and quote inquiries.</p>
      </div>

      <div className="space-y-6">
        {submissions.length === 0 ? (
          <div className="p-20 bg-white border border-slate-200 rounded-3xl text-center shadow-sm">
            <Mail className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium">No submissions found yet.</p>
          </div>
        ) : (
          submissions.map((sub: any, i: number) => (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 blur-3xl group-hover:bg-primary/5 transition-colors" />
              
              <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {sub.type || "Contact Form"}
                    </span>
                    <span className="text-slate-600 text-sm flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      <Calendar className="w-4 h-4 text-primary/60" />
                      {new Date(sub.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Full Name</p>
                        <p className="text-slate-900 font-bold text-lg leading-tight">{sub.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Email Address</p>
                        <a href={`mailto:${sub.email}`} className="text-slate-900 font-bold text-lg hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4 leading-tight">{sub.email}</a>
                      </div>
                    </div>
                    {sub.phone && (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                          <Phone className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Phone Number</p>
                          <a href={`tel:${sub.phone}`} className="text-slate-900 font-bold text-lg hover:text-primary transition-colors leading-tight">{sub.phone}</a>
                        </div>
                      </div>
                    )}
                    {sub.subject && (
                      <div className="flex items-center gap-4 md:col-span-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                          <Briefcase className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Subject / Project</p>
                          <p className="text-slate-900 font-bold text-lg leading-tight">{sub.subject}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:w-1/3 space-y-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 h-full relative shadow-inner">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Message Content
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      "{sub.message}"
                    </p>
                  </div>
                </div>
              </div>

              {sub.extraData && Object.keys(sub.extraData).length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Additional Meta Data</h4>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(sub.extraData).map(([key, value]: any) => (
                      <div key={key} className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-sm group/tag hover:border-primary/30 transition-colors shadow-sm">
                        <span className="text-slate-600 mr-2 font-mono text-[10px] uppercase tracking-tighter font-bold">{key.replace('_', ' ')}</span>
                        <span className="text-slate-900 font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
