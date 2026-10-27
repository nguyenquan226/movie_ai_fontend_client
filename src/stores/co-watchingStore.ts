import roomServices from "@/services/co-watching/roomService";
import { roomPayload, roomRes } from "@/types/co_watching.type";
import { FilmDataStream, FilmImages } from "@/types/film.type";
import { toast } from "sonner";
import { create } from "zustand";

interface CoWatchingState {
  dataRoom: {
    room: roomRes,
    filmData: FilmDataStream;
  } | null;

  part: number;
  episode: number;
}

interface CoWatchingAction {
  resetDataRoom: () => void;
  createLiveRoom: (payload: roomPayload) => Promise<void>;
  getRoomData: (roomId: string) => Promise<void>;
  handleUpdateEpisode: (part: number, episode: number) => void;
}

export const useCoWatchingStore = create<CoWatchingState & CoWatchingAction>((set) => ({
  dataRoom: null,

  part: 1,
  episode: 1,

  resetDataRoom: () => {
    set({ dataRoom: null });
  },

  handleUpdateEpisode: (part, episode) => {
    set({ part: part, episode: episode });
  },

  createLiveRoom: async (payload) => {
    try {
      const res = await roomServices.createRoom(payload);
      if (res.EC !== 0) {
        toast.warning(res.EM);
        console.log(">>> Error create live stream room: ", res.EM);
      }
      if (res && res.data) {
        const filmImages = res.data.film.filmImages.reduce((acc, item) => {
          acc[item.type as keyof FilmImages] = item.url;
          return acc;
        }, {} as FilmImages);

        set({
          dataRoom: {
            room: res.data.room,
            filmData: { film: res.data.film, filmImages }
          },

          part: res.data.room.partNumber,
          episode: res.data.room.episodeNumber,
        });
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  },

  getRoomData: async (roomId) => {
    try {
      const res = await roomServices.getRoomData(roomId);
      if (res.EC !== 0) {
        toast.error("Had error when get data room");
        console.log(">>> Error get data room: ", res.EM);
      }
      if (res && res.data) {
        const filmImages = res.data.film.filmImages.reduce((acc, item) => {
          acc[item.type as keyof FilmImages] = item.url;
          return acc;
        }, {} as FilmImages);

        set({
          dataRoom: {
            room: res.data.room,
            filmData: { film: res.data.film, filmImages }
          },

          part: res.data.room.partNumber,
          episode: res.data.room.episodeNumber,
        });
      }

    } catch (error) {
      console.log("Error: ", error);
    }
  }

}))