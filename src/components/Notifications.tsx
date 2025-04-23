"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/actions/notification.action";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Animation variants
const bellVariants = {
  animate: (unreadCount: number) => ({
    rotate: unreadCount > 0 ? [0, 12, -12, 0] : 0,
    scale: unreadCount > 0 ? [1, 1.08, 1] : 1,
    transition: {
      duration: 0.7,
      repeat: unreadCount > 0 ? Infinity : 0,
      ease: "easeInOut",
    },
  }),
};

const notificationVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      type: "spring",
      stiffness: 120,
      damping: 15,
    },
  }),
};

const sheetVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 300 } },
  tap: { scale: 0.95 },
};

const badgeVariants = {
  animate: {
    scale: [1, 1.08, 1],
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
  },
};

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

// Skeleton Component
const NotificationSkeleton = () => (
  <motion.div
    variants={skeletonVariants}
    initial="hidden"
    animate="visible"
    className="space-y-2"
    role="status"
    aria-label="Loading notifications"
  >
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="p-3 rounded-md border border-blue-300/50 bg-gray-700/20"
      >
        <style jsx>{`
          .skeleton-pulse {
            background: linear-gradient(
              90deg,
              rgba(107, 114, 128, 0.2) 25%,
              rgba(107, 114, 128, 0.3) 50%,
              rgba(107, 114, 128, 0.2) 75%
            );
            background-size: 200% 100%;
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
        <div className="h-4 w-3/4 rounded skeleton-pulse mb-2" />
        <div className="h-3 w-1/2 rounded skeleton-pulse mb-1" />
        <div className="h-3 w-1/4 rounded skeleton-pulse" />
      </div>
    ))}
  </motion.div>
);

// Notifications Component
const Notifications = () => {
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-600/50"
          aria-label={`Notifications${
            unreadCount > 0 ? `, ${unreadCount} unread` : ""
          }`}
        >
          <motion.div
            variants={bellVariants}
            animate="animate"
            custom={unreadCount}
          >
            <Bell className="w-5 h-5 text-gray-100" />
          </motion.div>
          {unreadCount > 0 && (
            <motion.div variants={badgeVariants} animate="animate">
              <Badge
                variant="destructive"
                className="
                  absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center
                  rounded-full text-xs bg-rose-400/90 text-white font-['Inter']
                "
              >
                {unreadCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-gray-600/30 backdrop-blur-md border-blue-400/20">
        <motion.div variants={sheetVariants} initial="hidden" animate="visible">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-gray-100 font-['Inter'] text-lg">
              <Bell className="w-5 h-5 text-blue-400" />
              Notifications
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {isLoading ? (
              <NotificationSkeleton />
            ) : isError ? (
              <p className="text-sm text-rose-400 text-center font-['Inter']">
                Failed to load notifications:{" "}
                {error?.message || "Unknown error"}
              </p>
            ) : notifications && notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  variants={notificationVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  className={`
                    p-3 rounded-md border bg-gray-700/20 shadow-sm
                    ${
                      notification.isRead
                        ? "border-blue-300/50"
                        : "border-blue-400"
                    }
                    hover:bg-gray-700/30 transition-colors
                  `}
                >
                  <p className="text-sm text-gray-100 font-['Inter']">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  {!notification.isRead && (
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="mt-1"
                    >
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="p-0 h-auto text-blue-400 hover:text-blue-300 font-['Inter']"
                        aria-label={`Mark notification ${notification.id} as read`}
                      >
                        Mark as read
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center font-['Inter']">
                No notifications
              </p>
            )}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default Notifications;
