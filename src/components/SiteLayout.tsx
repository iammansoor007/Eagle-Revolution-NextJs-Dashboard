"use client";

import { useGlobalLoading } from "./LoadingContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import LoadingScreen from "./LoadingScreen";
import { AnimatePresence, motion, easeOut } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { hasLoaded, setHasLoaded } = useGlobalLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Failsafe: Ensure the site is visible after a maximum delay
    if (!hasLoaded) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasLoaded, setHasLoaded]);

  const isSplashPhase = !hasLoaded;

  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // If we are on an admin route, we completely bypass the standard SiteLayout wrapper (Navbar, Footer, loading screen)
  if (isAdmin) {
    return <div className="relative min-h-screen bg-[#080808]">{children}</div>;
  }

  return (
    <div className="relative min-h-screen bg-background">
      <AnimatePresence>
        {isSplashPhase && mounted && (
          <LoadingScreen onComplete={() => setHasLoaded(true)} key="loader" />
        )}
      </AnimatePresence>

      <div className="relative min-h-screen">
        {/* 
          Keep the layout structure static and only animate children.
          This prevents the Navbar/Footer from flashing during transitions.
        */}
        <div className={`relative z-10 flex flex-col min-h-screen transition-opacity duration-700 ${hasLoaded ? "opacity-100" : "opacity-0"}`}>
          <div className="z-50">
            <Navbar />
          </div>
          
          <main className="flex-grow">
            <PageTransition>{children}</PageTransition>
          </main>
          
          <div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}