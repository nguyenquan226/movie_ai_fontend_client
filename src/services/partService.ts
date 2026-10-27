import publicAxios from "@/lib/publicAxios";

import { IBackendRes } from "@/types/backend.type";
import { PartDetail, PartRes } from "@/types/part.type";

export const partServices = {
  getPartsByFilmId: (filmId: string): Promise<IBackendRes<PartRes>> => {
    return publicAxios.post("/parts/film", { filmId })
  },

  getPartById: (id: string): Promise<IBackendRes<PartDetail>> => publicAxios.get(`/parts/${id}`),
};
