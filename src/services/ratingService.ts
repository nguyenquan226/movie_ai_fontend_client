import publicAxios from "@/lib/publicAxios";
import privateAxios from "@/lib/privateAxios";
import { IBackendRes, RatingRes } from "@/types/backend.type";

export const ratingService = {
  getRatingsByFilm: (
    filmId: string
  ): Promise<IBackendRes<{ result: RatingRes }>> => {
    return publicAxios.get(`/rating/get-rating-by-film/${filmId}`);
  },

  createRating: (data: {
    filmId: string;
    ratingValue: number;
    content?: string;
  }): Promise<IBackendRes<unknown>> => {
    return privateAxios.post("/rating/create-rating", data);
  },

  deleteRating: (ratingId: string): Promise<IBackendRes<unknown>> => {
    return privateAxios.delete(`/rating/delete-rating/${ratingId}`);
  },

  reportRating: (
    ratingId: string,
    reason: string,
    description?: string
  ): Promise<IBackendRes<null>> => {
    return privateAxios.post(`/report`, {
      reportType: "RATING",
      targetId: ratingId,
      reason,
      description,
    });
  },
};
