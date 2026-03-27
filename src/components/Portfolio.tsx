import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import completeData from "../src/data/completeData.json";

gsap.registerPlugin(ScrollTrigger);

const imageMap = {
  portfolio1,
  portfolio2,
  portfolio3,
  portfolio4,
  portfolio5
};

const MarqueeItem = ({ project }: { project: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.1 });

  const rotateX = useTransform(springY, [-0.4, 0.4], [3, -3]);
  const rotateY = useTransform(springX, [-0.4, 0.4], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!itemRef.current || !isHovered) return;
    const rect = (itemRef.current as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / rect.width - 0.5) * 0.4;
    const yPct = (mouseY / rect.height - 0.5) * 0.4;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      ref={itemRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }}
      onMouseMove={handleMouseMove}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformPerspective: 1200,
        scale: isHovered ? 1.02 : 1,
      }}
      className="relative w-[200px] sm:w-[240px] md:w-[280px] h-[280px] sm:h-[320px] md:h-[360px] flex-shrink-0 cursor-pointer will-change-transform transition-transform duration-300"
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl shadow-gray-300/50">
        <img
          src={imageMap[project.image as keyof typeof imageMap]}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)'
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />

        <motion.div
          className="absolute inset-0 bg-primary/20 mix-blend-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {isHovered && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
        )}

        <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
          <span className="inline-flex items-center gap-2 bg-secondary/40 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/30 w-fit mb-1 sm:mb-2">
            <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gradient-to-r ${project.accent}`} />
            <span className="text-[8px] sm:text-[10px] font-semibold tracking-wider text-white">
              {project.category}
            </span>
          </span>

          <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 sm:mb-1 leading-tight">
            {project.title}
          </h3>

          <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-[10px] sm:text-xs mb-0.5 sm:mb-1">
            <span className="truncate max-w-[80px] sm:max-w-none">{project.location}</span>
            <span className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-white/30" />
            <span>{project.year}</span>
          </div>

          <AnimatePresence mode="wait">
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="text-white/80 text-[8px] sm:text-[10px] leading-relaxed mb-1 sm:mb-2 line-clamp-2">
                  {project.desc}
                </p>
                <div className="flex items-center justify-between">
                  <div className="hidden xs:block">
                    <span className="text-white/40 text-[6px] sm:text-[8px] uppercase">Architect</span>
                    <p className="text-white text-[8px] sm:text-[10px] font-light truncate max-w-[80px] sm:max-w-none">
                      {project.architect}
                    </p>
                  </div>
                  <motion.button
                    className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/30 backdrop-blur-sm rounded-lg text-white text-[8px] sm:text-[10px] font-medium flex items-center gap-0.5 sm:gap-1 hover:bg-primary/50 transition-colors border border-primary/30"
                    whileHover={{ x: 3 }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    View
                    <svg
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 text-white/20 text-2xl sm:text-3xl font-black">
          {project.number}
        </div>
      </div>
    </motion.div>
  );
};

const InfiniteMarquee = ({ projects, direction = "left", speed = 45 }: { projects: any[]; direction?: string; speed?: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const marqueeRef = useRef(null);
  const animationRef = useRef<any>(null);

  const infiniteProjects = useMemo(() => {
    return [...projects, ...projects, ...projects, ...projects, ...projects];
  }, [projects]);

  useEffect(() => {
    if (!marqueeRef.current) return;

    const marquee = marqueeRef.current;
    const itemWidth = window.innerWidth < 640 ? 216 : window.innerWidth < 768 ? 256 : 296;
    const totalWidth = itemWidth * projects.length;
    const distance = direction === "left" ? -totalWidth : totalWidth;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    gsap.set(marquee, {
      x: direction === "left" ? 0 : -totalWidth
    });

    animationRef.current = gsap.to(marquee, {
      x: distance,
      duration: speed * (projects.length / 3),
      repeat: -1,
      ease: "none",
      modifiers: {
        x: (x: string) => {
          const value = parseFloat(x);
          if (direction === "left") {
            return value <= -totalWidth ? `${value + totalWidth}px` : `${value}px`;
          } else {
            return value >= 0 ? `${value - totalWidth}px` : `${value}px`;
          }
        }
      }
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [direction, speed, projects]);

  useEffect(() => {
    if (!animationRef.current) return;
    if (isHovered) {
      animationRef.current.pause();
    } else {
      animationRef.current.resume();
    }
  }, [isHovered]);

  return (
    <div
      className="relative overflow-hidden py-3 sm:py-4 md:py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 xs:w-20 sm:w-24 md:w-32 lg:w-40 z-20 pointer-events-none bg-gradient-to-r from-background via-background/90 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-16 xs:w-20 sm:w-24 md:w-32 lg:w-40 z-20 pointer-events-none bg-gradient-to-l from-background via-background/90 to-transparent" />

      <div className="absolute inset-x-0 top-0 h-6 sm:h-8 md:h-12 z-20 pointer-events-none bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-6 sm:h-8 md:h-12 z-20 pointer-events-none bg-gradient-to-t from-background to-transparent" />

      <div
        ref={marqueeRef}
        className="flex gap-2 sm:gap-3 md:gap-4"
        style={{
          willChange: 'transform',
          display: 'flex',
          flexWrap: 'nowrap',
        }}
      >
        {infiniteProjects.map((project, index) => (
          <MarqueeItem
            key={`${project.number}-${index}`}
            project={project}
          />
        ))}
      </div>
    </div>
  );
};

const PremiumLightbox = ({ image, onClose }: { image: any; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-secondary/98 backdrop-blur-xl flex items-center justify-center cursor-pointer p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 z-50 bg-gradient-to-r from-primary to-primary/80 backdrop-blur-md border border-primary/30 rounded-full px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 text-primary-foreground text-[10px] sm:text-xs font-medium hover:from-primary/90 hover:to-primary/70 transition-all"
        onClick={onClose}
      >
        Close
      </motion.button>

      <motion.img
        src={image}
        alt="Project preview"
        className="max-w-full max-h-[90vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
      />
    </motion.div>
  );
};

const Portfolio = () => {
  const sectionRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.001
  });

  const headerParallax = useTransform(smoothProgress, [0, 1], [0, -30]);

  const { section, projects, button } = completeData.portfolio;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const row1 = projects.slice(0, 3);
  const row2 = projects.slice(2, 5);

  return (
    <section
      ref={sectionRef}
      className="relative bg-background overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

        <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-20" />
        <div className="absolute inset-x-0 bottom-20 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-20" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] opacity-10 sm:opacity-15 md:opacity-20" />

        <div className="hidden sm:block absolute top-40 -left-20 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute bottom-40 -right-20 w-[250px] sm:w-[400px] md:w-[500px] h-[250px] sm:h-[400px] md:h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <motion.div
          style={{ y: headerParallax }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
            <div className="w-8 sm:w-10 md:w-12 h-0.5 bg-gradient-to-r from-primary to-primary/60" />
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase text-primary">
              {section.badge}
            </span>
            <div className="w-8 sm:w-10 md:w-12 h-0.5 bg-gradient-to-l from-primary to-primary/60" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] tracking-tight px-2"
            dangerouslySetInnerHTML={{ __html: section.headline }}
          />
        </motion.div>

        <div className="space-y-1 sm:space-y-2 md:space-y-0">
          <InfiniteMarquee projects={row1} direction="left" speed={45} />
          <InfiniteMarquee projects={row2} direction="right" speed={40} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mt-8 sm:mt-10 md:mt-12"
        >
          <button
            onClick={() => setLightbox(portfolio1)}
            className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs sm:text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1 sm:gap-2 hover:scale-105 hover:from-primary/90 hover:to-primary/70"
          >
            {button.text}
            <svg
              width="14"
              height="14"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <PremiumLightbox
            image={lightbox}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          className="relative block w-full h-8 sm:h-10 md:h-12 lg:h-16"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#portfolioWave)"
            d="M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,37.3C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"
          />
          <defs>
            <linearGradient id="portfolioWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Portfolio;