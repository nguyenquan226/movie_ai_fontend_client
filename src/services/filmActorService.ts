import publicAxios from "@/lib/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import { FilmActorGroup, FilmActorRes } from "@/types/filmActorData";

export const filmActorServices = {
  getActorsByFilmId: (filmId: string) => {
    return publicAxios.get(`/film-actor/get-actors-by-film/${filmId}`);
  },
  getFilmActorId: (id: number) => {
    return publicAxios.get(`/film-actor/get-film-actor-by-id/${id}`);
  },
  getFilmsByActorId: (actorId: string): Promise<IBackendRes<FilmActorRes>> => {
    return publicAxios.get(`/film-actor/get-films-by-actor/${actorId}`);
  },
  getFilmsByActorSlug: (actorSlug: string): Promise<IBackendRes<FilmActorRes>> => {
    return publicAxios.get(`/film-actor/get-films-by-actor-slug/${actorSlug}`);
  },
  groupFilmsByActorLodash: (): Promise<IBackendRes<FilmActorGroup>> => {
    return publicAxios.get(`/film-actor/group-films-by-actor-lodash`);
  }
};
