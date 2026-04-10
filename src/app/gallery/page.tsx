"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import project1 from '../../assets/portfolio1.png';
import project2 from '../../assets/portfolio2.jpg';
import project3 from '../../assets/portfolio3.jpg';
import project4 from '../../assets/portfolio4.jpg';
import project5 from '../../assets/portfolio5.jpg';
import project6 from '../../assets/portfolio7.jpg';

// ============================================================================
// ROOFING PROJECT DATA
// ============================================================================
const CATEGORIES = ["All", "Residential", "Commercial", "Storm", "Premium", "Metal"];

const PROJECTS = [
    {
        id: 1,
        title: "Presidential TL",
        subtitle: "Luxury Estate",
        category: "Premium",
        location: "Highland Park, TX",
        year: "2024",
        description: "GAF Presidential TL shingles with copper flashing and premium ventilation system. This luxury estate features architectural excellence and superior weather protection.",
        image: project1,
        featured: true,
        size: "large",
        specs: { sqft: "4,200", duration: "6 days", warranty: "50 Year" },
    },
    {
        id: 2,
        title: "Meridian Complex",
        subtitle: "Commercial TPO",
        category: "Commercial",
        location: "Plano, TX",
        year: "2024",
        description: "80mil TPO membrane with tapered insulation and 20-year warranty. Energy-efficient white membrane reduces cooling costs.",
        image: project2,
        featured: true,
        size: "wide",
        specs: { sqft: "28,000", duration: "18 days", warranty: "20 Year" },
    },
    {
        id: 3,
        title: "Storm Restoration",
        subtitle: "Insurance Claim",
        category: "Storm",
        location: "Frisco, TX",
        year: "2024",
        description: "Complete replacement due to hail damage with insurance coordination.",
        image: project3,
        featured: false,
        size: "tall",
        specs: { sqft: "3,100", duration: "3 days", warranty: "Lifetime" },
    },
    {
        id: 4,
        title: "Standing Seam",
        subtitle: "Metal Roofing",
        category: "Metal",
        location: "Prosper, TX",
        year: "2023",
        description: "24-gauge standing seam with hidden fasteners and snow guards.",
        image: project4,
        featured: false,
        size: "normal",
        specs: { sqft: "3,800", duration: "7 days", warranty: "40 Year" },
    },
    {
        id: 5,
        title: "Windsor Hills",
        subtitle: "Architectural Shingles",
        category: "Residential",
        location: "McKinney, TX",
        year: "2024",
        description: "GAF Timberline HDZ with ridge vent and premium underlayment.",
        image: project5,
        featured: true,
        size: "tall",
        specs: { sqft: "2,800", duration: "4 days", warranty: "Lifetime" },
    },
    {
        id: 6,
        title: "Distribution Hub",
        subtitle: "Industrial TPO",
        category: "Commercial",
        location: "Garland, TX",
        year: "2023",
        description: "Large-scale TPO with custom drainage and HVAC integration.",
        image: project6,
        featured: false,
        size: "wide",
        specs: { sqft: "45,000", duration: "22 days", warranty: "25 Year" },
    },
    {
        id: 7,
        title: "Synthetic Slate",
        subtitle: "DaVinci Collection",
        category: "Premium",
        location: "Southlake, TX",
        year: "2024",
        description: "DaVinci synthetic slate with authentic appearance and durability.",
        image: project1,
        featured: true,
        size: "large",
        specs: { sqft: "5,100", duration: "8 days", warranty: "50 Year" },
    },
    {
        id: 8,
        title: "Emergency Response",
        subtitle: "Storm Repair",
        category: "Storm",
        location: "Allen, TX",
        year: "2024",
        description: "24-hour emergency tarping and permanent wind damage repair.",
        image: project2,
        featured: false,
        size: "normal",
        specs: { sqft: "2,400", duration: "2 days", warranty: "Lifetime" },
    },
    {
        id: 9,
        title: "Copper Accents",
        subtitle: "Custom Metalwork",
        category: "Residential",
        location: "University Park, TX",
        year: "2023",
        description: "Custom copper flashing and decorative bay window roofs.",
        image: project3,
        featured: false,
        size: "tall",
        specs: { sqft: "3,300", duration: "6 days", warranty: "Lifetime" },
    },
    {
        id: 10,
        title: "Lakefront Estate",
        subtitle: "Premium Installation",
        category: "Premium",
        location: "Austin, TX",
        year: "2024",
        description: "Custom architectural roofing with premium underlayment system.",
        image: project4,
        featured: false,
        size: "normal",
        specs: { sqft: "3,600", duration: "5 days", warranty: "50 Year" },
    },
    {
        id: 11,
        title: "Retail Center",
        subtitle: "Commercial Flat Roof",
        category: "Commercial",
        location: "Dallas, TX",
        year: "2023",
        description: "Multi-unit retail center with TPO roofing system.",
        image: project5,
        featured: false,
        size: "wide",
        specs: { sqft: "32,000", duration: "20 days", warranty: "20 Year" },
    },
    {
        id: 12,
        title: "Heritage Home",
        subtitle: "Historic Restoration",
        category: "Residential",
        location: "Fort Worth, TX",
        year: "2024",
        description: "Period-appropriate roofing restoration with modern protection.",
        image: project6,
        featured: false,
        size: "normal",
        specs: { sqft: "2,900", duration: "5 days", warranty: "Lifetime" },
    },
];

// ============================================================================
// CLEAN HERO
// ============================================================================
const CleanHero = () => {
    return (
        <section className="relative p-4 sm:p-6 lg:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="inline-block text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] mb-3 sm:mb-4"
                    >
                        Our Portfolio
                    </motion.span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-3 sm:mb-4">
                        Featured <span className="text-primary">Projects</span>
                    </h1>

                    <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
                        A curated collection of our finest roofing installations across Texas
                    </p>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6"
                    />
                </motion.div>
            </div>
        </section>
    );
};

// ============================================================================
// MINIMAL FILTER
// ============================================================================
const MinimalFilter = ({ categories, activeCategory, onSelect }: { categories: string[]; activeCategory: string; onSelect: (category: string) => void }) => {
    const allCategories = ["All", ...categories.filter(c => c !== "All")];

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {allCategories.map((category) => (
                <motion.button
                    key={category}
                    onClick={() => onSelect(category)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${activeCategory === category
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    {category}
                    {activeCategory === category && (
                        <motion.div
                            layoutId="activeFilter"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                </motion.button>
            ))}
        </div>
    );
};

// ============================================================================
// DENSE MASONRY CARD - NO EMPTY SPACES
// ============================================================================
const getSizeClasses = (size: string) => {
    switch (size) {
        case 'large': return 'lg:col-span-2 lg:row-span-2';
        case 'wide': return 'lg:col-span-2';
        case 'tall': return 'lg:row-span-2';
        default: return '';
    }
};

const MasonryCard = ({ project, index, onClick }: { project: any; index: number; onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
            className={`group cursor-pointer relative overflow-hidden h-[300px] sm:h-[350px] lg:h-auto ${getSizeClasses(project.size)}`}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full h-full bg-card/60">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                )}

                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={`object-cover group-hover:scale-105 transition-transform duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 4}
                />

                {/* Always-visible dark gradient at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Hover brand overlay */}
                <motion.div
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent"
                />

                {/* Category tag — top left */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider">
                        {project.category}
                    </span>
                </div>

                {/* Title always visible at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 z-10">
                    <h3 className="text-white text-sm sm:text-base font-semibold leading-tight">{project.title}</h3>
                    <motion.div
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
                        transition={{ duration: 0.25 }}
                    >
                        <p className="text-white/80 text-xs mt-0.5">{project.subtitle}</p>
                        <div className="text-white/60 text-[10px] mt-1 flex items-center gap-1.5">
                            <span>{project.location}</span>
                            <span className="w-1 h-1 bg-white/40 rounded-full" />
                            <span>{project.year}</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// PREMIUM MODAL - LIGHT MODE EDITORIAL STYLE
// ============================================================================
const EditorialModal = ({ project, isOpen, onClose }: { project: any; isOpen: boolean; onClose: () => void }) => {
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/95 backdrop-blur-xl"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 40, stiffness: 400 }}
                        className="relative w-full max-w-5xl max-h-[90vh] bg-card rounded-2xl overflow-hidden border border-border shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-foreground/5 hover:bg-foreground/10 backdrop-blur-sm flex items-center justify-center transition-all border border-border group"
                        >
                            <svg className="w-4 h-4 text-foreground group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>

                        <div className="grid md:grid-cols-2 h-full">
                            {/* Image Side */}
                            <div className="relative h-[250px] sm:h-[300px] md:h-full bg-muted">
                                {!imageLoaded && (
                                    <div className="absolute inset-0 bg-muted animate-pulse" />
                                )}
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className={`object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setImageLoaded(true)}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-primary/30 via-primary/15 to-transparent" />
                            </div>

                            {/* Content Side */}
                            <div className="p-5 sm:p-6 md:p-8 flex flex-col overflow-y-auto">
                                <div>
                                    <span className="inline-block px-2.5 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-semibold uppercase tracking-wider mb-4">
                                        {project.category}
                                    </span>

                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 tracking-tight">
                                        {project.title}
                                    </h2>

                                    <p className="text-base sm:text-lg text-muted-foreground mb-3">
                                        {project.subtitle}
                                    </p>

                                    <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-5">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {project.location}
                                        </span>
                                        <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                                        <span>{project.year}</span>
                                    </div>

                                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                        {project.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                                    {Object.entries(project.specs).map(([key, value]: [string, any], i) => (
                                        <motion.div
                                            key={key}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-primary/5 rounded-xl p-3 text-center border border-primary/10"
                                        >
                                            <div className="text-lg sm:text-xl font-bold text-primary mb-0.5">{value}</div>
                                            <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                                {key === "sqft" ? "Sq Ft" : key === "duration" ? "Duration" : "Warranty"}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    onClick={() => {
                                        onClose();
                                        router.push("/contact");
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-all group w-full sm:w-fit shadow-md shadow-primary/25"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Inquire About This Project
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const filteredProjects = useMemo(() => {
        if (activeCategory === "All") return PROJECTS;
        return PROJECTS.filter(p => p.category === activeCategory);
    }, [activeCategory]);

    return (
        <main className="relative min-h-screen bg-background">
            <CleanHero />

            {/* Sticky Filter — offset by navbar height (sticky top-0 on navbar) */}
            <section className="sticky top-[57px] sm:top-[65px] z-30 py-3 px-3 bg-background/90 backdrop-blur-xl border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <MinimalFilter
                        categories={CATEGORIES}
                        activeCategory={activeCategory}
                        onSelect={setActiveCategory}
                    />
                </div>
            </section>

            {/* Editorial Gallery Grid — grid-flow-dense + gap-0 */}
            <section className="px-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px] grid-flow-dense gap-0">
                    {filteredProjects.map((project, i) => (
                        <MasonryCard
                            key={project.id}
                            project={project}
                            index={i}
                            onClick={() => setSelectedProject(project)}
                        />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-32">
                        <p className="text-muted-foreground text-base">No projects found.</p>
                        <button
                            onClick={() => setActiveCategory("All")}
                            className="mt-3 text-primary text-sm font-medium hover:underline"
                        >
                            View all projects
                        </button>
                    </div>
                )}
            </section>

            <EditorialModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </main >
    );
}