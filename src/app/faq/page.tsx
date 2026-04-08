"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Icon } from "../../config/icons";
import { useContent } from "../../hooks/useContent";
import Link from "next/link";

// Subtle Background - Static for performance
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
    </div>
);

// Accordion Item
const AccordionItem = ({
    item,
    index,
    isOpen,
    onToggle,
    searchHighlight
}: {
    item: any;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
    searchHighlight?: string;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const itemRef = useRef(null);
    const isInView = useInView(itemRef, { once: true, margin: "-30px" });

    const highlightText = (text: string, query?: string) => {
        if (!query || !text) return text;
        try {
            const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
            return parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ?
                    <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">{part}</mark> : part
            );
        } catch (error) {
            return text;
        }
    };

    return (
        <motion.div
            ref={itemRef}
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.4,
                delay: Math.min(index * 0.05, 0.3),
                ease: [0.25, 0.1, 0.25, 1]
            }}
            className="relative group"
        >
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
          relative bg-card/90 backdrop-blur-sm rounded-2xl
          border transition-all duration-300
          ${isOpen
                        ? 'border-primary/30 shadow-2xl shadow-primary/15'
                        : 'border-primary/10 hover:border-primary/20 shadow-lg shadow-primary/5'
                    }
        `}
            >
                <button
                    onClick={() => onToggle()}
                    className="w-full text-left p-7 md:p-9 focus:outline-none relative z-10"
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-sm font-mono text-primary/40">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                {item.category && item.category !== 'all' && item.category !== 'allquestion' && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                        {item.category}
                                    </span>
                                )}
                            </div>
                            <h3 className={`
                text-base md:text-lg lg:text-xl font-light transition-all duration-300
                ${isOpen
                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 font-medium'
                                    : 'text-card-foreground group-hover:text-card-foreground/90'
                                }
              `}>
                                {searchHighlight ? highlightText(item.question, searchHighlight) : item.question}
                            </h3>
                        </div>

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
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full border-2
                  flex items-center justify-center
                  transition-all duration-300
                  ${isOpen ? 'bg-primary border-primary' : 'bg-background'}
                `}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                >
                                    <path
                                        d={isOpen ? "M5 12h14" : "M12 5v14M5 12h14"}
                                        stroke={isOpen ? 'white' : isHovered ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </motion.div>
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
                                duration: 0.3,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="overflow-hidden"
                        >
                            <div className="px-7 md:px-9 pb-7 md:pb-9">
                                <div className="relative pl-6 border-l-2 border-primary/20">
                                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5">
                                        {searchHighlight ? highlightText(item.answer, searchHighlight) : item.answer}
                                    </p>

                                    {item.metadata && item.metadata.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                                            {item.metadata.map((meta: any, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 + i * 0.05 }}
                                                    className="flex items-center gap-2 text-xs"
                                                >
                                                    <span className="w-1 h-1 bg-primary rounded-full" />
                                                    <span className="text-muted-foreground">{meta.label}:</span>
                                                    <span className="font-medium text-card-foreground">{meta.value}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {item.links && item.links.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 }}
                                            className="flex flex-wrap items-center gap-4 pt-4 border-t border-primary/10"
                                        >
                                            {item.links.map((link: any, i: number) => (
                                                <motion.a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ x: 5 }}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
                                                >
                                                    <span>{link.label}</span>
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        className="group-hover:translate-x-1 transition-transform"
                                                    >
                                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                                                    </svg>
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
                    transition={{ duration: 0.2 }}
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
                    transition={{ duration: 0.2 }}
                />
            </div>
        </motion.div>
    );
};

// Category Filter - Fixed: No duplicate "All"
const CategoryFilter = ({
    categories,
    activeCategory,
    onCategoryChange
}: {
    categories: any[];
    activeCategory: string;
    onCategoryChange: (id: string) => void
}) => {
    // Filter out any duplicate 'all' or 'allquestion' categories
    const uniqueCategories = useMemo(() => {
        const seen = new Set();
        return categories.filter(cat => {
            const id = cat.id;
            if (seen.has(id) || id === 'allquestion') return false;
            seen.add(id);
            return true;
        });
    }, [categories]);

    return (
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {uniqueCategories.map((category) => {
                return (
                    <motion.button
                        key={category.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => onCategoryChange(category.id)}
                        className={`
              relative px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200
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
                                transition={{ type: "spring", stiffness: 500, damping: 40, duration: 0.2 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            {category.icon && <Icon name={category.icon} className="w-4 h-4" />}
                            {category.label}
                            {category.count !== undefined && category.id !== 'all' && (
                                <span className="text-xs opacity-70">({category.count})</span>
                            )}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
};

// Search Bar
const SearchBar = ({
    onSearch,
    searchQuery
}: {
    onSearch: (query: string) => void;
    searchQuery: string;
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Debounce search to prevent excessive filtering
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(localQuery);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [localQuery, onSearch]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md"
        >
            <div className={`
        relative flex items-center bg-card rounded-full border transition-all duration-200
        ${isFocused
                    ? 'border-primary shadow-lg shadow-primary/10'
                    : 'border-border hover:border-border/80 shadow-md'
                }
      `}>
                <div className="absolute left-4 text-muted-foreground">
                    <Icon name="Search" className="w-5 h-5" />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search questions..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-transparent rounded-full text-sm md:text-base text-card-foreground placeholder:text-muted-foreground focus:outline-none"
                />

                {localQuery && (
                    <button
                        onClick={() => {
                            setLocalQuery('');
                            onSearch('');
                            if (inputRef.current) inputRef.current.focus();
                        }}
                        className="absolute right-3 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>
        </motion.div>
    );
};

const AwardCTABanner = () => {
    const { whyChooseUs } = useContent();
    
    // Add null check for whyChooseUs
    if (!whyChooseUs || !whyChooseUs.cta) {
        return null;
    }
    
    const { cta } = whyChooseUs;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mt-20 overflow-hidden"
        >
            <div className="relative bg-card border border-border rounded-2xl">
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rotate-12"
                        animate={{ rotate: [12, 15, 12] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 -rotate-12"
                        animate={{ rotate: [-12, -15, -12] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                </div>

                <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/30" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/30" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30" />

                <div className="relative px-8 py-16 md:px-20 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-10 z-30">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <span className="w-8 h-[2px] bg-primary" />
                            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">
                                {cta.badge}
                            </span>
                        </motion.div>

                        <h3
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight"
                            dangerouslySetInnerHTML={{ __html: cta.title }}
                        />

                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
                            {cta.description}
                        </p>

                        {cta.trustBadges && cta.trustBadges.length > 0 && (
                            <div className="flex items-center gap-6 mt-6">
                                {cta.trustBadges.map((badge: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        <span className="text-xs text-muted-foreground">{badge}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cta.buttons && cta.buttons.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            {cta.buttons.map((button: any, idx: number) => (
                                <motion.a
                                    key={idx}
                                    href={button.href}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative px-8 py-4 bg-white text-primary border-2 border-primary font-bold rounded-full shadow-sm hover:bg-primary hover:text-white hover:shadow-md transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 group"
                                >
                                    <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                                        {button.text}
                                        <motion.svg
                                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </motion.svg>
                                    </span>
                                </motion.a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Main FAQ Page Component
export default function FAQPage() {
    const { faq } = useContent();
    const sectionRef = useRef(null);
    const [openItems, setOpenItems] = useState<number[]>([0]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Handle mounting to prevent hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Add null check for faq
    if (!faq) {
        return (
            <section className="relative bg-background py-20 md:py-24 lg:py-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Loading FAQ content...</p>
                    </div>
                </div>
            </section>
        );
    }

    const { section, categories = [], items = [] } = faq;

    // Get categories with counts - fix duplicate all issue
    const categoriesWithCounts = useMemo(() => {
        if (!categories.length) return [{ id: 'all', label: 'All Questions', icon: 'Grid' }];
        
        // Filter out invalid categories and create a Set to track unique IDs
        const validCategories = categories.filter((cat: any) => cat && cat.id);
        const uniqueIds = new Set();
        const uniqueCategories = validCategories.filter((cat: any) => {
            if (uniqueIds.has(cat.id)) return false;
            uniqueIds.add(cat.id);
            return true;
        });
        
        const catsWithCounts = uniqueCategories.map((cat: any) => ({
            ...cat,
            count: items.filter((item: any) => item && item.category === cat.id).length
        }));
        
        // Check if 'all' already exists
        const hasAllCategory = catsWithCounts.some((cat: any) => cat.id === 'all');
        
        if (!hasAllCategory) {
            return [{ id: 'all', label: 'All Questions', icon: 'Grid' }, ...catsWithCounts];
        }
        
        return catsWithCounts;
    }, [categories, items]);

    // Filter items with null checks
    const filteredItems = useMemo(() => {
        if (!items.length) return [];
        
        return items.filter((item: any) => {
            if (!item) return false;
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            const matchesSearch = searchQuery === '' ||
                (item.question && item.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.answer && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [items, activeCategory, searchQuery]);

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

    // Handle hash navigation
    useEffect(() => {
        if (!isMounted) return;
        
        const hash = window.location.hash.slice(1);
        if (hash && items.length) {
            const index = items.findIndex((item: any) => item && item.id === hash);
            if (index !== -1) {
                setOpenItems([index]);
                setTimeout(() => {
                    const element = document.getElementById(`faq-${hash}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        }
    }, [items, isMounted]);

    if (!isMounted) {
        return null;
    }

    return (
        <section
            ref={sectionRef}
            className="relative bg-background py-20 md:py-24 lg:py-28 overflow-hidden min-h-screen"
        >
            <SubtleBackground />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
                    {section?.badge && (
                        <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-3 block">
                            {section.badge}
                        </span>
                    )}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-4">
                        {section?.headline || "Frequently Asked Questions"}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        {section?.description || "Find answers to common questions about our services"}
                    </p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/60 mx-auto mt-6 rounded-full" />
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10 md:mb-12">
                    <CategoryFilter
                        categories={categoriesWithCounts}
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                    <SearchBar onSearch={setSearchQuery} searchQuery={searchQuery} />
                </div>

                <div className="space-y-3 md:space-y-4 mb-12 md:mb-16">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item: any, index: number) => (
                            <div key={item.id || index} id={`faq-${item.id || index}`}>
                                <AccordionItem
                                    item={item}
                                    index={index}
                                    isOpen={openItems.includes(index)}
                                    onToggle={() => handleToggle(index)}
                                    searchHighlight={searchQuery}
                                />
                            </div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-center py-16"
                        >
                            <div className="text-muted-foreground mb-3">
                                <Icon name="FileText" className="w-12 h-12 mx-auto opacity-50" />
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

                {/* Contact Section */}
                <AwardCTABanner />
            </div>
        </section>
    );
}