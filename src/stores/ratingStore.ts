import { create } from "zustand";
import { ratingService } from "@/services/ratingService";

interface RatingItem {
  ratingId: string;
  ratingValue: number;
  content?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}

interface RatingStoreState {
  ratings: RatingItem[];
  averageRating: number;
  totalRatings: number;
  isLoading: boolean;
  error: string | null;
}

interface RatingStoreActions {
  fetchRatings: (filmId: string) => Promise<void>;
  createRating: (data: {
    filmId: string;
    ratingValue: number;
    content?: string;
  }) => Promise<void>;
  deleteRating: (ratingId: string) => Promise<void>;
  updateRatingRealtime: (data: {
    filmId: string;
    averageRating: number;
    totalRatings: number;
    newRating?: RatingItem;
  }) => void;
  deleteRatingRealtime: (ratingId: string) => void;
  hideRatingRealtime: (ratingId: string, isHidden: boolean, filmId: string) => void;
  reset: () => void;
}

export const useRatingStore = create<RatingStoreState & RatingStoreActions>(
  (set, get) => ({
    ratings: [],
    averageRating: 0,
    totalRatings: 0,
    isLoading: false,
    error: null,

    fetchRatings: async (filmId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = (await ratingService.getRatingsByFilm(filmId)) as any;

        if (response?.EC === 1) {
          const result = response.result || response.data?.result;

          if (result) {
            set({
              ratings: result.list || [],
              averageRating: result.averageRating || 0,
              totalRatings: result.totalRatings || 0,
              isLoading: false,
            });
          } else {
            set({
              ratings: [],
              averageRating: 0,
              totalRatings: 0,
              isLoading: false,
            });
          }
        } else {
          set({
            error: response?.EM || "Error fetching ratings",
            isLoading: false,
          });
        }
      } catch (error: any) {
        console.error("fetchRatings error", error);
        set({
          error: error?.message || "Error fetching ratings",
          isLoading: false,
        });
      }
    },

    createRating: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = (await ratingService.createRating(data)) as any;

        if (response.EC === 1) {
          set({ isLoading: false });
          return response;
        } else {
          set({
            error: response.EM || "Error creating rating",
            isLoading: false,
          });
          throw new Error(response.EM || "Error creating rating");
        }
      } catch (error: any) {
        console.error("createRating error", error);
        set({
          error: error?.message || "Error creating rating",
          isLoading: false,
        });
        throw error;
      }
    },

    deleteRating: async (ratingId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = (await ratingService.deleteRating(ratingId)) as any;

        if (response.EC === 1) {
          set({ isLoading: false });
          return response;
        } else {
          set({
            error: response.EM || "Error deleting rating",
            isLoading: false,
          });
          throw new Error(response.EM || "Error deleting rating");
        }
      } catch (error: any) {
        console.error("deleteRating error", error);
        set({
          error: error?.message || "Error deleting rating",
          isLoading: false,
        });
        throw error;
      }
    },

    updateRatingRealtime: (data) => {
      set((state) => {
        const { averageRating, totalRatings, newRating } = data;

        if (newRating) {
          const existingIndex = state.ratings.findIndex(
            (r) => r.ratingId === newRating.ratingId
          );

          if (existingIndex >= 0) {
            const updatedRatings = [...state.ratings];
            updatedRatings[existingIndex] = newRating;
            return {
              ...state,
              ratings: updatedRatings,
              averageRating,
              totalRatings,
            };
          }

          return {
            ...state,
            ratings: [newRating, ...state.ratings],
            averageRating,
            totalRatings,
          };
        }

        return {
          ...state,
          averageRating,
          totalRatings,
        };
      });
    },

    deleteRatingRealtime: (ratingId: string) => {
      set((state) => ({
        ...state,
        ratings: state.ratings.filter((r) => r.ratingId !== ratingId),
      }));
    },
    hideRatingRealtime: (ratingId: string, isHidden: boolean, filmId: string) => {
      if (isHidden) {
        set((state) => {
          const newRatings = state.ratings.filter((r) => r.ratingId !== ratingId);
          let newAverage = 0;
          if (newRatings.length > 0) {
            const sum = newRatings.reduce((acc, r) => acc + r.ratingValue, 0);
            newAverage = Number((sum / newRatings.length).toFixed(1));
          }

          return {
            ...state,
            ratings: newRatings,
            totalRatings: newRatings.length,
            averageRating: newAverage,
          };
        });
      } else {
        // Khi unhide rating, fetch lại danh sách ratings
        get().fetchRatings(filmId);
      }
    },
    reset: () =>
      set({
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
        isLoading: false,
        error: null,
      }),
  })
);
