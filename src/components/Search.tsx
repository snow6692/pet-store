/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchProducts } from "@/actions/product.action";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";
import { useState } from "react";
import { Input } from "./ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { motion, Variants } from "framer-motion";

const inputVariants: Variants = {
  initial: { scale: 1, boxShadow: "0 0 0 rgba(59, 130, 246, 0)" },
  focus: {
    scale: 1.05,
    boxShadow: "0 0 12px rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: {
    scale: 1.03,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.6, -0.05, 0.01, 0.99],
      staggerChildren: 0.05,
    },
  },
};

const suggestionVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      type: "spring",
      stiffness: 120,
      damping: 12,
    },
  },
};

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [inputValue, setInputValue] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const { debouncedValue, isDebouncing } = useDebouncedValue(inputValue, 300);

  useEffect(() => {
    if (debouncedValue.length >= 3) {
      const url = new URLSearchParams();
      url.set("search", debouncedValue);
      router.replace(`?${url.toString()}`);
    } else {
      router.replace("?");
    }
  }, [debouncedValue, router]);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      startTransition(async () => {
        const products = await searchProducts({ search: searchTerm });
        setSuggestions(products);
      });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-xs">
      <motion.div
        variants={inputVariants}
        initial="initial"
        whileHover="hover"
        whileFocus="focus"
        className="relative group"
      >
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products..."
          className="
            bg-background/95 backdrop-blur-md
            border border-primary/20
            rounded-lg
            px-4 py-2
            text-foreground
            placeholder:text-muted-foreground/70
            focus:ring-2 focus:ring-primary/50
            focus:border-primary/50
            transition-all duration-300
            shadow-sm
          "
          // disabled={isPending || isDebouncing}
        />
        <motion.div
          className="
            absolute inset-0 -z-10
            rounded-lg
            bg-gradient-to-r from-primary/20 to-secondary/20
            opacity-0 group-hover:opacity-100
            blur-md
            transition-opacity duration-300
          "
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 },
            focus: { opacity: 1 },
          }}
          initial="initial"
          animate={inputValue ? "focus" : "initial"}
        />
      </motion.div>

      {suggestions.length > 0 && (
        <motion.ul
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          className="
            absolute w-full mt-2
            bg-background/95 backdrop-blur-lg
            border border-primary/20
            rounded-lg
            shadow-[0_4px_12px_rgba(0,0,0,0.15)]
            z-20
            max-h-60 overflow-y-auto
          "
        >
          {suggestions.map((product) => (
            <motion.li
              key={product.id}
              variants={suggestionVariants}
              className="group"
            >
              <Link
                href={`/products/product/${product.slug}`}
                className="
                  flex items-center
                  p-3
                  hover:bg-primary/10
                  transition-all duration-300
                  border-b border-primary/10 last:border-b-0
                "
              >
                <Image
                  src={product.images[0] || "/placeholder-image.jpg"}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="
                    rounded-md object-cover
                    ring-1 ring-primary/20
                    group-hover:ring-primary/50
                    transition-all duration-300
                  "
                />
                <p
                  className="
                    ml-3 text-sm font-medium
                    text-foreground
                    group-hover:text-primary
                    transition-colors duration-300
                  "
                >
                  {product.name}
                </p>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
