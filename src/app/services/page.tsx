"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring
} from 'framer-motion';
import {
  Home, Layout, TreePine, Building2, Building, Droplets,
  ArrowRight, Star, Shield, Clock, Award, Users, CheckCircle,
  Phone, Calendar, ArrowUpRight, Play, ChevronRight, Trophy,
  ThumbsUp, FileText, ClipboardCheck, Truck, Hammer, Minus, Plus,
  TrendingUp, BadgeCheck
} from 'lucide-react';
// import servicesData from '../../data/servicesData.json';

import breakcrumb from '@/assets/Breadcrumb-Image.jpeg';
import roofingImg from '../../assets/roof1.jpg.jpeg';
import windowsImg from '../../assets/window5.jpeg';
import decksImg from '../../assets/outdoor-sitting-desk.png';
import commercialImg from '../../assets/commercial-tpo.png';
import sidingImg from '../../assets/siding5.jpg.jpeg';
import gutter from '../../assets/gutterinstallation.jpg.jpeg';
import pvcdecks from '../../assets/pvcdecks.jpg.jpeg';

const iconMap: Record<string, any> = {
  Home, Layout, TreePine, Building2, Building, Droplets,
  Shield, Trophy, Users, ThumbsUp, FileText, ClipboardCheck,
  Truck, Hammer, CheckCircle, Award, Clock, BadgeCheck, TrendingUp, Star
};

const imageMap: Record<string, any> = {
  'Residential Roofing': roofingImg,
  'Windows & Doors': windowsImg,
  'Custom Decks': decksImg,
  'Commercial Roofing': commercialImg,
  'Siding, Soffit & Fascia': sidingImg,
  'Gutters & Protection': gutter,
  'PVC Decking': pvcdecks

};

import { useContent } from "../../hooks/useContent";

// --- Counter Component ---
const Counter = ({ value, suffix = "", duration = 2, start = false }: any) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (start) {
      let startTime: number | undefined;
      const animate = (timestamp: any) => {
        if (startTime === undefined) startTime = timestamp;
        const progress = Math.min((timestamp - startTime!) / (duration * 1000), 1);
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

// --- StatCounter Component for Stats Section ---
const StatCounter = ({ value, label, suffix, delay, icon: Icon, description }: any) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<any>(null);
  const inView = useInView(countRef, { once: true, margin: "50px" });

  useEffect(() => {
    if (inView) {
      let startTime: number | undefined;
      const animate = (timestamp: any) => {
        if (startTime === undefined) startTime = timestamp;
        const progress = Math.min((timestamp - startTime!) / 2000, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easedProgress * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, value]);

  return (
    <motion.div
      ref={countRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/40 hover:border-primary/20 h-full">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
            {Icon && <Icon className="w-7 h-7 sm:w-8 sm:h-8" />}
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tighter">
              {count.toLocaleString()}{suffix}
            </h3>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            {description && (
              <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Interactive Background (Matching Testimonials Style) ---
const InteractiveBackground = () => {
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    const handleMouseMove = (e: any) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Diagonal Grid Lines - Exactly like Testimonials */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 1px, transparent 1px, transparent 40px),
              repeating-linear-gradient(135deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 1px, transparent 1px, transparent 40px)
            `,
          }}
        />
      </div>

      {/* Animated Blob 1 - Matching Testimonials */}
      <motion.div
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, -50, 100, 50, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
      />

      {/* Animated Blob 2 - Matching Testimonials */}
      <motion.div
        animate={{
          x: [0, -100, 50, 100, 0],
          y: [0, 50, -100, -50, 0],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
      />

      {/* Desktop Mouse Follower (Additional enhancement - keeps interactivity) */}
      {!isMobile && !isTablet && (
        <motion.div
          animate={{
            x: mousePos.x - 400,
            y: mousePos.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 80,
            restDelta: 0.001
          }}
          className="absolute w-[800px] h-[800px] bg-primary/[0.04] rounded-full blur-[120px]"
        />
      )}
    </div>
  );
};

// --- Enhanced Service Card with Fixed Hover ---
const ServiceCard = ({ service, index }: any) => {
  const SIcon = (iconMap as any)[service.icon] || Home;
  const [isHovered, setIsHovered] = useState(false);

  const slug = service.title.toLowerCase().replace(/ & /g, '-').replace(/, /g, '-').replace(/ /g, '-');

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
      <Link href={`/services/${slug}`} className="block h-full">
        <div className="flex flex-col h-full">
          {/* Image Container - Fixed aspect ratio */}
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg transition-all duration-700 group-hover:shadow-2xl">
            <Image
              src={(imageMap as any)[service.title] || roofingImg}
              alt={service.title}
              fill
              quality={100}
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority={index < 3}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Subtle Border Glow on Hover */}
            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent group-hover:border-primary/20 transition-all duration-500 pointer-events-none" />

            {/* Floating Badge */}
            <div className="absolute top-6 left-6 z-10">
              <div className="px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-xl border border-white/30 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  {service.tag || "Expertise"}
                </span>
              </div>
            </div>

            {/* Hover Arrow Button */}
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

          {/* Content - Fixed spacing */}
          <div className="flex-1 mt-6 px-4 flex flex-col items-center text-center">
            {/* Index Number */}
            <div className="flex items-center gap-3 mb-4 opacity-40">
              <span className="w-6 h-[1px] bg-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="w-6 h-[1px] bg-foreground" />
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-foreground mb-2 tracking-tighter leading-tight group-hover:text-primary transition-colors duration-300">
              {service.title}
            </h3>

            {/* Tagline */}
            <p className="text-muted-foreground text-xs sm:text-sm font-medium uppercase tracking-[0.1em] opacity-60 group-hover:opacity-80 transition-opacity">
              {service.tagline || service.description?.substring(0, 50) + "..."}
            </p>

            {/* Learn More Link */}
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

// --- Award CTA Banner Component (Enhanced) ---
const AwardCTABanner = ({ data }: { data: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative overflow-hidden "
    >
      <div className="relative bg-gradient-to-br from-primary/5 via-white to-primary/5 border border-primary/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-48 xs:w-64 sm:w-96 h-48 xs:h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0, -30, 0],
              y: [0, -20, 0, 20, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-48 xs:w-64 sm:w-96 h-48 xs:h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0, 30, 0],
              y: [0, 20, 0, -20, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Animated Borders */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Content */}
        <div className="relative px-4 xs:px-6 sm:px-8 lg:px-12 py-8 xs:py-10 sm:py-14 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-6 xs:gap-8 z-20">
          <div className="max-w-2xl text-center lg:text-left">
            {/* Stars Rating */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center lg:justify-start gap-2 xs:gap-3 mb-3 xs:mb-4"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 xs:w-4 xs:h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-[10px] xs:text-xs sm:text-sm font-bold tracking-[0.15em] xs:tracking-[0.2em] uppercase text-primary">
                Trusted by Thousands
              </span>
            </motion.div>

            {/* Headline */}
            <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 xs:mb-4 leading-tight"
              dangerouslySetInnerHTML={{ __html: data?.title || "America's #1 Rated Home Improvement Team" }}
            />

            {/* Description */}
            <p className="text-muted-foreground text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mb-4 xs:mb-6"
              dangerouslySetInnerHTML={{ __html: data?.description || "Join thousands of satisfied homeowners who trusted us with their most valuable investment." }}
            />

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 xs:gap-3">
              {[
                { text: "A+ BBB Rating", icon: Award },
                { text: "24/7 Support", icon: Clock },
                { text: "Free Estimates", icon: FileText }
              ].map((badge, i) => {
                const BadgeIcon = badge.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 py-1 xs:py-1.5 bg-primary/5 rounded-full border border-primary/15"
                  >
                    <BadgeIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    <span className="text-[8px] xs:text-[10px] sm:text-xs text-foreground font-medium uppercase tracking-wide">
                      {badge.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex lg:flex-row sm:flex-col gap-3 xs:gap-4">
            <Link href={data?.buttonLink || "/contact"}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-5 xs:px-6 sm:px-8 py-3 xs:py-3.5 sm:py-4 bg-primary text-white font-bold rounded-full shadow-lg hover:text-white transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-xs xs:text-sm sm:text-base">
                  {data?.buttonText || "Get Free Quote"}
                  <ArrowRight className="w-3 h-3 xs:w-4 xs:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </Link>

            <motion.a
              href="tel:636-449-9714"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-5 xs:px-6 sm:px-8 py-3 xs:py-3.5 sm:py-4 bg-white text-primary border-2 border-primary font-bold rounded-full shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-xs xs:text-sm sm:text-base">
                <Phone className="w-3 h-3 xs:w-4 xs:h-4 group-hover:scale-110 transition-transform" />
                <span className="whitespace-nowrap">636-449-9714</span>
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Stats Section Component ---
const StatsSection = ({ data }: { data: any }) => {
  const stats = data?.stats || [
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
      icon: Home,
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
      icon: Shield,
      description: "Peace of mind guaranteed"
    }
  ];

  const LucideStar = Star;

  return (
    <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-primary uppercase tracking-wider">
              {data?.statsSection?.badge || data?.badge || "Our Impact"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-4 px-2">
            {typeof data?.statsSection?.headline === 'object' ? (
              <>
                {data.statsSection.headline.prefix}{' '}
                <span className="text-primary">{data.statsSection.headline.highlight}</span>{' '}
                {data.statsSection.headline.suffix}
              </>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: data?.statsSection?.headline || data?.headline || 'Trusted by Homeowners <span className="text-primary"> Across the Region</span>' }} />
            )}
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-3 sm:px-4">
            {Array.isArray(data?.statsSection?.description) ? (
              <span dangerouslySetInnerHTML={{ __html: data.statsSection.description.join(' ') }} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: data?.statsSection?.description || data?.description || "Numbers speak louder than words. Here's what we've achieved together with our valued customers." }} />
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {stats.map((stat: any, index: number) => (
            <StatCounter
              key={index}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={(index + 1) * 0.1}
              icon={stat.icon ? (iconMap as any)[stat.icon] : (index === 0 ? Clock : index === 1 ? Home : index === 2 ? BadgeCheck : Shield)}
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

export default function ServicesPage() {
  const { services: dataRaw } = useContent();
  const data = dataRaw as any;

  const services = (data?.services || []).map((service: any) => ({
    ...service,
    image: (imageMap as any)[service.title] || roofingImg
  }));

  return (
    <main className="bg-white relative overflow-hidden min-h-screen font-body scroll-smooth">
      <InteractiveBackground />

      {/* Hero Section */}
      <section className="relative h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] w-full">
        <Image
          src={breakcrumb}
          alt="Our Services"
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
                <span className="text-white">Services</span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-heading font-bold text-white mb-3 sm:mb-6 leading-tight"
              >
                {typeof data?.hero?.headline === 'object' ? (
                  <>
                    {data.hero.headline.prefix}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                      {data.hero.headline.highlight}
                    </span>{' '}
                    {data.hero.headline.suffix}
                  </>
                ) : typeof data?.headline === 'object' ? (
                  <>
                    {data.headline.prefix}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                      {data.headline.highlight}
                    </span>{' '}
                    {data.headline.suffix}
                  </>
                ) : (
                  data?.hero?.headline || data?.headline || "Our Services"
                )}
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-16 sm:w-20 h-0.5 sm:h-1 bg-primary mb-4 sm:mb-6 origin-left"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-white/80 text-sm xs:text-base sm:text-xl max-w-2xl"
              >
                {Array.isArray(data?.hero?.description) ? (
                  <span dangerouslySetInnerHTML={{ __html: data.hero.description.join(' ') }} />
                ) : Array.isArray(data?.description) ? (
                  <span dangerouslySetInnerHTML={{ __html: data.description.join(' ') }} />
                ) : (
                  data?.hero?.description || data?.description || "Comprehensive home improvement solutions with military precision and architectural excellence."
                )}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection data={data} />

      {/* Main Services Grid */}
      <section className="py-16 md:py-24 px-6 lg:px-12 bg-transparent relative">
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
              {data?.gridSection?.badge || data?.badge || "Expertise"}
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tighter text-foreground">
              {typeof data?.gridSection?.headline === 'object' ? (
                <>
                  {data.gridSection.headline.prefix}{' '}
                  <span className="text-primary">{data.gridSection.headline.highlight}</span>{' '}
                  {data.gridSection.headline.suffix}
                </>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: data?.gridSection?.headline || data?.headline || 'World Class <span className="text-primary">Capabilities</span>' }} />
              )}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6" />
            <p className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed">
              {Array.isArray(data?.gridSection?.description) ? (
                <span dangerouslySetInnerHTML={{ __html: data.gridSection.description.join(' ') }} />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: data?.gridSection?.description || data?.description || "Every detail matters when it comes to structural integrity. Our team brings military-grade standards to every project across the St. Louis area." }} />
              )}
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 relative z-30">
            {services.map((service: any, index: number) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Award CTA Banner */}
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <AwardCTABanner data={data?.cta} />
      </div>
    </main>
  );
}