'use client';

import React, { use, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useTransform
} from 'framer-motion';
import {
  Home, Layout, TreePine, Building2, Building, Droplets,
  CheckCircle, ArrowRight, Phone, Clock, Shield, Award,
  ChevronRight, Star, ThumbsUp, Truck,
  ChevronDown, ArrowUpRight, Users, Trophy,
  FileText, ClipboardCheck, Hammer, Minus, Plus, Sparkles, Zap, Palette, Sun, Snowflake
} from 'lucide-react';
import { notFound } from 'next/navigation';

import breakcrumb from '../../../assets/Breadcrumb-Image.jpeg';
import servicesData from '../../../data/servicesData.json';


import roofingImg from '../../../assets/roof1.jpg.jpeg';
import windowsImg from '../../../assets/window5.jpeg';
import decksImg from '../../../assets/outdoor-sitting-desk.png';
import commercialImg from '../../../assets/commercial-tpo.png';
import sidingImg from '../../../assets/siding5.jpg.jpeg';
import gutter from '../../../assets/gutterinstallation.jpg.jpeg';
import pvcdecks from '../../../assets/pvcdecks.jpg.jpeg';

const iconMap = {
  Home, Layout, TreePine, Building2, Building, Droplets,
  Shield, Trophy, Users, ThumbsUp, FileText, ClipboardCheck,
  Truck, Hammer, CheckCircle, Award, Clock, Sparkles, Zap, Palette, Sun, Snowflake
};

const imageMap = {
  'Residential Roofing': roofingImg,
  'Windows & Doors': windowsImg,
  'Custom Decks': decksImg,
  'Commercial Roofing': commercialImg,
  'Siding, Soffit & Fascia': sidingImg,
  'Gutters & Protection': gutter,
  'PVC Decking': pvcdecks

};

// --- Counter Component ---
const Counter = ({ value, suffix = "", duration = 2, start = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (start) {
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easedProgress * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [start, value, duration]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// --- StatCard Component ---
const StatCard = ({ stat, index }) => {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "50px" });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="relative group lg:px-2"
    >
      <div className="relative h-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-8 overflow-hidden transition-all duration-500 group-hover:bg-white/[0.06] group-hover:border-primary/30 group-hover:shadow-[0_20px_50px_rgba(36,48,210,0.15)]">
        <div className="absolute -inset-24 bg-primary/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="icon-container w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:!bg-primary group-hover:!border-primary transition-all duration-300">
              <stat.icon className="icon w-5 h-5 sm:w-6 sm:h-6 !text-primary group-hover:!text-white transition-all duration-300" />
            </div>
            <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 group-hover:text-primary transition-colors">
              Impact
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="text-2xl xs:text-4xl sm:text-5xl font-black text-foreground tracking-tight">
              <Counter
                value={parseInt(stat.value.replace(/[^0-9]/g, ''))}
                suffix={stat.value.includes('%') ? '%' : (stat.value.includes('+') ? '+' : '')}
                start={inView}
              />
            </h3>
            <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {stat.label}
            </p>
          </div>

          <div className="mt-4 sm:mt-8 flex items-center gap-2 sm:gap-4">
            <div className="h-[1.5px] sm:h-[2px] w-6 sm:w-8 bg-primary/20 group-hover:w-full group-hover:bg-primary transition-all duration-500 rounded-full" />
            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .icon-container:hover {
          background-color: hsl(var(--primary)) !important;
          border-color: hsl(var(--primary)) !important;
        }
        .icon-container:hover .icon {
          color: white !important;
        }
      `}</style>
    </motion.div>
  );
};

// --- Process Card Component ---
const ProcessCard = ({ step, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 15 });
  const springY = useSpring(y, { stiffness: 120, damping: 15 });
  const rotateX = useTransform(springY, [-0.3, 0.3], [3, -3]);
  const rotateY = useTransform(springX, [-0.3, 0.3], [-3, 3]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / rect.width - 0.5) * 0.3;
    const yPct = (mouseY / rect.height - 0.5) * 0.3;
    x.set(xPct);
    y.set(yPct);
    setMousePosition({ x: mouseX, y: mouseY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1500,
      }}
      className="relative group h-full"
    >
      <div className="relative h-full bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border/50 overflow-hidden">

        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary)/0.08), transparent 50%)`,
          }}
        />

        <motion.div
          className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{
            x: isHovered ? '100%' : '-100%',
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ x: '100%', opacity: 0 }}
          animate={{
            x: isHovered ? '-100%' : '100%',
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.1 }}
        />

        <motion.div
          className="absolute top-3 left-3 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-primary/20"
          animate={{
            width: isHovered ? 16 : 24,
            height: isHovered ? 16 : 24,
            borderColor: isHovered ? 'hsl(var(--primary)/0.6)' : 'hsl(var(--primary)/0.2)'
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-primary/20"
          animate={{
            width: isHovered ? 16 : 24,
            height: isHovered ? 16 : 24,
            borderColor: isHovered ? 'hsl(var(--primary)/0.6)' : 'hsl(var(--primary)/0.2)'
          }}
          transition={{ duration: 0.3 }}
        />

        {isHovered && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/40"
                initial={{
                  x: mousePosition.x,
                  y: mousePosition.y,
                  scale: 0,
                  opacity: 0.5
                }}
                animate={{
                  x: mousePosition.x + (Math.random() - 0.5) * 120,
                  y: mousePosition.y + (Math.random() - 0.5) * 120,
                  scale: [0, 1.2, 0],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.12,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}

        <div className="relative p-4 sm:p-8 lg:p-10 flex flex-col h-full z-10">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-6 sm:mb-8">
            <motion.div
              className="absolute inset-0 rounded-xl sm:rounded-2xl border border-primary/20"
              animate={{
                rotate: isHovered ? 180 : 0,
                borderColor: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.2)'
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-1 sm:inset-1.5 rounded-lg sm:rounded-xl border border-primary/10"
              animate={{
                rotate: isHovered ? -90 : 0
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isHovered ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="text-primary"
              >
                <step.icon className="w-5 h-5 sm:w-7 sm:h-7" />
              </motion.div>
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/50">
              Phase {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2 xs:mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
            {step.title}
          </h3>

          <p className="text-muted-foreground text-xs sm:text-base leading-relaxed flex-1">
            {step.description}
          </p>

          <div className="hidden md:block absolute bottom-3 right-4 sm:bottom-4 sm:right-6 text-6xl sm:text-8xl font-black text-primary/40 select-none">
            {String(index + 1).padStart(2, '0')}
          </div>

          <motion.div
            className="mt-5 sm:mt-6 h-[2px] bg-gradient-to-r from-primary to-primary/40 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '40px' : 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// --- FAQ Item Component ---
const FAQItem = ({ faq, index, isOpen, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 12 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 12 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative group"
    >
      <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden rounded-xl sm:rounded-2xl">
        <svg className="w-full h-full">
          <motion.rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#liquidGradient)"
            opacity={isHovered ? 0.08 : 0.02}
            style={{
              x: useTransform(springX, [0, 100], [-4, 4]),
              y: useTransform(springY, [0, 100], [-4, 4]),
            }}
          />
          <defs>
            <radialGradient id="liquidGradient">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(50);
          mouseY.set(50);
        }}
        className={`relative bg-card/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border transition-all duration-300 ${isOpen
          ? 'border-primary/40 shadow-2xl shadow-primary/10'
          : 'border-primary/10 hover:border-primary/25 shadow-lg'
          }`}
      >
        <button
          onClick={() => onToggle(index)}
          aria-expanded={isOpen}
          className="w-full text-left p-4 sm:p-6 md:p-8 focus:outline-none relative z-10"
        >
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            <h3 className={`text-sm sm:text-lg lg:text-xl font-semibold transition-all duration-300 leading-tight ${isOpen ? 'text-primary' : 'text-foreground group-hover:text-foreground/90'
              }`}>
              {faq.question}
            </h3>

            <div className="relative flex-shrink-0">
              <motion.div
                animate={isOpen ? { rotate: 180, scale: 1.05 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                  : isHovered
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-background text-muted-foreground'
                  }`}
              >
                {isOpen ? (
                  <Minus className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                ) : (
                  <Plus className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                )}
              </motion.div>
            </div>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-6 md:px-8 pb-5 sm:pb-8">
                <div className="relative pl-4 sm:pl-6 border-l-2 border-primary/30">
                  <p className="text-muted-foreground text-xs xs:text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden sm:block">
          <motion.div
            className="absolute top-2 left-2 sm:top-4 sm:left-4 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2"
            animate={isHovered ? { width: 8, height: 8, borderColor: 'hsl(var(--primary)/0.4)' } : { width: 12, height: 12, borderColor: 'hsl(var(--primary)/0.15)' }}
          />
          <motion.div
            className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2"
            animate={isHovered ? { width: 8, height: 8, borderColor: 'hsl(var(--primary)/0.4)' } : { width: 12, height: 12, borderColor: 'hsl(var(--primary)/0.15)' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// --- Award CTA Banner Component ---
const AwardCTABanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative mt-4 overflow-hidden"
    >
      <div className="relative bg-card border border-border rounded-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rotate-12"
            animate={{ rotate: [12, 15, 12] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 -rotate-12"
            animate={{ rotate: [-12, -15, -12] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/30" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/30" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30" />

        <div className="relative px-5 sm:px-8 py-10 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 z-30">
          <div className="max-w-2xl text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="flex justify-center lg:justify-start w-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 mb-4 mt-4"
              >
                <span className="w-8 h-[2px] bg-primary" />
                <span className="text-base sm:text-lg font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-primary">
                  Why Choose Us
                </span>
              </motion.div>
            </div>

            <h3 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
              America's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">#1 Rated</span><br />
              Home Improvement Team
            </h3>

            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mb-6">
              Join thousands of satisfied homeowners who trusted us with their most valuable investment.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-4">
              {["A+ BBB Rating", "24/7 Support", "Free Estimates"].map((badge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">{badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="relative flex-1 sm:flex-initial">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="h-full px-8 py-4 bg-primary text-white font-bold rounded-full shadow-sm hover:text-white overflow-hidden flex items-center justify-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                  Get Free Quote
                  <ArrowRight className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            </Link>

            <motion.a
              href="tel:636-449-9714"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-8 py-4 bg-white text-primary border-2 border-primary font-bold rounded-full shadow-sm hover:bg-primary hover:text-white hover:shadow-md transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 mb-4"
            >
              <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                Call Now: 636-449-9714
                <Phone className="w-4 h-4" />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Material Comparison Card (For Deck Pages) ---
const MaterialComparisonCard = ({ type, features, isRecommended }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isRecommended
        ? 'border-primary shadow-xl shadow-primary/20'
        : 'border-border hover:border-primary/30'
        }`}
    >
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
          RECOMMENDED
        </div>
      )}
      <div className="p-6 sm:p-8 bg-card">
        <h4 className="text-2xl font-bold text-foreground mb-4">{type}</h4>
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
export default function ServiceDetailPage({ params }) {
  const { slug } = use(params);
  const [openFaq, setOpenFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const allServices = servicesData.services.map(service => ({
    ...service,
    image: imageMap[service.title] || roofingImg
  }));

  const service = allServices.find(s => s.slug === slug);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!service) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || Home;

  const faqs = service.faq || [];

  const benefits = (service.benefits || []).map(b => ({
    ...b,
    icon: iconMap[b.icon] || Shield
  }));

  const processSteps = (service.process || []).map(p => ({
    ...p,
    icon: iconMap[p.icon] || Shield
  }));

  const statsData = (service.stats || []).map(s => ({
    ...s,
    icon: iconMap[s.icon] || Shield
  }));

  // Check if current page is a deck-related page
  const isDeckPage = service.slug === 'custom-decks' || service.slug === 'pvc-decking';

  // JSON-LD: FAQPage + Service structured data for rich snippets
  const faqJsonLd = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: "Eagle Revolution",
      telephone: "+1-636-449-9714",
      address: {
        "@type": "PostalAddress",
        addressLocality: "St. Louis",
        addressRegion: "MO",
        addressCountry: "US",
      },
    },
    areaServed: {
      "@type": "City",
      name: "St. Louis",
    },
    url: `https://www.eaglerevolution.com/services/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.eaglerevolution.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://www.eaglerevolution.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `https://www.eaglerevolution.com/services/${slug}`,
      },
    ],
  };

  return (
    <main className="bg-background text-foreground font-body overflow-x-hidden">
      {/* JSON-LD Structured Data for this service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] w-full">
        <Image
          src={breakcrumb}
          alt={service.title}
          fill
          quality={100}
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-1 sm:gap-2 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-6">
                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
                <Link href="/services" className="text-white/70 hover:text-white transition-colors">
                  Services
                </Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
                <span className="text-white truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">{service.title}</span>
              </div>

              <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-heading font-bold text-white mb-3 sm:mb-6 leading-tight">
                {service.title}
              </h1>

              <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-primary mb-4 sm:mb-6" />

              <p className="text-white/80 text-sm xs:text-base sm:text-xl max-w-2xl">
                Professional {service.title.toLowerCase()} services with military precision and architectural excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Overlap and Luxury Design */}
      <section className="relative py-6 sm:py-8 px-4 sm:px-8 w-full z-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative bg-background/80 backdrop-blur-2xl border border-border/50 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-12 lg:p-16 shadow-2xl overflow-hidden shadow-primary/5">
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-br from-primary/5 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-primary/5 to-transparent blur-3xl pointer-events-none" />

            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
              backgroundImage: `radial-gradient(hsl(var(--primary)) 0.5px, transparent 0.5px)`,
              backgroundSize: '24px 24px'
            }} />

            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {statsData.map((stat, idx) => (
                <StatCard key={idx} stat={stat} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-6 xs:py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <div className="flex justify-center lg:justify-start w-full mb-2">
                <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary/10">
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-[10px] xs:text-xs font-bold uppercase tracking-wider">{service.tag}</span>
                </div>
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-3 sm:mb-6 leading-tight">
                Craftsmanship <br />
                Without <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">Compromise.</span>
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {service.overview} We bring military-grade discipline and architectural beauty to every project.
                Our mission is your property's long-term protection and value enhancement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 w-full lg:max-w-none mx-auto lg:mx-0">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground text-sm sm:text-base font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <motion.div
                className="mb-10 w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex flex-row flex-wrap sm:flex-nowrap items-center justify-center lg:justify-start gap-4 w-full">
                  <Link href="/contact" className="flex-1 sm:flex-initial">
                    <motion.div
                      className="group relative overflow-hidden h-full px-7 py-3.5 rounded-2xl inline-flex items-center justify-center gap-2 text-base font-semibold tracking-wide bg-primary text-white border border-primary/30 transition-all duration-300 active:scale-[0.98] hover:text-white"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">Start Your Project</span>
                      <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  quality={100}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-white/5 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/20 shadow-2xl">
                  <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white text-xs sm:text-base font-medium italic leading-relaxed">
                    "Setting a new standard for home restoration. Truly exceptional work with attention to every detail."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section - The Eagle Edge */}
      <section className="py-6 xs:py-8 sm:py-10 md:py-12 bg-muted/30 border-y border-border">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 sm:w-12 h-px bg-primary/30" />
              <span className="text-[8px] xs:text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-primary">
                The Eagle Edge
              </span>
              <div className="w-8 sm:w-12 h-px bg-primary/30" />
            </div>

            <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-3 sm:mb-4">
              Engineered To <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">Outlast</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Experience the difference with our unwavering commitment to military-grade excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative bg-card rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-border hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300">
                    <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-base sm:text-xl font-heading font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>

                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {benefit.description}
                  </p>

                  <div className="mt-4 sm:mt-6 w-6 sm:w-8 h-px bg-primary/30 group-hover:w-12 sm:group-hover:w-16 group-hover:bg-primary transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PREMIUM DECK SHOWCASE - Conditional Section */}
      {/* Only shows for custom-decks and pvc-decking */}
      {/* ============================================ */}
      {/* ============================================ */}
      {/* PREMIUM DECK SHOWCASE - Enhanced Version */}
      {/* ============================================ */}
      {isDeckPage && (
        <section className="relative py-8 xs:py-10 sm:py-12 md:py-16 bg-background border-b border-border overflow-hidden">

          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]"
              animate={{
                x: [0, 40, -20, 0],
                y: [0, -30, 20, 0],
                scale: [1, 1.2, 0.9, 1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-[120px]"
              animate={{
                x: [0, -30, 40, 0],
                y: [0, 20, -30, 0],
                scale: [1, 0.9, 1.1, 1],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(hsl(var(--primary))_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

            {/* Enhanced Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-4xl mx-auto mb-16 sm:mb-20"
            >
              {/* Premium Badge with Animation */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 text-primary px-5 py-2.5 rounded-full border border-primary/30 mb-8 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Premium Material Showcase</span>
                <Sparkles className="w-4 h-4" />
              </motion.div>

              <h2 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6 leading-[1.1]">
                {service.slug === 'pvc-decking'
                  ? 'PVC vs Composite:'
                  : 'Composite & PVC:'}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-primary">
                  Built Different
                </span>
              </h2>

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-primary/50" />
                <Star className="w-4 h-4 text-primary fill-primary" />
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-primary/50" />
              </div>

              <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                {service.slug === 'pvc-decking'
                  ? 'Pure polymer engineering delivers unmatched moisture resistance and lighter, cooler surfaces that composite simply cannot match.'
                  : 'Two premium paths to your dream outdoor space. Discover why our deck installations are the gold standard.'}
              </p>
            </motion.div>

            {/* Hero Feature Image - Full Width */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 mb-16 group"
            >
              <Image
                src={decksImg}
                alt="Premium deck showcase"
                fill
                quality={100}
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="max-w-2xl"
                >
                  <span className="inline-block bg-primary text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
                    Award-Winning Craftsmanship
                  </span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                    Transform Your Outdoor Living
                  </h3>
                  <p className="text-white/80 text-lg mb-6">
                    Every deck we build is a masterpiece of engineering and design, backed by industry-leading warranties.
                  </p>
                </motion.div>
              </div>

              {/* Decorative Corner Accents */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-2xl" />
              <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-white/20 rounded-br-2xl" />
            </motion.div>

            {/* Material Comparison - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-20"
            >
              <div className="text-center mb-12">
                <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Compare & Choose</span>
                <h3 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mt-3 mb-4">
                  Find Your Perfect Material
                </h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Side-by-side comparison of our premium decking solutions
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                {/* Composite Card - Enhanced */}
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-500 ${service.slug === 'custom-decks'
                    ? 'border-primary shadow-2xl shadow-primary/20 bg-gradient-to-b from-primary/5 to-transparent'
                    : 'border-border hover:border-primary/30 bg-card'
                    }`}
                >


                  <div className="p-8 sm:p-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <TreePine className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-foreground">Capped Composite</h4>
                        <p className="text-sm text-muted-foreground">Wood fiber + polymer blend</p>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {[
                        { feature: "Natural wood look and feel", highlight: true },
                        { feature: "25+ year fade and stain warranty" },
                        { feature: "Realistic wood grain patterns" },
                        { feature: "Lower cost than premium PVC" },
                        { feature: "Excellent for full sun exposure" },
                        { feature: "Scratch and stain resistant capstock" }
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.highlight ? 'bg-primary/20' : 'bg-primary/10'
                            }`}>
                            <CheckCircle className={`w-3.5 h-3.5 ${item.highlight ? 'text-primary' : 'text-primary/70'}`} />
                          </div>
                          <span className={`${item.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                            {item.feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-6 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Starting at</span>
                        <span className="text-2xl font-bold text-foreground">Competitive Pricing</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* PVC Card - Enhanced */}
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-500 ${service.slug === 'custom-decks'
                    ? 'border-primary shadow-2xl shadow-primary/20 bg-gradient-to-b from-primary/5 to-transparent'
                    : 'border-border hover:border-primary/30 bg-card'
                    }`}
                >
                  {service.slug === 'pvc-decking' && (
                    <div className="absolute top-0 right-0 z-20">
                      <div className="bg-primary text-white text-xs font-bold px-6 py-2 rounded-bl-2xl shadow-lg">
                        ⭐ RECOMMENDED
                      </div>
                    </div>
                  )}
                  {service.slug === 'custom-decks' && (
                    <div className="absolute top-0 right-0 z-20">
                      <div className="bg-primary text-white text-xs font-bold px-6 py-2 rounded-bl-2xl shadow-lg">
                        ⭐ RECOMMENDED
                      </div>
                    </div>
                  )}

                  <div className="p-8 sm:p-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Droplets className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-foreground">Cellular PVC</h4>
                        <p className="text-sm text-muted-foreground">100% pure polymer</p>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {[
                        { feature: "Zero organic material - never rots", highlight: true },
                        { feature: "Lifetime rot and insect warranty", highlight: true },
                        { feature: "Lighter, cooler surface in direct sun" },
                        { feature: "Ideal for pools and shaded areas" },
                        { feature: "Superior moisture resistance" },
                        { feature: "Never absorbs water or swells" }
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.highlight ? 'bg-primary/20' : 'bg-primary/10'
                            }`}>
                            <CheckCircle className={`w-3.5 h-3.5 ${item.highlight ? 'text-primary' : 'text-primary/70'}`} />
                          </div>
                          <span className={`${item.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                            {item.feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-6 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Premium Investment</span>
                        <span className="text-2xl font-bold text-foreground">Worth Every Penny</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Feature Grid - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Zap,
                  title: "Cool-Touch Technology",
                  description: "Advanced heat-mitigating capstock keeps surfaces cooler than traditional composites",
                  color: "from-amber-500/20 to-orange-500/10"
                },
                {
                  icon: Palette,
                  title: "Premium Color Range",
                  description: "Multi-tonal streaking and authentic wood grain patterns that never fade",
                  color: "from-blue-500/20 to-purple-500/10"
                },
                {
                  icon: Shield,
                  title: "Lifetime Protection",
                  description: "Industry-leading warranties backed by our military-grade installation",
                  color: "from-green-500/20 to-emerald-500/10"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${item.color} border border-primary/10 backdrop-blur-sm overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-3">{item.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>





          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="relative py-16 xs:py-20 sm:py-24 md:py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-[300px] xs:w-[400px] sm:w-[600px] h-[300px] xs:h-[400px] sm:h-[600px] bg-primary/1 rounded-full blur-[80px] xs:blur-[100px] sm:blur-[120px]"
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -30, 50, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-[300px] xs:w-[400px] sm:w-[500px] h-[300px] xs:h-[400px] sm:h-[500px] bg-primary/1 rounded-full blur-[80px] xs:blur-[100px] sm:blur-[120px]"
            animate={{
              x: [0, -40, 30, 0],
              y: [0, 40, -20, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto mb-10 xs:mb-16 sm:mb-20"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-6">
              <div className="w-6 sm:w-12 h-[1px] sm:h-[1.5px] bg-gradient-to-r from-transparent to-primary/40" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-primary">
                Methodology
              </span>
              <div className="w-6 sm:w-12 h-[1px] sm:h-[1.5px] bg-gradient-to-l from-transparent to-primary/40" />
            </div>

            <h2 className="text-2xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-foreground mb-3 sm:mb-6 leading-tight sm:leading-[1.05]">
              Precision in <br className="hidden sm:block" />
              <span className="text-primary">every detail</span>
            </h2>

            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
              A battle-tested framework that ensures consistency, quality, and complete satisfaction—from initial consultation to final walkthrough.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-7 mb-4 sm:mb-6 lg:mb-7">
            {processSteps.slice(0, 3).map((step, idx) => (
              <ProcessCard key={idx} step={step} index={idx} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
            {processSteps.slice(3, 6).map((step, idx) => (
              <ProcessCard key={idx + 3} step={step} index={idx + 3} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-32 bg-muted/30 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(hsl(var(--primary))_0.5px,transparent_0.5px)] [background-size:24px_24px] sm:[background-size:32px_32px]" />
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-8 sm:mb-16"
          >
            <span className="inline-block text-primary text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-4">
              FAQ
            </span>
            <h2 className="text-2xl xs:text-4xl sm:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-3 sm:mb-6 leading-tight">
              Your Questions, <span className="text-primary">Answered</span>
            </h2>
            <p className="text-xs sm:text-base lg:text-xl text-muted-foreground px-2">
              Everything you need to know about our {service.title.toLowerCase()} services
            </p>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                faq={faq}
                index={idx}
                isOpen={openFaq === idx}
                onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Award CTA Banner */}
      <div className="w-full max-w-7xl mx-auto px-4 py-4">
        <AwardCTABanner />
      </div>

      {/* Explore More Services */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 sm:w-12 h-px bg-primary/30" />
              <span className="text-[8px] xs:text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-primary">
                Our Portfolio
              </span>
              <div className="w-8 sm:w-12 h-px bg-primary/30" />
            </div>

            <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-3 sm:mb-4">
              Explore More Services
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg px-2">
              Discover our full range of premium home improvement solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {allServices.filter(s => s.slug !== service.slug).slice(0, 3).map((s, idx) => {
              const SIcon = iconMap[s.icon] || Home;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  whileHover={{ y: -8 }}
                >
                  <Link
                    href={`/services/${s.slug}`}
                    className="group block relative overflow-hidden rounded-2xl sm:rounded-3xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
                  >
                    <div className="relative h-48 xs:h-52 sm:h-56 overflow-hidden">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        quality={100}
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <SIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 lg:p-7 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <span className="text-[10px] xs:text-xs font-bold uppercase tracking-wider text-primary">
                          {s.tag}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-xl font-heading font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                        {s.title}
                      </h3>

                      <p className="text-muted-foreground text-xs xs:text-sm sm:text-base leading-relaxed mb-4 sm:mb-5 line-clamp-2">
                        {s.description}
                      </p>

                      <div className="flex items-center gap-2 text-primary text-sm sm:text-base font-semibold group-hover:gap-3 transition-all">
                        <span>Learn More</span>
                        <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-12"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 border-2 border-primary text-primary text-sm sm:text-base font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              View All Services
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}