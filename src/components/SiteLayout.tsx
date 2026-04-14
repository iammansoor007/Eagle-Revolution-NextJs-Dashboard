"use client";

import { useGlobalLoading } from "./LoadingContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import LoadingScreen from "./LoadingScreen";
import { AnimatePresence, motion, easeOut } from "framer-motion"; // Add easeOut import
import { useEffect, useState } from "react";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { hasLoaded, setHasLoaded } = useGlobalLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSplashPhase = !hasLoaded;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  // FIXED: Use imported easeOut function
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: easeOut // ✅ Use the imported easing function
      }
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isSplashPhase && mounted && (
          <LoadingScreen onComplete={() => setHasLoaded(true)} key="loader" />
        )}
      </AnimatePresence>

      {hasLoaded && (
        <motion.div 
          className="relative z-10 flex flex-col min-h-screen"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="z-50">
            <Navbar />
          </motion.div>
          
          <motion.main variants={itemVariants} className="flex-grow">
            <PageTransition>{children}</PageTransition>
          </motion.main>
          
          <motion.div variants={itemVariants}>
            <Footer />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}