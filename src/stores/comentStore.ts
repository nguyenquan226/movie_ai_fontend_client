import { create } from "zustand";
import { CommentServices } from "@/services/commentService";
import type {
  CommentItem,
  CommentPayload,
  CommentListData,
  BackendComment,
  CommentReactionType,
} from "@/types/comment.type";
import { useAuthStore } from "./authStore";

interface ReplyingToState {
  rootParentId: string;
  replyId?: string;
  replyToName?: string;
}

interface CommentStoreState {
  activeTab: "comments" | "ratings";
  currentFilmId: string | null;
  comments: CommentItem[];
  totalComments: number;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  replyingTo: ReplyingToState | null;
  isLoading: boolean;
  error: string | null;
}

interface CommentStoreActions {
  fetchComments: (
    filmId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  countComments: (filmId: string) => Promise<void>;
  createComment: (payload: CommentPayload) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  reactComment: (commentId: string, type: CommentReactionType) => Promise<void>;
  setReplyingTo: (info: ReplyingToState | null) => void;
  setActiveTab: (tab: "comments" | "ratings") => void;
  removeCommentRealtime: (commentId: string) => void;
  createCommentRealtime: (newComment: BackendComment) => void;
  replyCommentRealtime: (data: {
    parentId: string;
    comment: BackendComment;
  }) => void;
  countCommentsRealtime: (filmId: string, total?: number) => void;
  reactCommentRealtime: (reaction: {
    commentId: string;
    userId: number | string;
    totalLike: number;
    totalDislike: number;
    userReaction?: CommentReactionType;
  }) => void;
  hideCommentRealtime: (commentId: string, isHidden: boolean) => void;
  unhideCommentRealtime: (comment: BackendComment) => void;
}

const mapBackendToItem = (c: BackendComment): CommentItem => ({
  id: c.commentId,
  content: c.content,
  createdAt: c.createdAt,
  isHidden: c.isHidden,
  totalLike: c.totalLike,
  totalDislike: c.totalDislike,
  totalChildrenComment: c.totalChildrenComment,
  currentUserReaction: c.currentUserReaction || undefined,
  user: {
    id: c.user.userId,
    name: c.user.fullName,
    avatar: c.user.avatarUrl,
  },
  parent: c.parent
    ? {
        id: c.parent.commentId,
        user: {
          id: c.parent.user.userId,
          name: c.parent.user.fullName,
          avatar: c.parent.user.avatarUrl,
        },
      }
    : null,
  replies: (c.children || []).map(mapBackendToItem),
});

const existsInTree = (list: CommentItem[], id: string): boolean => {
  for (const c of list) {
    if (c.id === id) return true;
    if (c.replies && c.replies.length && existsInTree(c.replies, id))
      return true;
  }
  return false;
};

const countSubtree = (node: CommentItem): number => {
  if (!node) return 0;
  return 1 + (node.replies || []).reduce((s, r) => s + countSubtree(r), 0);
};

const removeNodeRecursive = (
  list: CommentItem[],
  id: string
): { list: CommentItem[]; removed: number } => {
  let removed = 0;
  const newList: CommentItem[] = [];

  for (const c of list) {
    if (c.id === id) {
      removed += countSubtree(c);
      continue;
    }

    if (c.replies && c.replies.length) {
      const res = removeNodeRecursive(c.replies, id);
      if (res.removed > 0) {
        removed += res.removed;
        newList.push({ ...c, replies: res.list });
        continue;
      }
    }

    newList.push(c);
  }

  return { list: newList, removed };
};

export const useCommentStore = create<CommentStoreState & CommentStoreActions>(
  (set, get) => ({
    activeTab: "comments",
    currentFilmId: null,
    comments: [],
    meta: null,
    totalComments: 0,
    replyingTo: null,
    isLoading: false,
    error: null,

    fetchComments: async (filmId, page = 1, limit = 10) => {
      set({ isLoading: true, error: null, currentFilmId: filmId });
      try {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        const res = isAuthenticated
          ? await CommentServices.getCommentsByFilmAuth(filmId, page, limit)
          : await CommentServices.getCommentsByFilmGuest(filmId, page, limit);

        if (res.EC !== 1 || !res.data) {
          set({
            error: res.EM || "Error fetching comments",
            isLoading: false,
          });
          return;
        }

        const data: CommentListData = res.data;
        set({
          comments: (data.comments || []).sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
          meta: data.meta,
          isLoading: false,
        });
      } catch (error: any) {
        console.error("fetchComments error", error);
        set({
          error: error?.message || "Error fetching comments",
          isLoading: false,
        });
      }
    },

    createComment: async (payload) => {
      set({ isLoading: true, error: null });
      try {
        const res = await CommentServices.createComment(payload);
        if (res.EC !== 1 || !res.data) {
          set({
            error: res.EM || "Error creating comment",
            isLoading: false,
          });
          return;
        }

        const fullComment = res.data.fullComment as BackendComment;
        const newItem = mapBackendToItem(fullComment);

        if (payload.parentId) {
          const addReplyRecursive = (comments: CommentItem[]): CommentItem[] =>
            comments.map((c) => {
              if (c.id === payload.parentId) {
                return { ...c, replies: [...(c.replies || []), newItem] };
              }
              return { ...c, replies: addReplyRecursive(c.replies || []) };
            });

          set((state) => {
            const updatedComments = addReplyRecursive(state.comments);
            return {
              comments: updatedComments,
              totalComments: (state.totalComments || 0) + 1,
            };
          });
        } else {
          set((state) => ({
            comments: [newItem, ...state.comments],
            totalComments: (state.totalComments || 0) + 1,
          }));
        }
      } catch (error: any) {
        console.error("createComment error", error);
        set({ error: error?.message || "Error creating comment" });
      } finally {
        set({ isLoading: false, replyingTo: null });
      }
    },

    deleteComment: async (commentId: string, filmId?: string) => {
      set({ isLoading: true, error: null });
      try {
        const res = await CommentServices.deleteComment(commentId);
        if (res.EC !== 1) {
          set({
            error: res.EM || "Could not delete comment",
            isLoading: false,
          });
          return;
        }
        set((state) => {
          const res = removeNodeRecursive(state.comments, commentId);
          return { ...state, comments: res.list, isLoading: false };
        });
        if (filmId) {
          await get().countComments(filmId);
        }
      } catch (error: any) {
        console.error("deleteComment error", error);
        set({
          error: error?.message || "Error deleting comment",
          isLoading: false,
        });
      }
    },

    reactComment: async (commentId, type) => {
      try {
        const res = await CommentServices.reactToComment(commentId, type);
        if (res.EC !== 1 || !res.data) {
          set({ error: res.EM || "Error reacting to comment" });
          return;
        }

        const { totalLike, totalDislike, userReaction } = res.data;

        const updateTree = (list: CommentItem[]): CommentItem[] =>
          list.map((c) => {
            const replies = c.replies || [];

            if (c.id === commentId) {
              return {
                ...c,
                totalLike,
                totalDislike,
                currentUserReaction: userReaction || undefined,
                replies: updateTree(replies),
              };
            }

            return {
              ...c,
              replies: updateTree(replies),
            };
          });

        set((state) => ({
          ...state,
          comments: updateTree(state.comments),
        }));
      } catch (error: any) {
        console.error("reactComment error", error);
        set({ error: error?.message || "Error reacting to comment" });
      }
    },

    countComments: async (filmId: string) => {
      try {
        const res = await CommentServices.countCommentsByFilm(filmId);
        if (res.EC !== 1 || !res.data) {
          set({ error: res.EM || "Error counting comments" });
          return;
        }
        set({ totalComments: res.data.totalComments });
      } catch (error: any) {
        console.error("countComments error", error);
        set({ error: error?.message || "Error counting comments" });
      }
    },

    removeCommentRealtime: (commentId: string) =>
      set((state) => {
        const res = removeNodeRecursive(state.comments, commentId);
        const newTotal = Math.max((state.totalComments || 0) - res.removed, 0);
        return { ...state, comments: res.list, totalComments: newTotal };
      }),

    createCommentRealtime: (newComment: BackendComment) =>
      set((state) => {
        const currentFilmId = state.currentFilmId;
        const commentFilmId = newComment.film?.filmId;
        if (currentFilmId && commentFilmId && currentFilmId !== commentFilmId) {
          return state;
        }

        const mappedComment = mapBackendToItem(newComment);
        const exists = existsInTree(state.comments, mappedComment.id);
        if (exists) return state;

        if (newComment.parent) {
          const addReplyRecursive = (
            comments: CommentItem[]
          ): CommentItem[] => {
            return comments.map((c) => {
              if (c.id === newComment.parent?.commentId) {
                return { ...c, replies: [...(c.replies || []), mappedComment] };
              }
              return {
                ...c,
                replies: addReplyRecursive(c.replies || []),
              };
            });
          };
          return {
            ...state,
            comments: addReplyRecursive(state.comments),
          };
        } else {
          return {
            ...state,
            comments: [mappedComment, ...state.comments],
          };
        }
      }),

    replyCommentRealtime: (data) =>
      set((state) => {
        const currentFilmId = state.currentFilmId;
        const commentFilmId = data.comment.film?.filmId;
        if (currentFilmId && commentFilmId && currentFilmId !== commentFilmId) {
          return state;
        }

        const mappedComment = mapBackendToItem(data.comment);
        const exists = existsInTree(state.comments, mappedComment.id);
        if (exists) {
          return state;
        }

        const addReplyRecursive = (comments: CommentItem[]): CommentItem[] => {
          return comments.map((c) => {
            if (c.id === data.parentId) {
              return { ...c, replies: [...(c.replies || []), mappedComment] };
            }
            return {
              ...c,
              replies: addReplyRecursive(c.replies || []),
            };
          });
        };
        return {
          ...state,
          comments: addReplyRecursive(state.comments),
        };
      }),

    countCommentsRealtime: (filmId: string, total?: number) => {
      if (!filmId) return;
      const currentFilmId = get().currentFilmId;
      if (currentFilmId && currentFilmId === filmId) {
        set(() => ({
          totalComments: typeof total === "number" ? total : 0,
        }));
      }
    },

    reactCommentRealtime: (reaction) => {
      const { commentId, totalLike, totalDislike, userReaction, userId } = reaction;
      const currentUser = useAuthStore.getState().authUser;
      const updateTree = (list: CommentItem[]): CommentItem[] =>
        list.map((c) => {
          const replies = c.replies || [];

          if (c.id === commentId) {
            return {
              ...c,
              totalLike,
              totalDislike,
              currentUserReaction:
                currentUser?.userId === userId
                  ? userReaction || undefined
                  : c.currentUserReaction,
              replies: updateTree(replies),
            };
          }

          return {
            ...c,
            replies: updateTree(replies),
          };
        });

      set((state) => ({
        ...state,
        comments: updateTree(state.comments),
      }));
    },

    hideCommentRealtime: (commentId: string, isHidden: boolean) => {
      set((state) => {
        let hiddenCount = 0;
        const findAndCount = (list: CommentItem[]): number => {
          for (const c of list) {
            if (c.id === commentId) {
              return countSubtree(c);
            }
            if (c.replies && c.replies.length) {
              const count = findAndCount(c.replies);
              if (count > 0) return count;
            }
          }
          return 0;
        };

        hiddenCount = findAndCount(state.comments);
        const hideTree = (list: CommentItem[]): CommentItem[] =>
          list
            .map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  isHidden,
                  replies: (c.replies || []).map((r) => ({ ...r, isHidden })),
                };
              }
              return {
                ...c,
                replies: hideTree(c.replies || []),
              };
            })
            .filter((c) => !c.isHidden);
        const newTotal = isHidden
          ? Math.max((state.totalComments || 0) - hiddenCount, 0)
          : (state.totalComments || 0) + hiddenCount;

        return {
          ...state,
          comments: hideTree(state.comments),
          totalComments: newTotal,
        };
      });
    },

    unhideCommentRealtime: (unhiddenComment: BackendComment) => {
      set((state) => {
        const mappedComment = mapBackendToItem(unhiddenComment);
        const exists = existsInTree(state.comments, mappedComment.id);
        if (exists) return state;

        // Nếu là root comment (không có parent)
        if (!unhiddenComment.parent) {
          return {
            ...state,
            comments: [mappedComment, ...state.comments],
            totalComments: (state.totalComments || 0) + 1,
          };
        }

        // Nếu là reply, thêm vào parent
        const addToParent = (list: CommentItem[]): CommentItem[] =>
          list.map((c) => {
            if (c.id === unhiddenComment.parent?.commentId) {
              return {
                ...c,
                replies: [...(c.replies || []), mappedComment],
              };
            }
            return {
              ...c,
              replies: addToParent(c.replies || []),
            };
          });

        return {
          ...state,
          comments: addToParent(state.comments),
          totalComments: (state.totalComments || 0) + 1,
        };
      });
    },

    setReplyingTo: (info) => set({ replyingTo: info }),
    setActiveTab: (tab) => set({ activeTab: tab }),
  })
);
