"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useInView,
    AnimatePresence,
    useSpring,
    useMotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "../../config/icons";
import { useContent } from "../../hooks/useContent";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getVideoThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=225&fit=crop";

// ============================================================================
// 3D TILT CARD COMPONENT
// ============================================================================
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ============================================================================
// GLOWING BORDER CARD
// ============================================================================
const GlowCard = ({ children, className = "", isActive = false }: { children: React.ReactNode; className?: string; isActive?: boolean }) => {
    return (
        <div className={`relative group ${className}`}>
            <motion.div
                animate={{
                    opacity: isActive ? 0.4 : 0,
                    scale: isActive ? 1.05 : 1,
                }}
                className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-2xl blur-xl"
                transition={{ duration: 0.4 }}
            />
            <div className="relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-primary/30 transition-all duration-500">
                {children}
            </div>
        </div>
    );
};

// ============================================================================
// ANIMATED COUNTER
// ============================================================================
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000;
            const increment = value / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {count}{suffix}
        </span>
    );
};

// ============================================================================
// PREMIUM TESTIMONIAL CARD
// ============================================================================
const PremiumTestimonialCard = ({ testimonial, index, onPlayVideo }: { testimonial: any; index: number; onPlayVideo?: (videoId: string, title: string) => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 80, rotateX: 10 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.21, 0.45, 0.27, 0.9] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <TiltCard>
                <GlowCard isActive={isHovered}>
                    <div className="relative p-8 md:p-10 overflow-hidden">
                        <motion.div
                            animate={{
                                background: isHovered
                                    ? "radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0) 70%)"
                                    : "radial-gradient(circle at 100% 100%, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0) 70%)",
                            }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 pointer-events-none"
                        />

                        <motion.div
                            animate={{ rotate: isHovered ? 5 : 0, scale: isHovered ? 1.05 : 1 }}
                            className="absolute top-6 right-6 opacity-10"
                        >
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                                <path d="M10 11h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zM10 21h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zM19 11h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zM19 21h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z" />
                            </svg>
                        </motion.div>

                        <div className="flex gap-1.5 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <motion.svg
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 + i * 0.05, type: "spring" }}
                                    width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary"
                                >
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                                </motion.svg>
                            ))}
                        </div>

                        <motion.p
                            animate={{ y: isHovered ? -2 : 0 }}
                            className="text-foreground/90 text-lg md:text-xl leading-relaxed mb-8 font-light"
                        >
                            "{testimonial.text}"
                        </motion.p>

                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    animate={{ scale: isHovered ? 1.05 : 1 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-md opacity-60" />
                                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center">
                                        <span className="text-primary font-semibold text-xl">
                                            {testimonial.avatar || testimonial.name?.charAt(0) || "✓"}
                                        </span>
                                    </div>
                                </motion.div>

                                <div>
                                    <h4 className="font-semibold text-foreground text-base md:text-lg">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.position}, {testimonial.company}
                                    </p>
                                </div>
                            </div>

                            {testimonial.videoId && onPlayVideo && (
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onPlayVideo(testimonial.videoId, testimonial.name)}
                                    className="relative group/btn"
                                >
                                    <motion.div
                                        animate={{ scale: isHovered ? 1.2 : 1 }}
                                        className="absolute inset-0 bg-primary rounded-full blur-md opacity-0 group-hover/btn:opacity-50 transition-opacity"
                                    />
                                    <div className="relative w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-xl">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    </div>
                                </motion.button>
                            )}
                        </div>

                        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-primary/20" />
                        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-primary/20" />
                    </div>
                </GlowCard>
            </TiltCard>
        </motion.div>
    );
};

// ============================================================================
// CINEMATIC VIDEO CARD
// ============================================================================
const CinematicVideoCard = ({ video, onClick, index }: { video: any; onClick: () => void; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const thumbnailUrl = imageError ? FALLBACK_IMAGE : getVideoThumbnail(video.videoId);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/80">
                <motion.img
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                    src={thumbnailUrl}
                    alt={video.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    loading="lazy"
                />

                <motion.div
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                />

                <motion.div
                    initial={false}
                    animate={{ scale: isHovered ? 1 : 0.9, opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-white rounded-full blur-xl opacity-50"
                        />
                        <div className="relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/50 shadow-2xl">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: isHovered ? -5 : 0 }}
                    className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-md text-white text-xs font-mono"
                >
                    {video.duration}
                </motion.div>
            </div>

            <motion.div animate={{ x: isHovered ? 5 : 0 }} className="mt-3">
                <h4 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {video.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {video.title}
                </p>
            </motion.div>
        </motion.div>
    );
};

// ============================================================================
// FLOATING ORB BACKGROUND
// ============================================================================
const FloatingOrbs = () => {
    const orbs = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: 100 + Math.random() * 300,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 20 + Math.random() * 20,
        delay: Math.random() * 10,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {orbs.map((orb) => (
                <motion.div
                    key={orb.id}
                    className="absolute rounded-full bg-primary/5 blur-3xl"
                    style={{
                        width: orb.size,
                        height: orb.size,
                        left: `${orb.x}%`,
                        top: `${orb.y}%`,
                    }}
                    animate={{
                        x: [0, 50, -30, 20, 0],
                        y: [0, -30, 40, -20, 0],
                        scale: [1, 1.2, 0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        delay: orb.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

// ============================================================================
// VIDEO MODAL
// ============================================================================
const VideoModal = ({ isOpen, onClose, videoId, title }: { isOpen: boolean; onClose: () => void; videoId: string; title: string }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
                onClick={onClose}
            >
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M18 6L6 18M6 6L18 18" />
                    </svg>
                </motion.button>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&color=white`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ============================================================================
// SUCCESS MODAL
// ============================================================================
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 40 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    className="relative bg-gradient-to-br from-card to-card/95 rounded-2xl max-w-md w-full p-10 text-center border border-white/10 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-2xl"
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-medium text-foreground mb-2"
                    >
                        Thank You!
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground text-sm leading-relaxed"
                    >
                        Your testimonial has been submitted successfully.
                        <br />
                        <span className="text-primary font-medium mt-2 block">We appreciate your feedback!</span>
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={onClose}
                        className="mt-8 px-8 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Close
                    </motion.button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ============================================================================
// ERROR MODAL
// ============================================================================
const ErrorModal = ({ isOpen, onClose, message }: { isOpen: boolean; onClose: () => void; message: string }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 40 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    className="relative bg-gradient-to-br from-card to-card/95 rounded-2xl max-w-md w-full p-10 text-center border border-red-500/20 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-red-500/80 flex items-center justify-center shadow-2xl"
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
                        </svg>
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-medium text-foreground mb-2"
                    >
                        Submission Failed
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground text-sm leading-relaxed"
                    >
                        {message}
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={onClose}
                        className="mt-8 px-8 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Try Again
                    </motion.button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ============================================================================
// TESTIMONIAL FORM
// ============================================================================
const TestimonialForm = ({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void; isSubmitting: boolean }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        position: "",
        rating: 5,
        testimonial: "",
        allowPublish: true,
    });
    const [hoveredRating, setHoveredRating] = useState(0);

    const inputs = [
        { icon: "User", name: "name", label: "Full Name", type: "text" },
        { icon: "Mail", name: "email", label: "Email Address", type: "email" },
        { icon: "Building2", name: "company", label: "Company", type: "text" },
        { icon: "Briefcase", name: "position", label: "Position", type: "text" },
    ];

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {inputs.map((input) => (
                    <div key={input.name} className="relative group">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative"
                        >
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Icon name={input.icon} className="w-5 h-5" />
                            </div>
                            <input
                                type={input.type}
                                name={input.name}
                                value={formData[input.name as keyof typeof formData] as string}
                                onChange={(e) => setFormData({ ...formData, [input.name]: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                                placeholder={input.label}
                                required
                            />
                        </motion.div>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground">Your Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                            key={star}
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, rating: star })}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="focus:outline-none"
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill={(hoveredRating >= star || formData.rating >= star) ? "currentColor" : "none"}
                                stroke="currentColor"
                                className={`transition-all duration-200 ${(hoveredRating >= star || formData.rating >= star) ? "text-primary scale-110" : "text-muted-foreground"}`}
                            >
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                            </svg>
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="relative group">
                <div className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Icon name="MessageCircle" className="w-5 h-5" />
                </div>
                <textarea
                    name="testimonial"
                    rows={5}
                    value={formData.testimonial}
                    onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                    placeholder="Share your experience with us..."
                    required
                />
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="allowPublish"
                    checked={formData.allowPublish}
                    onChange={(e) => setFormData({ ...formData, allowPublish: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/30"
                />
                <label htmlFor="allowPublish" className="text-xs text-muted-foreground">
                    I agree to have my testimonial published
                </label>
            </div>

            <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium rounded-xl overflow-hidden disabled:opacity-50 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Submitting...
                        </>
                    ) : (
                        <>
                            Share Your Story
                            <Icon name="Send" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </span>
            </motion.button>
        </form>
    );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
const TestimonialsPage = () => {
    const { testimonials: testimonialsData } = useContent();
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedVideoTitle, setSelectedVideoTitle] = useState<string | null>(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const { section, testimonials, videos, stats } = testimonialsData || {};

    const handlePlayVideo = (videoId: string, title: string) => {
        setSelectedVideo(videoId);
        setSelectedVideoTitle(title);
        setShowVideoModal(true);
    };

    const handleSubmitTestimonial = async (formData: any) => {
        setIsSubmitting(true);

        try {
            // Try direct email submission using mailto as fallback
            const subject = encodeURIComponent(`Eagle Revolution Testimonial - ${formData.name}`);
            const body = encodeURIComponent(`
📋 TESTIMONIAL SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Position: ${formData.position}
Rating: ${formData.rating}/5 stars

📝 TESTIMONIAL:
${formData.testimonial}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Allow Publish: ${formData.allowPublish ? 'Yes' : 'No'}
Submitted: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);

            // Open email client with pre-filled content
            window.location.href = `mailto:banderson@eaglerevolution.com?subject=${subject}&body=${body}`;

            // Show success message since email client opened
            setShowSuccess(true);

            // Reset form
            const form = document.querySelector('form');
            if (form) form.reset();

        } catch (error) {
            console.error('Submission error:', error);
            setErrorMessage("Unable to open email client. Please email us directly at banderson@eaglerevolution.com");
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".fade-up", { y: 60, opacity: 0 }, {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: { trigger: ".fade-up-container", start: "top 80%" },
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <>
            <main className="relative min-h-screen bg-background overflow-hidden">
                <FloatingOrbs />

                {/* Hero Section */}
                <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                    <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[500px] md:h-[700px] bg-primary/20 blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 right-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/10 blur-[100px] rounded-full" />
                    </motion.div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.21, 0.45, 0.27, 0.9] }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8"
                            >
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-medium tracking-wider text-primary uppercase">
                                    {section?.badge || "Testimonials"}
                                </span>
                            </motion.div>

                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
                                What Our
                                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Customers </span>
                                Say
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                                {section?.description || "Real stories from real people who've experienced the Eagle Revolution difference"}
                            </p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center justify-center gap-6 mt-10"
                            >
                                <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full border border-white/10">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                                    </svg>
                                    <span className="text-sm font-medium">{stats?.averageRating || "5.0"} out of 5</span>
                                </div>
                                <div className="w-px h-8 bg-white/20" />
                                <div className="text-sm text-muted-foreground">
                                    Based on <span className="text-primary font-semibold">{stats?.totalReviews || 0}+</span> verified reviews
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { value: stats?.totalReviews || 0, label: "Total Reviews", icon: "MessageSquare", suffix: "+" },
                                { value: stats?.averageRating || 5.0, label: "Average Rating", icon: "Star", suffix: "" },
                                { value: stats?.subscribers || 0, label: "Happy Customers", icon: "Users", suffix: "+" },
                                { value: stats?.totalVideos || 0, label: "Video Stories", icon: "Video", suffix: "+" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group-hover:border-primary/30 transition-all">
                                        <Icon name={stat.icon} className="w-8 h-8 text-primary mx-auto mb-3" />
                                        <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                        </div>
                                        <div className="text-xs text-muted-foreground tracking-wide uppercase">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Grid */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {testimonials?.slice(0, 4).map((testimonial: any, idx: number) => (
                                <PremiumTestimonialCard
                                    key={testimonial.id || idx}
                                    testimonial={testimonial}
                                    index={idx}
                                    onPlayVideo={handlePlayVideo}
                                />
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Video Section */}
                {videos && videos.length > 0 && (
                    <section className="py-20 bg-gradient-to-b from-transparent via-white/5 to-transparent">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-xs font-medium tracking-wider text-primary uppercase">In Their Own Words</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Watch Customer Stories</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Hear directly from our customers about their experience
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                                {videos.map((video: any, idx: number) => (
                                    <CinematicVideoCard
                                        key={video.id || idx}
                                        video={video}
                                        index={idx}
                                        onClick={() => handlePlayVideo(video.videoId, video.title)}
                                    />
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-center mt-10"
                            >
                                <a
                                    href="https://g.page/r/eaglerevolution"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all group"
                                >
                                    <Icon name="Google" className="w-5 h-5" />
                                    Read all {stats?.totalReviews || 0}+ reviews on Google
                                    <Icon name="ArrowRight" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Share Your Story Section */}
                <section className="py-20">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-3xl" />
                            <div className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
                                <div className="text-center mb-8">
                                    <div className="w-12 h-1 bg-primary mx-auto mb-6 rounded-full" />
                                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Share Your Story</h2>
                                    <p className="text-muted-foreground">
                                        Have you worked with us? We'd love to hear about your experience
                                    </p>
                                    <p className="text-xs text-primary/60 mt-2">
                                        Clicking submit will open your email client
                                    </p>
                                </div>

                                <TestimonialForm onSubmit={handleSubmitTestimonial} isSubmitting={isSubmitting} />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 border-t border-white/10 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {testimonials?.slice(0, 5).map((t: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-background flex items-center justify-center text-primary text-xs font-medium"
                                        >
                                            {t.avatar || t.name?.charAt(0) || "✓"}
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">{stats?.subscribers || 0}+</span> satisfied customers
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-muted-foreground">Veteran Owned</span>
                                </div>
                                <div className="w-px h-4 bg-white/20" />
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                                        </svg>
                                    ))}
                                    <span className="font-medium ml-1">5.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>

            <VideoModal
                isOpen={showVideoModal}
                onClose={() => setShowVideoModal(false)}
                videoId={selectedVideo || ""}
                title={selectedVideoTitle || ""}
            />

            <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />

            <ErrorModal
                isOpen={showError}
                onClose={() => setShowError(false)}
                message={errorMessage}
            />
        </>
    );
};

export default TestimonialsPage;
