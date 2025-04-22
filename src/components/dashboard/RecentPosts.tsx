"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";

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

interface Post {
  id: string;
  title: string;
  createdAt: Date; // Changed from string to Date
}

interface RecentPostsProps {
  posts: Post[];
}
export default function RecentOrders({ posts }: RecentPostsProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card className="bg-background/95 backdrop-blur-md border border-primary/20 shadow-sm transition-all duration-300 hover:border-primary/50">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
