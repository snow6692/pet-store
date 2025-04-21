"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CTASection() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.section
      className="py-16 bg-primary text-primary-foreground"
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h3 className="text-3xl font-bold mb-4" variants={itemVariants}>
          Join Our Pet-Loving Community
        </motion.h3>
        <motion.p className="text-lg mb-8" variants={itemVariants}>
          Connect with other pet owners, share tips, and discover exclusive
          offers.
        </motion.p>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            asChild
            size="lg"
            className="bg-background text-foreground hover:bg-background/90"
          >
            <Link href="/community">Get Started</Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
