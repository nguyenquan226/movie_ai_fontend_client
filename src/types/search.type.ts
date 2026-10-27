export interface ISearchFilmResponse {
  films: IFilmSearch[];
}

export interface IFilmSearch {
  filmId: string;
  title: string;
  originalTitle: string;
  isVip: boolean;
  thumbUrl: string;
  slug: string;
  year: string;
  description: string;
}

export interface IActorSearch {
  actorId: number;
  actorName: string;
  slug: string;
  avatarUrl: string;
}

export interface IDirectorSearch {
  directorId: number;
  directorName: string;
  slug: string;
  avatarUrl: string;
}

export interface IProducerSearch {
  producerId: number;
  producerName: string;
  slug: string;
}

export interface ISearchActorResponse {
  actors: IActorSearch[];
}

export interface ISearchDirectorResponse {
  directors: IDirectorSearch[];
}

export interface ISearchProducerResponse {
  producers: IProducerSearch[];
}
