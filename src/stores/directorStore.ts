import { create } from "zustand";
import { directorServices } from "@/services/directorService";
import { filmDirectorServices } from "@/services/filmDirectorService";
import { Director } from "@/types/director.type";
import { FilmDirectorRes } from "@/types/filmDirectorData";
import { FilmData } from "@/types/backend.type";

interface DirectorStoreState {
  director: Director | null;
  filmDirectorData: FilmDirectorRes | null;
  films: FilmData[];
  isLoadingDirector: boolean;
  isLoadingFilmDirector: boolean;
  error: string | null;
}

type DirectorAction = {
  fetchDirectorDetail: (directorId: string) => Promise<void>;
  fetchFilmDirector: (directorId: string) => Promise<void>;
  fetchFilmDirectorBySlug: (directorSlug: string) => Promise<void>;
  fetchDirectorBySlug: (directorSlug: string) => Promise<void>;
  clearDirector: () => void;
};

export const useDirectorStore = create<DirectorStoreState & DirectorAction>()(
  (set) => ({
    director: null,
    filmDirectorData: null,
    films: [],
    isLoadingDirector: false,
    isLoadingFilmDirector: false,
    error: null,

    fetchDirectorDetail: async (directorId: string) => {
      set({ isLoadingDirector: true, error: null });
      try {
        const res = await directorServices.getDirectorById(directorId);
        set({ director: res.data || null });
      } catch (error: any) {
        set({ error: error.message || "Error fetching director details" });
      } finally {
        set({ isLoadingDirector: false });
      }
    },

    fetchDirectorBySlug: async (directorSlug: string) => {
      set({ isLoadingDirector: true, error: null });
      try {
        const res = await directorServices.getDirectorBySlug(directorSlug);
        set({ director: res.data || null });
      } catch (error: any) {
        set({ error: error.message || "Error fetching director details" });
      } finally {
        set({ isLoadingDirector: false });
      }
    },

    fetchFilmDirectorBySlug: async (directorSlug: string) => {
      set({ isLoadingFilmDirector: true, error: null });
      try {
        const res = await filmDirectorServices.getFilmsByDirectorSlug(directorSlug);
        const data = res.data || null;
        const films = data?.result ?? [];
        set({
          filmDirectorData: data,
          films,
        });
      } catch (error: any) {
        set({ error: error.message || "Error fetching film director data" });
      } finally {
        set({ isLoadingFilmDirector: false });
      }
    },


    fetchFilmDirector: async (directorId: string) => {
      set({ isLoadingFilmDirector: true, error: null });
      try {
        const res = await filmDirectorServices.getFilmsByDirectorId(directorId);
        const data = res.data || null;
        const films = data?.result ?? [];
        set({
          filmDirectorData: data,
          films,
        });
      } catch (error: any) {
        set({ error: error.message || "Error fetching film director data" });
      } finally {
        set({ isLoadingFilmDirector: false });
      }
    },

    clearDirector: () =>
      set({ director: null, filmDirectorData: null, films: [], error: null }),
  })
);
