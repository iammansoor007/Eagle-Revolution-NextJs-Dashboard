import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.65, 0, 0.35, 1] as const;

const SimpleDark = () => {
  return (
    <motion.div
      className="absolute inset-0 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    />
  );
};

const RoofDraw = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <svg width="200" height="120" viewBox="0 0 200 120" className="w-[200px] md:w-[240px]">
        <motion.path
          d="M40 70 L100 30 L160 70"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <motion.line
          x1="55"
          y1="70"
          x2="145"
          y2="70"
          stroke="hsl(var(--primary))"
          strokeWidth="2.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
        />
      </svg>
    </motion.div>
  );
};

const LogoText = () => {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center px-4">
        <div className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.15em] text-foreground mb-4">
          <span style={{ color: "hsl(var(--primary))" }}>Eagle</span>{" "}
          <span style={{ color: "hsl(var(--primary))" }}>Revolution</span>
        </div>

        <div className="mx-auto w-16 h-0.5 bg-primary" />

        <div className="mt-6 text-[10px] md:text-xs tracking-[0.25em] text-muted-foreground uppercase flex items-center justify-center gap-2">
          <span>🇺🇸</span>
          <span>Veteran Owned & Operated</span>
          <span>🇺🇸</span>
        </div>
      </div>
    </motion.div>
  );
};

const Ready = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 300);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 bg-background flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    />
  );
};

interface LoaderProps {
  onComplete: () => void;
}

const PremiumLoader = ({ onComplete }: LoaderProps) => {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 700);
    const t2 = setTimeout(() => setPhase(3), 1500);
    const t3 = setTimeout(() => setPhase(4), 2400);
    const t4 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[300]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence mode="wait">
        {phase === 1 && <SimpleDark key="dark" />}
        {phase === 2 && <RoofDraw key="roof" />}
        {phase === 3 && <LogoText key="logo" />}
        {phase === 4 && <Ready key="ready" onComplete={() => setPhase(4)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default PremiumLoader;