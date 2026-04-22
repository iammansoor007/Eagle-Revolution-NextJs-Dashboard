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

  // Use useEffect for state updates to avoid render-phase side effects
  useEffect(() => {
    if (pathname !== initialPath.current) {
      setHasNavigated(true);
    }
  }, [pathname]);

  const shouldPlayShutters = hasLoaded && hasNavigated;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={pathname} 
        className="relative min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Content wrapper with its own animation to ensure it shows up */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>

        {shouldPlayShutters && (
          <>
            {/* Top Shutter - uses fixed height and robust exit animation */}
            <motion.div
              className="fixed inset-0 bg-primary z-[9999] pointer-events-none"
              initial={{ translateY: "0%" }}
              animate={{ translateY: "-100%" }}
              transition={{
                duration: 0.6,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl md:text-3xl font-black tracking-widest uppercase text-center px-4 drop-shadow-lg">
                  Eagle Revolution
                </span>
              </div>
            </motion.div>

            {/* Bottom Shutter */}
            <motion.div
              className="fixed inset-0 bg-secondary z-[9998] pointer-events-none"
              initial={{ translateY: "0%" }}
              animate={{ translateY: "100%" }}
              transition={{
                duration: 0.6,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.05
              }}
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}