import { create } from "zustand";

import { FilmDetail, FilmImages } from "@/types/film.type";
import type { FilmDetailRes as FilmListItem } from "@/types/filmType";
import filmServices from "@/services/filmService";
import { partServices } from "@/services";
import { RatingRes } from "@/types/backend.type";
import { PartDetail, PartRes } from "@/types/part.type";

interface FilmState {
  isLoading: boolean;
  error: string | null;
  loading: boolean;
  loadingPart: boolean;
  loadingCountry: boolean
  loadingGenre: boolean
  loadingHeroSlides: boolean
  filmData: FilmDetail | null;
  partDetail: PartRes | null;
  ratingData: RatingRes | null;
  partData: PartDetail[] | null;
  koreanFilms: FilmListItem[]
  chineseFilms: FilmListItem[]
  usukFilms: FilmListItem[]
  genreFilms: FilmListItem[]
  heroFilms: FilmListItem[]
  totalPages: number
}

const initialFilmDetail = {
  filmData: null,
  partDetail: null,
  ratingData: null,
  partData: null,
  koreanFilms: [],
  chineseFilms: [],
  usukFilms: [],
  genreFilms: [],
  heroFilms: [],
  totalPages: 1,
};

interface FilmAction {
  resetFilmDetail: () => void;
  getRatingByFilmId: (filmId: string) => Promise<void>;
  getDetailFilm: (filmId: string) => Promise<void>;
  getPartData: (filmId: string) => Promise<void>;
  fetchKoreanFilms: () => Promise<void>
  fetchChineseFilms: () => Promise<void>
  fetchUSUKFilms: () => Promise<void>
  fetchFilmsByGenre: (genre: string, page?: number) => Promise<void>
  fetchHeroSlides: () => Promise<void>
}

export const useFilmStore = create<FilmState & FilmAction>()((set) => ({
  ...initialFilmDetail,
  loading: false,
  loadingPart: false,
  loadingCountry: false,
  loadingGenre: false,
  loadingHeroSlides: false,
  ratingData: null,
  filmParts: null,
  isLoading: false,
  error: null,

  resetFilmDetail: () => set(initialFilmDetail),

  getRatingByFilmId: async (filmId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await filmServices.getRatingsByFilmId(filmId);
      if (res.data?.result) {
        set({ ratingData: res.data?.result || null });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      set({ error: "Something went wrong" });
    } finally {
      set({ isLoading: false });
    }
  },

  getDetailFilm: async (filmSlug) => {
    set({ loading: true, error: null });
    try {
      const res = await filmServices.getFilmBySlug(filmSlug);

      if (res.EC !== 0) {
        set({ error: res.EM });
        console.error("Error FilmStore getDetailFilm: ", res.EM);
      }

      if (res.data) {
        const filmImages = res.data.film.filmImages.reduce((acc, item) => {
          acc[item.type as keyof FilmImages] = item.url;
          return acc;
        }, {} as FilmImages);

        set({
          filmData: { ...res.data, filmImages },
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      set({ error: "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },

  getPartData: async (filmId) => {
    set({ loadingPart: true, error: null });
    try {
      const res = await partServices.getPartsByFilmId(filmId);

      if (res.EC !== 0) {
        set({ error: res.EM });
        console.error("Error FilmStore getDetailFilm: ", res.EM);
      }

      if (res.data) {
        set({ partDetail: res.data });
        set({ partData: res.data.partData });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      set({ error: "Something went wrong" });
    } finally {
      set({ loadingPart: false });
    }
  },

  fetchKoreanFilms: async () => {
    set({ loadingCountry: true, error: null })
    try {
      const res = await filmServices.getByCountry("Korea", 1)
      const films = res.data?.result || []
      set({ koreanFilms: films })
    } catch (error) {
      console.error("Error fetching Korean films:", error)
      set({ error: "Failed to fetch Korean films" })
    } finally {
      set({ loadingCountry: false })
    }
  },

  fetchChineseFilms: async () => {
    set({ loadingCountry: true, error: null })
    try {
      const res = await filmServices.getByCountry("China", 1)
      const films = res.data?.result || []
      set({ chineseFilms: films })
    } catch (error) {
      console.error("Error fetching Chinese films:", error)
      set({ error: "Failed to fetch Chinese films" })
    } finally {
      set({ loadingCountry: false })
    }
  },

  fetchUSUKFilms: async () => {
    set({ loadingCountry: true, error: null })
    try {
      const res = await filmServices.getByCountry("USA", 1)
      const films = res.data?.result || []
      set({ usukFilms: films })
    } catch (error) {
      console.error("Error fetching US/UK films:", error)
      set({ error: "Failed to fetch US/UK films" })
    } finally {
      set({ loadingCountry: false })
    }
  },

  fetchFilmsByGenre: async (genre: string, page = 1) => {
    set({ loadingGenre: true, error: null })
    try {
      const res = await filmServices.getByGenre(genre, page)
      const films = res.data?.result || []
      const meta = res.data?.meta
      set({
        genreFilms: films,
        totalPages: meta?.totalPages || 1,
      })
    } catch (error) {
      console.error("Error fetching films by genre:", error)
      set({ error: "Failed to fetch genre films" })
    } finally {
      set({ loadingGenre: false })
    }
  },

  fetchHeroSlides: async () => {
    set({ loadingHeroSlides: true, error: null })
    try {
      const res = await filmServices.getHeroSlides()
      const films = res.data?.result || []
      set({ heroFilms: films })
    } catch (error) {
      console.error("Error fetching hero slides:", error)
      set({ error: "Failed to fetch hero slides" })
    } finally {
      set({ loadingHeroSlides: false })
    }
  },
}));
