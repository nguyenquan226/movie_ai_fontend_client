import publicAxios from "@/lib/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import { FilmDirectorGroup, FilmDirectorRes } from "@/types/filmDirectorData";
import { get } from "http";

export const filmDirectorServices = {
  getDirectorsByFilmId: (filmId: string) => {
    return publicAxios.get(`/film-director/by-film/${filmId}`);
  },
  getFilmDirectorId: (id: number) => {
    return publicAxios.get(`/film-director/get-film-director-by-id/${id}`);
  },

  getFilmsByDirectorId: (
    directorId: string
  ): Promise<IBackendRes<FilmDirectorRes>> => {
    return publicAxios.get(`/film-director/by-director/${directorId}`);
  },
  groupFilmsByDirectorLodash: (): Promise<IBackendRes<FilmDirectorGroup>> => {
    return publicAxios.get(`/film-director/group-directors-and-films-lodash`);
  },
  getFilmsByDirectorSlug: (
    directorSlug: string
  ): Promise<IBackendRes<FilmDirectorRes>> => {
    return publicAxios.get(`/film-director/by-director-slug/${directorSlug}`);
  }

};
