import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "../config/icons";
import { useContent } from "../hooks/useContent";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const ParallaxLayer = ({ children, speed = 0.2, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) => {
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

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={isHovered ? {
        scale: 1.01,
        boxShadow: "0 20px 40px -12px hsl(var(--foreground)/0.08)"
      } : {
        scale: 1,
        boxShadow: "0 10px 30px -10px hsl(var(--foreground)/0.05)"
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative bg-card/90 backdrop-blur-sm rounded-2xl border border-primary/50 shadow-xl overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl border border-primary/30 pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>

      <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-primary/50" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-primary/50" />
    </motion.div>
  );
};

const StatCounter = ({ value, label, suffix = "", delay = 0 }: { value: string; label: string; suffix?: string; delay?: number }) => {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const numericValue = parseInt(value);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const duration = 2000;
    const end = numericValue;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, numericValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl lg:text-5xl font-light text-primary mb-2">
        {displayValue}{suffix}
      </div>
      <div className="text-xs md:text-sm font-medium text-primary/70 uppercase tracking-[0.2em]">
        {label}
      </div>
    </motion.div>
  );
};

const CTASection = () => {
  const sectionRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !isClient) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-reveal',
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

  return (
    <section
      ref={sectionRef}
      className="relative bg-background py-12 md:py-14 lg:py-16 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-30" />

      <ParallaxLayer speed={0.1} className="z-0">
        <div className="absolute top-0 right-0 w-2/5 h-full">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Modern architecture"
            fill
            quality={100}
            className="object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background to-transparent" />
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={0.15} className="z-0">
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
            alt="Architectural detail"
            fill
            quality={100}
            className="object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      </ParallaxLayer>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-30">
        <div className="max-w-3xl mx-auto text-center mb-24 cta-reveal">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-gradient-to-r from-primary/30 to-primary" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
              Limited Availability
            </span>
            <div className="w-8 h-[2px] bg-gradient-to-r from-primary to-primary/30" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight">
            Ready to transform your<br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
              exterior remodeling project?
            </span>
          </h2>

          <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto">
            Join hundreds of satisfied homeowners who trust Eagle Revolution with their most important investment.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-24 cta-reveal">
          <StatCounter value="500" suffix="+" label="Projects" delay={0.1} />
          <StatCounter value="50" suffix="+" label="Years Combined" delay={0.15} />
          <StatCounter value="100" suffix="%" label="Satisfaction" delay={0.2} />
          <StatCounter value="24" suffix="/7" label="Support" delay={0.25} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-24"
        >
          <GlassCard className="p-10 md:p-14">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                  <Icon name="Flag" className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium tracking-wider text-primary">
                    Eagle Revolution • Veteran Owned
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-tight">
                  Your vision,<br />
                  <span className="font-medium text-primary">
                    expertly crafted
                  </span>
                </h3>

                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Experience the difference of working with a veteran-owned company that prioritizes quality, integrity, and customer satisfaction above all else.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    "50-year transferable warranties",
                    "Five-Year Workmanship Guarantee",
                    "Free estimates & inspections",
                    "Easy financing options"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="Check" className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/contact"
                  className="group relative w-full px-8 py-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-medium tracking-[0.2em] uppercase rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 block text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-full"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Get Free Estimate
                      <Icon name="ArrowRight" className="w-4 h-4" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                </Link>

                <Link
                  href="/portfolio"
                  className="group relative w-full px-8 py-5 bg-card text-primary text-xs font-medium tracking-[0.2em] uppercase rounded-full border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 block text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-full"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      View Gallery
                      <Icon name="ArrowRight" className="w-4 h-4" />
                    </span>
                  </motion.div>
                </Link>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border-2 border-card flex items-center justify-center text-primary text-xs font-medium shadow-sm"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">500+</span> satisfied homeowners
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Free Consultation",
              desc: "In-depth discussion of your vision with our expert team",
              icon: "Flag",
              delay: 0.3
            },
            {
              title: "Premium Materials",
              desc: "IKO, CertainTeed, ProVia, TimberTech certified installer",
              icon: "Award",
              delay: 0.35
            },
            {
              title: "Lifetime Support",
              desc: "Dedicated customer service for the life of your project",
              icon: "Shield",
              delay: 0.4
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: item.delay }}
            >
              <GlassCard className="p-8 text-center hover:bg-card transition-all duration-500">
                <div className="text-3xl text-primary mb-4">
                  <Icon name={item.icon} className="w-10 h-10 mx-auto" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-3">{item.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-6">
                  <Link href="/services" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-xs font-medium tracking-wider uppercase transition-colors group">
                    Learn more
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;