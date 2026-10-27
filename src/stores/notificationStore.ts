import { create } from "zustand";
import { notificationService } from "@/services/notificationService";
import type { Notification } from "@/types/notification.type";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
}

interface NotificationActions {
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  addNotification: (notification: Notification) => void;
  reset: () => void;
}

export const useNotificationStore = create<
  NotificationState & NotificationActions
>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  currentPage: 1,
  hasMore: true,
  isLoading: false,

  fetchNotifications: async (page = 1, limit = 20) => {
    try {
      set({ isLoading: true });

      const response = await notificationService.getNotifications(page, limit);

      const actualData = response?.data?.data || response?.data || [];
      const actualMeta = response?.data?.meta;

      if (Array.isArray(actualData)) {
        const dbNotifications = actualData.filter(
          (n: any) => n.notificationId > 0
        );

        set({
          notifications: dbNotifications,
          currentPage: page,
          hasMore: actualMeta?.page < actualMeta?.totalPages,
          isLoading: false,
        });
      } else {
        set({
          notifications: [],
          hasMore: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(
        "[NOTIFICATION STORE] Error fetching notifications:",
        error
      );
      set({ isLoading: false, notifications: [] });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationService.getUnreadCount();
      const actualCount = response?.data?.count;

      if (typeof actualCount === "number") {
        set({ unreadCount: actualCount });
      }
    } catch (error) {
      console.error("[NOTIFICATION STORE] Error fetching unread count:", error);
    }
  },

  loadMore: async () => {
    const { currentPage, hasMore, isLoading } = get();
    if (isLoading || !hasMore) return;

    try {
      set({ isLoading: true });
      const nextPage = currentPage + 1;
      const response = await notificationService.getNotifications(nextPage, 20);

      const actualData = response?.data?.data || response?.data || [];
      const actualMeta = response?.data?.meta;

      if (Array.isArray(actualData) && actualData.length > 0) {
        set((state) => ({
          notifications: [...state.notifications, ...actualData],
          currentPage: nextPage,
          hasMore: actualMeta?.page < actualMeta?.totalPages,
          isLoading: false,
        }));
      } else {
        set({ hasMore: false, isLoading: false });
      }
    } catch (error) {
      console.error("[NOTIFICATION STORE] Error loading more:", error);
      set({ isLoading: false });
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        ),
      }));
      get().fetchUnreadCount();
    } catch (error) {
      console.error("[NOTIFICATION STORE] Error marking as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("[NOTIFICATION STORE] Error marking all as read:", error);
    }
  },

  deleteNotification: async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);

      set((state) => ({
        notifications: state.notifications.filter(
          (n) => n.notificationId !== notificationId
        ),
      }));

      get().fetchUnreadCount();
    } catch (error) {
      console.error("[NOTIFICATION STORE] Error deleting notification:", error);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  reset: () => {
    set({
      notifications: [],
      unreadCount: 0,
      currentPage: 1,
      hasMore: true,
      isLoading: false,
    });
  },
}));
