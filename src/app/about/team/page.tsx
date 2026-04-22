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
import brandon from '../../../assets/ownerteam.jpeg'
import chrissy from '../../../assets/Chrissyteam.jpeg'
import austin from '../../../assets/Austinteam.jpeg'
import brandonsutton from '../../../assets/suttonteam.jpeg'
import allan from '../../../assets/allenteam.jpeg'

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ======================
// PREMIUM UNSPLASH IMAGES - CURATED
// ======================
const Images = {
  // Team Images (Fixed with .src)
  BrandonAnderson: brandon.src,
  ChrissyLong: chrissy.src,
  Austin: austin.src,
  BrandonSales: brandonsutton.src,
  Allan: allan.src,

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
const TeamPortrait = ({ image, title, badge1, badge2, alignRight = false }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<any>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group w-full ${alignRight ? 'lg:ml-auto' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10 w-full max-w-[500px] mx-auto lg:mx-0">
        {/* Glow */}
        <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-br from-blue-500/10 via-slate-500/10 to-blue-700/10 rounded-[2rem] sm:rounded-[2.5rem] blur-xl sm:blur-2xl group-hover:from-blue-500/20 group-hover:via-slate-500/20 group-hover:to-blue-700/20 transition-all duration-700" />

        {/* Image Container */}
        <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.08)] group-hover:shadow-[0_20px_50px_rgb(0,0,0,0.15)] transition-shadow duration-700">
          <motion.img
            src={image}
            alt={title}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-[280px] min-[350px]:h-[380px] sm:h-[450px] lg:h-[550px] object-cover"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-80" />

          {/* Animated Border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.rect
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              rx="24"
              fill="none"
              stroke="url(#portraitGradient)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isHovered ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="portraitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Badges */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20"
        >
          <div className="bg-white/95 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white group-hover:-translate-y-1 transition-transform duration-500">
            <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] min-[350px]:text-[10px] sm:text-xs font-bold text-slate-800 tracking-[0.1em]">
              <Icons.Sparkle />
              {badge1}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20"
        >
          <div className="bg-slate-900/95 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-700/50 group-hover:-translate-y-1 transition-transform duration-500">
            <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] min-[350px]:text-[10px] sm:text-xs font-bold text-blue-400 tracking-[0.1em]">
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
        {/* PREMIUM RESPONSIVE BACKGROUND */}
        {/* ====================== */}
        <div className="absolute inset-0 pointer-events-none bg-[#f8fafc]">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #0f172a 1px, transparent 1px),
                linear-gradient(to bottom, #0f172a 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[800px] h-[300px] sm:h-[400px] bg-gradient-to-b from-blue-100/50 to-transparent opacity-80 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-blue-50/50 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 -left-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-slate-100/50 blur-[100px] rounded-full pointer-events-none" />

        <ParallaxLayer speed={0.05} className="z-0">
          <div className="absolute bottom-0 right-0 w-full sm:w-1/3 h-1/2">
            <img
              src={Images.Pattern}
              alt="Heritage pattern"
              className="w-full h-full object-cover opacity-[0.02] mix-blend-multiply"
            />
          </div>
        </ParallaxLayer>

        <ParallaxLayer speed={0.08} className="z-0">
          <div className="absolute top-20 left-0 w-full sm:w-1/4 h-1/3">
            <img
              src={Images.Studio}
              alt="Studio"
              className="w-full h-full object-cover opacity-[0.02] mix-blend-multiply"
            />
          </div>
        </ParallaxLayer>

        {/* ====================== */}
        {/* MAIN CONTENT */}
        {/* ====================== */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 relative z-30">

          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24 md:mb-32 leadership-reveal relative z-20">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
              <div className="w-6 sm:w-8 h-[2px] bg-gradient-to-r from-blue-300 to-blue-500" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-blue-600">
                Our Leadership
              </span>
              <div className="w-6 sm:w-8 h-[2px] bg-gradient-to-r from-blue-500 to-blue-300" />
            </div>

            <h1 className="text-3xl min-[350px]:text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 mb-4 sm:mb-6 leading-tight px-1 sm:px-2">
              Guiding with<br />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-950">
                vision & integrity
              </span>
            </h1>

            <p className="text-slate-500 text-[13px] min-[350px]:text-sm sm:text-lg font-light max-w-2xl mx-auto px-4 leading-relaxed">
              Experienced leadership committed to excellence in every project, partnership, and promise.
            </p>
          </div>

          {/* ====================== */}
          {/* TEAM MEMBER 1 (Brandon Anderson) - IMAGE LEFT */}
          {/* ====================== */}
          <div className="grid lg:grid-cols-12 gap-8 min-[350px]:gap-12 sm:gap-16 md:gap-20 items-center lg:items-start mb-24 sm:mb-32 md:mb-40 relative">
            <div className="lg:col-span-5 leadership-reveal lg:sticky lg:top-32 relative z-10 w-full max-w-[400px] lg:max-w-none mx-auto lg:mx-0">
              <TeamPortrait
                image={Images.BrandonAnderson}
                title="Brandon Anderson - Founder & CEO"
                badge1="FOUNDER & CEO"
                badge2="VISION • INTEGRITY"
              />
            </div>

            <div className="lg:col-span-7 space-y-8 leadership-reveal relative z-10 lg:pl-6 w-full">
              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 min-[350px]:p-8 sm:p-10 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <h3 className="text-2xl min-[350px]:text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 mb-2 sm:mb-3">
                  Brandon Anderson
                  <span className="block text-[10px] sm:text-xs font-mono font-bold text-blue-600 mt-2 sm:mt-3 tracking-[0.2em] uppercase">
                    Founder & CEO
                  </span>
                </h3>

                <div className="mt-8 sm:mt-10 relative">
                  <div className="absolute -left-3 sm:-left-6 -top-4 sm:-top-6 text-blue-100/60 scale-[1.2] sm:scale-[1.8] pointer-events-none">
                    <Icons.Quote />
                  </div>
                  <div className="space-y-4 sm:space-y-6 text-slate-600 text-[13px] min-[350px]:text-sm sm:text-base md:text-lg leading-relaxed relative z-10">
                    <p>
                      Originally from Nashville, Tennessee, Brandon was raised in Southern Illinois. Growing up in a difficult home environment, he faced challenges that forced him to mature quickly. Later, his grandparents stepped in to raise him and his two brothers, teaching him what it truly means to show up for family and build something stronger than what you were given.
                    </p>
                    <p>
                      Brandon carried those lessons into his service in the United States Army, where he developed discipline, resilience, and the ability to perform under pressure. The military reinforced a mindset that still defines him today. No excuses. No shortcuts. Just execution.
                    </p>
                    <p>
                      After his service, he pursued a career in high-performance environments, earning multiple promotions and working with top-tier organizations. At the center of Brandon's life is his family—his devoted wife Cassandra and their children. Everything he builds is rooted in creating stability, opportunity, and a legacy reflecting strength, integrity, and purpose.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* ====================== */}
          {/* TEAM MEMBER 3 (Chrissy Long) - IMAGE LEFT */}
          {/* ====================== */}
          <div className="grid lg:grid-cols-12 gap-8 min-[350px]:gap-12 sm:gap-16 md:gap-20 items-center lg:items-start mb-24 sm:mb-32 md:mb-40 relative">
            <div className="lg:col-span-5 leadership-reveal lg:sticky lg:top-32 relative z-10 w-full max-w-[400px] lg:max-w-none mx-auto lg:mx-0">
              <TeamPortrait
                image={Images.ChrissyLong}
                title="Chrissy Long - Executive Assistant"
                badge1="EXECUTIVE ASSISTANT"
                badge2="RELIABLE • PURPOSEFUL"
              />
            </div>

            <div className="lg:col-span-7 space-y-8 leadership-reveal relative z-10 lg:pl-6 w-full">
              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 min-[350px]:p-8 sm:p-10 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <h3 className="text-2xl min-[350px]:text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 mb-2 sm:mb-3">
                  Chrissy Long
                  <span className="block text-[10px] sm:text-xs font-mono font-bold text-blue-600 mt-2 sm:mt-3 tracking-[0.2em] uppercase">
                    Executive Assistant
                  </span>
                </h3>

                <div className="mt-8 sm:mt-10 relative">
                  <div className="absolute -left-3 sm:-left-6 -top-4 sm:-top-6 text-blue-100/60 scale-[1.2] sm:scale-[1.8] pointer-events-none">
                    <Icons.Quote />
                  </div>
                  <div className="space-y-4 sm:space-y-6 text-slate-600 text-[13px] min-[350px]:text-sm sm:text-base md:text-lg leading-relaxed relative z-10">
                    <p>
                      Say hello to the newest powerhouse at Eagle Revolution- our amazing new executive assistant, Chrissy Long! She is the backbone that ensures nothing falls through the cracks - because every great company needs a reliable teammate, and every great customer deserves amazing work!
                    </p>
                    <p>
                      Here is a little bit about Chrissy and what she has to say about working at Eagle Revolution:
                    </p>
                    <p className="italic font-medium text-slate-700">
                      " I have found my home, a place with genuine people who really care about their customers and employees, which today is sometimes rare. I truly believe my calling in life is to help others, and this job is exactly that, purposeful and fulfilling. It also gives me the opportunity to live a better-tuned life, take care of my daughters, and still have time for the hobbies I enjoy. When I'm not at work; I am either napping, training for a kickboxing match, serving at my local church, or enjoying time with my family. I really love a simplistic, peaceful lifestyle and I hope to bring those attributes into my work life. "
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ====================== */}
          {/* TEAM MEMBER 4 (Austin) - IMAGE RIGHT */}
          {/* ====================== */}
          <div className="grid lg:grid-cols-12 gap-8 min-[350px]:gap-12 sm:gap-16 md:gap-20 items-center lg:items-start mb-24 sm:mb-32 md:mb-40 relative">
            <div className="lg:col-span-7 space-y-8 order-2 lg:order-1 leadership-reveal relative z-10 lg:pr-6 w-full">
              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 min-[350px]:p-8 sm:p-10 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <h3 className="text-2xl min-[350px]:text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 mb-2 sm:mb-3">
                  Austin
                  <span className="block text-[10px] sm:text-xs font-mono font-bold text-blue-600 mt-2 sm:mt-3 tracking-[0.2em] uppercase">
                    Canvas Manager
                  </span>
                </h3>

                <div className="mt-8 sm:mt-10 relative">
                  <div className="absolute -left-3 sm:-left-6 -top-4 sm:-top-6 text-blue-100/60 scale-[1.2] sm:scale-[1.8] pointer-events-none">
                    <Icons.Quote />
                  </div>
                  <div className="space-y-4 sm:space-y-6 text-slate-600 text-[13px] min-[350px]:text-sm sm:text-base md:text-lg leading-relaxed relative z-10">
                    <p>Drumroll, please! 🥁 It's time for you to meet the dream team behind Eagle Revolution!🦅</p>
                    <p>First up is our amazing canvas manager, Austin! We are so grateful to have a leader who brings creativity, care, and amazing organization to every project.</p>
                    <p>Here's what Austin has to say about working for the company:</p>
                    <p className="italic font-medium text-slate-700">
                      "As a Canvas Manager at Eagle Revolution, going on 5 months I'm proud and grateful to be part of a team where growth isn't just encouraged-it's built into everything we do. That mindset doesn't stop at work; it flows into how I live. I thrive outdoors; whether I'm at the park with my kids, exploring nature, or enjoying a sporting event. I truly believe connection, movement, and joy go hand in hand. Yoga and mindfulness practices keep me grounded, but I'm always reaching forward, learning, and evolving. At work and in life, I believe growth isn't a destination-it's a daily practice, shaped by purpose, presence and the courage to keep showing up, fully."
                    </p>
                    <p>Thank you Austin for all you do for the team!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 leadership-reveal lg:sticky lg:top-32 relative z-10 w-full max-w-[400px] lg:max-w-none mx-auto lg:mx-0">
              <TeamPortrait
                image={Images.Austin}
                title="Austin - Canvas Manager"
                badge1="CANVAS MANAGER"
                badge2="GROWTH • MINDFULNESS"
                alignRight
              />
            </div>
          </div>

          {/* ====================== */}
          {/* TEAM MEMBER 5 (Brandon) - IMAGE LEFT */}
          {/* ====================== */}
          <div className="grid lg:grid-cols-12 gap-8 min-[350px]:gap-12 sm:gap-16 md:gap-20 items-center lg:items-start mb-24 sm:mb-32 md:mb-40 relative">
            <div className="lg:col-span-5 leadership-reveal lg:sticky lg:top-32 relative z-10 w-full max-w-[400px] lg:max-w-none mx-auto lg:mx-0">
              <TeamPortrait
                image={Images.BrandonSales}
                title="Brandon - Construction Sales Professional"
                badge1="SALES PROFESSIONAL"
                badge2="KNOWLEDGE • HONESTY"
              />
            </div>

            <div className="lg:col-span-7 space-y-8 leadership-reveal relative z-10 lg:pl-6 w-full">
              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 min-[350px]:p-8 sm:p-10 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <h3 className="text-2xl min-[350px]:text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 mb-2 sm:mb-3">
                  Brandon
                  <span className="block text-[10px] sm:text-xs font-mono font-bold text-blue-600 mt-2 sm:mt-3 tracking-[0.2em] uppercase">
                    Construction Sales Professional
                  </span>
                </h3>

                <div className="mt-8 sm:mt-10 relative">
                  <div className="absolute -left-3 sm:-left-6 -top-4 sm:-top-6 text-blue-100/60 scale-[1.2] sm:scale-[1.8] pointer-events-none">
                    <Icons.Quote />
                  </div>
                  <div className="space-y-4 sm:space-y-6 text-slate-600 text-[13px] min-[350px]:text-sm sm:text-base md:text-lg leading-relaxed relative z-10">
                    <p>
                      Brandon is a construction sales professional with over 12 years of experience specializing in windows, doors, and roofing. He's known for his straightforward approach, strong product knowledge, and commitment to helping customers find the right solutions for their homes.
                    </p>
                    <p>
                      As an Illinois resident, Brandon takes pride in serving his local community with honesty and dependable service. Outside of work, Brandon is a dedicated softball dad and enjoys spending his free time on the golf course.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ====================== */}
          {/* FOOTER NOTE */}
          {/* ====================== */}
          <div className="text-center mt-20 sm:mt-32 mb-10">
            <p className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-widest uppercase">
              Quality over shortcuts <span className="mx-2 text-slate-300">•</span> Service over sales pressure
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}