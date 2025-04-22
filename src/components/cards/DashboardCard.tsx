// "use client";

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { cn } from "@/lib/utils";
// import { ArrowRight, LucideIcon } from "lucide-react"; // Import LucideIcon type

// interface DashboardCardProps {
//   cardTitle: string;
//   cardContent: string;
//   className?: string;
//   icon?: LucideIcon; // Use LucideIcon type for icon component
// }

// export default function DashboardCard({
//   cardTitle,
//   cardContent,
//   className,
//   icon: IconComponent, // Rename to avoid confusion
// }: DashboardCardProps) {
//   return (
//     <Card
//       className={cn(
//         "w-full bg-background/95 backdrop-blur-md",
//         "border border-primary/20 rounded-lg",
//         "shadow-md hover:shadow-xl hover:border-primary/50",
//         "transition-all duration-300",
//         "group-hover:scale-105",
//         "flex flex-col",
//         className
//       )}
//     >
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="text-lg font-semibold text-foreground">
//           {cardTitle}
//         </CardTitle>
//         {IconComponent && (
//           <IconComponent className="h-5 w-5 text-primary" aria-hidden="true" />
//         )}
//       </CardHeader>
//       <CardContent className="flex-grow flex items-end justify-between">
//         <p className="text-sm text-muted-foreground">{cardContent}</p>
//         <ArrowRight
//           className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//           aria-hidden="true"
//         />
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  cardTitle: string;
  cardContent: string;
  className?: string;
  icon?: LucideIcon;
}

const cardVariants = {
  rest: { scale: 1, rotate: 0, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
  hover: {
    scale: 1.05,
    rotate: 1,
    boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
};

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.2, rotate: 10, transition: { duration: 0.3 } },
};

const arrowVariants = {
  rest: { x: -10, opacity: 0 },
  hover: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function DashboardCard({
  cardTitle,
  cardContent,
  className,
  icon: IconComponent,
}: DashboardCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      className="group"
    >
      <Card
        className={cn(
          // Glassmorphic background with stronger blur
          "w-full bg-background/60 backdrop-blur-xl",
          // Dynamic gradient border
          "border border-transparent",
          "relative overflow-hidden",
          // Neumorphic shadows
          "shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
          // Smooth transitions
          "transition-all duration-500",
          // Gradient border effect on hover
          "before:content-[''] before:absolute before:inset-0 before:border-2 before:border-transparent",
          "before:transition-all before:duration-500",
          "group-hover:before:border-[linear-gradient(45deg,#3b82f6,#a855f7)]",
          // Rounded corners and padding
          "rounded-2xl p-6",
          "flex flex-col",
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground tracking-tight">
            {cardTitle}
          </CardTitle>
          {IconComponent && (
            <motion.div variants={iconVariants}>
              <IconComponent
                className="h-6 w-6 text-primary"
                aria-hidden="true"
              />
            </motion.div>
          )}
        </CardHeader>
        <CardContent className="flex-grow flex items-end justify-between">
          <p className="text-sm text-muted-foreground/90 font-medium">
            {cardContent}
          </p>
          <motion.div variants={arrowVariants}>
            <ArrowRight className="h-5 w-5 text-primary" aria-hidden="true" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
