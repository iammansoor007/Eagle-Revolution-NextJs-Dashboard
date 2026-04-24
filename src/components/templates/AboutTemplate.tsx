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
import roofingImg from '../../assets/roof1.jpg.jpeg';
import windowsImg from '../../assets/window5.jpeg';
import decksImg from '../../assets/outdoor-sitting-desk.png';
import commercialImg from '../../assets/commercial-tpo.png';
import sidingImg from '../../assets/siding5.jpg.jpeg';
import gutter from '../../assets/gutterinstallation.jpg.jpeg';
import pvcdecks from '../../assets/pvcdecks.jpg.jpeg';

import {
  MousePointer2, Globe, ShieldCheck, ArrowUpRight, Clock,
  CheckCircle2 as CheckCircle, BadgeCheck, TrendingUp, Users,
  Award, Scale, Gem, Zap, Heart, Sparkles, ArrowRight,
  Target as LucideTarget, Shield as LucideShield, Home as LucideHome,
  Building as LucideBuilding, Wind as LucideWindow, Droplet as LucideDroplet,
  Layers as LucideLayers, Star as LucideStar
} from 'lucide-react';
import React from 'react';

gsap.registerPlugin(ScrollTrigger);

const StatCounter = ({ value, label, suffix = "", delay = 0, icon: Icon, description }: any) => {
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
    <div ref={ref} className="group relative bg-card rounded-xl p-3 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center sm:text-left">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative mb-3 flex justify-center sm:justify-start">
        <div className="inline-flex p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110">
          <Icon className="w-5 h-5 sm:w-8 sm:h-8 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      <div className="relative">
        <div className="flex items-baseline justify-center sm:justify-start gap-1 mb-2">
          <span className="text-2xl sm:text-6xl font-bold text-foreground tracking-tight">{count}</span>
          <span className="text-xl sm:text-4xl font-bold text-primary">{suffix}</span>
        </div>
        <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1">{label}</h3>
        {description && <p className="text-[10px] sm:text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
};

const StatsSection = () => {
  const { aboutPage } = useContent();
  const { stats: statsData } = aboutPage;
  const iconLookup: any = { Clock, Home: LucideHome, BadgeCheck, Shield: LucideShield };
  return (
    <section className="py-12 sm:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wider">{statsData.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-5xl font-bold text-foreground mb-4">{statsData.headline}</h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">{statsData.description}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {statsData.items.map((stat: any, index: number) => (
            <StatCounter key={index} value={stat.value} label={stat.label} suffix={stat.suffix} delay={0.1 + index * 0.1} icon={iconLookup[stat.icon] || LucideShield} description={stat.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const { aboutPage } = useContent();
  const { hero } = aboutPage;
  const statIconMap: any = { ShieldCheck, Zap, Globe };
  return (
    <section className="relative min-h-[85vh] sm:min-h-screen w-full bg-background overflow-hidden flex items-center justify-center py-16">
      <div className="absolute inset-0 z-0">
        <motion.div style={{ y: y1 }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" alt="Modern Architecture" fill className="object-cover opacity-20 sm:opacity-30 scale-110 grayscale-[0.5]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10 md:bg-gradient-to-r md:from-background md:via-background/90 md:to-transparent" />
      </div>
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div style={{ y: textY }} className="w-full lg:w-7/12 text-center lg:text-left" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-5xl md:text-8xl font-black leading-tight tracking-tighter text-primary mb-6">
              {hero.headline.line1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">{hero.headline.line2}</span> <br />
              {hero.headline.line3}
            </h1>
            <p className="text-muted-foreground text-lg sm:text-2xl max-w-xl mx-auto lg:mx-0 mb-8">{hero.description}</p>
            <Link href="/contact" className="inline-block px-12 py-4 bg-primary text-primary-foreground font-bold rounded-xl">{hero.cta}</Link>
          </motion.div>
          <div className="w-full lg:w-5/12">
             {/* Simplified right side for template */}
             <div className="bg-card/80 backdrop-blur-xl border p-8 rounded-3xl shadow-2xl">
                <div className="space-y-4">
                  {hero.stats.map((stat: any, i: number) => {
                    const StatIcon = statIconMap[stat.icon] || ShieldCheck;
                    return (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-background/40 border">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <StatIcon className="text-primary w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-black">{stat.val}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FounderStory = () => {
  const { aboutPage } = useContent();
  const { story } = aboutPage;
  return (
    <section className="py-12 sm:py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <Image src={owner} alt="Founder" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-4xl sm:text-6xl font-light mb-6">{story.headline}</h2>
            <p className="text-lg text-muted-foreground mb-8">{story.description}</p>
            <div className="space-y-4">
              {story.founder.bio.map((p: string, i: number) => (
                <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function AboutTemplate({ pageData, params }: { pageData?: any, params?: any }) {
  return (
    <div className="relative">
      <Hero />
      <StatsSection />
      <FounderStory />
      {/* Add more sections as needed from original about page */}
    </div>
  );
}
