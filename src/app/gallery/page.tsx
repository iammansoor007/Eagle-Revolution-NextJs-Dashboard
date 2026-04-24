"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Import images directly - NOT wrapped in objects
import commercialroof from '../../assets/commercial-tpo.png';
import decks from '../../assets/outdoor-sitting-desk.png';
import deck3 from '../../assets/decks2 (1).jpg';
import deck2 from '../../assets/decks2 (2).jpg';
import door from "../../assets/DOORS-20260414T184740Z-3-001/DOORS/DOOR1.jpg";
import residental1 from '../../assets/roof1.jpg.jpeg';
import residental2 from '../../assets/residentalroofing2ndimage.jpg';
import siding from '../../assets/siding5.jpg.jpeg';
import windowImg from '../../assets/window5.jpeg';
import gutter from '../../assets/gutterinstallation.jpg.jpeg';
import pvc from '../../assets/pvcdecks.jpg.jpeg';
import window2 from '../../assets/windowimage.jpg';

















const imageMap: Record<string, any> = {
    commercialroof,
    decks,
    deck3,
    deck2,
    door,
    residental1,
    residental2,
    siding,
    windowImg,
    gutter,
    pvc,
    window2
};

import { useContent } from "../../hooks/useContent";

// ============================================================================
// HERO SECTION
// ============================================================================
const Hero = ({ data }: { data: any }) => {
    return (
        <section className="relative pt-8 xs:pt-10 sm:pt-12 lg:pt-16 pb-8 xs:pb-10 sm:pb-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="absolute top-1/4 -left-10 xs:-left-16 w-40 xs:w-56 sm:w-64 md:w-80 lg:w-96 h-40 xs:h-56 sm:h-64 md:h-80 lg:h-96 bg-primary/5 rounded-full blur-2xl xs:blur-3xl" />
            <div className="absolute bottom-1/4 -right-10 xs:-right-16 w-40 xs:w-56 sm:w-64 md:w-80 lg:w-96 h-40 xs:h-56 sm:h-64 md:h-80 lg:h-96 bg-primary/5 rounded-full blur-2xl xs:blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <span className="inline-block text-primary text-[8px] xs:text-[9px] sm:text-xs font-semibold uppercase tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] mb-2 xs:mb-3 sm:mb-4">
                        {data?.badge || "Our Portfolio"}
                    </span>

                    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-2 xs:mb-3 sm:mb-4 px-2"
                        dangerouslySetInnerHTML={{ __html: data?.title || 'Featured <span className="text-primary">Projects</span>' }}
                    />

                    <p className="text-muted-foreground text-[11px] xs:text-xs sm:text-sm md:text-base max-w-[280px] xs:max-w-sm sm:max-w-lg mx-auto px-2">
                        {data?.description || "A curated collection of our finest installations"}
                    </p>

                    <div className="w-12 xs:w-14 sm:w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 xs:mt-5 sm:mt-6" />
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// FILTER - FIXED STICKY BEHAVIOR
// ============================================================================
const Filter = ({
    categories,
    projects,
    activeCategory,
    onSelect
}: {
    categories: string[];
    projects: any[];
    activeCategory: string;
    onSelect: (category: string) => void
}) => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-1 xs:gap-1.5 sm:gap-2">
            {categories.map((category) => {
                const count = category === "All"
                    ? projects.length
                    : projects.filter(p => p.category === category).length;

                return (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={`relative px-2 xs:px-2.5 sm:px-4 py-1 xs:py-1.5 sm:py-2 text-[9px] xs:text-[10px] sm:text-xs font-medium transition-all duration-200 ${activeCategory === category
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <span className="flex items-center gap-0.5 xs:gap-1">
                            {category}
                            <span className={`text-[8px] xs:text-[9px] sm:text-[10px] ${activeCategory === category ? "text-primary" : "text-muted-foreground"
                                }`}>
                                ({count})
                            </span>
                        </span>
                        {activeCategory === category && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

// ============================================================================
// MASONRY CARD
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
    const [imageError, setImageError] = useState(false);

    const imageSrc = typeof project?.image === 'string' && imageMap[project.image] ? imageMap[project.image] : project?.image;

    // Validate image before rendering
    if (!imageSrc) {
        return null;
    }

    return (
        <div
            className={`group cursor-pointer relative overflow-hidden h-[220px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-auto ${getSizeClasses(project.size)}`}
            style={{
                animation: `fadeInScale 0.4s ease-out ${Math.min(index * 0.05, 0.3)}s both`
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full h-full bg-card">
                {/* Loading State */}
                {(!imageLoaded && !imageError) && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                )}

                {/* Image */}
                {!imageError && imageSrc && (
                    <Image
                        src={imageSrc}
                        alt={project.title || "Project image"}
                        fill
                        quality={100}
                        className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'
                            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        sizes="(max-width: 320px) 100vw, (max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 4}
                    />
                )}

                {/* Error State */}
                {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground text-[10px] xs:text-xs sm:text-sm">No Image</span>
                    </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Hover Overlay */}
                <div
                    className={`absolute inset-0 bg-primary transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-0'
                        }`}
                />

                {/* Featured Badge */}
                {project.featured && (
                    <div className="absolute top-2 xs:top-2.5 sm:top-3 right-2 xs:right-2.5 sm:right-3 z-10">
                        <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-primary text-primary-foreground text-[7px] xs:text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded">
                            ★ Featured
                        </span>
                    </div>
                )}

                {/* Category Tag */}
                <div className="absolute top-2 xs:top-2.5 sm:top-3 left-2 xs:left-2.5 sm:left-3 z-10">
                    <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-black/60 backdrop-blur-sm text-white text-[7px] xs:text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider rounded">
                        {project.category}
                    </span>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-2 xs:p-3 sm:p-4 z-10">
                    <div className={`transition-all duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-1'}`}>
                        <h3 className="text-white text-xs xs:text-sm sm:text-base font-semibold leading-tight mb-0.5 xs:mb-1">
                            {project.title}
                        </h3>

                        <p className={`text-white/80 text-[9px] xs:text-[10px] sm:text-xs mb-1 xs:mb-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
                            }`}>
                            {project.subtitle}
                        </p>

                        <div className={`flex items-center gap-1 xs:gap-1.5 text-white/70 text-[7px] xs:text-[8px] sm:text-[10px] transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
                            }`}>
                            <span>{project.location}</span>
                            <span className="w-0.5 xs:w-1 h-0.5 xs:h-1 bg-white/40 rounded-full" />
                            <span>{project.year}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MODAL
// ============================================================================
const Modal = ({ project, isOpen, onClose }: { project: any; isOpen: boolean; onClose: () => void }) => {
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen && typeof window !== 'undefined') {
            window.addEventListener("keydown", handleEsc);
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener("keydown", handleEsc);
            }
        };
    }, [isOpen, onClose]);

    if (!project || !isOpen) return null;
    
    const imageSrc = typeof project?.image === 'string' && imageMap[project.image] ? imageMap[project.image] : project?.image;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4"
            style={{ animation: 'fadeIn 0.2s ease-out' }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-5xl max-h-[95vh] xs:max-h-[92vh] sm:max-h-[90vh] bg-card rounded-xl xs:rounded-2xl overflow-hidden shadow-2xl border border-border"
                style={{ animation: 'scaleIn 0.3s ease-out' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 z-20 w-7 xs:w-8 sm:w-9 h-7 xs:h-8 sm:h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors border border-white/20"
                >
                    <svg className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid lg:grid-cols-2 h-full max-h-[95vh] xs:max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
                    {/* Image Section */}
                    <div className="relative h-[180px] xs:h-[220px] sm:h-[280px] lg:h-full bg-muted">
                        {(!imageLoaded && !imageError) && (
                            <div className="absolute inset-0 bg-muted animate-pulse" />
                        )}
                        {imageError ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                <span className="text-muted-foreground text-xs xs:text-sm">Image Unavailable</span>
                            </div>
                        ) : (
                            imageSrc && (
                                <Image
                                    src={imageSrc}
                                    alt={project.title || "Project image"}
                                    fill
                                    quality={100}
                                    className={`object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => setImageError(true)}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            )
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-primary/40 to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col p-3 xs:p-4 sm:p-6 lg:p-6">
                        {/* Category Badge */}
                        <span className="inline-block px-2 xs:px-2.5 py-0.5 xs:py-1 bg-primary/10 text-primary text-[8px] xs:text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider rounded-full mb-2 xs:mb-3 sm:mb-4 w-fit">
                            {project.category}
                        </span>

                        {/* Title */}
                        <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-0.5 xs:mb-1 tracking-tight">
                            {project.title}
                        </h2>

                        <p className="text-xs xs:text-sm sm:text-base text-muted-foreground mb-2 xs:mb-3 sm:mb-4">
                            {project.subtitle}
                        </p>

                        {/* Location & Year */}
                        <div className="flex items-center gap-1.5 xs:gap-2 text-muted-foreground text-[9px] xs:text-[10px] sm:text-xs mb-3 xs:mb-4">
                            <span className="flex items-center gap-0.5 xs:gap-1">
                                <svg className="w-2.5 xs:w-3 sm:w-3.5 h-2.5 xs:h-3 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {project.location}
                            </span>
                            <span className="w-0.5 xs:w-1 h-0.5 xs:h-1 bg-muted-foreground/40 rounded-full" />
                            <span>{project.year}</span>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-[10px] xs:text-xs sm:text-sm leading-relaxed mb-3 xs:mb-4 sm:mb-5">
                            {project.description}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3 mb-4 xs:mb-5 sm:mb-6">
                            {Object.entries(project.specs || {}).map(([key, value]: [string, any]) => (
                                <div key={key} className="bg-primary/5 rounded-lg xs:rounded-xl p-2 xs:p-2.5 sm:p-3 text-center border border-primary/10">
                                    <div className="text-sm xs:text-base sm:text-lg font-bold text-primary mb-0.5">
                                        {value}
                                    </div>
                                    <div className="text-[7px] xs:text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
                                        {key === "sqft" ? "Sq Ft" : key === "duration" ? "Duration" : "Warranty"}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => {
                                onClose();
                                router.push("/contact");
                            }}
                            className="w-full inline-flex items-center justify-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg xs:rounded-xl text-[11px] xs:text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors mt-auto"
                        >
                            <span>Inquire About This Project</span>
                            <svg className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN PAGE - WITH FIXED STICKY FILTER
// ============================================================================
export default function GalleryPage() {
    const { galleryPage } = useContent();
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isFilterSticky, setIsFilterSticky] = useState(false);

    const categories = galleryPage?.categories || ["All"];
    const projects = galleryPage?.projects || [];

    const filteredProjects = useMemo(() => {
        if (activeCategory === "All") return projects;
        return projects.filter((p: any) => p.category === activeCategory);
    }, [activeCategory, projects]);

    // Handle sticky filter on scroll
    useEffect(() => {
        // Check if window is defined (client-side)
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsFilterSticky(scrollPosition > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <main className="relative min-h-screen bg-background">
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                /* Custom breakpoints for extra small screens */
                @media (min-width: 320px) {
                    .xs\\:block { display: block; }
                    .xs\\:inline-block { display: inline-block; }
                    .xs\\:flex { display: flex; }
                    .xs\\:grid { display: grid; }
                    .xs\\:hidden { display: none; }
                }
            `}</style>

            <Hero data={galleryPage?.header || {}} />

            {/* Filter Bar - Fixed sticky behavior */}
            <div
                className={`transition-all duration-300 ${isFilterSticky
                    ? 'sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm'
                    : 'relative z-30 bg-background border-b border-border'
                    }`}
            >
                <div className="py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 sm:px-4">
                    <div className="max-w-7xl mx-auto">
                        <Filter
                            categories={categories}
                            projects={projects}
                            activeCategory={activeCategory}
                            onSelect={setActiveCategory}
                        />
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <section className="px-0 pb-8 xs:pb-12 sm:pb-16">
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px] xl:auto-rows-[240px] grid-flow-dense gap-0">
                    {filteredProjects.map((project: any, i: number) => (
                        <MasonryCard
                            key={project.id || i}
                            project={project}
                            index={i}
                            onClick={() => setSelectedProject(project)}
                        />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-16 xs:py-20 sm:py-24 md:py-32 px-4">
                        <p className="text-muted-foreground text-xs xs:text-sm sm:text-base mb-2 xs:mb-3">
                            No projects found in this category
                        </p>
                        <button
                            onClick={() => setActiveCategory("All")}
                            className="text-primary text-[10px] xs:text-xs sm:text-sm font-medium hover:underline"
                        >
                            View all projects
                        </button>
                    </div>
                )}
            </section>

            <Modal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </main>
    );
}