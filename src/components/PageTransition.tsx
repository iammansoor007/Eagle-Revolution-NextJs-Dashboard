"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useGlobalLoading } from "./LoadingContext";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hasLoaded } = useGlobalLoading();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  // Synchronous state update during render to catch path changes BEFORE the first paint
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setHasNavigated(true);
    setIsTransitioning(true);
  }

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

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
          // Delay the entrance of the new page content until shutters cover the screen
          transition={{ duration: 0.4, delay: shouldPlayShutters ? 0.4 : 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {shouldPlayShutters && isTransitioning && (
          <>
            {/* Top Shutter - Swipes UP */}
            <motion.div
              className="fixed inset-0 bg-primary z-[9999] pointer-events-none flex items-center justify-center"
              initial={{ translateY: "100%" }}
              animate={{ translateY: ["100%", "0%", "-100%"] }}
              transition={{
                duration: 1,
                times: [0, 0.5, 1],
                ease: [0.76, 0, 0.24, 1]
              }}
            >
              <div className="relative">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 0], y: [20, 0, -20] }}
                  transition={{ duration: 1, times: [0, 0.5, 1] }}
                  className="text-white text-2xl md:text-5xl font-black tracking-[0.2em] uppercase px-4 whitespace-nowrap"
                >
                  Eagle Revolution
                </motion.span>
              </div>
            </motion.div>

            {/* Bottom Shutter - Secondary Swipe for depth */}
            <motion.div
              className="fixed inset-0 bg-secondary z-[9998] pointer-events-none"
              initial={{ translateY: "100%" }}
              animate={{ translateY: ["100%", "0%", "100%"] }}
              transition={{
                duration: 1,
                times: [0, 0.5, 1],
                ease: [0.76, 0, 0.24, 1],
                delay: 0.05
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}