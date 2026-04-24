import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "../config/icons";
import { useContent } from "../hooks/useContent";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
        onClick={onClose}
      >
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        >
          <Icon name="X" className="w-6 h-6 text-white" />
        </motion.button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&color=white`}
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

const VideoThumbnailCard = ({ video, onClick, index }: { video: any; onClick: () => void; index: number }) => {
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-lg">
        <motion.div
          className="w-full h-full relative"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <Image
            src={imageError ? 'https://via.placeholder.com/320x180?text=Eagle+Revolution' : `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
            alt={video.name}
            fill
            quality={100}
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized={!imageError} // YouTube thumbnails often need unoptimized if they error on Next.js proxy
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <div className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center transform transition-transform group-hover:scale-110">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-primary border-b-[8px] border-b-transparent ml-1" />
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-white text-xs">
            <span className="px-2 py-1 bg-black/50 rounded-md backdrop-blur-sm">{video.duration}</span>
            {video.views && (
              <>
                <span>•</span>
                <span className="px-2 py-1 bg-black/50 rounded-md backdrop-blur-sm">{formatViews(video.views)} views</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {video.name}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{video.title}</p>
      </div>
    </motion.div>
  );
};

const TestimonialCard = ({ testimonial, onPlayVideo, isActive }: { testimonial: any; onPlayVideo: (videoId: string, title: string) => void; isActive?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-0.3, 0.3], [2, -2]);
  const rotateY = useTransform(springX, [-0.3, 0.3], [-2, 2]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024) return;
    if (!cardRef.current) return;
    const rect = (cardRef.current as HTMLElement).getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
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
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className="relative w-full"
    >
      <motion.div
        className={`
          relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm
          rounded-2xl p-8 lg:p-10
          border transition-all duration-500
          min-h-[400px] lg:min-h-[440px]
          flex flex-col
          ${isActive
            ? 'border-primary/40 shadow-2xl shadow-primary/20'
            : 'border-primary/10 shadow-xl hover:shadow-2xl'
          }
        `}
        animate={{
          boxShadow: isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 30px -15px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="mb-6 relative">
          <Icon name="Quote" className="w-12 h-12 text-primary/30" />
        </div>

        <div className="flex-1 mb-6 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-foreground/90 text-lg lg:text-xl leading-relaxed font-light">
            "{testimonial.text}"
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-primary/10">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-md opacity-50" />
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                {testimonial.avatar}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-foreground text-base lg:text-lg truncate">
                  {testimonial.name}
                </h4>
                <span className="flex-shrink-0">
                  <Icon name="Verified" className="w-5 h-5 text-primary" />
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {testimonial.position}, {testimonial.company}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="Star" className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
            </div>
          </div>

          {testimonial.videoId && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPlayVideo(testimonial.videoId, testimonial.name)}
              className="relative group flex-shrink-0"
            >
              <div className="absolute inset-0 bg-white rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity" />
              <div className="relative w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5" />
              </div>
            </motion.button>
          )}
        </div>

        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-primary/20" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-primary/20" />
      </motion.div>
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
  const { testimonials: testimonialsData } = useContent();
  const sectionRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const { section, testimonials, videos, stats } = testimonialsData;

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

  const nextTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  useEffect(() => {
    if (isAutoPlaying && testimonials.length > 0) {
      autoPlayRef.current = setInterval(() => {
        nextTestimonial();
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, nextTestimonial, testimonials.length]);

  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextTestimonial();
      }, 5000);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !isClient) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-element',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isClient]);


  // if (!isClient) return null;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative bg-background py-20 md:py-28 lg:py-32 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 1px, transparent 1px, transparent 40px),
                  repeating-linear-gradient(135deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 1px, transparent 1px, transparent 40px)
                `,
              }}
            />
          </div>

          <motion.div
            animate={{
              x: [0, 100, 0, -100, 0],
              y: [0, -50, 100, 50, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
          />

          <motion.div
            animate={{
              x: [0, -100, 50, 100, 0],
              y: [0, 50, -100, -50, 0],
            }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 reveal-element">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-primary">
                {section.badge}
              </span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              {section.headline}
            </h2>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {section.description}
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-card/50 rounded-full border border-primary/10">
                <Icon name="Google" className="w-5 h-5" />
                <span className="text-xs text-muted-foreground">{section.featured}</span>
              </div>
              <div className="w-px h-4 bg-primary/20" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="Star" className="w-4 h-4 text-primary fill-primary" />
                ))}
                <span className="text-xs font-medium text-foreground ml-1">{stats.subscribers}</span>
              </div>
            </div>

            <div className="w-20 h-0.5 bg-gradient-to-r from-primary to-primary/40 mx-auto mt-8 rounded-full" />
          </div>

          <div className="max-w-5xl mx-auto mb-16 lg:mb-20 reveal-element">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                >
                  <TestimonialCard
                    testimonial={testimonials[activeIndex]}
                    onPlayVideo={handlePlayVideo}
                    isActive={true}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mono font-bold text-primary">
                      {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">/</span>
                    <span className="text-sm font-mono text-muted-foreground">
                      {String(testimonials.length).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="w-px h-6 bg-primary/20 mx-2" />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAutoPlay}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-primary/10 hover:border-primary/30 transition-all"
                  >
                    {isAutoPlaying ? <Icon name="Pause" className="w-4 h-4" /> : <Icon name="Play" className="w-4 h-4" />}
                    <span className="text-xs text-muted-foreground">
                      {isAutoPlaying ? 'Auto' : 'Manual'}
                    </span>
                  </motion.button>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevTestimonial}
                    className="w-10 h-10 rounded-full border border-primary/20 bg-card/50 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <Icon name="ChevronLeft" className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextTestimonial}
                    className="w-10 h-10 rounded-full border border-primary/20 bg-card/50 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <Icon name="ChevronRight" className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="absolute -bottom-12 left-0 right-0">
                <div className="flex gap-1 justify-center">
                  {(testimonials as any[]).map((_: any, idx: number) => (
                    <motion.button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className="group cursor-pointer"
                    >
                      <div
                        className={`
                          h-1 rounded-full transition-all duration-300
                          ${idx === activeIndex
                            ? 'w-8 bg-primary'
                            : 'w-4 bg-primary/20 group-hover:bg-primary/40'
                          }
                        `}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {videos && videos.length > 0 && (
            <div className="mb-16 reveal-element">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-primary to-primary/60" />
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
                  Customer Stories
                </span>
                <span className="text-xs text-primary ml-auto">{stats.totalVideos}+ video testimonials</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                {videos.map((video: any, idx: number) => (
                  <VideoThumbnailCard
                    key={video.id}
                    video={video}
                    index={idx}
                    onClick={() => handlePlayVideo(video.videoId, video.title)}
                  />
                ))}
              </div>

              <motion.div className="text-center mt-6" whileHover={{ scale: 1.02 }}>
                <a
                  href="https://g.page/r/eaglerevolution"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
                >
                  <Icon name="Google" className="w-5 h-5" />
                  Read all {stats.totalVideos}+ reviews on Google
                  <Icon name="ArrowRight" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-primary/10 reveal-element">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {testimonials.slice(0, 5).map((t: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-card flex items-center justify-center text-primary text-xs font-medium shadow-sm"
                  >
                    {t.avatar}
                  </motion.div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{stats.subscribers}+</span> satisfied customers
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">Veteran Owned Business</span>
              </div>
              <div className="w-px h-4 bg-primary/20" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="Star" className="w-4 h-4 text-primary fill-primary" />
                ))}
                <span className="font-semibold text-foreground ml-1">5.0</span>
              </div>
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