"use client";

import React from "react";
import { motion } from "framer-motion";

export interface GlowingLineDividerProps {
  className?: string;
  duration?: number;
}

export function GlowingLineDivider({
  className = "",
  duration = 4.5,
}: GlowingLineDividerProps) {
  return (
    <div className={`relative w-full overflow-hidden flex items-center justify-center py-4 ${className}`}>
      {/* Base Subtle Gradient Line */}
      <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/25 dark:via-emerald-400/30 to-transparent" />

      {/* Animated Traveling Glowing Laser Spark Particle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 h-[2px] w-36 sm:w-56 bg-gradient-to-r from-transparent via-emerald-400 to-cyan-300 pointer-events-none"
        style={{
          boxShadow: "0 0 14px 2px rgba(16, 185, 129, 0.8), 0 0 28px 6px rgba(6, 182, 212, 0.5)",
        }}
        initial={{ left: "-25%" }}
        animate={{ left: "125%" }}
        transition={{
          repeat: Infinity,
          duration: duration,
          ease: "easeInOut",
        }}
      >
        {/* Glowing Head Point */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-100 shadow-[0_0_10px_3px_#34d399,0_0_20px_6px_#22d3ee]" />
      </motion.div>
    </div>
  );
}

export default GlowingLineDivider;
