"use client"
import { useRef, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "swiper/css"
import "swiper/css/free-mode"
import { AnimatePresence, motion } from "framer-motion"
import { useFilmRouter } from "@/hooks/filmRouter"
import { useFilmClick } from "@/hooks/handleFiilmClick"
import { useProducerStore } from "@/stores/producerStore"
import type { FilmData } from "@/types/backend.type"

export default function FilmProducer() {
    const swiperRef = useRef<any>(null)
    const { goFilmDetail } = useFilmRouter()
    const { handleFilmClick } = useFilmClick()
    const { films } = useProducerStore()

    if (!films.length) {
        return <p className="text-muted-foreground italic text-center mt-4">Chưa có phim nào được ghi nhận.</p>
    }

    const filmsByYear = films.reduce((acc: Record<string, FilmData[]>, film) => {
        const year = film.year || "Không rõ"
        if (!acc[year]) acc[year] = []
        acc[year].push(film)
        return acc
    }, {})

    const sorted = Object.entries(filmsByYear)
        .map(([year, items]) => ({ year, items }))
        .sort((a, b) => Number(a.year) - Number(b.year))

    return (
        <Tabs defaultValue="all" className="w-full !overflow-visible">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Các Phim Sản Xuất</h3>
                <TabsList className="bg-secondary rounded-md">
                    <TabsTrigger
                        value="all"
                        className="text-muted-foreground hover:text-black hover:bg-primary
                                    data-[state=active]:text-black data-[state=active]:bg-primary
                                    transition-colors px-3 py-1 rounded-md font-medium"
                    >
                        Tất cả
                    </TabsTrigger>
                    <TabsTrigger
                        value="time"
                        className="text-muted-foreground hover:text-black hover:bg-primary
                                    data-[state=active]:text-black data-[state=active]:bg-primary
                                    transition-colors px-3 py-1 rounded-md font-medium"
                    >
                        Thời gian
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* TẤT CẢ */}
            <TabsContent value="all" className="mt-2">
                <div className="px-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
                    {films.map((f, i) => {
                        const thumb = f.thumbUrl || f.filmImages?.[0]?.url || "/images/small.jpg"
                        return (
                            <motion.div
                                key={i}
                                whileHover={{
                                    scale: 1.08,
                                    zIndex: 10,
                                    boxShadow: "0 0 25px rgba(250, 204, 21, 0.3)",
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="group relative overflow-hidden rounded-xl aspect-[3/4] md:aspect-[2/3] h-72 md:h-80 min-w-[220px] bg-secondary/50 cursor-pointer"
                                onClick={() => goFilmDetail(f.slug)}
                            >
                                <img
                                    src={thumb || "/placeholder.svg"}
                                    alt={f.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                flex flex-col justify-end p-4"
                                >
                                    <h1 className="text-[11px] md:text-sm font-semibold text-foreground leading-tight line-clamp-2">
                                        {f.title}
                                    </h1>
                                    <h2 className="text-xs text-muted-foreground mt-1 line-clamp-1">{f.originalTitle}</h2>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {f.year && <span>{f.year}</span>}
                                        {f.duration && <span> - {f.duration} phút</span>}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleFilmClick(f)
                                        }}
                                        className="absolute bottom-3 right-4 text-xs font-semibold
                                                bg-primary text-black px-3 py-1.5 rounded-full shadow-md
                                                hover:bg-primary hover:scale-105 hover:shadow-[0_0_12px_rgba(250,204,21,0.6)]
                                                transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ease-in-out"
                                    >
                                        Xem ngay
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </TabsContent>

            {/* THEO THỜI GIAN */}
            <TabsContent value="time" className="mt-2 w-full">
                <div className="relative w-full flex justify-center overflow-hidden py-6">
                    <div className="absolute top-[30px] left-0 right-0 h-[2px] bg-primary rounded-full z-0" />
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute left-4 top-1/4 -translate-y-1/2 bg-background/80 hover:bg-secondary text-primary p-3 rounded-full z-20 transition"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute right-4 top-1/4 -translate-y-1/2 bg-background/80 hover:bg-secondary text-primary p-3 rounded-full z-20 transition"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <Swiper
                        modules={[FreeMode]}
                        freeMode
                        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
                        spaceBetween={40}
                        slidesPerView="auto"
                        grabCursor
                        className="relative z-10 max-w-[1280px] w-full px-12 overflow-hidden"
                    >
                        {sorted.map((group) => (
                            <SwiperSlide
                                key={group.year}
                                className="!w-auto flex flex-col items-center px-6 select-none overflow-visible"
                            >
                                <div className="flex flex-col items-center mb-6 relative z-10">
                                    <div className="w-3.5 h-3.5 rounded-full bg-primary mb-2 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                                    <span className="text-primary font-semibold text-lg">{group.year}</span>
                                </div>

                                <div className="flex flex-col items-center gap-4 min-h-[340px] mt-2">
                                    {group.items.map((f, i) => {
                                        const thumb = f.thumbUrl || f.filmImages?.[0]?.url || "/images/small.jpg"
                                        return (
                                            <div key={f.filmId || i} className="flex flex-col items-center cursor-pointer">
                                                <HoverFilmCard f={f} handleFilmClick={handleFilmClick} thumb={thumb} />
                                                <h1 className="text-[11px] md:text-sm font-semibold text-foreground leading-tight line-clamp-2 text-center mt-2">
                                                    {f.title}
                                                </h1>
                                                <h2 className="text-xs text-muted-foreground mt-1 line-clamp-1 text-center">{f.originalTitle}</h2>
                                            </div>
                                        )
                                    })}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </TabsContent>
        </Tabs>
    )
}

function HoverFilmCard({ f, handleFilmClick, thumb }: any) {
    const { goFilmDetail } = useFilmRouter()
    const [hovered, setHovered] = useState(false)

    return (
        <div className="relative group" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div
                onClick={() => goFilmDetail(f.slug)}
                className="relative rounded-xl overflow-hidden aspect-[2/3] w-40 sm:w-44
                   bg-secondary/60 cursor-pointer border border-border/60
                   transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300"
            >
                <img
                    src={thumb || "/placeholder.svg"}
                    alt={f.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div
                    className={`absolute inset-0 rounded-xl border transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ${hovered ? "border-primary/60 shadow-[0_0_15px_rgba(250,204,21,0.4)]" : "border-transparent"
                        }`}
                ></div>
            </div>

            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-1/2 left-[105%] -translate-y-1/2"
                    >
                        <button
                            onClick={() => handleFilmClick(f)}
                            className="text-[10px] font-semibold bg-primary text-black px-3 py-1.5
                         rounded-full shadow-[0_0_12px_rgba(250,204,21,0.4)]
                         hover:bg-primary hover:scale-105 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300
                         whitespace-nowrap"
                        >
                            Xem ngay
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
