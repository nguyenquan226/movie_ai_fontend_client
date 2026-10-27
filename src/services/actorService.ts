import publicAxios from "@/lib/publicAxios";
import { Actor, FilmActor } from "@/types/actor.type";
import { IBackendRes } from "@/types/backend.type";

export const actorServices = {
  getActorById: (actorId: string): Promise<IBackendRes<Actor>> => {
    return publicAxios.get(`/actor/get-actor-by-id/${actorId}`);
  },
  getActorBySlug: (actorSlug: string): Promise<IBackendRes<Actor>> => {
    return publicAxios.get(`/actor/get-actor-by-slug/${actorSlug}`);
  }
};
