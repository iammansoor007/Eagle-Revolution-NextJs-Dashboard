import {
    motion,
    useInView,
    useReducedMotion
} from "framer-motion";
import { useRef, useEffect, useState, useCallback, useMemo, memo } from "react";
import EagleAboutImg from "@/assets/fairabout.png";
import completeData from "../src/data/completeData.json";

const Counter = memo(({ value, suffix = "", duration = 1.8 }: { value: number; suffix?: string; duration?: number }) => {
    const ref = useRef(null);
    const [display, setDisplay] = useState(0);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const shouldReduceMotion = useReducedMotion();
    const hasAnimatedRef = useRef(false);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        if (!inView || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        if (shouldReduceMotion) {
            setDisplay(value);
            return;
        }

        let startTime: number;
        const startValue = 0;
        const endValue = value;
        const durationMs = duration * 1000;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startValue + (endValue - startValue) * eased);
            setDisplay(current);

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplay(endValue);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [inView, value, duration, shouldReduceMotion]);

    return (
        <span ref={ref} className="tabular-nums">
            {display.toLocaleString()}{suffix}
        </span>
    );
});

Counter.displayName = "Counter";

const ParticlesBackground = memo(() => {
    const particlesInit = useCallback(async (engine: any) => {
        const { loadSlim } = await import("tsparticles-slim");
        await loadSlim(engine);
    }, []);

    const options = useMemo(() => ({
        fullScreen: { enable: false },
        particles: {
            number: {
                value: 12,
                density: { enable: true, area: 800 }
            },
            color: { value: ["hsl(var(--primary))", "hsl(var(--primary)/80)"] },
            shape: { type: "circle" },
            opacity: {
                value: 0.15,
                random: true,
                animation: { enable: true, speed: 0.5, minimumValue: 0.05 }
            },
            size: {
                value: { min: 0.5, max: 2 },
                random: true,
                animation: { enable: true, speed: 2, minimumValue: 0.5 }
            },
            move: {
                enable: true,
                speed: 0.3,
                direction: "top" as const,
                random: true,
                straight: false,
                outModes: { default: "out" as const }
            },
            links: {
                enable: true,
                distance: 150,
                color: "hsl(var(--primary))",
                opacity: 0.1,
                width: 0.5
            }
        },
        detectRetina: true,
        fpsLimit: 30
    }), []);

    const [ParticlesComponent, setParticlesComponent] = useState<any>(null);

    useEffect(() => {
        import("react-tsparticles").then((module) => {
            setParticlesComponent(() => module.default);
        });
    }, []);

    if (!ParticlesComponent) return null;

    return (
        <ParticlesComponent
            id="roofing-particles"
            init={particlesInit}
            options={options}
            className="absolute inset-0 pointer-events-none"
        />
    );
});

ParticlesBackground.displayName = "ParticlesBackground";

const StatCard = memo(({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative bg-card p-4 rounded-2xl border border-border shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
        >
            <div className="relative">
                <span className="text-3xl md:text-4xl font-black text-primary">
                    <Counter value={value} suffix={suffix} />
                </span>
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary rounded-full" />
            </div>
            <p className="text-xs md:text-sm font-semibold text-muted-foreground mt-3">
                {label}
            </p>
        </motion.div>
    );
});

StatCard.displayName = "StatCard";

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { badge, headline, description, image, stats, buttons, trustBadges, coreValues } = completeData.about;

    const variants = useMemo(() => ({
        hidden: { opacity: 0, y: 30 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: custom * 0.15,
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1]
            }
        })
    }), []);

    const trustBadgesArray = useMemo(() => [
        { color: "from-primary to-primary/90", delay: 0.6, text: "Veteran Owned" },
        { color: "from-primary/90 to-primary/80", delay: 0.7, text: "Licensed" },
        { color: "from-primary/80 to-primary/70", delay: 0.8, text: "Insured" },
        { color: "from-primary/70 to-primary/60", delay: 0.9, text: "50+ Yrs Exp" }
    ], []);

    return (
        <section
            ref={sectionRef}
            className="relative bg-background overflow-hidden py-12 md:py-14 lg:py-16"
            aria-label="About Eagle Revolution"
        >
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none rotate-180">
                <svg
                    viewBox="0 0 1440 120"
                    className="relative block w-full h-[50px] sm:h-[70px] md:h-[90px]"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="premium-divider-header" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="url(#premium-divider-header)"
                        d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
                    />
                </svg>
            </div>

            <div className="absolute inset-0">
                <ParticlesBackground />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--primary)/0.02)_0%,_transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--primary)/0.02)_0%,_transparent_50%)]" />
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' patternUnits='userSpaceOnUse' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='hsl(var(--primary))' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")` }} />
            </div>

            {!shouldReduceMotion && (
                <>
                    <motion.div
                        animate={{
                            x: [0, 40, 0],
                            y: [0, -40, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -40, 0],
                            y: [0, 40, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 2
                        }}
                        className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-3xl"
                    />
                </>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
                    <motion.div
                        variants={variants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        custom={0}
                        className="relative group"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700" />

                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/50">
                            <div className="relative aspect-[4/5] lg:aspect-[3/4]">
                                <img
                                    src={EagleAboutImg}
                                    alt={image.alt}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-7000 group-hover:scale-105"
                                    loading="eager"
                                    width="800"
                                    height="1000"
                                />

                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                    className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6"
                                >
                                    <div className="bg-card/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-xl border border-border">
                                        <span className="flex items-center gap-2 text-sm font-bold text-primary">
                                            <span className="text-lg">🇺🇸</span>
                                            {image.badge}
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={variants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        custom={1}
                        className="space-y-8"
                    >
                        <motion.div
                            variants={variants}
                            custom={2}
                            className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10"
                        >
                            <span className="text-primary text-lg">⚡</span>
                            <span className="text-primary uppercase tracking-[0.2em] text-xs sm:text-sm font-bold">
                                {badge}
                            </span>
                        </motion.div>

                        <div className="space-y-4">
                            <motion.h2
                                variants={variants}
                                custom={3}
                                className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight"
                            >
                                <span className="block text-foreground">
                                    {headline.prefix}
                                </span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                                    {headline.highlight}
                                </span>
                                <span className="block text-foreground">
                                    {headline.suffix}
                                </span>
                            </motion.h2>

                            <motion.div
                                variants={variants}
                                custom={4}
                                className="w-24 h-1.5 bg-gradient-to-r from-primary to-primary/60 rounded-full"
                            />
                        </div>

                        <motion.p
                            variants={variants}
                            custom={5}
                            className="text-muted-foreground text-lg md:text-xl leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />

                        {coreValues && (
                            <motion.div
                                variants={variants}
                                custom={5.5}
                                className="flex flex-wrap gap-2 pt-2"
                            >
                                {coreValues.map((value: string) => (
                                    <span key={value} className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full border border-secondary/20">
                                        {value}
                                    </span>
                                ))}
                            </motion.div>
                        )}

                        <motion.div
                            variants={variants}
                            custom={6}
                            className="flex flex-wrap items-center gap-4 pt-2"
                        >
                            {buttons.map((button: any, idx: number) => (
                                button.primary ? (
                                    <motion.a
                                        key={idx}
                                        href={button.href}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {button.text}
                                            <svg
                                                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                />
                                            </svg>
                                        </span>
                                    </motion.a>
                                ) : (
                                    <motion.a
                                        key={idx}
                                        href={button.href}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group inline-block px-8 py-4 bg-card text-primary font-bold rounded-full border-2 border-primary/20 hover:border-primary shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <span className="flex items-center gap-2">
                                            {button.text}
                                            <svg
                                                className="w-5 h-5 group-hover:rotate-45 transition-transform"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 7l7-7M7 7l7 7M7 7h10"
                                                />
                                            </svg>
                                        </span>
                                    </motion.a>
                                )
                            ))}
                        </motion.div>

                        <motion.div
                            variants={variants}
                            custom={7}
                            className="grid grid-cols-3 gap-4 pt-8"
                        >
                            {stats.map((stat: any) => (
                                <StatCard key={stat.label} {...stat} />
                            ))}
                        </motion.div>

                        <motion.div
                            variants={variants}
                            custom={8}
                            className="flex items-center justify-between sm:justify-start sm:gap-8 pt-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {trustBadgesArray.map((badge, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, x: -20 }}
                                            animate={{ scale: 1, x: 0 }}
                                            transition={{
                                                delay: badge.delay,
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 15
                                            }}
                                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${badge.color} border-2 border-card shadow-md flex items-center justify-center text-[8px] font-bold text-primary-foreground`}
                                        >
                                            {badge.text.charAt(0)}
                                        </motion.div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-primary">{trustBadges.happyClients}+</p>
                                    <p className="text-xs text-muted-foreground">Happy Clients</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                                    <path d="M10 4a1 1 0 011 1v4.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V5a1 1 0 011-1z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-bold text-primary">{trustBadges.emergency}</p>
                                    <p className="text-xs text-muted-foreground">Emergency</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
                <svg
                    viewBox="0 0 1440 120"
                    className="relative block w-full h-[50px] sm:h-[70px] md:h-[90px]"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="premium-divider-footer" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="url(#premium-divider-footer)"
                        d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
                    />
                </svg>
            </div>
        </section>
    );
}