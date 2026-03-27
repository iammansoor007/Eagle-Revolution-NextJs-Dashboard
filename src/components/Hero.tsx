import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroBg from "@/assets/fairbg.png";
import { FiArrowRight, FiChevronDown, FiStar, FiThumbsUp } from "react-icons/fi";
import { RiBuildingLine, RiShieldCheckLine } from "react-icons/ri";
import completeData from "../src/data/completeData.json";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { badge, headlines, description, buttons, stats, promoBadge } = completeData.hero;

  useEffect(() => {
    if (!sectionRef.current) return;
    const img = sectionRef.current.querySelector(".hero-parallax-img");
    if (img) {
      gsap.to(img, {
        y: 120,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX - innerWidth / 2) * 0.015,
        y: (clientY - innerHeight / 2) * 0.015,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const iconComponents = {
    FiArrowRight: FiArrowRight,
    RiBuildingLine: RiBuildingLine,
    FiStar: FiStar,
    FiThumbsUp: FiThumbsUp,
    RiShieldCheckLine: RiShieldCheckLine
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen herooooo flex items-end overflow-hidden bg-gradient-to-br from-background via-background/95 to-background isolate md:items-center md:justify-center"
    >
      <div className="absolute inset-0 -z-10">
        <motion.img
          src={heroBg}
          alt=""
          className="hero-parallax-img w-full h-[130%] object-cover absolute -top-[15%] will-change-transform"
          style={{
            x: mousePosition.x,
            y: mousePosition.y - 20,
          }}
          transition={{ type: "spring", mass: 0.8, stiffness: 40, damping: 25 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-br z-1 opacity-50 from-primary/75 via-primary/50 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />

        <motion.div
          className="absolute top-[20%] right-[15%] w-[40rem] h-[40rem] bg-foreground/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            x: mousePosition.x * 0.3,
            y: mousePosition.y * 0.3,
          }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[10%] w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            x: mousePosition.x * -0.2,
            y: mousePosition.y * -0.2,
          }}
        />
      </div>

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="modernGrid"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#modernGrid)" />
        </svg>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[20%] right-[12%] w-40 h-40 border border-foreground/10 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.8 }}
          style={{
            x: mousePosition.x * 0.4,
            y: mousePosition.y * 0.4,
          }}
        />
        <motion.div
          className="absolute top-[12%] right-[5%] w-72 h-72 border border-foreground/5 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 1.0 }}
          style={{
            x: mousePosition.x * 0.25,
            y: mousePosition.y * 0.25,
          }}
        />
        <motion.div
          className="absolute bottom-[25%] left-[8%] w-56 h-56 border border-foreground/5 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 1.2 }}
          style={{
            x: mousePosition.x * -0.3,
            y: mousePosition.y * -0.3,
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-foreground/20 rounded-full blur-[1px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="section-padding w-full relative z-10 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto lg:mx-0 lg:max-w-6xl">
          <motion.div
            className="flex items-center gap-2 mb-2 mt-8 md:-mt-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="w-8 h-px bg-foreground/40 md:w-16" />
            <span className="font-body text-foreground/80 text-xs md:text-sm uppercase tracking-[0.3em] font-light">
              {badge}
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-7xl font-bold text-foreground mb-2 leading-[1.1] tracking-tight">
            {headlines.map((line, i) => (
              <motion.span
                key={i}
                className="block overflow-hidden"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.3 + 0.2 * i,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="text-m sm:text-l md:text-xl text-foreground/80 max-w-2xl mb-6 leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {description}
          </motion.p>

          {promoBadge && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-full px-5 py-2.5">
                <span className="text-primary text-sm font-semibold">🇺🇸</span>
                <span className="text-foreground text-sm font-medium">{promoBadge.text}</span>
                <a href="#contact" className="text-primary text-sm font-bold hover:underline">
                  {promoBadge.cta}
                </a>
              </div>
            </motion.div>
          )}

          <motion.div
            className="flex flex-col sm:flex-row gap-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            {buttons.map((button, idx) => {
              const Icon = iconComponents[button.icon as keyof typeof iconComponents];
              return button.primary ? (
                <motion.a
                  key={idx}
                  href={button.href}
                  className="group bg-primary text-primary-foreground px-8 py-4 font-medium text-lg inline-flex items-center justify-center gap-3 rounded-md hover:bg-primary/90 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  whileHover={{ scale: 1.03, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {button.text}
                  {Icon && <Icon className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />}
                </motion.a>
              ) : (
                <motion.a
                  key={idx}
                  href={button.href}
                  className="group backdrop-blur-sm bg-transparent border border-foreground/20 text-foreground px-8 py-4 font-medium text-lg inline-flex items-center justify-center gap-3 rounded-md hover:bg-foreground/10 hover:border-foreground/30 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {button.text}
                  {Icon && <Icon className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />}
                </motion.a>
              );
            })}
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-10 md:gap-14 lg:gap-20 mt-8 md:mt-12 pt-6 border-t border-foreground/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.5 }}
          >
            {stats.map((stat, idx) => {
              const StatIcon = iconComponents[stat.icon as keyof typeof iconComponents];
              return (
                <motion.div
                  key={stat.label}
                  className="flex items-center gap-4"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {StatIcon && <StatIcon className="w-7 h-7 md:w-8 md:h-8 text-foreground" />}
                  <div>
                    <span className="block font-heading text-foreground text-2xl md:text-3xl lg:text-3xl font-bold leading-tight">
                      {stat.value}
                    </span>
                    <span className="font-body text-foreground/60 text-xs uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute hidden sm:flex bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-3 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <span className="text-foreground/40 text-[10px] uppercase tracking-[0.3em] font-light">
          Discover
        </span>
        <motion.div
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiChevronDown className="w-5 h-5 text-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;