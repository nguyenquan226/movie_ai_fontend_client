import privateAxios from "@/lib/privateAxios";
import type {
  NotificationResponse,
  UnreadCountResponse,
} from "@/types/notification.type";

export const notificationService = {
  getNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await privateAxios.get<NotificationResponse>(
        `/notifications?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await privateAxios.get<UnreadCountResponse>(
        "/notifications/unread-count"
      );
      return response;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      const response = await privateAxios.patch(
        `/notifications/${notificationId}/read`
      );
      return response;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await privateAxios.patch("/notifications/read-all");
      return response;
    } catch (error) {
      console.error("Error marking all as read:", error);
      throw error;
    }
  },

  deleteNotification: async (notificationId: number) => {
    try {
      const response = await privateAxios.delete(
        `/notifications/${notificationId}`
      );
      return response;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
};
