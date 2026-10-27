export interface NotificationResult {
  commentId?: string;
  parentId?: string;
  filmId?: string;
  slug?: string;
  filmTitle?: string;
  reason?: string;
  note?: string;
}

export interface Notification {
  notificationId: number;
  type: "reply" | "reaction" | "system" | "warning" | "violation_warning" | "info" | "hidden_comment" | "report" | "report_result";
  message: string;
  data?: any;
  isRead: boolean;
  replier?: {
    userId: number;
    fullName: string;
    email?: string;
    avatarUrl?: string;
  };
  result?: NotificationResult;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  EC: number;
  EM: string;
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  EC: number;
  EM: string;
  count: number;
}
