"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useGlobalLoading } from "./LoadingContext";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hasLoaded } = useGlobalLoading();
  const initialPath = useRef(pathname);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (pathname !== initialPath.current) {
      setHasNavigated(true);
      setIsTransitioning(true);
      
      // Reset transition state after shutters should have cleared
      const timer = setTimeout(() => setIsTransitioning(false), 800);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const shouldPlayShutters = hasLoaded && hasNavigated;

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={pathname} 
          className="relative w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {shouldPlayShutters && isTransitioning && (
          <>
            {/* Top Shutter */}
            <motion.div
              className="fixed inset-0 bg-primary z-[9999] pointer-events-none"
              initial={{ translateY: "100%" }}
              animate={{ translateY: ["100%", "0%", "-100%"] }}
              transition={{
                duration: 0.8,
                times: [0, 0.5, 1],
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-2xl md:text-4xl font-black tracking-widest uppercase px-4">
                  Eagle Revolution
                </span>
              </div>
            </motion.div>

            {/* Bottom Shutter */}
            <motion.div
              className="fixed inset-0 bg-secondary z-[9998] pointer-events-none"
              initial={{ translateY: "100%" }}
              animate={{ translateY: ["100%", "0%", "100%"] }}
              transition={{
                duration: 0.8,
                times: [0, 0.5, 1],
                ease: "easeInOut",
                delay: 0.05
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}