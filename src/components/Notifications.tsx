// components/Notifications.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/actions/notification.action";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (!notifications || notifications.length === 0)
    return <p>There is no notifications</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-2 rounded-md border ${
              notification.isRead ? " border-blue-200" : "border-blue-600"
            }`}
          >
            <p className="text-sm">{notification.message}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </p>
            {!notification.isRead && (
              <Button
                variant="link"
                size="sm"
                onClick={() => markAsRead(notification.id)}
              >
                Mark as read
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
