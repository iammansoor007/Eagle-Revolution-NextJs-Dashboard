"use client";

import React, { useState, useRef, useEffect } from 'react';
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
import breakcrumb from '@/assets/Breadcrumb-Image.jpeg';
import { useContent } from "../../hooks/useContent";

import roofingImg from '@/assets/roof1.jpg.jpeg';
import windowsImg from '@/assets/window5.jpeg';
import decksImg from '@/assets/outdoor-sitting-desk.png';
import commercialImg from '@/assets/commercial-tpo.png';
import sidingImg from '@/assets/siding5.jpg.jpeg';
import gutter from '@/assets/gutterinstallation.jpg.jpeg';
import pvcdecks from '@/assets/pvcdecks.jpg.jpeg';

const iconMap: Record<string, any> = {
  Home, Layout, TreePine, Building2, Building, Droplets,
  Shield, Trophy, Users, ThumbsUp, FileText, ClipboardCheck,
  Truck, Hammer, CheckCircle, Award, Clock, Sparkles, Zap, Palette, Sun, Snowflake, Star
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

// --- StatCard Component ---
const StatCard = ({ stat, index }: any) => {
  const cardRef = useRef<any>(null);
  const inView = useInView(cardRef, { once: true, margin: "50px" });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: any) => {
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

  const StatIcon = iconMap[stat.icon] || Shield;

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
              <StatIcon className="icon w-5 h-5 sm:w-6 sm:h-6 !text-primary group-hover:!text-white transition-all duration-300" />
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
    </motion.div>
  );
};

// --- Process Card Component ---
const ProcessCard = ({ step, index }: { step: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 15 });
  const springY = useSpring(y, { stiffness: 120, damping: 15 });
  const rotateX = useTransform(springY, [-0.3, 0.3], [3, -3]);
  const rotateY = useTransform(springX, [-0.3, 0.3], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent) => {
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

  const StepIcon = iconMap[step.icon] || Shield;

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

        <div className="relative p-4 sm:p-8 lg:p-10 flex flex-col h-full z-10">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-6 sm:mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isHovered ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="text-primary"
              >
                <StepIcon className="w-5 h-5 sm:w-7 sm:h-7" />
              </motion.div>
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary/50">
              Phase {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2 xs:mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
            {step.title}
          </h3>

          <p className="text-muted-foreground text-xs sm:text-base leading-relaxed flex-1">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- FAQ Item Component ---
const FAQItem = ({ faq, index, isOpen, onToggle }: { faq: any, index: number, isOpen: boolean, onToggle: (i: number) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative group"
    >
      <div
        className={`relative bg-card/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border transition-all duration-300 ${isOpen
          ? 'border-primary/40 shadow-2xl shadow-primary/10'
          : 'border-primary/10 hover:border-primary/25 shadow-lg'
          }`}
      >
        <button
          onClick={() => onToggle(index)}
          className="w-full text-left p-4 sm:p-6 md:p-8 focus:outline-none relative z-10"
        >
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            <h3 className={`text-sm sm:text-lg lg:text-xl font-semibold transition-all duration-300 leading-tight ${isOpen ? 'text-primary' : 'text-foreground'
              }`}>
              {faq.question}
            </h3>
            <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary text-white' : 'border-border bg-background'}`}>
              {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </div>
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-6 md:px-8 pb-5 sm:pb-8">
                <p className="text-muted-foreground text-xs xs:text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- Award CTA Banner Component ---
const AwardCTABanner = () => {
  const { serviceDetailPage } = useContent();
  const { trustBanner } = (serviceDetailPage as any) || {};

  return (
    <div className="relative bg-card border border-border rounded-2xl p-8 sm:p-12 overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl text-center lg:text-left">
          <h3 className="text-2xl sm:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: trustBanner?.headline || "America's #1 Rated Home Improvement Team" }} />
          <p className="text-muted-foreground text-lg mb-6" dangerouslySetInnerHTML={{ __html: trustBanner?.description || "Join thousands of satisfied homeowners who trusted us." }} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/contact" className="px-8 py-4 bg-primary text-white font-bold rounded-full text-center">
            {trustBanner?.cta?.primary || "Get Free Quote"}
          </Link>
          <a href={`tel:${trustBanner?.cta?.phone || "636-449-9714"}`} className="px-8 py-4 bg-white text-primary border-2 border-primary font-bold rounded-full text-center">
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default function ServiceDetailTemplate({ pageData, params: syncParams }: { pageData?: any, params?: any }) {
  const { services: servicesData, serviceDetailPage } = useContent();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (pageData?.slug) {
      setSlug(pageData.slug);
    } else if (syncParams?.slug) {
      const pSlug = syncParams.slug;
      setSlug(Array.isArray(pSlug) ? pSlug.join('/') : pSlug);
    }
  }, [pageData, syncParams]);

  const servicesList = (servicesData as any).services || [];
  const allServices = servicesList.map((service: any) => ({
    ...service,
    image: imageMap[service.title] || roofingImg
  }));

  const service = allServices.find((s: any) => s.slug === slug);

  if (!service && slug) {
    return notFound();
  }

  if (!service) return <div className="pt-32 text-center">Loading...</div>;

  const IconComponent = iconMap[service.icon] || Home;
  const faqs = service.faq || [];
  const processSteps = (service.process || []).map((p: any) => ({ ...p, icon: p.icon }));
  const statsData = (service.stats || []).map((s: any) => ({ ...s, icon: s.icon }));
  const isDeckPage = service.slug === 'custom-decks' || service.slug === 'pvc-decking';

  return (
    <main className="bg-background text-foreground font-body">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[500px] w-full">
        <Image src={breakcrumb} alt={service.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <h1 className="text-3xl sm:text-7xl font-bold text-white mb-4">{service.title}</h1>
            <p className="text-white/80 text-lg sm:text-2xl max-w-2xl">
              Professional {service.title.toLowerCase()} services with military precision.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat: any, idx: number) => (
            <StatCard key={idx} stat={stat} index={idx} />
          ))}
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-6xl font-bold mb-6">Craftsmanship Without Compromise.</h2>
            <p className="text-lg text-muted-foreground mb-8">{service.overview}</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {service.features.map((f: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="text-primary w-5 h-5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl">
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <Image src={service.image} alt={service.title} fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-bold mb-4">Precision in every detail</h2>
            <p className="text-lg text-muted-foreground">Our battle-tested methodology ensures consistency and quality.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step: any, idx: number) => (
              <ProcessCard key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-bold text-center mb-16">Your Questions, Answered</h2>
          <div className="space-y-4">
            {faqs.map((faq: any, idx: number) => (
              <FAQItem key={idx} faq={faq} index={idx} isOpen={openFaq === idx} onToggle={() => setOpenFaq(openFaq === idx ? null : idx)} />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AwardCTABanner />
      </div>
    </main>
  );
}
