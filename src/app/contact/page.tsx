"use client";

import { useRef, useEffect, useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useInView,
    AnimatePresence
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "../../config/icons";
import { useContent } from "../../hooks/useContent";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// Liquid Parallax Component
const LiquidParallax = ({ children, speed = 0.1, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, speed * 50]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.6, 0.4]);

    return (
        <motion.div
            ref={ref}
            style={{ y, opacity }}
            className={`absolute inset-0 will-change-transform ${className}`}
        >
            {children}
        </motion.div>
    );
};

// Holographic Input
const HolographicInput = ({ icon: IconName, label, type = "text", ...props }: { icon: string; label: string; type?: string;[key: string]: any }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={isFocused ? {
                    opacity: 0.2,
                    scale: 1.05,
                } : {
                    opacity: isHovered ? 0.1 : 0,
                    scale: 1,
                }}
                className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary rounded-xl blur-lg"
                transition={{ duration: 0.3 }}
            />

            <div className={`
        relative flex items-center bg-card/95 backdrop-blur-sm rounded-xl border transition-all duration-500
        ${isFocused
                    ? 'border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.15)]'
                    : hasValue
                        ? 'border-primary/30'
                        : 'border-border/80 hover:border-border/80'
                }
      `}>
                <div className={`
          absolute left-4 transition-all duration-500
          ${isFocused ? 'text-primary scale-110' : hasValue ? 'text-primary' : 'text-muted-foreground group-hover:text-muted-foreground/80'}
        `}>
                    <Icon name={IconName} className="w-5 h-5" />
                </div>

                <input
                    ref={inputRef}
                    type={type}
                    placeholder={label}
                    onChange={(e) => {
                        setHasValue(!!e.target.value);
                        props.onChange?.(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none"
                    {...props}
                />

                {isFocused && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary rounded-full"
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                )}
            </div>
        </div>
    );
};

// Quantum Textarea
const QuantumTextarea = ({ icon: IconName, label, ...props }: { icon: string; label: string;[key: string]: any }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={isFocused ? {
                    opacity: 0.2,
                    scale: 1.02,
                } : {
                    opacity: isHovered ? 0.1 : 0,
                    scale: 1,
                }}
                className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary rounded-xl blur-lg"
                transition={{ duration: 0.3 }}
            />

            <div className={`
        relative flex bg-card/95 backdrop-blur-sm rounded-xl border transition-all duration-500
        ${isFocused
                    ? 'border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.15)]'
                    : hasValue
                        ? 'border-primary/30'
                        : 'border-border/80 hover:border-border/80'
                }
      `}>
                <div className={`
          absolute left-4 top-4 transition-all duration-500
          ${isFocused ? 'text-primary scale-110' : hasValue ? 'text-primary' : 'text-muted-foreground'}
        `}>
                    <Icon name={IconName} className="w-5 h-5" />
                </div>

                <textarea
                    placeholder={label}
                    rows={6}
                    onChange={(e) => {
                        setHasValue(!!e.target.value);
                        props.onChange?.(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none resize-none"
                    {...props}
                />
            </div>
        </div>
    );
};

// SMS Consent Checkbox Component
const SMSConsentCheckbox = ({ checked, onChange }: { checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const { contactPage: contactData } = useContent();
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <motion.div
            className="relative mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`
                relative flex items-start gap-3 p-4 rounded-xl transition-all duration-500
                ${isFocused ? 'bg-primary/5 border border-primary/30' : 'bg-muted/30 border border-border/50 hover:border-primary/20'}
            `}>
                <div className="relative">
                    <input
                        type="checkbox"
                        id="smsConsent"
                        checked={checked}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="absolute opacity-0 w-5 h-5 cursor-pointer"
                    />
                    <motion.div
                        animate={checked ? {
                            backgroundColor: "hsl(var(--primary))",
                            borderColor: "hsl(var(--primary))"
                        } : {
                            backgroundColor: "transparent",
                            borderColor: "hsl(var(--border))"
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                            w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300
                            ${isHovered && !checked ? 'border-primary/50' : ''}
                        `}
                    >
                        {checked && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                                <Icon name="Check" className="w-3 h-3 text-white" />
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                <label
                    htmlFor="smsConsent"
                    className="flex-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed cursor-pointer"
                >
                    {contactData?.smsConsent?.text || "I agree to receive informational SMS text messages from Eagle Revolution related to my request, including appointment scheduling and service updates, at the number I provided. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. Please see "}
                    <Link href="/privacy" className="text-primary hover:underline transition-colors">{contactData?.smsConsent?.privacyLabel || "Privacy Policy"}</Link>
                    {' '}and{' '}
                    <Link href="/terms" className="text-primary hover:underline transition-colors">{contactData?.smsConsent?.termsLabel || "Terms and Conditions"}</Link>.
                </label>
            </div>

            {isFocused && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary rounded-full"
                />
            )}
        </motion.div>
    );
};

// Success Modal
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { contactPage: contactData } = useContent();
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-secondary/95 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                        }}
                        className="relative bg-card rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-primary/5" />

                        <div className="relative pt-10 sm:pt-12 pb-6 sm:pb-8 px-6 sm:px-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                    delay: 0.2
                                }}
                                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30"
                            >
                                <motion.div
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <Icon name="Check" className="w-8 h-8 text-white" />
                                </motion.div>
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-xl sm:text-2xl font-light text-foreground mb-2 sm:mb-3"
                            >
                                {contactData?.successModal?.title || "Message Sent Successfully!"}
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="text-muted-foreground text-xs sm:text-sm leading-relaxed"
                            >
                                {contactData?.successModal?.description || "Thank you for reaching out to Eagle Revolution."}
                                <br />
                                <span className="font-medium text-primary mt-2 block">
                                    {contactData?.successModal?.responseLabel || "We'll respond within 4-8 hours."}
                                </span>
                            </motion.p>

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                onClick={onClose}
                                className="mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-medium tracking-[0.2em] uppercase rounded-full shadow-lg hover:shadow-xl transition-all duration-500"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {contactData?.successModal?.button || "Close"}
                            </motion.button>
                        </div>

                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-primary/20" />
                        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-primary/20" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Main Contact Page Component
const ContactPage = () => {
    const { contactPage: contactData } = useContent();
    const sectionRef = useRef(null);
    const [isClient, setIsClient] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [smsConsent, setSmsConsent] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate SMS consent
        if (!smsConsent) {
            alert("Please agree to receive SMS communications to continue.");
            return;
        }

        setIsSubmitting(true);

        const emailContent = `
 🦅 EAGLE REVOLUTION CONTACT FORM

 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 📋 CONTACT INFORMATION
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Name: ${formData.name}
 Email: ${formData.email}
 Phone: ${formData.phone}
 Subject: ${formData.subject}
 SMS Consent: Yes

 📝 MESSAGE
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ${formData.message}

 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ⏱️ Submitted: ${new Date().toLocaleString()}
 🇺🇸 Veteran Owned & Operated
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

        try {
            try {
                const response = await fetch('/api/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: 'Contact Form',
                        subject: `🦅 Eagle Revolution Contact - ${formData.subject}`,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        subject_line: formData.subject,
                        message: formData.message,
                        sms_consent: 'Yes'
                    })
                });

                if (response.ok) {
                    setShowSuccess(true);
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: '',
                        message: ''
                    });
                    setSmsConsent(false);
                    setIsSubmitting(false);
                    return;
                }
            } catch (fetchError) {
                console.log('Resend failed, using mailto fallback');
            }

            window.location.href = `mailto:banderson@eaglerevolution.com?subject=${encodeURIComponent(`Contact: ${formData.subject}`)}&body=${encodeURIComponent(emailContent)}`;
            setShowSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setSmsConsent(false);

        } catch (error) {
            console.error('Submission error:', error);
            alert('Please email us directly at banderson@eaglerevolution.com');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!sectionRef.current || !isClient) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.contact-reveal',
                { y: 50, opacity: 0, rotateX: 5 },
                {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [isClient]);

    return (
        <section
            ref={sectionRef}
            className="relative bg-background py-12 sm:py-14 md:py-16 lg:py-20 overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1000px] h-[400px] sm:h-[500px] bg-gradient-to-b from-primary/5 to-transparent opacity-60 blur-3xl" />

            <LiquidParallax speed={0.05} className="z-0">
                <div className="absolute top-20 right-0 w-2/5 h-3/5">
                    <Image
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
                        alt=""
                        fill
                        quality={100}
                        className="object-cover opacity-[0.03]"
                    />
                </div>
            </LiquidParallax>

            <LiquidParallax speed={0.08} className="z-0">
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2">
                    <Image
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt=""
                        fill
                        quality={100}
                        className="object-cover opacity-[0.03]"
                    />
                </div>
            </LiquidParallax>

            <div className="absolute inset-0 pointer-events-none">
                {isClient && [...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-primary/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -40, 0, 40, 0],
                            opacity: [0, 0.2, 0],
                        }}
                        transition={{
                            duration: 8 + Math.random() * 6,
                            repeat: Infinity,
                            delay: Math.random() * 4,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-30">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 md:mb-20 contact-reveal">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="w-8 sm:w-12 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase text-primary/80">
                            {contactData?.header?.badge || "Contact Us"}
                        </span>
                        <div className="w-8 sm:w-12 h-[2px] bg-gradient-to-r from-primary via-primary to-transparent" />
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-4 sm:mb-6 leading-tight">
                        {contactData?.header?.headline?.replace("Conversation", "") || "Let's Start a "}<span className="text-primary font-bold">{contactData?.header?.headline?.includes("Conversation") ? "Conversation" : ""}</span>
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto px-4">
                        {contactData?.header?.description || "Whether you have a question about our services, need a quote, or want to discuss a project, our team is ready to help. Reach out and we'll get back to you within 4-8 hours."}
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {contactData?.infoCards?.map((card: any, index: number) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/80 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                            <div className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 animate-[shimmer_2s_infinite]" />
                                </div>

                                <div className="relative p-7">
                                    <div className="relative mb-5">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:shadow-lg transition-all duration-500">
                                            <Icon name={card.icon} className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    <h3 className="text-lg font-medium mb-2 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/80 transition-all duration-500">
                                        {card.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                        {card.description}
                                    </p>

                                    <div className="space-y-2 pt-3 border-t border-primary/10">
                                        {card.value && (
                                            <div className="flex items-center gap-2 text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                                <span className="text-foreground/80 font-mono text-xs">{card.value}</span>
                                            </div>
                                        )}
                                        {card.subLabel && (
                                            <div className="flex items-center gap-2 text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                                <span className="text-foreground/80 font-mono text-xs">{card.subLabel}</span>
                                            </div>
                                        )}
                                        {card.label && (
                                            <div className="flex items-center gap-2 text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                                <span className="text-foreground/80 font-mono text-xs">{card.label}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute top-3 right-3">
                                        <svg className="w-4 h-4 text-primary/50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>

                                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary/20" />
                                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary/20" />

                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <style jsx>{`
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  .animate-\\[shimmer_2s_infinite\\] {
    animation: shimmer 2s infinite;
  }
`}</style>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative max-w-4xl mx-auto"
                >
                    <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-primary/10 shadow-2xl overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <motion.rect
                                x="2"
                                y="2"
                                width="calc(100% - 4px)"
                                height="calc(100% - 4px)"
                                fill="none"
                                stroke="url(#formGradient)"
                                strokeWidth="1.2"
                                strokeDasharray="8 8"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.6 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                            <defs>
                                <linearGradient id="formGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="hsl(var(--primary)/0.8)" stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="relative p-5 sm:p-8 md:p-10 lg:p-12">
                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <HolographicInput
                                        icon="User"
                                        label={contactData?.form?.labels?.name || "Full name"}
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <HolographicInput
                                        icon="Mail"
                                        type="email"
                                        label={contactData?.form?.labels?.email || "Email address"}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <HolographicInput
                                        icon="Phone"
                                        type="tel"
                                        label={contactData?.form?.labels?.phone || "Phone number"}
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <HolographicInput
                                        icon="FileText"
                                        label={contactData?.form?.labels?.subject || "Subject"}
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* SMS Consent Checkbox */}
                                <SMSConsentCheckbox
                                    checked={smsConsent}
                                    onChange={(e) => setSmsConsent(e.target.checked)}
                                />

                                <QuantumTextarea
                                    icon="MessageCircle"
                                    label={contactData?.form?.labels?.message || "How can we help you?"}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                />

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ y: -3, scale: 1.1 }}
                                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border-2 border-card flex items-center justify-center text-primary text-[8px] sm:text-xs font-medium shadow-lg"
                                                >
                                                    {String.fromCharCode(64 + i)}
                                                </motion.div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                                            <span className="font-semibold text-foreground">24/7</span> support available
                                        </span>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="relative px-6 sm:px-10 py-2.5 sm:py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs sm:text-sm font-medium rounded-full shadow-2xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    >
                                        <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                                                    />
                                                    <span className="hidden xs:inline">{contactData?.form?.labels?.submitting || "Sending..."}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="hidden xs:inline">{contactData?.form?.labels?.submit || "Send Message"}</span>
                                                    <span className="xs:hidden">Send</span>
                                                    <Icon name="Send" className="w-4 h-4" />
                                                </>
                                            )}
                                        </span>
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.4 }}
                                        />
                                    </motion.button>
                                </div>
                            </form>

                            <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-primary/10">
                                <div className="text-[10px] sm:text-xs font-mono text-primary flex items-center gap-1 sm:gap-2">
                                    <span className="animate-pulse">●</span>
                                    <span>{contactData?.form?.footer?.veteran || "Veteran owned & operated"}</span>
                                </div>
                                <div className="hidden xs:block w-px h-4 sm:h-6 bg-border" />
                                <div className="text-[10px] sm:text-xs text-muted-foreground">
                                    {contactData?.form?.footer?.confidential || <><span className="font-semibold text-foreground">100%</span> confidential</>}
                                </div>
                                <div className="hidden xs:block w-px h-4 sm:h-6 bg-border" />
                                <div className="text-[10px] sm:text-xs text-muted-foreground">
                                    {contactData?.form?.footer?.response || <>Response within <span className="text-primary font-semibold">4-8 hours</span></>}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Wave Decoration */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
                <svg
                    viewBox="0 0 1440 100"
                    className="relative block w-full h-16 sm:h-20 md:h-24"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="url(#contactWave)"
                        d="M0,48L60,52.3C120,57,240,65,360,65.3C480,66,600,58,720,52C840,46,960,42,1080,46C1200,50,1320,58,1380,62L1440,66L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
                    />
                    <defs>
                        <linearGradient id="contactWave" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
        </section>
    );
};

export default ContactPage;