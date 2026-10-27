import { Actor } from "./actor.type";
import { FilmData } from "./backend.type";
import { Film } from "./film.type";
import { FilmDirectorItem } from "./filmDirectorData";

export interface FilmActorRes {
  film: Film;
  actor: Actor;
  result: FilmData[];
}
export interface FilmActorItem {
  filmId: string;
  originalTitle: string;
  title: string;
  description: string;
  releaseDate: string;
  year: string;
  thumbUrl: string;
  slug: string;
  duration: number;
  age: string;
  type: string;
  country: string;
  language: string;
  publicStatus: string;
}


export interface FilmActorGroup {
  actor: string;
  filmList: FilmActorItem[];
}
