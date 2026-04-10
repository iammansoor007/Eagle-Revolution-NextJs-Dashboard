"use client";

import { useGlobalLoading } from "./LoadingContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import LoadingScreen from "./LoadingScreen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { hasLoaded, setHasLoaded } = useGlobalLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // On first load, only show the loader.
  // After it finishes, it sets hasLoaded=true which reveals the header/footer/page.
  const isSplashPhase = !hasLoaded;

  return (
    <>
      <AnimatePresence mode="wait">
        {isSplashPhase && mounted && (
          <LoadingScreen onComplete={() => setHasLoaded(true)} />
        )}
      </AnimatePresence>

      {hasLoaded && (
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
