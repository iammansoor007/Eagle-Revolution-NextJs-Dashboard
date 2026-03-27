import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import completeData from "../src/data/completeData.json";

gsap.registerPlugin(ScrollTrigger);

const Icons = {
  Quote: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-primary">
      <path d="M10 11H6V7H10V11Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 11H14V7H18V11Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Verified: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Play: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="1.5" />
      <path d="M16 12L10 16V8L16 12Z" fill="white" />
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary">
      <path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary">
      <path d="M5 12H19M19 12L13 18M19 12L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Google: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10c2.4 0 4.6-.85 6.3-2.28l-2.5-2.5c-.97.58-2.1.9-3.3.9-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6h-3l4 4 4-4h-3z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Star: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
    </svg>
  )
};

const VideoModal = ({ isOpen, onClose, videoId, title }: { isOpen: boolean; onClose: () => void; videoId: string; title: string }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/95 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
        >
          <Icons.Close />
        </motion.button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative w-full max-w-5xl aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0`}
            title={title || "YouTube video player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const VideoThumbnailCard = ({ video, onClick }: { video: any; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="relative group cursor-pointer"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative aspect-video rounded-lg md:rounded-xl overflow-hidden bg-muted shadow-md">
        <img
          src={imageError ? 'https://via.placeholder.com/320x180?text=Eagle+Revolution' : `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
          alt={video.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center transform transition-transform group-hover:scale-110">
              <Icons.Play />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
          <div className="flex items-center gap-2 text-white/90 text-xs">
            <span>{video.duration}</span>
            {video.views && (
              <>
                <span>•</span>
                <span>{formatViews(video.views)} views</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 md:mt-3">
        <h4 className="font-semibold text-foreground text-sm md:text-base line-clamp-1">{video.name}</h4>
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{video.title}</p>
      </div>
    </motion.div>
  );
};

const TestimonialCard = ({ testimonial, isActive = false, onPlayVideo }: { testimonial: any; isActive?: boolean; onPlayVideo: (videoId: string, title: string) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(springY, [-0.2, 0.2], [1, -1]);
  const rotateY = useTransform(springX, [-0.2, 0.2], [-1, 1]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return;
    if (!cardRef.current) return;
    const rect = (cardRef.current as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / rect.width - 0.5) * 0.05;
    const yPct = (mouseY / rect.height - 0.5) * 0.05;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX: window.innerWidth >= 768 ? rotateX : 0,
        rotateY: window.innerWidth >= 768 ? rotateY : 0,
        transformPerspective: 1000,
      }}
      className="relative w-full mx-auto"
    >
      <div className={`
        relative bg-card rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10
        border transition-all duration-300
        min-h-[320px] md:min-h-[360px] lg:min-h-[400px]
        flex flex-col
        ${isActive
          ? 'border-primary/30 shadow-xl shadow-primary/10'
          : 'border-primary/10 shadow-lg shadow-primary/5'
        }
      `}>
        <div className="mb-4 md:mb-6 text-primary/40 flex-shrink-0">
          <Icons.Quote />
        </div>

        <div className="flex-1 overflow-y-auto mb-4 md:mb-6 pr-2 custom-scrollbar">
          <p className="text-foreground/80 text-base md:text-lg lg:text-xl leading-relaxed font-light">
            "{testimonial.text}"
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 flex-shrink-0 mt-auto">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-md" />
              <div className="relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-primary font-medium text-sm md:text-base lg:text-lg">
                {testimonial.avatar}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                <h4 className="font-semibold text-foreground text-sm md:text-base lg:text-lg truncate">
                  {testimonial.name}
                </h4>
                <span className="text-primary flex-shrink-0">
                  <Icons.Verified />
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {testimonial.position}, {testimonial.company}
              </p>
            </div>
          </div>

          {testimonial.videoId && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPlayVideo(testimonial.videoId, testimonial.name)}
              className="relative group flex-shrink-0"
            >
              <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center">
                <Icons.Play />
              </div>
            </motion.button>
          )}
        </div>

        <div className="absolute top-4 right-4 md:top-6 md:right-6 w-6 h-6 md:w-8 md:h-8 border-t border-r border-primary/20" />
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-6 h-6 md:w-8 md:h-8 border-b border-l border-primary/20" />
      </div>
    </motion.div>
  );
};

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: hsl(var(--muted));
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: hsl(var(--primary));
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary)/0.8);
  }
`;

const Testimonials = () => {
  const sectionRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const { section, testimonials, videos, stats } = completeData.testimonials;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = scrollbarStyles;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const handlePlayVideo = (videoId: string, title: string) => {
    setSelectedVideo(videoId);
    setSelectedVideoTitle(title);
    setShowVideoModal(true);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !isClient) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-element',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
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
    <>
      <section
        ref={sectionRef}
        className="relative bg-background py-12 md:py-16 lg:py-20 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12 lg:mb-16 reveal-element">
            <span className="text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2 md:mb-3 block">
              {section.badge}
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-3 md:mb-4">
              {section.headline}
            </h2>

            <p className="text-sm md:text-base lg:text-lg text-muted-foreground px-4">
              {section.description}
            </p>

            <div className="flex items-center justify-center gap-2 mt-3 md:mt-4">
              <Icons.Google />
              <span className="text-xs md:text-sm text-muted-foreground">{section.featured}</span>
            </div>

            <div className="w-12 md:w-16 h-0.5 bg-gradient-to-r from-primary to-primary/60 mx-auto mt-4 md:mt-6 rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto mb-12 md:mb-16 lg:mb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TestimonialCard
                  testimonial={testimonials[activeIndex]}
                  isActive={true}
                  onPlayVideo={handlePlayVideo}
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-4 md:mt-6">
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-mono font-medium text-primary">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-xs md:text-sm font-mono text-border">/</span>
                <span className="text-xs md:text-sm font-mono text-muted-foreground">
                  {String(testimonials.length).padStart(2, '0')}
                </span>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-primary/20 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <Icons.ArrowLeft />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-primary/20 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <Icons.ArrowRight />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="mb-12 md:mb-16 lg:mb-20 reveal-element">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-4 md:w-6 h-px bg-gradient-to-r from-primary to-primary/60" />
              <span className="text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
                Customer Stories
              </span>
              <span className="text-[10px] md:text-xs text-primary ml-auto md:ml-2">{stats.totalVideos} reviews on Google</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {videos.map((video: any) => (
                <VideoThumbnailCard
                  key={video.id}
                  video={video}
                  onClick={() => handlePlayVideo(video.videoId, video.title)}
                />
              ))}
            </div>

            <div className="text-center mt-4 md:mt-6">
              <a
                href="https://g.page/r/eaglerevolution"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs md:text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Icons.Google />
                Read all {stats.totalVideos} reviews on Google
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4 pt-4 md:pt-6 mt-4 md:mt-6 border-t border-primary/10 reveal-element">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex -space-x-2">
                {testimonials.slice(0, 4).map((t: any, i: number) => (
                  <div
                    key={i}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border-2 border-card flex items-center justify-center text-primary text-[8px] md:text-xs font-medium shadow-sm"
                  >
                    {t.avatar}
                  </div>
                ))}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{stats.subscribers}</span> 5-star reviews
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
              <span className="text-muted-foreground">
                <span className="text-primary font-semibold">{stats.views}</span> total views
              </span>
              <span className="w-px h-3 md:h-4 bg-primary/20" />
              <span className="text-muted-foreground">
                <span className="text-primary font-semibold">Veteran Owned</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoId={selectedVideo || ""}
        title={selectedVideoTitle || ""}
      />
    </>
  );
};

export default Testimonials;