import { create } from "zustand"
import { filmProducerServices } from "@/services/filmProducerService"
import type { Producer } from "@/types/producer.type"
import type { FilmDirectorRes } from "@/types/filmDirectorData"
import type { FilmData } from "@/types/backend.type"

interface ProducerStoreState {
    producer: Producer | null
    filmProducerData: FilmDirectorRes | null
    films: FilmData[]
    isLoadingProducer: boolean
    isLoadingFilmProducer: boolean
    error: string | null
}

type ProducerAction = {
    fetchProducerDetail: (producerId: string) => Promise<void>
    fetchFilmProducer: (producerId: string) => Promise<void>
    clearProducer: () => void
}

export const useProducerStore = create<ProducerStoreState & ProducerAction>()((set) => ({
    producer: null,
    filmProducerData: null,
    films: [],
    isLoadingProducer: false,
    isLoadingFilmProducer: false,
    error: null,

    fetchProducerDetail: async (producerId: string) => {
        set({ isLoadingProducer: true, error: null })
        try {
            const res = await filmProducerServices.getFilmProducerId(Number(producerId))
            set({ producer: res.data.result.producer || null })
        } catch (error: any) {
            set({ error: error.message || "Error fetching producer details" })
        } finally {
            set({ isLoadingProducer: false })
        }
    },
    fetchFilmProducer: async (producerId: string) => {
        set({ isLoadingFilmProducer: true, error: null })
        try {
            const res = await filmProducerServices.getFilmsByProducerId(producerId)
            const data = res.data || null
            const films = data?.result ?? []
            set({
                filmProducerData: data,
                films,
            })
        } catch (error: any) {
            set({ error: error.message || "Error fetching film producer data" })
        } finally {
            set({ isLoadingFilmProducer: false })
        }
    },

    clearProducer: () => set({ producer: null, filmProducerData: null, films: [], error: null }),
}))
