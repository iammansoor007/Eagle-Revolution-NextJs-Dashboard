"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Icon } from "../../config/icons";
import { useContent } from "../../hooks/useContent";
import Image from "next/image";
import Link from "next/link";

// ============================================================================
// CONSTANTS
// ============================================================================
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=450&fit=crop&q=80";
const GOOGLE_MAPS_REVIEW_URL = "https://maps.app.goo.gl/PbvRBs4tJsDAJVMy6";

const getVideoThumbnail = (videoId: string) =>
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

// ============================================================================
// SMOOTH COUNTER
// ============================================================================
const Counter = ({ value, suffix = "", start = false, isDecimal = false }: { value: number; suffix?: string; start?: boolean; isDecimal?: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;

        let startTime = 0;
        const duration = 1500;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 4);

            if (isDecimal) {
                setCount(Number((easedProgress * value).toFixed(1)));
            } else {
                setCount(Math.floor(easedProgress * value));
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);

        return () => { };
    }, [start, value, isDecimal]);

    return <span>{isDecimal ? count.toFixed(1) : count}{suffix}</span>;
};

// ============================================================================
// TESTIMONIAL CARD
// ============================================================================
const TestimonialCard = ({
    testimonial,
    index,
    onPlay
}: {
    testimonial: any;
    index: number;
    onPlay?: (id: string, title: string) => void;
}) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white dark:bg-card rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl border border-gray-100 dark:border-white/5 transition-all duration-300"
        >
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-5xl text-primary/10 font-serif">"</div>

            {/* Stars */}
            <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                    </svg>
                ))}
            </div>

            {/* Content */}
            <p className="text-gray-700 dark:text-foreground/80 text-sm sm:text-base leading-relaxed mb-6 line-clamp-5">
                "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-white/5">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-foreground text-sm sm:text-base">
                        {testimonial.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground">
                        {testimonial.position}, {testimonial.company}
                    </p>
                </div>

                {testimonial.videoId && onPlay && (
                    <button
                        onClick={() => onPlay(testimonial.videoId, testimonial.name)}
                        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center transition-all group/btn"
                        aria-label="Play video testimonial"
                    >
                        <svg className="w-4 h-4 text-primary group-hover/btn:text-white transition-colors ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// ============================================================================
// VIDEO CARD
// ============================================================================
const VideoCard = ({ video, index, onClick }: { video: any; index: number; onClick: () => void }) => {
    const [error, setError] = useState(false);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="cursor-pointer group"
            onClick={onClick}
        >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-muted/20 shadow-md">
                <Image
                    src={error ? FALLBACK_IMAGE : getVideoThumbnail(video.videoId)}
                    alt={video.title}
                    fill
                    quality={100}
                    onError={() => setError(true)}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={!error}
                />

                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary shadow-lg flex items-center justify-center group-hover:scale-110 transition-all">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    </div>
                </div>

                <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-white text-xs font-medium">
                    {video.duration}
                </span>
            </div>

            <h4 className="mt-3 text-sm font-medium text-gray-900 dark:text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {video.title}
            </h4>
        </motion.div>
    );
};

// ============================================================================
// STAT CARD
// ============================================================================
const StatCard = ({ value, label, suffix = "", index, isDecimal = false }: { value: number; label: string; suffix?: string; index: number; isDecimal?: boolean }) => {
    const cardRef = useRef(null);
    const inView = useInView(cardRef, { once: true, margin: "50px" });

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="text-center"
        >
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-1">
                <Counter value={value} suffix={suffix} start={inView} isDecimal={isDecimal} />
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-muted-foreground font-medium uppercase tracking-wider">
                {label}
            </div>
        </motion.div>
    );
};

// ============================================================================
// GOOGLE REVIEW BADGE
// ============================================================================
const GoogleReviewBadge = () => {
    return (
        <a
            href={GOOGLE_MAPS_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-white/10 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
        >
            <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <div>
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-900 dark:text-foreground text-lg">4.9</span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-muted-foreground">71 verified Google reviews</p>
                </div>
            </div>
        </a>
    );
};

// ============================================================================
// VIDEO MODAL
// ============================================================================
const VideoModal = ({ isOpen, onClose, videoId, title }: { isOpen: boolean; onClose: () => void; videoId: string; title: string }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
                    onClick={onClose}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        aria-label="Close video"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============================================================================
// SUCCESS MODAL
// ============================================================================
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white dark:bg-card w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                        <p className="text-gray-600 dark:text-muted-foreground mb-6">
                            Your testimonial has been submitted successfully.
                        </p>

                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============================================================================
// FORM MODAL
// ============================================================================
const FormModal = ({ isOpen, onClose, onSubmit, isSubmitting }: any) => {
    const [form, setForm] = useState({
        name: "", email: "", company: "", position: "", rating: 5, testimonial: ""
    });
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white dark:bg-card w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl my-8"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                        aria-label="Close form"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <h2 className="text-xl sm:text-2xl font-bold mb-6 pr-6">Share Your Experience</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Name *"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="px-4 py-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email *"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="px-4 py-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Company"
                                value={form.company}
                                onChange={e => setForm({ ...form, company: e.target.value })}
                                className="px-4 py-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Position"
                                value={form.position}
                                onChange={e => setForm({ ...form, position: e.target.value })}
                                className="px-4 py-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 dark:text-muted-foreground mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setForm({ ...form, rating: star })}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none"
                                    >
                                        <svg
                                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-all ${(hoverRating >= star || form.rating >= star) ? "text-yellow-500 scale-110" : "text-gray-300 dark:text-gray-600"}`}
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            placeholder="Your testimonial... *"
                            rows={4}
                            value={form.testimonial}
                            onChange={e => setForm({ ...form, testimonial: e.target.value })}
                            className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            required
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Testimonial"}
                        </button>

                        <p className="text-xs text-gray-500 dark:text-muted-foreground text-center">
                            Submitting will open your email client
                        </p>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ============================================================================
// MAIN PAGE - WITH GOOGLE REVIEWS INTEGRATED
// ============================================================================
export default function TestimonialsPage() {
    const { testimonials: data } = useContent();
    const containerRef = useRef(null);

    const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { section, testimonials = [], videos = [], stats = {} } = data || {};

    // Updated with actual Google Maps data: 4.9 rating, 71 reviews
    const googleStats = {
        rating: 4.9,
        totalReviews: 71,
        customers: 1200,
        videos: 25,
    };

    const handleSubmit = async (formData: any) => {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'Testimonial Submission',
                    subject: `Testimonial - ${formData.name}`,
                    name: formData.name,
                    email: formData.email,
                    company: formData.company,
                    position: formData.position,
                    rating: formData.rating,
                    message: formData.testimonial
                })
            });

            if (response.ok) {
                setShowForm(false);
                setShowSuccess(true);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            // Fallback to mailto if Resend fails
            const subject = encodeURIComponent(`Testimonial - ${formData.name}`);
            const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Position: ${formData.position}
Rating: ${formData.rating}/5

${formData.testimonial}
            `);
            window.location.href = `mailto:banderson@eaglerevolution.com?subject=${subject}&body=${body}`;
            setShowForm(false);
            setShowSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main ref={containerRef} className="relative min-h-screen bg-gray-50 dark:bg-background">
            {/* Hero Section */}
            <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

                <div className="relative max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Google Review Badge */}
                        <div className="flex justify-center mb-6">
                            <GoogleReviewBadge />
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                            <span className="text-gray-900 dark:text-foreground">What Our</span>
                            <br className="sm:hidden" />
                            <span className="sm:inline"> </span>
                            <span className="text-primary"> Customers Say</span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-gray-600 dark:text-muted-foreground max-w-md sm:max-w-xl mx-auto mb-8">
                            Real stories from homeowners who trusted us with their most valuable investment
                        </p>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-gray-600 dark:text-muted-foreground">
                                    <span className="font-bold text-gray-900 dark:text-foreground">4.9</span> • {googleStats.totalReviews} verified reviews
                                </span>
                            </div>
                            <div className="w-px h-5 bg-gray-300 dark:bg-white/20" />
                            <div className="text-sm font-medium text-gray-600 dark:text-muted-foreground">
                                <span className="font-bold text-gray-900 dark:text-foreground">1200+</span> happy customers
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <a
                                href={GOOGLE_MAPS_REVIEW_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full text-base font-semibold hover:text-white flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                                </svg>
                                Leave a Google Review
                            </a>
                            <button
                                onClick={() => setShowForm(true)}
                                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-card text-gray-900 dark:text-foreground rounded-full text-base font-semibold border border-gray-200 dark:border-white/10 hover:border-primary transition-all shadow-sm hover:shadow-md"
                            >
                                Share Your Story
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-8 sm:py-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { value: googleStats.totalReviews, label: "Google Reviews", suffix: "+" },
                            { value: googleStats.rating, label: "Average Rating", suffix: "", isDecimal: true },
                            { value: googleStats.customers, label: "Projects Completed", suffix: "+" },
                            { value: googleStats.videos, label: "Video Stories", suffix: "+" },
                        ].map((stat, i) => (
                            <StatCard key={i} {...stat} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Testimonials Grid */}
            <section className="py-12 sm:py-16 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
                            Featured <span className="text-primary">Testimonials</span>
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">
                            See what our customers have to say about their experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.slice(0, 4).map((item: any, i: number) => (
                            <TestimonialCard
                                key={i}
                                testimonial={item}
                                index={i}
                                onPlay={(id, title) => setSelectedVideo({ id, title })}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Testimonials Section */}
            {videos.length > 0 && (
                <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white dark:bg-card/20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-10 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
                                Watch <span className="text-primary">Customer Stories</span>
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">
                                Hear directly from our satisfied customers
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                            {videos.map((item: any, i: number) => (
                                <VideoCard
                                    key={i}
                                    video={item}
                                    index={i}
                                    onClick={() => setSelectedVideo({ id: item.videoId, title: item.title })}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bottom CTA Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 sm:p-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-foreground mb-3">
                            Loved by 71+ Homeowners on Google
                        </h2>
                        <p className="text-gray-600 dark:text-muted-foreground mb-6 max-w-md mx-auto">
                            Join our growing community of satisfied customers. See what everyone's talking about!
                        </p>
                        <a
                            href={GOOGLE_MAPS_REVIEW_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full text-base font-semibold hover:text-white transition-all shadow-lg    "
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            View All 71 Reviews on Google
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-gray-200 dark:border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <a
                        href={GOOGLE_MAPS_REVIEW_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 dark:text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        </svg>
                        Read all 71 reviews on Google Maps
                    </a>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-muted-foreground">
                        <span>🇺🇸 Veteran Owned</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                        <span>4.9 ★ Rating</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                        <span>71+ Reviews</span>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                videoId={selectedVideo?.id || ""}
                title={selectedVideo?.title || ""}
            />

            <FormModal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
            />
        </main>
    );
}