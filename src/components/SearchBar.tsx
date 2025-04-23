
"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { motion } from "framer-motion";

const searchVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.push(`/community?${params.toString()}`);
  }, 300);

  return (
    <motion.div
      variants={searchVariants}
      initial="hidden"
      animate="visible"
      className="mb-4"
    >
      <Input
        placeholder="Search posts..."
        defaultValue={q}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full bg-gray-600/20 border-blue-400/20 text-gray-100 placeholder-gray-400 focus:ring-blue-400/50"
      />
    </motion.div>
  );
}
