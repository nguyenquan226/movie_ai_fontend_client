import { create } from "zustand";
import { actorServices } from "@/services/actorService";
import { filmActorServices } from "@/services/filmActorService";
import { Actor } from "@/types/actor.type";
import { FilmData } from "@/types/backend.type";
import { FilmActorRes } from "@/types/filmActorData";

interface ActorStoreState {
  actor: Actor | null;
  filmActorData: FilmActorRes | null;
  films: FilmData[];
  isLoadingActor: boolean;
  isLoadingFilmActor: boolean;
  error: string | null;
}

type ActorDataAction = {
  fetchActorDetail: (actorId: string) => Promise<void>;
  fetchActorDetailBySlug: (actorSlug: string) => Promise<void>;
  fetchFilmActor: (actorId: string) => Promise<void>;
  fetchFilmsByActorSlug: (actorSlug: string) => Promise<void>;
  clearActor: () => void;
};

export const useActorStore = create<ActorStoreState & ActorDataAction>()(
  (set) => ({
    actor: null,
    filmActorData: null,
    films: [],
    isLoadingActor: false,
    isLoadingFilmActor: false,
    error: null,

    fetchActorDetail: async (actorId: string) => {
      set({ isLoadingActor: true, error: null });
      try {
        const res = await actorServices.getActorById(actorId);
        set({ actor: res.data || null });
      } catch (error: any) {
        set({ error: error.message || "Error fetching actor details" });
      } finally {
        set({ isLoadingActor: false });
      }
    },
    fetchActorDetailBySlug: async (actorSlug: string) => {
      set({ isLoadingActor: true, error: null });
      try {
        const res = await actorServices.getActorBySlug(actorSlug);
        set({ actor: res.data || null });
      }
      catch (error: any) {
        set({ error: error.message || "Error fetching actor details" });
      } finally {
        set({ isLoadingActor: false });
      }
    },

    fetchFilmActor: async (actorId: string) => {
      set({ isLoadingFilmActor: true, error: null });
      try {
        const res = await filmActorServices.getFilmsByActorId(actorId);
        const data = res.data || null;
        const films = data?.result ?? [];

        set({
          filmActorData: data,
          films,
        });
      } catch (error: any) {
        set({ error: error.message || "Error fetching film actor data" });
      } finally {
        set({ isLoadingFilmActor: false });
      }
    },
    fetchFilmsByActorSlug: async (actorSlug: string) => {
      set({ isLoadingFilmActor: true, error: null });
      try {
        const res = await filmActorServices.getFilmsByActorSlug(actorSlug);
        const data = res.data || null;
        const films = data?.result ?? [];
        set({
          filmActorData: data,
          films,
        });
      } catch (error: any) {
        set({ error: error.message || "Error fetching film actor data" });
      } finally {
        set({ isLoadingFilmActor: false });
      }
    },
    clearActor: () =>
      set({
        actor: null,
        filmActorData: null,
        films: [],
        error: null,
      }),
  })
);
