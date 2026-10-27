import { userServices } from "@/services";
import { IPlaylist } from "@/types/user.type";
import { create } from "zustand";

interface IPlaylistState {
  isLoadingPlaylist: boolean;
  userPlaylists: IPlaylist[];
}

type PlaylistAction = {
  setLoading: (value: boolean) => void;
  fetchPlaylists: () => Promise<void>;
  refetchPlaylists: () => Promise<void>;
};

const initialPlaylistState = {
  isLoadingPlaylist: false,
  userPlaylists: [],
};

export const userPlaylistStore = create<IPlaylistState & PlaylistAction>()(
  (set, get) => ({
    ...initialPlaylistState,
    setLoading: (value: boolean) =>
      set((state) => ({
        ...state,
        isLoadingPlaylist: value,
      })),

    fetchPlaylists: async () => {
      set({ isLoadingPlaylist: true });
      try {
        const res = await userServices.CallGetUserPlaylist();
        if (res && res.EC === 1) {
          set({ userPlaylists: res.data?.playlists });
        }
      } catch (error) {
        console.log("check eror", error);
      } finally {
        await new Promise((r) => setTimeout(r, 500));
        set({ isLoadingPlaylist: false });
      }
    },

    refetchPlaylists: async () => {
      set({ isLoadingPlaylist: true });
      try {
        const res = await userServices.CallGetUserPlaylist();
        if (res && res.EC === 1) {
          set({ userPlaylists: res.data?.playlists });
        }
      } catch (error) {
        console.log("check eror", error);
      } finally {
        set({ isLoadingPlaylist: false });
      }
    },
  })
);
