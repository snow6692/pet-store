// "use client";

// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { useGetAllCategories } from "@/hooks/useGetCategories";
// import { useRouter, useSearchParams } from "next/navigation";

// function FilterByCategory() {
//   const { data: categories } = useGetAllCategories();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const categoryName = searchParams.get("category") || "all";

//   const handleChange = (value: string) => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (value && value !== "all") {
//       params.set("category", value);
//     } else {
//       params.delete("category");
//     }
//     router.push(`/products/filter?${params.toString()}`);
//   };
//   return (
//     <Select value={categoryName} onValueChange={handleChange}>
//       <SelectTrigger className="w-[180px]">
//         <SelectValue placeholder="Filter by category" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="all">All Categories</SelectItem>
//         {categories?.map((cat) => (
//           <SelectItem key={cat.id} value={cat.name}>
//             {cat.name}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }

// export default FilterByCategory;

"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetAllCategories } from "@/hooks/useGetCategories";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const triggerVariants: Variants = {
  initial: { scale: 1, boxShadow: "0 0 0 rgba(59, 130, 246, 0)" },
  hover: { scale: 1.03, transition: { duration: 0.25, ease: "easeOut" } },
  focus: {
    scale: 1.05,
    boxShadow: "0 0 12px rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.3, ease: "easeOut" },
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

const itemVariants: Variants = {
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

function FilterByCategory() {
  const { data: categories } = useGetAllCategories();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryName = searchParams.get("category") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`/products/filter?${params.toString()}`);
  };

  return (
    <motion.div
      variants={triggerVariants}
      initial="initial"
      whileHover="hover"
      whileFocus="focus"
      className="relative group w-[180px]"
    >
      <Select value={categoryName} onValueChange={handleChange}>
        <SelectTrigger
          className="
            bg-background/95 backdrop-blur-md
            border border-primary/20
            rounded-lg
            px-4 py-2
            text-foreground
            focus:ring-2 focus:ring-primary/50
            focus:border-primary/50
            transition-all duration-300
            shadow-sm
            h-10
          "
        >
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
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
          animate={categoryName !== "all" ? "focus" : "initial"}
        />
        <SelectContent
          className="
            bg-background/95 backdrop-blur-lg
            border border-primary/20
            rounded-lg
            shadow-[0_4px_12px_rgba(0,0,0,0.15)]
            mt-1
            max-h-60 overflow-y-auto
            z-20
          "
        >
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
          >
            <SelectItem
              value="all"
              className="
                focus:bg-primary/10
                transition-all duration-300
                text-foreground
                hover:text-primary
                px-3 py-2
              "
            >
              All Categories
            </SelectItem>
            {categories?.map((cat) => (
              <motion.div
                key={cat.id}
                variants={itemVariants}
                className="group"
              >
                <SelectItem
                  value={cat.name}
                  className="
                    focus:bg-primary/10
                    transition-all duration-300
                    text-foreground
                    hover:text-primary
                    px-3 py-2
                  "
                >
                  <div className="flex items-center">
                    <Image
                      src={cat.image || "/placeholder-image.jpg"}
                      alt={cat.name}
                      width={24}
                      height={24}
                      className="
                        rounded-sm object-cover
                        mr-2
                        ring-1 ring-primary/20
                        group-hover:ring-primary/50
                        transition-all duration-300
                      "
                    />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                </SelectItem>
              </motion.div>
            ))}
          </motion.div>
        </SelectContent>
      </Select>
    </motion.div>
  );
}

export default FilterByCategory;
