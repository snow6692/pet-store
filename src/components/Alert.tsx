"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function AlertComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
        type: "spring",
        stiffness: 100,
      }}
      className="mx-auto mt-4 px-4 w-full"
    >
      <Alert className="bg-red-600 text-white shadow-lg rounded-lg border-none">
        <AlertCircle className="h-4 w-4 text-white" />
        <AlertTitle className="text-white font-bold">
          Important Notice
        </AlertTitle>
        <AlertDescription className="text-white/90">
          This shop is for learning purposes only. Please do not use Visa to buy
          products; try cash on delivery instead.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
