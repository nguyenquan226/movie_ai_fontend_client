export interface User {
  userId: number | string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  genderCode?: string;
  age?: number;
  roleId?: number;
  birthDate?: string | null;
  isVip?: boolean;
  statusCode?: string;
  vipExpireDate?: string | null;
}

export interface CommentPayload {
  content: string;
  filmId: string;
  partId?: string;
  episodeId?: string;
  parentId?: string;
}

export interface BackendComment {
  commentId: string;
  content: string;
  isHidden: boolean;
  totalLike: number;
  totalDislike: number;
  totalChildrenComment: number;
  user: User;
  film?: { filmId: string; title?: string };
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  createdBy?: number | string;
  updatedBy?: number | string;
  deletedBy?: number | string;
  parent?: BackendComment | null;
  children?: BackendComment[];
  currentUserReaction?: CommentReactionType;
}

export interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  isHidden?: boolean;
  totalLike: number;
  totalDislike: number;
  totalChildrenComment: number;
  currentUserReaction?: CommentReactionType;
  user: {
    id: number | string;
    name: string;
    avatar?: string;
  };
  parent?: {
    id: string;
    user: {
      id: number | string;
      name: string;
      avatar?: string;
    };
  } | null;
  replies: CommentItem[];
}

export interface CommentListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CommentListData {
  comments: CommentItem[];
  meta: CommentListMeta;
}

export interface CreateCommentData {
  fullComment: BackendComment;
}

export interface ReactCommentData {
  commentId: string;
  totalLike: number;
  totalDislike: number;
  userReaction: CommentReactionType | null;
}

export interface CountCommentsData {
  filmId: string;
  totalComments: number;
}

export type CommentReactionType = "LIKE" | "DISLIKE";
