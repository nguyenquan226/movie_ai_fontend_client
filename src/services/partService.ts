import publicAxios from "@/lib/publicAxios";

import { IBackendRes } from "@/types/backend.type";
import { PartData } from "@/types/part.type";

export const partServices = {
  getPartsByFilmId: (filmId: string): Promise<IBackendRes<PartData>> => {
    return publicAxios.post("/parts/film", { filmId })
  },

  getPartById: (id: string): Promise<IBackendRes<DetailPart>> => publicAxios.get(`/parts/${id}`),
};
