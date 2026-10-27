import publicAxios from "@/lib/publicAxios"
import type { IBackendRes } from "@/types/backend.type"
import type { FilmDirectorRes } from "@/types/filmDirectorData"

export const filmProducerServices = {
    getProducersByFilmId: (filmId: string) => {
        return publicAxios.get(`/film-producer/by-film/${filmId}`)
    },
    getFilmProducerId: (id: number) => {
        return publicAxios.get(`/film-producer/get-film-producer-by-id/${id}`)
    },
    getFilmsByProducerId: (producerId: string): Promise<IBackendRes<FilmDirectorRes>> => {
        return publicAxios.get(`/film-producer/by-producer/${producerId}`)
    },
}
