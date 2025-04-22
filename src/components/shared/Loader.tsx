"use client";

import React from "react";
import { motion } from "framer-motion";

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Loader: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 flex items-center justify-center bg-background/60 backdrop-blur-xl"
      role="status"
      aria-label="Loading"
    >
      <div className="relative p-6 bg-background/80 border border-primary/20 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <motion.svg
          variants={spinnerVariants}
          animate="animate"
          className="h-12 w-12 text-primary"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </motion.svg>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple/10 rounded-2xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="mt-4 text-sm font-medium text-foreground">Loading...</p>
      </div>
    </motion.div>
  );
};

export default Loader;
