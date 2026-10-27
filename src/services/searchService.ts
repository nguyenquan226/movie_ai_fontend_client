import publicAxios from "@/lib/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import {
  ISearchActorResponse,
  ISearchDirectorResponse,
  ISearchFilmResponse,
  ISearchProducerResponse,
} from "@/types/search.type";

const baseURL = process.env.NEXT_PUBLIC_API_BACKEND_URL;
export const searchService = {
  //   callLogin: (credentials: LoginInput): Promise<IBackendRes<IAccount>> => {
  //     return publicAxios.post(`${baseURL}/auth/login`, credentials);
  //   },
  callSearchFilm: (
    keyword: string
  ): Promise<IBackendRes<ISearchFilmResponse>> => {
    return publicAxios.get(`${baseURL}/search/films`, {
      params: {
        q: keyword,
      },
    });
  },

  searchActor: async (
    query: string
  ): Promise<IBackendRes<ISearchActorResponse>> => {
    return publicAxios.get(`/search/actors`, {
      params: {
        q: query,
      },
    });
  },

  searchDirector: async (
    query: string
  ): Promise<IBackendRes<ISearchDirectorResponse>> => {
    return publicAxios.get(`/search/directors`, {
      params: {
        q: query,
      },
    });
  },

  searchProducer: async (
    query: string
  ): Promise<IBackendRes<ISearchProducerResponse>> => {
    return publicAxios.get(`/search/producers`, {
      params: {
        q: query,
      },
    });
  },
};
