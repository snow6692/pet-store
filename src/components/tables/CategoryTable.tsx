// "use client";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import Image from "next/image";
// import { format } from "date-fns";
// import { PenIcon, XIcon } from "lucide-react";
// import { category } from "@prisma/client";
// import { deleteCategory } from "@/actions/category.action";
// import ConfirmDeleteDialog from "../dialogs/ConfirmDeleteDialog";
// import toast from "react-hot-toast";
// import UpdateCategoryDialog from "../dialogs/UpdateCategoryDialog";
// function CategoryTable({ categories }: { categories: category[] }) {
//   const handleDelete = async (id: string, name: string) => {
//     const promiseDelete = () => deleteCategory(id);

//     toast.promise(promiseDelete(), {
//       loading: `${name} is being deleted...`,
//       success: `${name} deleted successfully!`,
//       error: `Failed to delete ${name}`,
//     });
//   };
//   return (
//     <div className="overflow-x-auto">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Image</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Created At</TableHead>
//             <TableHead>Update</TableHead>
//             <TableHead>Delete</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {categories.map((category) => (
//             <TableRow key={category.id}>
//               <TableCell>
//                 <Image
//                   src={category.image}
//                   alt={`${category.name} image`}
//                   width={36}
//                   height={36}
//                 />
//               </TableCell>
//               <TableCell>{category.name}</TableCell>
//               <TableCell>
//                 {format(new Date(category.createdAt), "dd-MM-yyyy")}
//               </TableCell>
//               <TableCell>
//                 <UpdateCategoryDialog category={category}>
//                   <PenIcon className=" cursor-pointer text-green-500" />
//                 </UpdateCategoryDialog>
//               </TableCell>
//               <TableCell>
//                 <ConfirmDeleteDialog
//                   name={category.name}
//                   id={category.id}
//                   onDelete={() => handleDelete(category.id, category.name)}
//                 >
//                   <XIcon className=" cursor-pointer text-red-500" />
//                 </ConfirmDeleteDialog>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// export default CategoryTable;



"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { format } from "date-fns";
import { PenIcon, XIcon, PlusIcon } from "lucide-react";
import { category } from "@prisma/client";
import { deleteCategory } from "@/actions/category.action";
import ConfirmDeleteDialog from "../dialogs/ConfirmDeleteDialog";
import UpdateCategoryDialog from "../dialogs/UpdateCategoryDialog";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";

interface CategoryTableProps {
  categories: category[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.01,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const cellVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.3,
    rotate: 15,
    color: "#ffffff",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

const rippleVariants = {
  rest: { scale: 0, opacity: 0 },
  hover: {
    scale: 2,
    opacity: 0.3,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  pulse: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.9, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.3, ease: "easeOut" },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

function CategoryTable({ categories }: CategoryTableProps) {
  const handleDelete = async (id: string, name: string) => {
    const promiseDelete = () => deleteCategory(id);

    toast.promise(promiseDelete(), {
      loading: `${name} is being deleted...`,
      success: `${name} deleted successfully!`,
      error: `Failed to delete ${name}`,
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="
        h-screen
        bg-gradient-to-b from-background via-background to-primary/10
        flex flex-col
        py-8
      "
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-extrabold text-foreground mb-8 text-center tracking-tight bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            Categories Management
          </h1>
        </motion.div>

        {/* Table Container */}
        <div
          className="
            bg-background/70 backdrop-blur-2xl
            border border-primary/30
            rounded-3xl
            shadow-[0_8px_24px_rgba(0,0,0,0.2)]
            overflow-x-auto
            relative
            before:content-[''] before:absolute before:inset-0
            before:border-4 before:border-transparent
            before:rounded-3xl
            before:transition-all before:duration-500
            hover:before:border-[linear-gradient(45deg,#3b82f6,#a855f7)]
            flex-1
            max-h-[calc(100%-140px)]
            overflow-y-auto
          "
        >
          <Table aria-label="Categories table">
            <TableHeader>
              <TableRow
                className="
                  bg-background/90 backdrop-blur-lg
                  border-b border-primary/30
                  hover:bg-background/95
                  transition-colors duration-300
                  sticky top-0 z-10
                  shadow-sm
                "
              >
                {["Image", "Name", "Created At", "Update", "Delete"].map(
                  (header) => (
                    <TableHead
                      key={header}
                      className="
                        text-foreground font-bold text-base py-5
                        relative
                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0
                        after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-purple-500
                        after:scale-x-0 after:origin-left after:transition-transform after:duration-300
                        hover:after:scale-x-100
                      "
                    >
                      {header}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {categories?.length ? (
                  categories.map((category) => (
                    <motion.tr
                      key={category.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      exit={{
                        opacity: 0,
                        x: 30,
                        transition: { duration: 0.3 },
                      }}
                      className="
                        border-b border-primary/20
                        group
                        transition-all duration-300
                        relative
                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0
                        after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-purple-500
                        after:scale-x-0 after:transition-transform after:duration-500
                        hover:after:scale-x-100
                      "
                    >
                      <TableCell className="py-5">
                        <motion.div variants={cellVariants}>
                          <Image
                            src={category.image}
                            alt={`${category.name} image`}
                            width={36}
                            height={36}
                            className="rounded-md object-cover"
                          />
                        </motion.div>
                      </TableCell>
                      <TableCell className="text-foreground font-medium text-sm py-5">
                        <motion.div variants={cellVariants}>
                          {category.name}
                        </motion.div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm py-5">
                        <motion.div variants={cellVariants}>
                          {format(new Date(category.createdAt), "dd-MM-yyyy")}
                        </motion.div>
                      </TableCell>
                      <TableCell className="py-5">
                        <UpdateCategoryDialog category={category}>
                          <motion.div
                            variants={iconVariants}
                            whileHover="hover"
                            className="relative inline-block"
                          >
                            <motion.div
                              variants={rippleVariants}
                              className="
                                absolute inset-0 rounded-full
                                bg-green-500/30
                              "
                            />
                            <PenIcon
                              className="
                                h-5 w-5 text-green-400
                                cursor-pointer
                                relative z-10
                              "
                              aria-label={`Update ${category.name}`}
                            />
                          </motion.div>
                        </UpdateCategoryDialog>
                      </TableCell>
                      <TableCell className="py-5">
                        <ConfirmDeleteDialog
                          name={category.name}
                          id={category.id}
                          onDelete={() =>
                            handleDelete(category.id, category.name)
                          }
                        >
                          <motion.div
                            variants={iconVariants}
                            whileHover="hover"
                            className="relative inline-block"
                          >
                            <motion.div
                              variants={rippleVariants}
                              className="
                                absolute inset-0 rounded-full
                                bg-red-500/30
                              "
                            />
                            <XIcon
                              className="
                                h-5 w-5 text-red-400
                                cursor-pointer
                                relative z-10
                              "
                              aria-label={`Delete ${category.name}`}
                            />
                          </motion.div>
                        </ConfirmDeleteDialog>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="
                        text-center text-muted-foreground text-base py-12
                        bg-background/80 rounded-b-3xl
                      "
                    >
                      <motion.div
                        variants={emptyStateVariants}
                        initial="hidden"
                        animate={["visible", "pulse"]}
                      >
                        <p className="text-lg font-semibold text-foreground">
                          No categories available
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Add a new category to get started!
                        </p>
                        <motion.div
                          variants={ctaVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          className="mt-4"
                        >
                          <Link href="/categories/new">
                            <button
                              className="
                                inline-flex items-center px-4 py-2
                                bg-gradient-to-r from-primary to-purple-500
                                text-white font-semibold rounded-lg
                                shadow-md hover:shadow-lg
                                transition-all duration-300
                              "
                            >
                              <PlusIcon className="h-5 w-5 mr-2" />
                              Add Category
                            </button>
                          </Link>
                        </motion.div>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
}

export default CategoryTable;
