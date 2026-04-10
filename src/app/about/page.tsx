"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContent } from "../../hooks/useContent";
import { Icon } from "../../config/icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import owner from "@/assets/ownerupdatedimage.jpeg";
import roofingImg from '@/assets/portfolio1.png';
import windowsImg from '@/assets/portfolio2.jpg';
import decksImg from '@/assets/portfolio3.jpg';
import commercialImg from '@/assets/portfolio4.jpg';
import sidingImg from '@/assets/portfolio5.jpg';
import servicesData from '../../data/servicesData.json';

import {
  MousePointer2,
  Globe,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2 as CheckCircle,
  BadgeCheck,
  TrendingUp,
  Users,
  Award,
  Scale,
  Gem,
  Zap,
  Heart,
  Sparkles,
  ArrowRight,
  Target as LucideTarget,
  Shield as LucideShield,
  Home as LucideHome,
  Building as LucideBuilding,
  Wind as LucideWindow,
  Droplet as LucideDroplet,
  Layers as LucideLayers,
  Star as LucideStar
} from 'lucide-react';
import React from 'react';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  Home: LucideHome, Layout: LucideLayers, TreePine: LucideStar, Building2: LucideBuilding, Building: LucideBuilding, Droplets: LucideDroplet,
  Shield: LucideShield, Trophy: Award, Users: Users, ThumbsUp: Heart, FileText: LucideLayers, ClipboardCheck: CheckCircle,
  Truck: LucideLayers, Hammer: LucideStar, CheckCircle: CheckCircle, Award: Award, Clock: Clock
};

const imageMap: Record<string, any> = {
  'Residential Roofing': roofingImg,
  'Windows & Doors': windowsImg,
  'Custom Decks': decksImg,
  'Commercial Roofing': commercialImg,
  'Siding, Soffit & Fascia': sidingImg,
  'Gutters & Protection': sidingImg,
};

// ==================== CUSTOM SVG ICONS ====================
const CustomIcons = {
  Star: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7M3 12h18" />
    </svg>
  ),
  Target: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 22V19.4M12 2V4.6M22 12H19.4M2 12H4.6M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" />
    </svg>
  ),
  Badge: () => (
    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Building: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Window: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4h16v16H4V4zM12 4v16M4 12h16" />
    </svg>
  ),
  Droplet: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2.25l-7.5 12a7.5 7.5 0 0015 0l-7.5-12z" />
    </svg>
  ),
  Layers: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-4.477a2.25 2.25 0 012.092 0L21.75 12M2.25 12l8.954 4.477a2.25 2.25 0 012.092 0L21.75 12M2.25 12V16.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V12" />
    </svg>
  ),
};

// ==================== STAT COUNTER COMPONENT ====================
const StatCounter = ({ value, label, suffix = "", delay = 0, icon: Icon, description }: {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
  icon: any;
  description?: string
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (inView) {
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
  }, [inView, value]);

  return (
    <div
      ref={ref}
      className="group relative bg-card rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center sm:text-left"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative mb-3 sm:mb-4 md:mb-6 flex justify-center sm:justify-start">
        <div className="inline-flex p-2 sm:p-3 bg-primary/10 rounded-xl sm:rounded-2xl group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      <div className="relative">
        <div className="flex items-baseline justify-center sm:justify-start gap-0.5 sm:gap-1 mb-2 sm:mb-3">
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground tracking-tight">
            {count}
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
            {suffix}
          </span>
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-1 sm:mb-2">
          {label}
        </h3>

        {description && (
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 sm:w-12 h-0.5 bg-primary/30 group-hover:w-12 sm:group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
    </div>
  );
};

// ==================== STATS SECTION ====================
const StatsSection = () => {
  const stats = [
    {
      value: 50,
      label: "Years Combined Experience",
      suffix: "+",
      delay: 0.1,
      icon: Clock,
      description: "Industry expertise across our team"
    },
    {
      value: 1000,
      label: "Homes Transformed",
      suffix: "+",
      delay: 0.2,
      icon: LucideHome,
      description: "Satisfied homeowners"
    },
    {
      value: 100,
      label: "Veteran Owned",
      suffix: "%",
      delay: 0.3,
      icon: BadgeCheck,
      description: "Proudly serving our community"
    },
    {
      value: 10,
      label: "Year Workmanship Guarantee",
      suffix: "YR",
      delay: 0.4,
      icon: LucideShield,
      description: "Peace of mind guaranteed"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-primary uppercase tracking-wider">
              Our Impact
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-4 px-2">
            Trusted by Homeowners
            <br className="hidden sm:block" />
            <span className="text-primary"> Across the Region</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-3 sm:px-4">
            Numbers speak louder than words. Here's what we've achieved together with our valued customers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={stat.delay}
              icon={stat.icon}
              description={stat.description}
            />
          ))}
        </div>

        <div className="mt-8 sm:mt-12 md:mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 items-center opacity-60">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">500+ 5-Star Reviews</span>
            </div>
            <div className="w-px h-2 sm:h-3 bg-border rounded-full hidden sm:block" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">A+ BBB Rating</span>
            </div>
            <div className="w-px h-2 sm:h-3 bg-border rounded-full hidden sm:block" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <LucideStar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Top Rated Contractor</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== HERO WITH BACKGROUND IMAGE ====================
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen w-full bg-background overflow-hidden flex items-center justify-center py-16 sm:py-12">
      {/* --- Background --- */}
      <div className="absolute inset-0 z-0">
        <motion.div style={{ y: y1 }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
            alt="Modern Architecture"
            className="w-full h-full object-cover opacity-20 sm:opacity-30 scale-110 grayscale-[0.5]"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10 md:bg-gradient-to-r md:from-background md:via-background/90 md:to-transparent" />

        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="absolute inset-0 z-10 opacity-[0.03] sm:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(hsl(var(--foreground)) 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />

      {/* --- Main Container --- */}
      <div className="relative z-30 w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16">

          {/* Left Side */}
          <motion.div
            style={{ y: textY }}
            className="w-full lg:w-7/12 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl xs:text-5xl sm:text-5xl md:text-7xl lg:text-[80px] xl:text-[100px] font-black leading-[1.05] sm:leading-[1.1] md:leading-[0.95] lg:leading-[0.85] tracking-tighter text-primary mb-4 sm:mb-6">
              SOARING <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/70 to-foreground/90">
                BEYOND
              </span>
              <br />
              EXPECTATIONS.
            </h1>

            <p className="text-muted-foreground text-lg sm:text-lg md:text-lg lg:text-xl xl:text-2xl max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 font-medium leading-relaxed px-2 sm:px-0">
              Born in O'Fallon, Missouri. Built on military precision. Driven by integrity.
            </p>

            <div className="flex flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center">
              <motion.a
                href="/contact"
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="px-12 sm:px-14 md:px-16 py-3 sm:py-4 md:py-5 bg-primary text-primary-foreground font-bold text-lg sm:text-lg md:text-lg rounded-xl flex items-center justify-center gap-2 sm:gap-3 group transition-all hover:text-white"
              >
                Contact Now
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-sm lg:w-5/12 mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50" />

              <div className="relative bg-card/80 backdrop-blur-xl border border-border/60 p-6 sm:p-8 rounded-3xl shadow-2xl">

                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <LucideStar key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Trusted by 500+ Homeowners</p>
                </div>

                {/* Stats - Clean & Simple */}
                <div className="space-y-4">
                  {[
                    { label: 'Veteran Owned', val: 'USA', icon: <ShieldCheck className="text-primary w-5 h-5" /> },
                    { label: 'Quality Guarantee', val: 'Lifetime', icon: <Zap className="text-primary w-5 h-5" /> },
                    { label: 'Support', val: '24/7', icon: <Globe className="text-primary w-5 h-5" /> },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-background/40 border border-border/40">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">{stat.label}</p>
                        <p className="text-xl font-black text-foreground">{stat.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simple CTA */}
                <div className="mt-6 pt-4 border-t border-border/60">
                  <div className="text-center">
                    <a
                      href="tel:636-449-9714"
                      className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                    >
                      636-449-9714
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">Call for Free Estimate</p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ==================== PARALLAX LAYER ====================
const ParallaxLayer = ({ children, speed = 0.1, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) => {
  const ref = useRef(null);
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

// ==================== FOUNDER PORTRAIT ====================
const FounderPortrait = () => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/20 to-primary/20 rounded-2xl sm:rounded-3xl blur-lg group-hover:blur-xl transition-all duration-700" />

        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/50 h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px]">
          <Image
            src={owner}
            alt="Brandon Anderson - Founder, Eagle Revolution"
            className="object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              fill="none"
              stroke="url(#founderGradient)"
              strokeWidth="1.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isHovered ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
            <defs>
              <linearGradient id="founderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary)/0.8)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 z-10"
        >
          <div className="bg-card/95 backdrop-blur-sm px-2 sm:px-3 md:px-5 py-1 sm:py-2 md:py-2.5 rounded-full shadow-xl border border-border">
            <span className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] md:text-xs font-bold text-primary">
              <Icon name="Flag" className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4" />
              VETERAN OWNED
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 z-10"
        >
          <div className="bg-card/95 backdrop-blur-sm px-2 sm:px-3 md:px-5 py-1 sm:py-2 md:py-2.5 rounded-full shadow-xl border border-border">
            <span className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] md:text-xs font-bold text-primary">
              <Icon name="Award" className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4" />
              ProVia • IKO • CertainTeed • Wolf
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ==================== FOUNDER STORY ====================
const FounderStory = () => {
  const sectionRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !isClient) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.founder-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
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

  if (!isClient) return null;

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative bg-background py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden"
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
            backgroundSize: '60px 60px sm:80px 80px',
          }}
        />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[300px] sm:h-[400px] bg-gradient-to-b from-primary/5 to-transparent opacity-60 blur-3xl" />

      <ParallaxLayer speed={0.05} className="z-0">
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2">
          <img
            src="https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Heritage pattern"
            className="w-full h-full object-cover opacity-[0.02]"
          />
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={0.08} className="z-0">
        <div className="absolute top-20 left-0 w-1/4 h-1/3">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
            alt="Studio"
            className="w-full h-full object-cover opacity-[0.02]"
          />
        </div>
      </ParallaxLayer>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-30">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 md:mb-20 founder-reveal">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-6 sm:w-8 h-[2px] bg-gradient-to-r from-primary/30 to-primary" />
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-primary">
              Our Story
            </span>
            <div className="w-6 sm:w-8 h-[2px] bg-gradient-to-r from-primary to-primary/30" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-foreground mb-4 sm:mb-6 leading-tight px-2">
            Soaring Beyond <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">Expectations</span>
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto px-3 sm:px-4">
            Born in St. Charles, Missouri. Built on military precision. Driven by integrity.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-start">
          <div className="founder-reveal lg:sticky lg:top-24">
            <FounderPortrait />
          </div>

          <div className="space-y-6 sm:space-y-8 md:space-y-10 founder-reveal">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-3 sm:mb-4 text-left">
                Brandon Anderson
                <span className="block text-xs sm:text-sm font-mono text-primary mt-1 sm:mt-2 tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                  Founder • U.S. Army Veteran • Globally Licensed Combat Sports Official
                </span>
              </h3>

              <div className="mt-6 sm:mt-8 relative">
                <div className="absolute -left-2 sm:-left-4 -top-2 text-primary/20">
                  <Icon name="Quote" className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                </div>
                <p className="text-foreground text-base sm:text-lg md:text-xl font-medium leading-relaxed pl-4 sm:pl-6 md:pl-8">
                  &ldquo;Eagle Revolution was built to be more than just a remodeling company. It was built to lead a movement.&rdquo;
                </p>
              </div>

              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 md:space-y-5">
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                  Based in O'Fallon, Missouri, Eagle Revolution was founded by Brandon Anderson, an Army veteran and globally licensed combat sports official who brings discipline, precision, and accountability to every project. With years of leadership experience at some of the largest home improvement companies in North America, Brandon saw firsthand how the industry had shifted away from homeowners and toward profits, leaving people with high prices, poor communication, and broken trust.
                </p>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                  He knew it didn't have to be that way. Eagle Revolution was created to restore what the industry lost—trust, craftsmanship, and doing the job right the first time. Today, we stand as a local company built to compete with the biggest names in the country, not through gimmicks, but through transparency, quality work, and a relentless commitment to our customers.
                </p>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                  Our systems are built for precision, but our strength is our people—driven professionals who take ownership, communicate clearly, and treat every home like their own.
                </p>
              </div>

              <blockquote className="border-l-4 border-primary pl-3 sm:pl-4 md:pl-6 py-2 my-6 sm:my-8">
                <p className="text-sm sm:text-base md:text-lg font-medium text-foreground italic">
                  "This is freedom in construction form—freedom from overpriced corporate contractors, freedom from broken promises, and freedom to expect more from your remodeler."
                </p>
                <footer className="mt-2 sm:mt-3 font-bold text-[10px] sm:text-xs text-primary uppercase tracking-widest">
                  — Brandon Anderson, CEO
                </footer>
              </blockquote>

              <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 mt-8 sm:mt-10 pt-4 border-t border-border">
                <motion.a
                  href="https://www.linkedin.com/company/eagle-revolution/people/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 sm:p-3 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Icon name="Linkedin" className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.a>
                <motion.a
                  href="mailto:banderson@eaglerevolution.com"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 sm:p-3 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                  aria-label="Email"
                >
                  <Icon name="Mail" className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.a>
                <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground break-all">
                  banderson@eaglerevolution.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== MISSION SECTION ====================
const MissionSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-20px",
    amount: 0.1,
  });

  const corePrinciples = [
    {
      title: "Fairness",
      desc: "Honest pricing with zero hidden agendas. Every quote is transparent, every invoice is exact—building trust through radical transparency.",
      val: "01",
      icon: Scale,
    },
    {
      title: "Honesty",
      desc: "Transparent communication at every milestone. No surprises, no shortcuts—just unwavering integrity that defines our character.",
      val: "02",
      icon: Gem,
    },
    {
      title: "Hard Work",
      desc: "Relentless pursuit of perfection until excellence is achieved. We measure success by your satisfaction, not by the clock.",
      val: "03",
      icon: Zap,
    },
    {
      title: "Precision",
      desc: "Military-grade accuracy in every detail. From initial measurements to final execution—where craftsmanship meets mathematical certainty.",
      val: "04",
      icon: LucideTarget,
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-8 sm:py-10 lg:py-12 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern
              id="light-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-border/10"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#light-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-24 items-start">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="w-full lg:w-5/12 text-center lg:text-left"
          >
            <div className="mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                Our Mission
              </h2>
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: 60 } : {}}
                className="h-[2px] bg-primary mt-3 sm:mt-4 mx-auto lg:mx-0"
              />
            </div>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 px-2 sm:px-0">
              To revolutionize the remodeling industry by putting people first—restoring trust through transparency, exceptional craftsmanship, and an unwavering commitment to doing what’s right.
            </p>

            <div className="flex gap-4 sm:gap-6 justify-center lg:justify-start">
              {[
                { value: "100%", label: "Customer First" },
                { value: "0%", label: "Hidden Agendas" },
                { value: "∞", label: "Commitment" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT CARDS */}
          <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            {corePrinciples.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border shadow-md hover:shadow-xl transition bg-card"
              >
                <div className="flex justify-between mb-3 sm:mb-4">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    {item.val}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          className="mt-12 sm:mt-16 h-px bg-primary origin-left"
        />
      </div>
    </section>
  );
};

// ==================== PREMIUM MARQUEE ====================
const RecognitionMarquee = () => {
  const certs = [
    "ProVia Certified", "IKO Pro", "Shingle Master",
    "TimberTech", "Veteran Owned", "Contractor Excellence", "Wolf Home Products Certified"
  ];

  return (
    <section className="py-6 sm:py-8 md:py-12 mt-2 overflow-hidden relative bg-background">
      <div className="flex flex-col gap-2">
        <div className="flex whitespace-nowrap leading-none">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-2 sm:gap-4 md:gap-8"
          >
            {[...certs, ...certs].map((text, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-4 md:gap-8 group">
                <span
                  className="text-5xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[8rem] font-black uppercase tracking-tighter transition-all duration-500"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '1px hsl(var(--border))',
                    WebkitTextStrokeColor: 'hsl(var(--border))'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--primary))';
                    e.currentTarget.style.webkitTextStrokeColor = 'hsl(var(--primary))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'transparent';
                    e.currentTarget.style.webkitTextStrokeColor = 'hsl(var(--border))';
                  }}
                >
                  {text}
                </span>
                <div className="w-4 sm:w-6 md:w-8 lg:w-12 xl:w-16 h-[2px] bg-border group-hover:bg-primary group-hover:scale-x-125 transition-all duration-500" />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex whitespace-nowrap opacity-60">
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-3 sm:gap-6 md:gap-12"
          >
            {[...certs, ...certs].map((text, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-6 md:gap-12 group">
                <span
                  className="text-xs xs:text-sm sm:text-base md:text-xl lg:text-2xl font-light tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all duration-500"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '0.5px hsl(var(--muted-foreground))',
                    WebkitTextStrokeColor: 'hsl(var(--muted-foreground))'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--primary))';
                    e.currentTarget.style.webkitTextStrokeColor = 'hsl(var(--primary))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'transparent';
                    e.currentTarget.style.webkitTextStrokeColor = 'hsl(var(--muted-foreground))';
                  }}
                >
                  {text}
                </span>
                <span className="text-border font-serif italic text-sm sm:text-base md:text-xl lg:text-2xl group-hover:text-primary transition-colors">
                  &
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-12 sm:w-16 md:w-24 lg:w-32 xl:w-64 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-16 md:w-24 lg:w-32 xl:w-64 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
    </section>
  );
};

// ==================== SERVICE CARD (Your Preferred Style) ====================
const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const SIcon = iconMap[service.icon as keyof typeof iconMap] || LucideHome;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/services/${service.slug}`} className="block h-full">
        <div className="flex flex-col h-full">
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg transition-all duration-700 group-hover:shadow-2xl">
            <Image
              src={imageMap[service.title] || roofingImg}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority={index < 3}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent group-hover:border-primary/20 transition-all duration-500 pointer-events-none" />

            <div className="absolute top-6 left-6 z-10">
              <div className="px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-xl border border-white/30 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  {service.tag}
                </span>
              </div>
            </div>

            <motion.div
              className="absolute bottom-6 right-6 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </motion.div>
          </div>

          <div className="flex-1 mt-6 px-4 flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4 opacity-40">
              <span className="w-6 h-[1px] bg-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="w-6 h-[1px] bg-foreground" />
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-foreground mb-2 tracking-tighter leading-tight group-hover:text-primary transition-colors duration-300">
              {service.title}
            </h3>

            <p className="text-muted-foreground text-xs sm:text-sm font-medium uppercase tracking-[0.1em] opacity-60 group-hover:opacity-80 transition-opacity">
              {service.tagline}
            </p>

            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Learn More
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ==================== SERVICES SECTION ====================
const ServicesSection = () => {
  const servicesList = (servicesData?.services || []).map(service => ({
    ...service,
    image: imageMap[service.title] || roofingImg
  }));

  return (
    <section className="py-16 md:py-24 px-6 lg:px-12 bg-transparent relative z-30">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary text-xs font-black uppercase tracking-[0.5em] mb-4">
            Eagle Revolution
          </span>
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tighter text-foreground">
            World Class <span className="text-primary">Capabilities</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed">
            Every detail matters when it comes to structural integrity. Our team brings military-grade standards to every project across the St. Louis area.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 relative z-30">
          {servicesList.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 sm:mt-16"
        >
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                View All Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
// ==================== CTA BANNER ====================
const AwardCTABanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative mt-8 sm:mt-12 md:mt-16 lg:mt-20 mb-8 sm:mb-12 md:mb-16 lg:mb-20 overflow-hidden"
    >
      <div className="relative bg-card border border-border rounded-xl sm:rounded-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-primary/5 rotate-12"
            animate={{ rotate: [12, 15, 12] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-primary/5 -rotate-12"
            animate={{ rotate: [-12, -15, -12] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] sm:h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] sm:h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-primary/30" />
        <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 border-t-2 border-r-2 border-primary/30" />
        <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-primary/30" />
        <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-primary/30" />

        <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 z-30 text-center lg:text-left">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 mb-3 sm:mb-4"
            >
              <span className="w-4 sm:w-6 md:w-8 h-[1px] sm:h-[2px] bg-primary" />
              <span className="text-[8px] sm:text-[10px] md:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-primary">
                Get Preapproved
              </span>
            </motion.div>

            <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 leading-tight">
              Ready to Start Your{' '}
              <span className="text-primary">Revolution?</span>
            </h3>

            <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 px-2 sm:px-0">
              Get preapproved in seconds and take the first step toward transforming your home with military precision and unwavering integrity.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mt-3 sm:mt-4 md:mt-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full" />
                <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground">No Obligation</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full" />
                <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground">Free Estimate</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full" />
                <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground">5 Year Guarantee</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:shadow-xl hover:text-white transition-all duration-300 overflow-hidden flex items-center justify-center gap-1.5 sm:gap-2 group"
            >
              <span className="relative z-10 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base whitespace-nowrap">
                Get Preapproved
                <motion.svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </span>
            </motion.a>

            <motion.a
              href="/contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-background text-primary border-2 border-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 overflow-hidden flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <span className="relative z-10 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base whitespace-nowrap">
                Contact Us
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== CORE VALUES GRID ====================
const ValuesGrid = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const values = [
    {
      title: 'Customer First',
      description: 'Our customers always come first here at Eagle Revolution. We ensure that our customers can have complete confidence in the quality of our work, knowing that we will always act in their best interests and stand behind our products and services with unwavering dedication.',
      icon: BadgeCheck,
      number: '01',
      stat: '500+',
      statLabel: 'Happy Clients',
    },
    {
      title: 'Integrity',
      description: 'In the remodeling industry, integrity means consistently doing what is right, even when no one is watching. We believe in keeping our promises, providing accurate estimates, and delivering on our commitments without cutting corners.',
      icon: CheckCircle,
      number: '02',
      stat: '0%',
      statLabel: 'Hidden Fees',
    },
    {
      title: 'Extreme Ownership',
      description: 'By embracing this mindset, we ensure that we always act in the best interests of our clients, driving continuous improvement and achieving excellence in every project we undertake. We are not perfect by any means, but we are perfect at fixing any mistake along the way.',
      icon: LucideShield,
      number: '03',
      stat: '100%',
      statLabel: 'Accountability',
    },
    {
      title: 'Gratitude',
      description: 'By expressing gratitude, we build lasting relationships and create a positive impact, ensuring every interaction is rooted in kindness and acknowledgment. We believe that a thankful mindset inspires excellence in service and craftsmanship, making every project a shared celebration.',
      icon: Sparkles,
      number: '04',
      stat: '100%',
      statLabel: 'Grateful',
    },
    {
      title: 'Growth',
      description: 'We believe that growth is essential not only for individual team members but also for the company as a whole. This core value drives us to seek out new learning opportunities, embrace innovation, and stay up-to-date with industry trends and best practices.',
      icon: TrendingUp,
      number: '05',
      stat: '∞',
      statLabel: 'Continuous',
    },
    {
      title: 'Humility',
      description: 'Humility is about putting the needs of the customer above our own and being open to feedback, learning, and improvement. By embracing humility, we stay grounded, continually refining our skills and enhancing the customer experience.',
      icon: Heart,
      number: '06',
      stat: '24/7',
      statLabel: 'Client Focus',
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="currentColor" className="text-muted-foreground/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-[200px] sm:w-[300px] md:w-[500px] h-[200px] sm:h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[250px] sm:w-[400px] md:w-[600px] h-[250px] sm:h-[400px] md:h-[600px] bg-primary/3 rounded-full blur-3xl animate-pulse-slower" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[800px] h-[300px] sm:h-[500px] md:h-[800px] bg-primary/2 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6"
          >
            <div className="w-4 sm:w-6 md:w-8 h-px bg-primary" />
            <span className="text-[8px] sm:text-[10px] md:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] text-primary uppercase">
              Our Core Values
            </span>
            <div className="w-4 sm:w-6 md:w-8 h-px bg-primary" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl xxl:text-7xl font-bold tracking-tight px-2"
          >
            <span className="text-foreground">Built on</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/95 bg-clip-text text-transparent">
              Unshakable Principles
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-3 sm:mt-4 md:mt-6 max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-3 sm:px-4"
          >
            Six principles that guide every decision, every interaction, and every project we undertake.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-12 sm:w-16 md:w-20 h-px bg-primary/40 mx-auto mt-4 sm:mt-6 md:mt-8"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
          {values.map((value, idx) => {
            const Icon = value.icon;
            const isHovered = hoveredCard === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group"
              >
                <div className="relative h-full">
                  <motion.div
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  <div className={`relative bg-card rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 ${isHovered
                    ? 'shadow-2xl border-primary/30'
                    : 'shadow-lg border-border'
                    } border`}>
                    <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary to-primary/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                      <div className="relative mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                        <motion.div
                          animate={{
                            rotate: isHovered ? [0, -5, 5, 0] : 0,
                          }}
                          transition={{ duration: 0.5 }}
                          className="relative z-10 flex justify-center sm:justify-start"
                        >
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${isHovered
                            ? 'bg-primary/10 shadow-lg shadow-primary/20'
                            : 'bg-muted/50'
                            }`}>
                            <Icon
                              className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 transition-all duration-500 ${isHovered ? 'text-primary scale-110' : 'text-muted-foreground'
                                }`}
                              strokeWidth={1.5}
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          animate={{
                            scale: isHovered ? [1, 1.2, 1] : 1,
                            opacity: isHovered ? [0.5, 0.2, 0.5] : 0,
                          }}
                          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
                          className="absolute inset-0 bg-primary/20 rounded-xl sm:rounded-2xl blur-md"
                        />
                      </div>

                      <div className="absolute top-3 sm:top-4 md:top-5 lg:top-6 xl:top-8 right-3 sm:right-4 md:right-5 lg:right-6 xl:right-8">
                        <span className={`text-[10px] sm:text-xs md:text-sm font-mono transition-all duration-500 ${isHovered ? 'text-primary font-semibold' : 'text-muted-foreground/40'
                          }`}>
                          {value.number}
                        </span>
                      </div>

                      <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1.5 sm:mb-2 md:mb-3 transition-all duration-500 text-center sm:text-left ${isHovered ? 'text-primary' : 'text-foreground'
                        }`}>
                        {value.title}
                      </h3>

                      <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm leading-relaxed mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-center sm:text-left">
                        {value.description}
                      </p>

                      <div className="pt-3 sm:pt-4 md:pt-5 lg:pt-6 border-t border-border/50">
                        <div className="flex items-baseline justify-between mb-1 sm:mb-2">
                          <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">
                            {value.statLabel}
                          </span>
                          <motion.span
                            animate={{
                              scale: isHovered ? 1.05 : 1,
                              color: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                            }}
                            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold"
                          >
                            {value.stat}
                          </motion.span>
                        </div>
                        <motion.div
                          animate={{
                            width: isHovered ? '100%' : '0%',
                          }}
                          transition={{ duration: 0.5 }}
                          className="h-0.5 bg-primary/50 rounded-full"
                        />
                      </div>
                    </div>

                    <motion.div
                      animate={{
                        opacity: isHovered ? 1 : 0,
                      }}
                      className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(20px, -20px) scale(1.1); opacity: 0.5; }
        }
        @keyframes pulse-slower {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50% { transform: translate(-25px, 25px) scale(1.2); opacity: 0.4; }
        }
        @keyframes pulse-slowest {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(15px, -15px) scale(1.05); opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 15s ease-in-out infinite;
        }
        .animate-pulse-slowest {
          animation: pulse-slowest 18s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

// ==================== MAIN PAGE COMPONENT ====================
export default function AboutPage() {
  return (
    <main className="bg-background">
      <Hero />
      <RecognitionMarquee />
      <FounderStory />
      <StatsSection />
      <MissionSection />
      <ServicesSection />
      <ValuesGrid />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-20">
        <AwardCTABanner />
      </div>
    </main>
  );
}