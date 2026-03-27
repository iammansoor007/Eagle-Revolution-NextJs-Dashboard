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
import completeData from "../src/data/completeData.json";

gsap.registerPlugin(ScrollTrigger);

const Images = {
  Hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  Pattern: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  Abstract: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
};

const Icons = {
  Linkedin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 8h4v12H4V8z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 8h4v2c.6-.8 1.5-2 3-2 2.5 0 4 1.5 4 4v8h-4v-6c0-1.5-.5-2-2-2s-2 .5-2 2v6h-4V8z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Twitter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.8 9 5-.2-2.2.6-4.5 2.5-6 2.5-2 6-1.5 7.5 1 1.1-.2 2.2-.6 3-1 0 0-.5 1.7-2 3 1.1-.1 2-.5 3-1 0 0-.5 1.6-2 3z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Instagram: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  ),
  Facebook: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Google: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10c2.4 0 4.6-.85 6.3-2.28l-2.5-2.5c-.97.58-2.1.9-3.3.9-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6h-3l4 4 4-4h-3z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 7l-10 7L2 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Location: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
    </svg>
  ),
  Infinity: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M13.833 9.167C14.5 8.5 15.3 8 16.5 8C18.5 8 20 9.5 20 12C20 14.5 18.5 16 16.5 16C14.5 16 13 14.5 13 12C13 9.5 11.5 8 9.5 8C7.5 8 6 9.5 6 12C6 14.5 7.5 16 9.5 16C10.7 16 11.5 15.5 12.167 14.833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Roofing: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 10L12 3L21 10L18 13L12 8L6 13L3 10Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 13V19H18V13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Inspection: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Repair: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M16 4L20 8L12 16H8V12L16 4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20H20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Replacement: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M20 12H4M12 4v16M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Residential: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 10L12 3L21 10L18 13L12 8L6 13L3 10Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 13V19H16V13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Commercial: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="8" width="16" height="12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8V4H16V8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Emergency: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Maintenance: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Warranty: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15 9H22L17 14L19 21L12 17L5 21L7 14L2 9H9L12 2Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Financing: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  CreditCard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Image: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 16l-4-4-5 5-3-3-6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  FileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Star: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
};

const iconMap = {
  Repair: Icons.Repair,
  Replacement: Icons.Replacement,
  Inspection: Icons.Inspection,
  Maintenance: Icons.Maintenance,
  Residential: Icons.Residential,
  Commercial: Icons.Commercial,
  Emergency: Icons.Emergency,
  Roofing: Icons.Roofing,
  Warranty: Icons.Warranty,
  Financing: Icons.Financing,
  CreditCard: Icons.CreditCard,
  Image: Icons.Image,
  FileText: Icons.FileText,
  Star: Icons.Star,
  Linkedin: Icons.Linkedin,
  Twitter: Icons.Twitter,
  Instagram: Icons.Instagram,
  Facebook: Icons.Facebook,
  Google: Icons.Google
};

const ParallaxLayer = ({ children, speed = 0.05, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={`absolute inset-0 will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

const QuantumParticles = () => {
  const particles = [...Array(20)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 0.5,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.2 + 0.05,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 15, -15, 10, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative flex items-center bg-muted backdrop-blur-sm rounded-full border transition-all duration-500
          ${isFocused
            ? 'border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.1)]'
            : 'border-border hover:border-border/80'
          }
        `}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            required
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-full hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
          >
            Subscribe
            <Icons.ArrowRight />
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {isSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-0 right-0 text-center"
          >
            <span className="text-xs text-primary">
              ✓ Thank you for subscribing
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceLinks = () => {
  const { services } = completeData.footer;

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2">
        <Icons.Sparkle />
        {services.title}
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {services.main.map((service: any) => {
          const ServiceIcon = iconMap[service.icon as keyof typeof iconMap] || Icons.Roofing;
          return (
            <motion.a
              key={service.label}
              href={service.href}
              whileHover={{ x: 5 }}
              className="inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group py-1"
            >
              <span className="text-muted-foreground/60 group-hover:text-primary transition-colors">
                <ServiceIcon />
              </span>
              <span>{service.label}</span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

const MaterialsSection = () => {
  const { services } = completeData.footer;

  return (
    <div className="space-y-3 mt-4">
      <h5 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary/60">
        {services.materials.title}
      </h5>
      <div className="space-y-2">
        {services.materials.items.map((material: any) => (
          <motion.a
            key={material.label}
            href={material.href}
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary/80 transition-colors"
          >
            <span className="text-[8px] text-primary/40">●</span>
            {material.label}
          </motion.a>
        ))}
      </div>
    </div>
  );
};

const ContactInfo = () => {
  const { contact } = completeData.footer;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2">
          <Icons.Sparkle />
          {contact.title}
        </h4>
        <div className="space-y-4">
          <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
            <span className="text-muted-foreground/60 group-hover:text-primary">
              <Icons.Mail />
            </span>
            {contact.email}
          </a>
          <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
            <span className="text-muted-foreground/60 group-hover:text-primary">
              <Icons.Phone />
            </span>
            {contact.phone}
          </a>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="text-muted-foreground/60">
              <Icons.Location />
            </span>
            <span>{contact.address}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="text-muted-foreground/60">
              <Icons.Infinity />
            </span>
            <span>{contact.emergency}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary/60">
          Service Areas
        </h5>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {contact.areas}
        </p>
      </div>
    </div>
  );
};

const CertificationsGrid = () => {
  const { certifications } = completeData.footer;

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {certifications.map((cert: any, i: number) => {
        const CertIcon = iconMap[cert.icon as keyof typeof iconMap] || Icons.Warranty;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="relative p-3 bg-muted backdrop-blur-sm rounded-lg border border-border hover:border-primary/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground/60 group-hover:text-primary transition-colors">
                <CertIcon />
              </span>
              <div>
                <span className="text-xs font-mono text-primary/80">{cert.cert}</span>
                <p className="text-[10px] text-muted-foreground">{cert.number}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const SocialLinks = () => {
  const { social } = completeData.footer;

  return (
    <div className="flex items-center gap-3">
      {social.map((socialItem: any) => {
        const SocialIcon = iconMap[socialItem.icon as keyof typeof iconMap] || Icons.Linkedin;
        return (
          <motion.a
            key={socialItem.platform}
            href={socialItem.href}
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 group"
            aria-label={socialItem.platform}
          >
            <SocialIcon />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20 blur-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        );
      })}
    </div>
  );
};

const LegacyMarquee = () => {
  const { marquee } = completeData.footer;

  return (
    <div className="relative overflow-hidden py-8 border-t border-border">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 mx-8 group">
            <span className="text-xs font-mono text-primary/40 group-hover:text-primary transition-colors duration-300">
              <Icons.Sparkle />
            </span>
            <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-muted-foreground transition-colors duration-300">
              {marquee.texts[0]}
            </span>
            <span className="text-xs font-mono text-primary/40 group-hover:text-primary transition-colors duration-300">
              <Icons.Sparkle />
            </span>
            <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-muted-foreground transition-colors duration-300">
              {marquee.texts[1]}
            </span>
            <span className="text-xs font-mono text-primary/40 group-hover:text-primary transition-colors duration-300">
              <Icons.Sparkle />
            </span>
            <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-muted-foreground transition-colors duration-300">
              {marquee.texts[2]}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Footer = () => {
  const sectionRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  const { company, quickLinks, bottom, hours } = completeData.footer;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !isClient) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isClient]);

  if (!isClient) return null;

  return (
    <footer
      ref={sectionRef}
      className="relative bg-background overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent opacity-60 blur-3xl" />

      <ParallaxLayer speed={0.03} className="z-0">
        <div className="absolute top-40 right-0 w-2/5 h-2/5">
          <img
            src={Images.Abstract}
            alt="Abstract architecture"
            className="w-full h-full object-cover opacity-[0.02]"
          />
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={0.05} className="z-0">
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3">
          <img
            src={Images.Pattern}
            alt="Heritage pattern"
            className="w-full h-full object-cover opacity-[0.02]"
          />
        </div>
      </ParallaxLayer>

      <QuantumParticles />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-24 pb-16 border-b border-border">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30">
                  <span className="text-primary-foreground font-bold text-sm text-center leading-tight">ER</span>
                </div>
                <div>
                  <span className="text-foreground font-light text-lg block">{company.name}</span>
                  <span className="text-[10px] text-primary/60 font-mono tracking-wider">{company.tagline}</span>
                </div>
              </div>

              <p className="text-muted-foreground text-xs leading-relaxed">
                {company.description}
              </p>

              <SocialLinks />
            </motion.div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                Subscribe to insights
              </h4>
              <NewsletterForm />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {quickLinks.map((link: any) => {
                const LinkIcon = iconMap[link.icon as keyof typeof iconMap] || Icons.Warranty;
                return (
                  <a key={link.label} href={link.href} className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <LinkIcon /> {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <ServiceLinks />
            <MaterialsSection />
          </div>

          <div className="lg:col-span-4">
            <ContactInfo />

            {hours && (
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2 mb-3">
                  <Icons.Sparkle />
                  Office Hours
                </h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>{hours.monday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>{hours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>{hours.sunday}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2 mb-3">
                <Icons.Sparkle />
                Certifications & Accreditations
              </h4>
              <CertificationsGrid />
            </div>
          </div>
        </div>

        <LegacyMarquee />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{bottom.copyright}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{bottom.rights}</span>
          </div>
          <div className="flex items-center gap-6">
            {bottom.links.map((link: any) => (
              <a key={link.label} href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
            ))}
          </div>
          <div className="text-muted-foreground/60">
            <span className="font-mono">{bottom.tagline}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          className="relative block w-full h-20 md:h-24"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#footerWave)"
            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
          <defs>
            <linearGradient id="footerWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;