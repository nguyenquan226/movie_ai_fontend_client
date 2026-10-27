import { FilmData } from "./backend.type";
import { Director } from "./director.type";
import { Film } from "./film.type";

export interface FilmDirectorRes {
  film: Film;
  director: Director;
  result: FilmData[];
}



export interface FilmDirectorItem {
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


export interface FilmDirectorGroup {
  director: string;
  filmList: FilmDirectorItem[];
}
