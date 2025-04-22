"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";

export default function CTASection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.6 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.95 },
    focus: { outline: "2px solid #ffffff", outlineOffset: "4px" },
  };

  return (
    <motion.section
      className="relative py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Subtle Background Image Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(/pets-pattern.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.h3
          className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight"
          variants={itemVariants}
        >
          Join Our <span className="text-stone-700">Pet-Loving</span> Community
        </motion.h3>
        <motion.p
          className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Connect with thousands of pet owners, share tips, and unlock exclusive
          offers tailored for you and your furry friends.
        </motion.p>
        <motion.div
          className="flex justify-center mb-10"
          variants={itemVariants}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            whileFocus="focus"
          >
            <Button
              asChild
              size="lg"
              className=" transition-all duration-300 flex items-center gap-2 px-8 py-4 rounded-full font-semibold "
              aria-label="Join the pet community"
            >
              <Link href="/community">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        <motion.p
          className="text-base sm:text-lg text-primary-foreground/80 flex items-center justify-center gap-2"
          variants={itemVariants}
        >
          <Users className="w-5 h-5" aria-hidden="true" />
          Join 10,000+ pet lovers already connected!
        </motion.p>
      </div>  
    </motion.section>
  );
}
