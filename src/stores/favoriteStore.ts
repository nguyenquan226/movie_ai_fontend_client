import { userServices } from "@/services";
import { filmInUserPage } from "@/types/user.type";
import { create } from "zustand";

interface IFavoriteState {
  isLoadingFavoriteList: boolean;
  favoriteList: filmInUserPage[];
}

type FavoriteAction = {
  setLoading: (value: boolean) => void;
  fetchFavoriteList: () => Promise<void>;
};

const initialFavoriteListState = {
  isLoadingFavoriteList: false,
  favoriteList: [],
};

export const userFavoriteStore = create<IFavoriteState & FavoriteAction>()(
  (set) => ({
    ...initialFavoriteListState,
    setLoading: (value: boolean) =>
      set((state) => ({
        ...state,
        isLoadingFavoriteList: value,
      })),

    fetchFavoriteList: async () => {
      try {
        const res = await userServices.callFavoriteFilmsList();
        if (res && res.EC === 1) {
          set({ favoriteList: res.data?.favorites });
        }
      } catch (error) {
        console.log("check eror", error);
      }
    },
  })
);
