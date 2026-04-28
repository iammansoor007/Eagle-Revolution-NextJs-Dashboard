import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "../config/icons";
import { useContent } from "../hooks/useContent";
import brandonImg from "@/assets/ownerupdatedimage.jpeg";

gsap.registerPlugin(ScrollTrigger);

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

const CeoPortrait = () => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const ceo = (useContent().leadership as any).ceo || { image: {}, alt: '', badges: { top: '', bottom: '' } };

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
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/20 to-primary/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-700" />

        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/50 h-[500px] md:h-[600px]">
          {ceo.image?.src ? (
            ceo.image.src.startsWith('http') || ceo.image.src.startsWith('/uploads') ? (
              <img
                src={ceo.image.src}
                alt={ceo.alt || "CEO"}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={ceo.image.src}
                alt={ceo.alt || "CEO"}
                className="object-cover"
                fill
                quality={100}
              />
            )
          ) : (
            <Image
              src={brandonImg}
              alt={ceo.alt || "CEO"}
              className="object-cover"
              fill
              quality={100}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              fill="none"
              stroke="url(#ceoGradient)"
              strokeWidth="1.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isHovered ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
            <defs>
              <linearGradient id="ceoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
          className="absolute top-6 left-6 z-10"
        >
          <div className="bg-card/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-xl border border-border">
            <span className="flex items-center gap-2 text-xs font-bold text-primary">
              <Icon name="Flag" className="w-4 h-4" />
              {ceo.badges.top}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="absolute bottom-6 right-6 z-10"
        >
          <div className="bg-card/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-xl border border-border">
            <span className="flex items-center gap-2 text-xs font-bold text-primary">
              <Icon name="Award" className="w-4 h-4" />
              {ceo.badges.bottom}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Leadership = () => {
  const { leadership } = useContent();
  const sectionRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  const section = (leadership as any).section || { badge: '', headline: '', description: '' };
  const ceo = (leadership as any).ceo || { name: '', title: '', image: {}, alt: '', badges: { top: '', bottom: '' }, quotes: [], description: [], socials: [] };

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
    <section
      ref={sectionRef}
      className="relative bg-background py-16 md:py-24 lg:py-32 overflow-hidden"
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

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/5 to-transparent opacity-60 blur-3xl" />

      <ParallaxLayer speed={0.05} className="z-0">
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2">
          <Image
            src="https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Heritage pattern"
            fill
            quality={100}
            className="object-cover opacity-[0.02]"
          />
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={0.08} className="z-0">
        <div className="absolute top-20 left-0 w-1/4 h-1/3">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
            alt="Studio"
            fill
            quality={100}
            className="object-cover opacity-[0.02]"
          />
        </div>
      </ParallaxLayer>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-30">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 leadership-reveal">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-gradient-to-r from-primary/30 to-primary" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
              {section.badge}
            </span>
            <div className="w-8 h-[2px] bg-gradient-to-r from-primary to-primary/30" />
          </div>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight"
            dangerouslySetInnerHTML={{ __html: section.headline }}
          />

          <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto">
            {section.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-start">
          <div className="leadership-reveal lg:sticky lg:top-24">
            <CeoPortrait />
          </div>

          <div className="space-y-10 leadership-reveal">
            <div>
              <h3 className="text-3xl md:text-4xl font-light text-foreground mb-4">
                {ceo.name}
                <span className="block text-sm font-mono text-primary mt-2 tracking-[0.2em] uppercase">
                  {ceo.title}
                </span>
              </h3>

              <div className="mt-8 relative">
                <div className="absolute -left-4 -top-2 text-primary/20">
                  <Icon name="Quote" className="w-10 h-10" />
                </div>
                {ceo.quotes.map((quote: string, idx: number) => (
                  <p key={idx} className="text-foreground text-lg md:text-xl font-medium leading-relaxed pl-8">
                    &ldquo;{quote}&rdquo;
                  </p>
                ))}
              </div>

              <div className="mt-8 space-y-5">
                {ceo.description.map((desc: string, idx: number) => (
                  <p key={idx} className="text-muted-foreground text-base md:text-lg leading-relaxed">
                    {desc}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-10 pt-4 border-t border-border">
                {(ceo.socials || []).map((social: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Link
                      href={social.url}
                      className="p-3 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                      aria-label={social.icon}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon name={social.icon} className="w-5 h-5" />
                      </motion.div>
                    </Link>
                    {social.label && (
                      <span className="text-sm text-muted-foreground break-all">
                        {social.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;