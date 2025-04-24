"use client";

import Link from "next/link";
import Login from "./buttons/Login";
import { ModeToggle } from "./buttons/ModeToggle";
import CartIcon from "./icons/CartIcon";
import UserIcon from "./icons/UserIcon";
import Search from "./Search";
import FilterByCategory from "./FilterByCategory";
import { motion, Variants } from "framer-motion";
import { Suspense } from "react";
import { useSession } from "next-auth/react";

const navVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
      type: "spring",
      stiffness: 140,
      damping: 12,
    },
  },
};

const linkVariants: Variants = {
  hover: {
    scale: 1.12,
    y: -4,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      type: "spring",
      stiffness: 200,
    },
  },
};

const iconVariants: Variants = {
  hover: {
    scale: 1.25,
    rotate: 10,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      type: "spring",
      stiffness: 200,
    },
  },
  tap: {
    scale: 0.8,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

const glowVariants: Variants = {
  hover: {
    scale: 1.15,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  initial: {
    scale: 1,
    opacity: 0.7,
  },
};

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="
        sticky top-0 z-50
        bg-background/90 backdrop-blur-lg
        shadow-[0_4px_12px_rgba(0,0,0,0.1)]
        border-b border-primary/20
        bg-gradient-to-r from-primary/15 via-secondary/15 to-primary/15
        flex flex-col gap-4
        md:grid md:grid-cols-2
        lg:flex lg:flex-row lg:items-center lg:justify-between
        px-4 sm:px-6 lg:px-8 py-4
      "
    >
      {/* Logo and Links */}
      <div className="flex items-center space-x-6">
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="
              text-3xl font-extrabold tracking-tighter
              bg-clip-text text-transparent
              bg-gradient-to-r from-primary via-secondary to-primary
              hover:bg-gradient-to-l
              transition-all duration-700
              drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]
            "
          >
            MyStore
          </Link>
        </motion.div>
        <div className="flex items-center space-x-6">
          <motion.div variants={itemVariants}>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                href="/products/1"
                className="
                  text-foreground text-base font-semibold
                  relative group
                  transition-colors duration-300
                  hover:text-primary
                "
              >
                Products
                <span
                  className="
                    absolute bottom-0 left-0 w-0 h-0.5
                    bg-gradient-to-r from-primary to-secondary
                    transition-all duration-400 group-hover:w-full
                    shadow-[0_0_8px_rgba(59,130,246,0.4)]
                  "
                />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                href="/community"
                className="
                  text-foreground text-base font-semibold
                  relative group
                  transition-colors duration-300
                  hover:text-primary
                "
              >
                Community
                <span
                  className="
                    absolute bottom-0 left-0 w-0 h-0.5
                    bg-gradient-to-r from-primary to-secondary
                    transition-all duration-400 group-hover:w-full
                    shadow-[0_0_8px_rgba(59,130,246,0.4)]
                  "
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-center md:justify-end gap-4">
        <motion.div
          variants={itemVariants}
          whileFocus={{ scale: 1.08 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.25, type: "spring", stiffness: 180 }}
          className="relative group"
        >
          <Suspense
            fallback={
              <div className="w-[180px] h-10 bg-background/50 rounded-lg animate-pulse" />
            }
          >
            <Search />
          </Suspense>
          <motion.div
            variants={glowVariants}
            initial="initial"
            whileHover="hover"
            className="
                absolute inset-0 -z-10
                rounded-md
                bg-gradient-to-r from-primary/20 to-secondary/20
                opacity-70 group-hover:opacity-100
                blur-md
              "
          />
        </motion.div>
        <motion.div
          variants={itemVariants}
          whileFocus={{ scale: 1.08 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.25, type: "spring", stiffness: 180 }}
          className="relative group"
        >
          <Suspense
            fallback={
              <div className="w-[180px] h-10 bg-background/50 rounded-lg animate-pulse" />
            }
          >
            <FilterByCategory />
          </Suspense>
          <motion.div
            variants={glowVariants}
            initial="initial"
            whileHover="hover"
            className="
                absolute inset-0 -z-10
                rounded-md
                bg-gradient-to-r from-primary/20 to-secondary/20
                opacity-70 group-hover:opacity-100
                blur-md
              "
          />
        </motion.div>
      </div>

      {/* Icons */}
      <div className="flex items-center justify-center md:justify-end gap-4">
        <motion.div
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
          className="cursor-pointer relative group"
        >
          <CartIcon aria-label="View cart" />
          <motion.div
            variants={glowVariants}
            initial="initial"
            whileHover="hover"
            className="
              absolute inset-0 -z-10
              rounded-full
              bg-gradient-to-r from-primary/30 to-secondary/30
              opacity-70 group-hover:opacity-100
              blur-sm
              shadow-[0_0_10px_rgba(59,130,246,0.5)]
            "
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          className="cursor-pointer relative group"
        >
          {user ? (
            <UserIcon user={user} aria-label="User profile" />
          ) : (
            <Login aria-label="Log in" />
          )}

          <motion.div
            variants={glowVariants}
            initial="initial"
            whileHover="hover"
            className="
              absolute inset-0 -z-10
              rounded-full
              bg-gradient-to-r from-primary/30 to-secondary/30
              opacity-70 group-hover:opacity-100
              blur-sm
              shadow-[0_0_10px_rgba(59,130,246,0.5)]
            "
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          className="cursor-pointer relative group"
        >
          <ModeToggle aria-label="Toggle theme" />
          <motion.div
            variants={glowVariants}
            initial="initial"
            whileHover="hover"
            className="
              absolute inset-0 -z-10
              rounded-full
              bg-gradient-to-r from-primary/30 to-secondary/30
              opacity-70 group-hover:opacity-100
              blur-sm
              shadow-[0_0_10px_rgba(59,130,246,0.5)]
            "
          />
        </motion.div>
      </div>
    </motion.nav>
  );
}
