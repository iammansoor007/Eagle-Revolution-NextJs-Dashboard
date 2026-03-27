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
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Minus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Document: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Chat: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Roof: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 10L12 3L21 10L18 13L12 8L6 13L3 10Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 13V19H18V13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7v7c0 5.5 10 8 10 8s10-2.5 10-8V7l-10-5z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Storm: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 14.5C4 16.985 6.015 19 8.5 19h7c2.485 0 4.5-2.015 4.5-4.5S17.985 10 15.5 10H14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10L8 13H12L10 16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 5L9 8H14L12 11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  DocumentCheck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 15l2 2 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Tools: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M14.7 6.3L19 2L22 5L17.7 9.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.3 17.7L5 22L2 19L6.3 14.7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 8L8 16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 10L12 3L21 10L18 13L12 8L6 13L3 10Z" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Layout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 3v18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  TreePine: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 10h3l-4 6h5l-3 6h14l-3-6h5l-4-6h3l-8-8z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
};

const iconMap = {
  Home: Icons.Home,
  Tools: Icons.Tools,
  Shield: Icons.Shield,
  Storm: Icons.Storm,
  Layout: Icons.Layout,
  TreePine: Icons.TreePine
};

const SubtleBackground = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }}
    />
    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-primary/5 to-transparent" />
    <motion.div
      animate={{
        x: [0, 20, 0, -20, 0],
        y: [0, -15, 25, 15, 0],
      }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute top-40 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
    />
  </div>
);

const FloatingParticles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 h-0.5 bg-primary/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0, 0.2, 0],
        }}
        transition={{
          duration: 6 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const AccordionItem = ({ item, index, isOpen, onToggle }: { item: any; index: number; isOpen: boolean; onToggle: (index: number) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 30, damping: 10 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 10 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = (buttonRef.current as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(50);
    mouseY.set(50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="relative group"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#liquidGradient)"
          opacity={isHovered ? 0.08 : 0.03}
          style={{
            x: useTransform(springX, [0, 100], [-5, 5]),
            y: useTransform(springY, [0, 100], [-5, 5]),
          }}
          transition={{ duration: 0.3 }}
        />
        <defs>
          <radialGradient id="liquidGradient">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          </radialGradient>
        </defs>
      </svg>

      <motion.div
        className="absolute -left-8 top-1/2 -translate-y-1/2 hidden lg:block"
        animate={isHovered ? {
          x: -5,
          scale: 1.1,
          opacity: 0.8
        } : {
          x: 0,
          scale: 1,
          opacity: 0.4
        }}
        transition={{ duration: 0.3 }}
      >
        <span className={`
          text-[90px] font-black leading-none tracking-tighter
          ${isOpen ? 'text-primary/15' : 'text-muted-foreground/20'}
          transition-colors duration-500
        `}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      <div
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`
          relative bg-card/90 backdrop-blur-sm rounded-2xl
          border transition-all duration-500
          ${isOpen
            ? 'border-primary/30 shadow-2xl shadow-primary/15'
            : 'border-primary/10 hover:border-primary/20 shadow-lg shadow-primary/5'
          }
        `}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.rect
            x="2"
            y="2"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="1.2"
            strokeDasharray="6 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isHovered ? {
              pathLength: 1,
              opacity: 0.6
            } : {
              pathLength: 0,
              opacity: 0
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary)/80)" />
            </linearGradient>
          </defs>
        </svg>

        {isHovered && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full z-20"
                style={{
                  background: i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/80)',
                  boxShadow: `0 0 8px ${i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/80)'}`,
                }}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 0.6
                }}
                animate={{
                  x: [`50%`, `${20 + (i * 10)}%`],
                  y: [`50%`, `${15 + (i * 12)}%`],
                  scale: [0, 2, 0],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}

        <button
          onClick={() => onToggle(index)}
          className="w-full text-left p-7 md:p-9 focus:outline-none relative z-10"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between gap-6">
            <h3 className={`
              text-base md:text-lg lg:text-xl font-light transition-all duration-500
              ${isOpen
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 font-medium'
                : 'text-card-foreground group-hover:text-card-foreground/90'
              }
            `}>
              {item.question}
            </h3>

            <div className="relative flex-shrink-0">
              <motion.div
                animate={isOpen ? {
                  rotate: 180,
                  scale: 1.1,
                  backgroundColor: 'hsl(var(--primary))',
                  borderColor: 'hsl(var(--primary))',
                } : {
                  rotate: 0,
                  scale: 1,
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full border-2
                  flex items-center justify-center
                  transition-all duration-500
                  ${isOpen ? 'bg-primary border-primary' : 'bg-background'}
                `}
              >
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
                >
                  <motion.path
                    d={isOpen ? "M5 12h14" : "M12 5v14M5 12h14"}
                    stroke={isOpen ? 'white' : isHovered ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    animate={isOpen ? {
                      d: "M5 12h14"
                    } : {
                      d: "M12 5v14M5 12h14"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.svg>
              </motion.div>

              {isOpen && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0, 0.4]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="overflow-hidden"
            >
              <div className="px-7 md:px-9 pb-7 md:pb-9">
                <div className="relative pl-6 border-l-2 border-primary/20">
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5">
                    {item.answer}
                  </p>

                  {item.metadata && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                      {item.metadata.map((meta: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="w-1 h-1 bg-primary rounded-full" />
                          <span className="text-muted-foreground">{meta.label}:</span>
                          <span className="font-medium text-card-foreground">{meta.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {item.links && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap items-center gap-4 pt-4 border-t border-primary/10"
                    >
                      {item.links.map((link: any, i: number) => (
                        <motion.a
                          key={i}
                          href={link.url}
                          whileHover={{ x: 5 }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
                        >
                          <span>{link.label}</span>
                          <motion.svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="group-hover:translate-x-1 transition-transform"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                          </motion.svg>
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2"
          animate={isHovered ? {
            width: 14,
            height: 14,
            borderColor: 'hsl(var(--primary)/0.5)'
          } : {
            width: 24,
            height: 24,
            borderColor: 'hsl(var(--primary)/0.2)'
          }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2"
          animate={isHovered ? {
            width: 14,
            height: 14,
            borderColor: 'hsl(var(--primary)/0.5)'
          } : {
            width: 24,
            height: 24,
            borderColor: 'hsl(var(--primary)/0.2)'
          }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
};

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: { categories: any[]; activeCategory: string; onCategoryChange: (id: string) => void }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      {categories.map((category, index) => {
        const CategoryIcon = category.icon ? iconMap[category.icon as keyof typeof iconMap] : null;
        return (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onCategoryChange(category.id)}
            className={`
              relative px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300
              ${activeCategory === category.id
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-card-foreground bg-card/50 hover:bg-primary/5'
              }
            `}
          >
            {activeCategory === category.id && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {CategoryIcon && <CategoryIcon />}
              {category.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`
        relative w-full max-w-md transition-all duration-300
        ${isFocused ? 'scale-[1.02]' : 'scale-100'}
      `}
    >
      <div className={`
        relative flex items-center bg-card rounded-full border transition-all duration-300
        ${isFocused
          ? 'border-primary shadow-lg shadow-primary/10'
          : 'border-border hover:border-border/80 shadow-md'
        }
      `}>
        <div className="absolute left-4 text-muted-foreground">
          <Icons.Search />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search questions..."
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-transparent rounded-full text-sm md:text-base text-card-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        {isFocused && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute right-3 text-xs text-muted-foreground"
          >
            ⏎
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const KnowledgeCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { knowledgeCard } = completeData.faq;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <motion.div
        animate={isHovered ? {
          rotateX: 2,
          rotateY: 2,
          scale: 1.02,
          boxShadow: "0 30px 60px -15px hsl(var(--primary)/0.3)"
        } : {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          boxShadow: "0 20px 40px -15px hsl(var(--primary)/0.15)"
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-10 overflow-hidden"
        style={{ transformPerspective: 1000 }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                initial={{ x: '50%', y: '50%', scale: 0 }}
                animate={{
                  x: [`50%`, `${20 + i * 12}%`],
                  y: [`50%`, `${15 + i * 10}%`],
                  scale: [0, 2.5, 0],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 2.2,
                  delay: i * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <motion.div
              animate={isHovered ? {
                rotate: 360,
                scale: 1.2,
                backgroundColor: 'rgba(255,255,255,0.15)'
              } : {
                rotate: 0,
                scale: 1,
                backgroundColor: 'rgba(255,255,255,0.1)'
              }}
              transition={{ duration: 0.8 }}
              className="w-16 h-16 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20"
            >
              <Icons.Chat />
            </motion.div>

            <div>
              <h4 className="text-xl md:text-2xl font-semibold text-white mb-2">
                {knowledgeCard.title}
              </h4>
              <p className="text-white/80 text-base md:text-lg">
                {knowledgeCard.description}
              </p>
            </div>
          </div>

          <motion.a
            href={knowledgeCard.buttonLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-7 py-3.5 md:px-8 md:py-4 bg-white text-primary text-xs md:text-sm font-medium rounded-full shadow-2xl overflow-hidden group/btn whitespace-nowrap"
          >
            <span className="relative z-10 flex items-center gap-2">
              {knowledgeCard.buttonText}
              <motion.svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                animate={isHovered ? { x: 5 } : { x: 0 }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" />
              </motion.svg>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-50 to-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.a>
        </div>

        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-white/20" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-white/20" />
      </motion.div>
    </motion.div>
  );
};

const FAQ = () => {
  const sectionRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [openItems, setOpenItems] = useState<number[]>([0]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { section, categories, items, knowledgeCard } = completeData.faq;

  const filteredItems = items.filter((item: any) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggle = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setOpenItems([]);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !isClient) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
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
      className="relative bg-background py-20 md:py-24 lg:py-28 overflow-hidden"
    >
      <SubtleBackground />
      <FloatingParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 faq-reveal">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-3 block">
            {section.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-4">
            {section.headline}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            {section.description}
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/60 mx-auto mt-6 rounded-full" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10 md:mb-12 faq-reveal">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="space-y-3 md:space-y-4 mb-12 md:mb-16">
          {filteredItems.length > 0 ? (
            filteredItems.map((item: any, index: number) => (
              <AccordionItem
                key={item.id}
                item={item}
                index={index}
                isOpen={openItems.includes(index)}
                onToggle={() => handleToggle(index)}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-muted-foreground mb-3">
                <Icons.Document />
              </div>
              <p className="text-muted-foreground text-base">
                No questions found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-sm text-primary hover:text-primary/80 underline underline-offset-4"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>

        <KnowledgeCard />
      </div>
    </section>
  );
};

export default FAQ;