"use client";

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Upload, Send, Briefcase, FileText, User, Mail, Phone, CheckCircle, ArrowRight } from 'lucide-react';

const Images = {
  Pattern: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
};

const ParallaxLayer = ({ children, speed = 0.1, className = "" }: any) => {
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 50]);

  return (
    <motion.div ref={ref} style={{ y }} className={`absolute inset-0 will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
};

export default function CareersPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Add FormSubmit configurations directly to formData
    formData.append("_subject", "New Job Application - Eagle Revolution");
    formData.append("_captcha", "false");
    formData.append("_template", "table");

    try {
      const response = await fetch("https://formsubmit.co/ajax/ammansoor0077@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      alert("Failed to submit your application. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white min-h-screen font-body w-full overflow-hidden">
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden w-full">
        {/* ====================== */}
        {/* PREMIUM BACKGROUND */}
        {/* ====================== */}

        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #2563eb 1px, transparent 1px),
                linear-gradient(to bottom, #2563eb 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-50 to-transparent opacity-80 blur-[100px]" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

        <ParallaxLayer speed={0.05} className="z-0">
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 opacity-[0.03]">
            <img
              src={Images.Pattern}
              alt="Background pattern"
              className="w-full h-full object-cover"
            />
          </div>
        </ParallaxLayer>

        {/* ====================== */}
        {/* MAIN CONTENT */}
        {/* ====================== */}
        <div className="max-w-5xl mx-auto px-4 xs:px-6 md:px-8 relative z-30">

          <div className="max-w-3xl mx-auto text-center mb-12 xs:mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="w-8 h-[2px] bg-gradient-to-r from-blue-300 to-blue-500" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-blue-600">
                Join Eagle Revolution
              </span>
              <div className="w-8 h-[2px] bg-gradient-to-r from-blue-500 to-blue-300" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-light text-slate-900 mb-6 leading-tight tracking-tight"
            >
              Construct your future with<br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900">
                absolute precision
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-base xs:text-lg md:text-xl font-light max-w-2xl mx-auto px-2 xs:px-4"
            >
              We are seeking driven professionals who refuse to take shortcuts. Bring your expertise to a team that values craft, integrity, and long-term growth.
            </motion.p>
          </div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-blue-700/10 rounded-[2.5rem] blur-xl" />

              <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white">

                {isSuccess ? (
                  <div className="p-8 xs:p-12 sm:p-16 text-center flex flex-col items-center justify-center min-h-[400px] xs:min-h-[500px]">
                    <div className="w-20 h-20 xs:w-24 xs:h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 xs:mb-8">
                      <CheckCircle className="w-10 h-10 xs:w-12 xs:h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl xs:text-3xl font-bold text-slate-900 mb-3 xs:mb-4">Application Submitted!</h2>
                    <p className="text-base xs:text-lg text-slate-600 max-w-md mx-auto">
                      Thank you for your interest in joining Eagle Revolution. Our operations team will review your CV and be in touch shortly.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="p-8 sm:p-12 md:p-16 space-y-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                      {/* Full Name */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold tracking-widest uppercase text-slate-500 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="David Taggart"
                          className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold tracking-widest uppercase text-slate-500 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-500" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="david@example.com"
                          className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold tracking-widest uppercase text-slate-500 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-500" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="(555) 123-4567"
                          className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800"
                        />
                      </div>

                      {/* Role Selection */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold tracking-widest uppercase text-slate-500 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-500" />
                          Position Applying For
                        </label>
                        <div className="relative">
                          <select
                            name="role"
                            required
                            defaultValue=""
                            className="w-full px-4 py-3 xs:px-5 xs:py-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 appearance-none"
                          >
                            <option value="" disabled>Select role...</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Lead Contractor">Lead Contractor</option>
                            <option value="Sales Representative">Sales Representative</option>
                            <option value="Roofing/Exterior Specialist">Roofing & Exterior Specialist</option>
                            <option value="Administrative Support">Administrative Support</option>
                            <option value="Other">Other Inquiry</option>
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter / Message */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold tracking-widest uppercase text-slate-500 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        Professional Summary
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        placeholder="Tell us about your experience and why you belong on our team..."
                        className="w-full px-4 py-3 xs:px-5 xs:py-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all resize-y text-slate-800"
                      ></textarea>
                    </div>

                    {/* CV / Resume Upload */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold tracking-widest uppercase text-slate-500 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-500" />
                        Resume / CV Attachment
                      </label>
                      <div className={`relative group overflow-hidden cursor-pointer w-full border-2 ${fileName ? 'border-green-500 bg-green-50/30' : 'border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-300'} rounded-2xl p-6 xs:p-8 sm:p-10 transition-all flex flex-col items-center justify-center`}>
                        <input
                          type="file"
                          name="attachment"
                          accept=".pdf,.doc,.docx"
                          required
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        <div className="text-center flex flex-col items-center justify-center space-y-4 pointer-events-none relative z-0">
                          <div className={`p-4 rounded-full transition-all duration-300 ${fileName ? 'bg-green-100 text-green-600 scale-110' : 'bg-white shadow-sm text-blue-500 group-hover:scale-110 group-hover:shadow-md'}`}>
                            {fileName ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                          </div>

                          {fileName ? (
                            <div className="space-y-1">
                              <p className="text-base font-semibold text-slate-900">{fileName}</p>
                              <p className="text-xs text-green-600 font-bold tracking-widest uppercase">File Ready to Send</p>
                            </div>
                          ) : (
                            <div className="space-y-1 px-1">
                              <p className="text-sm xs:text-base font-semibold text-slate-700 leading-tight">Click to upload or drag & drop</p>
                              <p className="text-[10px] xs:text-xs text-slate-400 font-mono break-all">PDF, DOC, DOCX up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold tracking-widest shadow-lg shadow-blue-600/20 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden relative"
                      >
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        <span className="relative z-10 text-xs xs:text-sm">{isSubmitting ? 'SECURELY SENDING...' : 'SUBMIT APPLICATION'}</span>
                        {!isSubmitting && <ArrowRight className="w-4 h-4 xs:w-5 xs:h-5 relative z-10 group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
