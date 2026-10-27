// src/services/commentService.ts

import privateAxios from "@/lib/privateAxios";
import publicAxios from "@/lib/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import {
  CommentPayload,
  CommentListData,
  CreateCommentData,
  CommentReactionType,
  CountCommentsData,
} from "@/types/comment.type";


export const CommentServices = {
  getCommentsByFilmGuest: (
    filmId: string,
    page = 1,
    limit = 10
  ): Promise<IBackendRes<CommentListData>> => {
    return publicAxios.get(
      `/comment/get-comments-by-film-guest/${filmId}?page=${page}&limit=${limit}`
    );
  },

  getCommentsByFilmAuth: (
    filmId: string,
    page = 1,
    limit = 10
  ): Promise<IBackendRes<CommentListData>> => {
    return privateAxios.get(
      `/comment/get-comments-by-film/${filmId}?page=${page}&limit=${limit}`
    );
  },

  createComment: (
    payload: CommentPayload
  ): Promise<IBackendRes<CreateCommentData>> => {
    return privateAxios.post(`/comment/create-comment`, payload);
  },

  deleteComment: (commentId: string): Promise<IBackendRes<null>> => {
    return privateAxios.delete(`/comment/delete-comment/${commentId}`);
  },

  countCommentsByFilm: (filmId: string): Promise<IBackendRes<CountCommentsData>> => {
    return publicAxios.get(`/comment/count-by-film/${filmId}`);
  },

  reactToComment: (
    commentId: string,
    type: CommentReactionType
  ): Promise<IBackendRes<any>> => {
    return privateAxios.post(`/comment-reactions/create-reaction`, {
      commentId,
      type,
    });
  },

  reportComment: (
    commentId: string,
    reason: string,
    description?: string
  ): Promise<IBackendRes<any>> => {
    return privateAxios.post(`/report`, {
      reportType: "COMMENT",
      targetId: commentId,
      reason,
      description,
    });
  },
};
