import publicAxios from "@/lib/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import { Director } from "@/types/director.type";

export const directorServices = {
  getDirectorById: (directorId: string): Promise<IBackendRes<Director>> => {
    return publicAxios.get(`/director/get-director-by-id/${directorId}`);
  },
  getDirectorBySlug: (directorSlug: string): Promise<IBackendRes<Director>> => {
    return publicAxios.get(`/director/get-director-by-slug/${directorSlug}`);
  }
};
