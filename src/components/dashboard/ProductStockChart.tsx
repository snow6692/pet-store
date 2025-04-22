"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

interface ProductStockData {
  name: string;
  stock: number;
}

interface ProductStockChartProps {
  data: ProductStockData[];
}

export default function ProductStockChart({ data }: ProductStockChartProps) {
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
        <CardHeader>
          <CardTitle>Product Stock Levels</CardTitle>
          <CardDescription>Current inventory levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6/20" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    borderRadius: "8px",
                    backdropFilter: "blur(8px)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="stock"
                  stroke="#22c55e" // secondary (emerald-500)
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#22c55e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
