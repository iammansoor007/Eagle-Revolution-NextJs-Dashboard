"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ======================
// PREMIUM UNSPLASH IMAGES - CURATED
// ======================
const Images = {
  // Dummy Team Images
  CEO: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  CFO: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  COO: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",

  // Heritage
  Pattern: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  Studio: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
};

// ======================
// PREMIUM SVG ICONS - FULLY DEFINED
// ======================
const Icons = {
  Linkedin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 8h4v12H4V8z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 8h4v2c.6-.8 1.5-2 3-2 2.5 0 4 1.5 4 4v8h-4v-6c0-1.5-.5-2-2-2s-2 .5-2 2v6h-4V8z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 7l-10 7L2 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Quote: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M10 11H6V7h4v4z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M18 11h-4V7h4v4z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
    </svg>
  ),
  Award: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 14l-2 6 6-2 6 2-2-6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

// ======================
// CINEMATIC PARALLAX LAYER
// ======================
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

// ======================
// TEAM PORTRAIT (Generic)
// ======================
const TeamPortrait = ({ image, title, badge1, badge2 }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<any>(null);
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
        {/* Gradient Border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-blue-600/20 to-blue-700/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-700" />

        {/* Image Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={image}
            alt={title}
            className="w-full h-[320px] xs:h-[400px] md:h-[600px] object-cover"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

          {/* Animated Border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              fill="none"
              stroke="url(#portraitGradient)"
              strokeWidth="1.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isHovered ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
            <defs>
              <linearGradient id="portraitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Badges */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="absolute top-4 left-4 xs:top-6 xs:left-6"
        >
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 xs:px-5 xs:py-2.5 rounded-full shadow-xl border border-blue-200">
            <span className="flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs font-bold text-blue-800">
              <Icons.Sparkle />
              {badge1}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="absolute bottom-4 right-4 xs:bottom-6 xs:right-6"
        >
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 xs:px-5 xs:py-2.5 rounded-full shadow-xl border border-blue-200">
            <span className="flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs font-bold text-blue-800">
              <Icons.Award />
              {badge2}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ======================
// MAIN PAGE COMPONENT
// ======================
export default function MeetTheTeamPage() {
  const sectionRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !isClient) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.leadership-reveal',
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
    <main className="bg-white">
      <section
        ref={sectionRef}
        className="relative py-14 md:py-18 lg:py-20 overflow-hidden"
      >
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

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-50 to-transparent opacity-60 blur-3xl" />

        <ParallaxLayer speed={0.05} className="z-0">
          <div className="absolute bottom-0 right-0 w-1/3 h-1/2">
            <img
              src={Images.Pattern}
              alt="Heritage pattern"
              className="w-full h-full object-cover opacity-[0.02]"
            />
          </div>
        </ParallaxLayer>

        <ParallaxLayer speed={0.08} className="z-0">
          <div className="absolute top-20 left-0 w-1/4 h-1/3">
            <img
              src={Images.Studio}
              alt="Studio"
              className="w-full h-full object-cover opacity-[0.02]"
            />
          </div>
        </ParallaxLayer>

        {/* ====================== */}
        {/* MAIN CONTENT */}
        {/* ====================== */}
        <div className="max-w-7xl mx-auto px-4 xs:px-6 md:px-8 relative z-30">

          <div className="max-w-3xl mx-auto text-center mb-12 xs:mb-16 md:mb-20 leadership-reveal">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-gradient-to-r from-blue-300 to-blue-500" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-blue-600">
                Our Leadership
              </span>
              <div className="w-8 h-[2px] bg-gradient-to-r from-blue-500 to-blue-300" />
            </div>

            <h1 className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-4 xs:mb-6 leading-tight px-2">
              Guiding with<br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">
                vision & integrity
              </span>
            </h1>

            <p className="text-slate-600 text-base xs:text-lg md:text-xl font-light max-w-2xl mx-auto px-2 xs:px-4">
              Experienced leadership committed to excellence in every project, partnership, and promise.
            </p>
          </div>

          {/* ====================== */}
          {/* TEAM MEMBER 1 (CEO) - IMAGE LEFT */}
          {/* ====================== */}
          <div className="grid lg:grid-cols-2 gap-10 xs:gap-12 md:gap-16 items-center mb-20 xs:mb-24 md:mb-32">
            <div className="leadership-reveal">
              <TeamPortrait
                image={Images.CEO}
                title="John Doe - Founder & CEO"
                badge1="FOUNDER & CEO"
                badge2="CRAFT • INTEGRITY"
              />
            </div>

            <div className="space-y-8 leadership-reveal">
              <div>
                <h3 className="text-2xl xs:text-3xl md:text-4xl font-light text-slate-900 mb-2 xs:mb-3">
                  John Doe
                  <span className="block text-[10px] xs:text-xs md:text-sm font-mono text-blue-600 mt-1.5 xs:mt-2 tracking-[0.2em] uppercase">
                    Founder & CEO
                  </span>
                </h3>

                <div className="mt-6 relative">
                  <div className="absolute -left-2 xs:-left-4 top-0 text-blue-400/30 scale-75 xs:scale-100">
                    <Icons.Quote />
                  </div>
                  <p className="text-slate-600 text-sm xs:text-base md:text-lg leading-relaxed pl-4 xs:pl-6">
                    John founded the company with a clear vision: to create an organization built on precision craftsmanship, honest communication, and long-term relationships. With years of hands-on industry experience and leadership across residential and commercial projects, he understands that every structure is more than construction—it is protection for families, businesses, and investments.
                  </p>
                </div>

                <div className="flex items-center gap-3 xs:gap-4 mt-6 xs:mt-8">
                  <motion.a href="#" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 xs:p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Icons.Linkedin />
                  </motion.a>
                  <motion.a href="#" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 xs:p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Icons.Mail />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* ====================== */}
          {/* TEAM MEMBER 2 (CFO) - IMAGE RIGHT */}
          {/* ====================== */}
          <div className="grid lg:grid-cols-2 gap-10 xs:gap-12 md:gap-16 items-center mb-20 xs:mb-24 md:mb-32">
            <div className="space-y-8 order-2 lg:order-1 leadership-reveal">
              <div>
                <h3 className="text-2xl xs:text-3xl md:text-4xl font-light text-slate-900 mb-2 xs:mb-3">
                  Jane Smith
                  <span className="block text-[10px] xs:text-xs md:text-sm font-mono text-blue-600 mt-1.5 xs:mt-2 tracking-[0.2em] uppercase">
                    Chief Financial Officer
                  </span>
                </h3>

                <div className="mt-6 relative">
                  <div className="absolute -left-2 xs:-left-4 top-0 text-blue-400/30 scale-75 xs:scale-100">
                    <Icons.Quote />
                  </div>
                  <p className="text-slate-600 text-sm xs:text-base md:text-lg leading-relaxed pl-4 xs:pl-6">
                    Jane brings strategic financial leadership with over 15 years of experience in corporate finance and operational scaling. As CFO, she ensures sustainable growth, financial transparency, and long-term stability. Her expertise in resource allocation and financial planning enables the company to invest in quality materials, advanced training, and exceptional talent—all while maintaining competitive pricing for clients.
                  </p>
                </div>

                <div className="flex items-center gap-3 xs:gap-4 mt-6 xs:mt-8">
                  <motion.a href="#" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 xs:p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Icons.Linkedin />
                  </motion.a>
                  <motion.a href="#" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 xs:p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Icons.Mail />
                  </motion.a>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 leadership-reveal">
              <TeamPortrait
                image={Images.CFO}
                title="Jane Smith - Chief Financial Officer"
                badge1="CHIEF FINANCIAL OFFICER"
                badge2="STRATEGY • GROWTH"
              />
            </div>
          </div>

          {/* ====================== */}
          {/* TEAM MEMBER 3 (COO) - IMAGE LEFT */}
          {/* ====================== */}
          <div className="grid lg:grid-cols-2 gap-10 xs:gap-12 md:gap-16 items-center">
            <div className="leadership-reveal">
              <TeamPortrait
                image={Images.COO}
                title="Michael Johnson - Operations Director"
                badge1="OPERATIONS DIRECTOR"
                badge2="EFFICIENCY • SCALE"
              />
            </div>

            <div className="space-y-8 leadership-reveal">
              <div>
                <h3 className="text-2xl xs:text-3xl md:text-4xl font-light text-slate-900 mb-2 xs:mb-3">
                  Michael Johnson
                  <span className="block text-[10px] xs:text-xs md:text-sm font-mono text-blue-600 mt-1.5 xs:mt-2 tracking-[0.2em] uppercase">
                    Operations Director
                  </span>
                </h3>

                <div className="mt-6 relative">
                  <div className="absolute -left-2 xs:-left-4 top-0 text-blue-400/30 scale-75 xs:scale-100">
                    <Icons.Quote />
                  </div>
                  <p className="text-slate-600 text-sm xs:text-base md:text-lg leading-relaxed pl-4 xs:pl-6">
                    Michael oversees all day-to-day on-site executions and project management workflows. With a deep background in construction and team coordination, he acts as the bridge separating strategy from flawless execution. His meticulous attention to safety, timeline adherence, and supply chain logistics ensures that every team member operates optimally to deliver your projects well above standard expectations.
                  </p>
                </div>

                <div className="flex items-center gap-3 xs:gap-4 mt-6 xs:mt-8">
                  <motion.a href="#" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 xs:p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Icons.Linkedin />
                  </motion.a>
                  <motion.a href="#" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 xs:p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Icons.Mail />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* ====================== */}
          {/* FOOTER NOTE */}
          {/* ====================== */}
          <div className="text-center mt-32">
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
              Quality over shortcuts <span className="mx-2 text-slate-300">•</span> Service over sales pressure
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
