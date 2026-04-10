"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useGlobalLoading } from "./LoadingContext";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hasLoaded } = useGlobalLoading();
  const initialPath = useRef(pathname);
  const hasEverNavigated = useRef(false);

  // Immediate detection during render phase
  if (pathname !== initialPath.current) {
    hasEverNavigated.current = true;
  }

  const shouldPlayShutters = hasLoaded && hasEverNavigated.current;

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div key={pathname} className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>

        {shouldPlayShutters && (
          <>
            {/* Top Shutter - uses transform translate with fixed height */}
            <motion.div
              className="fixed top-0 left-0 w-full h-full bg-primary z-[999] pointer-events-none"
              initial={{ translateY: "0%" }}
              animate={{ translateY: "-100%" }}
              transition={{
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl md:text-3xl font-black tracking-widest uppercase text-center px-4">
                  Eagle Revolution
                </span>
              </div>
            </motion.div>

            {/* Bottom Shutter */}
            <motion.div
              className="fixed bottom-0 left-0 w-full h-full bg-secondary z-[998] pointer-events-none"
              initial={{ translateY: "0%" }}
              animate={{ translateY: "100%" }}
              transition={{
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.1
              }}
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}