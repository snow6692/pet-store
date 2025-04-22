"use client";

import Link from "next/link";

import { Mail, Phone, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
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

  return (
    <motion.footer
      className="bg-gradient-to-b from-muted to-muted/80 py-16 text-foreground"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-bold text-foreground mb-4">
              Pet Haven
            </h4>
            <p className="text-muted-foreground text-sm">
              Your one-stop shop for premium pet supplies and a vibrant
              community.
            </p>
          </motion.div>

          {/* Explore Section */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-bold text-foreground mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products/1"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Community
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Stay Connected Section */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-bold text-foreground mb-4">
              Stay Connected
            </h4>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <a
                  href="tel:+201060257232"
                  className="text-muted-foreground hover:text-primary text-sm"
                  aria-label="Call us at +201060257232"
                >
                  +20 106 025 7232
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <a
                  href="mailto:ahmedha258258@gmail.com"
                  className="text-muted-foreground hover:text-primary text-sm"
                  aria-label="Email us at ahmedha258258@gmail.com"
                >
                  ahmedha258258@gmail.com
                </a>
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/in/ahmed-hamada-a83309239"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Visit our LinkedIn profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/snow6692"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Visit our GitHub profile"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.hr
          className="my-8 border-t border-muted-foreground/20"
          variants={itemVariants}
        />

        {/* Copyright */}
        <motion.div
          className="text-center text-muted-foreground text-sm"
          variants={itemVariants}
        >
          <p>© 2025 Snow. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
