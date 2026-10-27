// types/socket.type.ts
import { BackendComment, User } from "./comment.type";

// Assuming Comment interface based on backend entity
export interface NewCommentData extends BackendComment {}

export interface ReplyCommentData {
  parentId: string;
  replyToUser: User;
  replyComment: BackendComment;
}

export interface ReplyNotificationData {
  targetUserId: number;
  parentId: string;
  replyToUser: User;
  replyComment: BackendComment;
}

export interface ReactionNotificationData {
  targetUserId: number;
  reactionUser: User;
  reactionType: "LIKE" | "DISLIKE";
  comment: BackendComment;
}

export interface DeleteCommentData {
  commentId: string;
}

export interface CountCommentsData {
  filmId: string;
  total: number;
}

export interface ReactCommentData {
  commentId: string;
  userId: number;
  reactionType: "LIKE" | "DISLIKE";
}
