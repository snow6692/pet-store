"use client";
export const dynamic = "force-dynamic";

import DashboardCard from "@/components/cards/DashboardCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, PlusCircle } from "lucide-react";
type CardLink = {
  title: string;
  content: string;
  link: string;
  icon: typeof Package | typeof PlusCircle;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      duration: 0.6,
    },
  },
};

const cardLinks: CardLink[] = [
  {
    title: "See All Categories",
    content: "Go to categories",
    link: "/dashboard/categories/1",
    icon: PlusCircle,
  },
  {
    title: "Add New Category",
    content: "Create a new category",
    link: "/dashboard/categories/new",
    icon: Package,
  },
];
function CategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-extrabold text-foreground mb-10 text-center tracking-tight">
            Products Dashboard
          </h1>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {cardLinks.map((card) => (
            <motion.div key={card.link} variants={cardVariants}>
              <Link
                href={card.link}
                className="block group"
                aria-label={`Navigate to ${card.title}`}
              >
                <DashboardCard
                  cardContent={card.content}
                  cardTitle={card.title}
                  icon={card.icon}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default CategoryPage;
