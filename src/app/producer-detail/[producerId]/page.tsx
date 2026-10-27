"use client"

import ProducerInfo from "@/components/producer/ProducerInfo"
import FilmProducer from "@/components/producer/FilmProducer"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useProducerStore } from "@/stores/producerStore"

export default function ProducerDetail() {
    const producerId = useParams().producerId as string
    const {
        isLoadingProducer,
        isLoadingFilmProducer,
        fetchProducerDetail,
        fetchFilmProducer,
        producer,
        filmProducerData,
        error,
    } = useProducerStore()

    useEffect(() => {
        if (!producerId) return
        fetchProducerDetail(producerId)
        fetchFilmProducer(producerId)
    }, [producerId])

    if (isLoadingProducer || isLoadingFilmProducer)
        return <div className="text-center py-20">Đang tải thông tin nhà sản xuất...</div>

    if (error) return <div className="text-center py-20 text-red-500">{error}</div>

    if (!producer) return <div className="text-center py-20">Không tìm thấy thông tin nhà sản xuất.</div>

    if (!filmProducerData) {
        return <div className="text-center py-20">Nhà sản xuất này chưa tham gia bộ phim nào.</div>
    }

    return (
        <main className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden mt-24">
            <section className="relative flex-1 w-full">
                <div className="max-w-[1400px] mx-auto px-2 sm:px-2 lg:px-2">
                    <div className="flex flex-col gap-10">
                        <div className="border-b border-border pb-6">
                            <ProducerInfo />
                        </div>
                        <div className="pt-6">
                            <FilmProducer />
                        </div>

                    </div>
                </div>
            </section>
        </main>

    )
}
