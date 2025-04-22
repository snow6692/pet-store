"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, Variants } from "framer-motion";
// import { LucideIcon } from "lucide-react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
      type: "spring",
      stiffness: 120,
      damping: 12,
    },
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

interface OverviewCardProps {
  title: string;
  count: number;
  isLoading: boolean;
  icon: string;
}

export default function OverviewCard({
  title,
  count,
  isLoading,
}: OverviewCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card
        className="
          bg-background/95 backdrop-blur-md
          border border-primary/20
          shadow-sm
          transition-all duration-300
          hover:border-primary/50
        "
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {/* <Icon className="h-4 w-4 text-primary" /> */}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold">{count}</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
