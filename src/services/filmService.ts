import privateAxios from "@/lib/privateAxios";
import publicAxios from "@/lib/publicAxios";

const baseURL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

import { IBackendRes, RatingRes } from "@/types/backend.type";
import { FilmDetailRes, IFilmSuggestRes, IFilmVipRes } from "@/types/film.type";

const filmServices = {
  updateView: (filmId: string): Promise<IBackendRes<unknown>> => {
    return privateAxios.post(`/films/${filmId}/view`);
  },

  getFilmSuggest: (): Promise<IBackendRes<{ result: IFilmSuggestRes[] }>> => {
    return publicAxios.get('/films/suggest-list');
  },

  getFilmById: (filmId: string): Promise<IBackendRes<FilmDetailRes>> => {
    return publicAxios.get(`/films/${filmId}`);
  },

  getFilmBySlug: (filmSLug: string): Promise<IBackendRes<FilmDetailRes>> => {
    return publicAxios.get(`/films/slug/${filmSLug}`);
  },

  getActorByFilmId: (filmId: string): Promise<IBackendRes<FilmDetailRes>> => {
    return publicAxios.get(`/film-actor/get-actors-by-film/${filmId}`);
  },

  getDirectorByFilm: (filmId: string): Promise<IBackendRes<FilmDetailRes>> => {
    return publicAxios.get(`/film-director/by-film/${filmId}`);
  },

  getRatingsByFilmId: (
    filmId: string
  ): Promise<IBackendRes<{ result: RatingRes }>> => {
    return publicAxios.get(`/rating/get-rating-by-film/${filmId}`);
  },

  getAllVip: (): Promise<IBackendRes<{ result: IFilmVipRes[] }>> => {
    return publicAxios.get('/films/film-vip');
  },

  async getAll() {
    return publicAxios.get(`${baseURL}/films?current=1&pageSize=10`);
  },
  async getById(id: string) {
    return publicAxios.get(`${baseURL}/films/${id}`);
  },
  async getHeroSlides() {
    return publicAxios.get(`${baseURL}/films?current=1&pageSize=5`);
  },
  async getByCountry(countryName: string, page: number = 1, pageSize: number = 20) {
    return publicAxios.get(`/films/by-country/${countryName}?current=${page}&pageSize=${pageSize}`);
  },
  async getByGenre(genreName: string, page: number = 1, pageSize: number = 20) {
    return publicAxios.get(`/films/by-genre/${genreName}?current=${page}&pageSize=${pageSize}`);
  },
  async getByType(typeValue: string, page = 1, pageSize = 20) {
    return publicAxios.get(`/films/by-type/${typeValue}?current=${page}&pageSize=${pageSize}`)
  },
  async searchFilms(
    filters: {
      country?: string
      type?: string
      age_code?: string
      genre?: string
      version?: string
      year?: string
    },
    sort?: string,
    page = 1,
    pageSize = 20,
  ) {
    const params = new URLSearchParams()

    if (filters.country) params.append("country", filters.country)
    if (filters.type) params.append("type", filters.type)
    if (filters.age_code) params.append("age_code", filters.age_code)
    if (filters.genre) params.append("genre", filters.genre)
    if (filters.version) params.append("version", filters.version)
    if (filters.year) params.append("year", filters.year)
    if (sort) params.append("sort", sort)
    params.append("current", page.toString())
    params.append("limit", pageSize.toString())

    return publicAxios.get(`/films/filter/search?${params.toString()}`)
  },
};

export default filmServices;
