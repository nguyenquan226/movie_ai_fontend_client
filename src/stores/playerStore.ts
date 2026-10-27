import { create } from "zustand";

interface PlayerStoreState {
  part: string;
  episode: string;
}

interface PlayerStoreAcion {
  handleInfoPlayer: (part: string, episode: string) => void,
  resetInfoPlayer: () => void,
}

export const usePlayerStore = create<PlayerStoreState & PlayerStoreAcion>()((set, get) => ({
  part: "",
  episode: "",

  handleInfoPlayer: (part, episode) => {
    set({ part: part, episode: episode });
  },

  resetInfoPlayer: () => {
    set({ part: "", episode: "" });
  }
}))