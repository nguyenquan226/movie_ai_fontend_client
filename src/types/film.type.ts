import { AllCodeValue } from "./allcode.type";
import { Actor } from "./actor.type";
import { Director } from "./director.type";
import { Producer } from "./producer.type";

export interface FilmImageRes {
  url: string;
  type: "backdrop" | "horizontal" | "poster";
}

export interface FilmImages {
  backdrop: string;
  horizontal: string;
  poster: string;
}

export interface Film {
  filmId: string;
  originalTitle: string;
  title: string;
  isVip: boolean;
  duration: number;
  description: string;
  releaseDate: string;
  year: string;
  thumbUrl: string;
  slug: string;
  view: number;
  filmImages: FilmImageRes[];
  age: AllCodeValue;
  type: AllCodeValue;
  genres: AllCodeValue[];
  country: AllCodeValue;
  lang: AllCodeValue;
  publicStatus: AllCodeValue;
}

export interface FilmDetailRes {
  film: Film;
  directors: Director[];
  actors: Actor[];
  producers: Producer[];
}

export interface FilmDetail extends FilmDetailRes {
  filmImages: FilmImages;
}

export interface FilmDataStream {
  film: Film;
  filmImages: FilmImages;
}

export interface IFilmVipRes {
  filmId: string;
  originalTitle: string;
  title: string;
  isVip: boolean;
  duration: number;
  description: string;
  year: string;
  slug: string;
  view: number;
  filmImages: FilmImageRes[];
}

export interface IFilmSuggestRes {
  filmId: string;
  originalTitle: string;
  title: string;
  isVip: boolean;
  duration: number;
  description: string;
  year: string;
  slug: string;
  view: number;
  filmImages: FilmImageRes[];
  age: AllCodeValue;
  country: AllCodeValue;
}